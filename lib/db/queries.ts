import { and, desc, eq, gt, inArray, sql } from "drizzle-orm";
import { getDb } from "./index";
import { orderItems, orders, products, sessions, users } from "./schema";
import type { CartItem, Category, Product } from "@/lib/products";

/** A row of the orders table as read back from Postgres. */
export type Order = typeof orders.$inferSelect;

/* ------------------------------------------------------------------ *
 * Products
 * ------------------------------------------------------------------ */

type ProductRow = typeof products.$inferSelect;

/** Map a DB row to the app's Product contract (nullable → optional). */
function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category as Category,
    price: row.price,
    compareAtPrice: row.compareAtPrice ?? undefined,
    rating: row.rating,
    reviews: row.reviews,
    shortDescription: row.shortDescription,
    description: row.description,
    image: row.image,
    emoji: row.emoji,
    gradient: row.gradient,
    badge: (row.badge as Product["badge"]) ?? undefined,
    stock: row.stock,
  };
}

export async function getProducts(): Promise<Product[]> {
  const rows = await getDb().select().from(products).orderBy(products.name);
  return rows.map(toProduct);
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const [row] = await getDb().select().from(products).where(eq(products.id, id));
  return row ? toProduct(row) : undefined;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const unique = [...new Set(ids)];
  if (unique.length === 0) return [];
  const rows = await getDb().select().from(products).where(inArray(products.id, unique));
  const byId = new Map(rows.map((r) => [r.id, toProduct(r)]));
  return ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
}

/** Decrement stock for a product; never below zero. Used on a paid order. */
export async function decrementStock(productId: string, qty: number): Promise<void> {
  await getDb()
    .update(products)
    .set({ stock: sql`GREATEST(0, ${products.stock} - ${qty})` })
    .where(eq(products.id, productId));
}

/** Insert a new product (used by the /admin page). Throws on duplicate id. */
export async function insertProduct(data: {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice: number | null;
  shortDescription: string;
  description: string;
  image: string;
  emoji: string;
  gradient: string;
  badge: string | null;
  stock: number;
}): Promise<void> {
  await getDb().insert(products).values(data);
}

/** Delete a product by id (used by the /admin page). */
export async function deleteProduct(id: string): Promise<void> {
  await getDb().delete(products).where(eq(products.id, id));
}

/* ------------------------------------------------------------------ *
 * Users
 * ------------------------------------------------------------------ */

export async function getUserByEmail(email: string) {
  const [row] = await getDb().select().from(users).where(eq(users.email, email));
  return row ?? null;
}

export async function getUserById(id: number) {
  const [row] = await getDb().select().from(users).where(eq(users.id, id));
  return row ?? null;
}

export async function createUser(email: string, passwordHash: string, name: string) {
  const [row] = await getDb()
    .insert(users)
    .values({ email, passwordHash, name })
    .returning();
  return row;
}

/* ------------------------------------------------------------------ *
 * Sessions
 * ------------------------------------------------------------------ */

export async function createSessionRow(userId: number, tokenHash: string, expiresAt: Date) {
  const [row] = await getDb()
    .insert(sessions)
    .values({ userId, tokenHash, expiresAt })
    .returning();
  return row;
}

/** Returns the user for a session token, or null when the session is missing/expired. */
export async function getUserBySessionToken(tokenHash: string) {
  const rows = await getDb()
    .select({ user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, new Date())));
  return rows[0]?.user ?? null;
}

export async function deleteSession(tokenHash: string) {
  await getDb().delete(sessions).where(eq(sessions.tokenHash, tokenHash));
}

/* ------------------------------------------------------------------ *
 * Orders
 * ------------------------------------------------------------------ */

export type OrderItemSnapshot = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

export type OrderWithItems = Order & { items: OrderItemSnapshot[] };

type CreateOrderData = {
  id: string;
  userId: number;
  email: string;
  shippingName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  stripeSessionId?: string | null;
};

export async function createOrder(
  data: CreateOrderData,
  items: OrderItemSnapshot[],
): Promise<OrderWithItems> {
  const [row] = await getDb()
    .insert(orders)
    .values({
      id: data.id,
      userId: data.userId,
      email: data.email,
      shippingName: data.shippingName,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country,
      subtotal: data.subtotal,
      shipping: data.shipping,
      tax: data.tax,
      total: data.total,
      stripeSessionId: data.stripeSessionId ?? null,
    })
    .returning();

  if (items.length > 0) {
    await getDb().insert(orderItems).values(
      items.map((item) => ({ ...item, orderId: row.id })),
    );
  }
  return { ...row, items };
}

async function getOrderItems(orderId: string): Promise<OrderItemSnapshot[]> {
  const rows = await getDb()
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId))
    .orderBy(orderItems.id);
  return rows.map((r) => ({
    productId: r.productId,
    name: r.name,
    price: r.price,
    qty: r.qty,
  }));
}

export async function getOrderById(id: string): Promise<OrderWithItems | null> {
  const [order] = await getDb().select().from(orders).where(eq(orders.id, id));
  if (!order) return null;
  const items = await getOrderItems(order.id);
  return { ...order, items };
}

export async function getOrderByStripeSession(sessionId: string): Promise<OrderWithItems | null> {
  const [order] = await getDb()
    .select()
    .from(orders)
    .where(eq(orders.stripeSessionId, sessionId));
  if (!order) return null;
  const items = await getOrderItems(order.id);
  return { ...order, items };
}

export async function listOrdersByUser(userId: number): Promise<OrderWithItems[]> {
  const rows = await getDb()
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
  return Promise.all(
    rows.map(async (order) => ({ ...order, items: await getOrderItems(order.id) })),
  );
}

export async function markOrderPaid(id: string): Promise<void> {
  await getDb().update(orders).set({ status: "paid" }).where(eq(orders.id, id));
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

/** Build a line-item snapshot from cart items + catalog products. */
export function snapshotItems(
  items: CartItem[],
  catalog: Product[],
): { items: OrderItemSnapshot[]; ready: boolean } {
  const byId = new Map(catalog.map((p) => [p.id, p]));
  const snapshot: OrderItemSnapshot[] = [];
  for (const item of items) {
    const product = byId.get(item.productId);
    if (!product) continue;
    snapshot.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: item.qty,
    });
  }
  const ready =
    snapshot.length === items.length &&
    items.every((i) => byId.has(i.productId) && byId.get(i.productId)!.stock >= i.qty);
  return { items: snapshot, ready };
}

/** Friendly order number, e.g. "LUM-81234". */
export function newOrderId(): string {
  return `LUM-${Math.floor(10000 + Math.random() * 90000)}`;
}
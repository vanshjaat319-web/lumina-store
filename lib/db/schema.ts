import {
  integer,
  serial,
  text,
  timestamp,
  doublePrecision,
  pgTable,
} from "drizzle-orm/pg-core";

/** Store users. */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Opaque session tokens (sha256-hash stored; raw token only ever in the cookie). */
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  tokenHash: text("token_hash").notNull().unique(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Product catalog, seeded once from the static catalog in lib/products.ts.
 * Prices are integer USD, matching formatPrice() in lib/products.ts.
 */
export const products = pgTable("products", {
  id: text("id").primaryKey(), // slug, e.g. "aura-headphones"
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: doublePrecision("price").notNull(),
  compareAtPrice: doublePrecision("compare_at_price"),
  rating: doublePrecision("rating").notNull().default(4.5),
  reviews: integer("reviews").notNull().default(0),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  emoji: text("emoji").notNull(),
  gradient: text("gradient").notNull(),
  badge: text("badge"), // "New" | "Sale" | "Bestseller"
  stock: integer("stock").notNull().default(0),
});

/**
 * Orders. `id` is a friendly display number like "LUM-81234".
 * `status` is "pending" when the Stripe session is created, then "paid"
 * once the checkout.session.completed webhook lands.
 */
export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  shippingName: text("shipping_name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  country: text("country").notNull(),
  subtotal: doublePrecision("subtotal").notNull(),
  shipping: doublePrecision("shipping").notNull(),
  tax: doublePrecision("tax").notNull(),
  total: doublePrecision("total").notNull(),
  status: text("status").notNull().default("pending"), // "pending" | "paid"
  stripeSessionId: text("stripe_session_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Line items snapshot the name+price at purchase time (catalog may change later). */
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull(),
  name: text("name").notNull(),
  price: doublePrecision("price").notNull(),
  qty: integer("qty").notNull(),
});
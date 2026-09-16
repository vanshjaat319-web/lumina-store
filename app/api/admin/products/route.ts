import { NextResponse } from "next/server";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { CATEGORIES, isCategory } from "@/lib/products";
import { deleteProduct, getProduct, insertProduct } from "@/lib/db/queries";

const GRADIENTS: Record<string, string> = {
  audio: "from-indigo-800 to-violet-600",
  home: "from-amber-400 to-orange-600",
  desk: "from-zinc-700 to-zinc-900",
  wearables: "from-teal-500 to-cyan-500",
  accessories: "from-orange-400 to-rose-500",
};

const BADGES = ["New", "Sale", "Bestseller"] as const;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Make sure the owner is signed in before any admin write. */
async function adminUser() {
  const user = await getCurrentUser();
  if (!user || !(await isAdmin(user))) {
    return null;
  }
  return user;
}

function unauthorized() {
  return NextResponse.json({ error: "Not signed in as the store owner." }, { status: 401 });
}

/** Create a new product from the /admin form. */
export async function POST(request: Request) {
  const user = await adminUser();
  if (!user) return unauthorized();

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Bad request." }, { status: 400 });

  const errors: Record<string, string> = {};
  const name = String(body.name ?? "").trim();
  const category = String(body.category ?? "");
  const shortDescription = String(body.shortDescription ?? "").trim();
  const description = String(body.description ?? "").trim();
  const price = Number(body.price);
  const compareAtPriceRaw = body.compareAtPrice;
  const stock = Number(body.stock ?? 0);
  const emoji = String(body.emoji ?? "").trim();
  const image = String(body.image ?? "").trim();

  if (!name) errors.name = "Name is required.";
  if (!isCategory(category)) errors.category = "Pick a valid category.";
  if (!Number.isFinite(price) || price <= 0) errors.price = "Enter a price above 0.";
  const compareAtPrice =
    compareAtPriceRaw === "" || compareAtPriceRaw == null
      ? null
      : Number(compareAtPriceRaw);
  if (compareAtPrice !== null && (!Number.isFinite(compareAtPrice) || compareAtPrice <= price))
    errors.compareAtPrice = "Compare-at price must be above the sale price.";
  if (!Number.isInteger(stock) || stock < 0) errors.stock = "Enter a whole number 0 or more.";
  if (!shortDescription) errors.shortDescription = "Short description is required.";
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  // Auto id from the name, made unique if the slug already exists.
  let id = slugify(name);
  if (!id) id = "product";
  let suffix = 2;
  while (await getProduct(id)) id = `${slugify(name)}-${suffix++}`;

  const gradient = GRADIENTS[category] ?? "from-zinc-200 to-zinc-300";
  const categoryEmoji = CATEGORIES.find((c) => c.slug === category)?.emoji ?? "🛍️";

  await insertProduct({
    id,
    name,
    category,
    price,
    compareAtPrice,
    shortDescription,
    description,
    image,
    emoji: emoji || categoryEmoji,
    gradient,
    badge: BADGES.includes(body.badge) ? (body.badge as (typeof BADGES)[number]) : null,
    stock,
  });

  return NextResponse.json({ ok: true, id });
}

/** Delete a product (id sent in the body). */
export async function DELETE(request: Request) {
  const user = await adminUser();
  if (!user) return unauthorized();

  const body = await request.json().catch(() => null);
  const id = String(body?.id ?? "");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  await deleteProduct(id);
  return NextResponse.json({ ok: true });
}
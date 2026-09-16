/**
 * Seed script: pushes the static catalog from lib/products.ts into Postgres.
 * Idempotent — safe to run repeatedly (upserts by product id).
 *
 * Usage: npm run db:seed  (requires DATABASE_URL to be set)
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import { products } from "../lib/db/schema";
import { products as catalog, type Product } from "../lib/products";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set — cannot seed. Provision a Neon store first.");
}

const db = drizzle(neon(url));

// Map app Product → DB row; nullables become null.
const rows = catalog.map((p: Product) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: p.price,
  compareAtPrice: p.compareAtPrice ?? null,
  rating: p.rating,
  reviews: p.reviews,
  shortDescription: p.shortDescription,
  description: p.description,
  image: p.image,
  emoji: p.emoji,
  gradient: p.gradient,
  badge: p.badge ?? null,
  stock: p.stock,
}));

await db
  .insert(products)
  .values(rows)
  .onConflictDoUpdate({
    target: products.id,
    set: {
      name: sql`excluded.name`,
      category: sql`excluded.category`,
      price: sql`excluded.price`,
      compareAtPrice: sql`excluded.compare_at_price`,
      rating: sql`excluded.rating`,
      reviews: sql`excluded.reviews`,
      shortDescription: sql`excluded.short_description`,
      description: sql`excluded.description`,
      image: sql`excluded.image`,
      emoji: sql`excluded.emoji`,
      gradient: sql`excluded.gradient`,
      badge: sql`excluded.badge`,
      stock: sql`excluded.stock`,
    },
  });

console.log(`Seeded ${rows.length} products into the catalog.`);
process.exit(0);
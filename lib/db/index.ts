import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Shared Drizzle client for the Neon Postgres database.
 *
 * The connection string is read lazily on the first query, so merely importing
 * this module (e.g. during `next build`) never throws or connects. The first
 * `getDb()` call validates DATABASE_URL and creates the client.
 */
let _db: NeonHttpDatabase<typeof schema> | null = null;

export function getDb(): NeonHttpDatabase<typeof schema> {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local (dev) or the Vercel environment (prod).",
    );
  }
  _db = drizzle(neon(url), { schema });
  return _db;
}

export { schema };

/** Alias used by the query helpers so call sites read naturally. */
export const db = getDb;
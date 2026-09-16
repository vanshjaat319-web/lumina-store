import { cookies } from "next/headers";
import { hash, compare } from "bcryptjs";
import { createHash, randomBytes } from "crypto";
import {
  createSessionRow,
  deleteSession,
  getUserById,
  getUserBySessionToken,
} from "@/lib/db/queries";

const COOKIE = "lumina_session";
const SESSION_DAYS = 30;

/** Securely hash a plain-text password. */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

/** Verify a plain-text password against its bcrypt hash. */
export async function verifyPassword(password: string, bcryptHash: string): Promise<boolean> {
  return compare(password, bcryptHash);
}

/** SHA-256 a raw token — this is what we store in DB. */
function tokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Read the raw session token from the cookie. */
async function cookieToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE)?.value ?? null;
}

/** Return the current logged-in user, or null. Safe to call in Server Components. */
export async function getCurrentUser() {
  const raw = await cookieToken();
  if (!raw) return null;
  // Without a database there can be no sessions — return null so the app
  // still builds/render before DATABASE_URL is configured.
  if (!process.env.DATABASE_URL) return null;
  return getUserBySessionToken(tokenHash(raw));
}

/** Set an auth cookie after login/register. Must be called from a Route Handler or Server Action. */
export async function setAuthCookie(userId: number) {
  const raw = randomBytes(32).toString("base64url");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);

  await createSessionRow(userId, tokenHash(raw), expiresAt);

  const store = await cookies();
  store.set(COOKIE, raw, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

/** Delete the current session and clear the cookie. */
export async function clearAuthCookie() {
  const raw = await cookieToken();
  if (raw) await deleteSession(tokenHash(raw));
  const store = await cookies();
  store.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

/**
 * Require a logged-in user — returns the user or throws a Next redirect to /login.
 * Use inside Server Components or Route Handlers that must gate on auth.
 *
 * Throws a Next `redirect` so it can be used in try/catch at the page level.
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    const { redirect } = await import("next/navigation");
    redirect("/login?redirect=/checkout");
  }
  return user;
}

/**
 * Is this user the store owner? The owner's email is set once in
 * ADMIN_EMAIL (env var). When it's not set, no one is admin.
 */
export async function isAdmin(user: { email: string } | null | undefined): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  if (!adminEmail || !user) return false;
  return user.email.toLowerCase() === adminEmail;
}
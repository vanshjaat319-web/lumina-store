import { NextResponse } from "next/server";
import { hashPassword, setAuthCookie } from "@/lib/auth";
import { createUser, getUserByEmail } from "@/lib/db/queries";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, name } = body as Record<string, string>;

  const errors: Record<string, string> = {};
  if (!email || !EMAIL_RE.test(email)) errors.email = "Enter a valid email.";
  if (!password || password.length < 8) errors.password = "Password must be at least 8 characters.";
  if (!name?.trim()) errors.name = "Name is required.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const existing = await getUserByEmail(email.toLowerCase().trim());
  if (existing) {
    return NextResponse.json({ errors: { email: "An account already exists with this email." } }, { status: 422 });
  }

  const user = await createUser(
    email.toLowerCase().trim(),
    await hashPassword(password),
    name.trim(),
  );

  await setAuthCookie(user.id);

  return NextResponse.json({ ok: true });
}
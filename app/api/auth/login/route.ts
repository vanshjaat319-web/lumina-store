import { NextResponse } from "next/server";
import { setAuthCookie, verifyPassword } from "@/lib/auth";
import { getUserByEmail } from "@/lib/db/queries";

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as Record<string, string>;

  if (!email || !password) {
    return NextResponse.json({ errors: { email: "Email and password are required." } }, { status: 422 });
  }

  const user = await getUserByEmail(email.toLowerCase().trim());
  if (!user) {
    return NextResponse.json({ errors: { email: "No account found with that email." } }, { status: 422 });
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ errors: { password: "Incorrect password." } }, { status: 422 });
  }

  await setAuthCookie(user.id);

  return NextResponse.json({ ok: true });
}
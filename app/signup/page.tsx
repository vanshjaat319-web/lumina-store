import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Create account — Lumina",
  description: "Create a Lumina account to place orders and track receipts.",
};

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/account");

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 sm:py-24">
      <AuthForm mode="register" />
      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-indigo-700 hover:text-indigo-800">
          Sign in
        </Link>
      </p>
    </div>
  );
}
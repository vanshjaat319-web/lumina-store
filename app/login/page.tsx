import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign in — Lumina",
  description: "Sign in to access your Lumina orders and receipts.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect((await searchParams).redirect ?? "/account");

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 sm:py-24">
      <AuthForm mode="login" />
      <p className="mt-6 text-center text-sm text-zinc-500">
        No account yet?{" "}
        <Link href="/signup" className="font-medium text-indigo-700 hover:text-indigo-800">
          Create one
        </Link>
      </p>
    </div>
  );
}
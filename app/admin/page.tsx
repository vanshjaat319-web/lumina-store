import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/db/queries";
import AdminPanel from "@/components/AdminPanel";

export const metadata: Metadata = {
  title: "Admin — Lumina",
  description: "Manage your Lumina store products.",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/admin");

  if (!(await isAdmin(user))) redirect("/account");

  const products = await getProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wider text-indigo-700">
          Store owner only
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
          Admin — manage products
        </h1>
        <p className="mt-2 max-w-xl text-zinc-600">
          Add and remove products without writing any code. Changes appear on the store
          immediately.
        </p>
      </header>
      <AdminPanel products={products} />
    </div>
  );
}
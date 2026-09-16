import type { Metadata } from "next";
import Catalog from "@/components/Catalog";
import { getProducts } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Shop — Lumina",
  description: "Browse the full Lumina catalog — audio, home, desk, wearables, and accessories.",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [{ category }, products] = await Promise.all([searchParams, getProducts()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Shop</h1>
        <p className="mt-2 max-w-xl text-zinc-600">
          Every product we carry. Search, filter by category, and sort to find your next favourite.
        </p>
      </header>
      <Catalog products={products} initialCategory={category} />
    </div>
  );
}
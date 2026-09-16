import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  products,
  getProduct,
  getCategoryLabel,
  relatedProducts,
  discountFor,
} from "@/lib/products";
import { Badge, Price, ProductTile, Stars } from "@/components/ProductBits";
import PurchaseBox from "@/components/PurchaseBox";
import ProductGrid from "@/components/ProductGrid";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  return {
    title: product ? `${product.name} — Lumina` : "Product — Lumina",
    description: product?.shortDescription,
  };
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
      aria-hidden="true"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const related = relatedProducts(product.id);
  const discount = discountFor(product);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-zinc-500" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition-colors hover:text-zinc-800">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-zinc-300">
            /
          </li>
          <li>
            <Link href="/products" className="transition-colors hover:text-zinc-800">
              Shop
            </Link>
          </li>
          <li aria-hidden="true" className="text-zinc-300">
            /
          </li>
          <li>
            <Link
              href={`/products?category=${product.category}`}
              className="transition-colors hover:text-zinc-800"
            >
              {getCategoryLabel(product.category)}
            </Link>
          </li>
          <li aria-hidden="true" className="text-zinc-300">
            /
          </li>
          <li className="max-w-[16rem] truncate text-zinc-800">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Visual */}
        <div className="relative">
          <ProductTile
            product={product}
            className="aspect-square w-full rounded-3xl shadow-xl shadow-zinc-900/5"
          />
          {product.badge && (
            <div className="absolute left-5 top-5 z-10">
              <Badge badge={product.badge} />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            {getCategoryLabel(product.category)}
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3">
            <Stars rating={product.rating} reviews={product.reviews} size="text-base" />
          </div>

          <div className="mt-5 flex items-center gap-3">
            <Price product={product} className="text-2xl" />
            {discount > 0 && (
              <span className="rounded-full bg-white/85 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-rose-600 ring-1 ring-black/5 backdrop-blur-sm">
                Save {discount}%
              </span>
            )}
          </div>

          <p className="mt-5 text-[15px] leading-7 text-zinc-600">{product.description}</p>

          <div className="mt-8">
            <PurchaseBox product={product} />
          </div>

          {/* Trust checklist */}
          <ul className="mt-8 grid gap-3 rounded-2xl border border-hairline bg-white p-5 sm:grid-cols-3">
            {[
              { copy: "Free shipping over $50" },
              { copy: "30-day returns" },
              { copy: "2-year warranty" },
            ].map((item) => (
              <li key={item.copy} className="flex items-start gap-2.5 text-sm text-zinc-700">
                <CheckIcon />
                {item.copy}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            You may also like
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            More {getCategoryLabel(product.category).toLowerCase()} picks
          </p>
          <div className="mt-6">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}
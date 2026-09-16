import Link from "next/link";
import { CATEGORIES, homeFeatured } from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";
import { ProductTile } from "@/components/ProductBits";

function GlowIcon({ path, className = "" }: { path: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-5 w-5 ${className}`}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

const TRUST_ITEMS = [
  {
    icon: "M11.48 3.5a.56.56 0 0 1 1.04 0l1.9 3.85 4.25.62a.56.56 0 0 1 .31.95l-3.08 3 .73 4.24a.56.56 0 0 1-.81.59L12 14.6 7.18 16.75a.56.56 0 0 1-.81-.59l.73-4.24-3.08-3a.56.56 0 0 1 .31-.95l4.25-.62Z",
    label: "4.6/5 from 5,200+ reviews",
  },
  {
    icon: "M5 17h-2v-5a2 2 0 0 1 2-2h2l3.5-4.5a1 1 0 0 1 1.8.6V8h6a2 2 0 0 1 2 2.6l-1.3 5.2a2 2 0 0 1-2 1.6h-8",
    label: "Free US shipping over $50",
  },
  {
    icon: "M3 10a6 6 0 0 1 12 0v1h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h1Zm6-4a4 4 0 0 0-4 4H9Zm6 4a2 2 0 1 0-4 0h4Z",
    label: "Secure checkout",
  },
  {
    icon: "M9 12l2 2 4-4m-3 11a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
    label: "30-day hassle-free returns",
  },
];

export default function Home() {
  const [heroA, heroB] = homeFeatured;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Hero */}
      <section className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            New season, now live
          </span>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tighter text-zinc-900 sm:text-6xl">
            Everyday essentials,
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              thoughtfully made.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-zinc-600">
            Audio, home, desk, and wearables — a small catalog of things we actually use,
            designed to last and priced honestly.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/products" className="btn-primary hover:bg-zinc-700 active:scale-[0.99]">
              Shop all products
            </Link>
            <Link
              href="/products?category=audio"
              className="btn-secondary hover:border-zinc-300 active:scale-[0.99]"
            >
              Browse audio →
            </Link>
          </div>
        </div>

        {/* Photo collage */}
        <div className="relative hidden md:block">
          <div className="grid grid-cols-2 gap-4">
            {heroA && heroB ? (
              <>
                <ProductTile
                  product={heroA}
                  className="aspect-square rounded-3xl shadow-xl shadow-zinc-900/5"
                />
                <ProductTile
                  product={heroB}
                  className="mt-10 aspect-square rounded-3xl shadow-xl shadow-zinc-900/5"
                />
              </>
            ) : null}
          </div>
          <div className="absolute -bottom-6 left-1/2 w-72 -translate-x-1/2 rotate-1 rounded-2xl bg-foreground px-5 py-4 text-white shadow-2xl">
            <p className="text-xs uppercase tracking-wide text-zinc-400">People love us</p>
            <p className="mt-1 text-lg font-semibold tracking-tight">4.6/5 · 5,200+ reviews</p>
            <p className="mt-0.5 text-xs text-zinc-400">Free shipping over $50 · 30-day returns</p>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section
        className="grid gap-6 border-y border-hairline py-7 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Why shop with Lumina"
      >
        {TRUST_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-zinc-800 ring-1 ring-hairline">
              <GlowIcon path={item.icon} className="text-accent" />
            </span>
            <p className="text-sm font-medium text-zinc-700">{item.label}</p>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="py-14">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Shop by category
            </h2>
            <p className="mt-1 text-sm text-zinc-500">Five collections, each edited with intent</p>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-accent transition-colors hover:text-indigo-500"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl bg-white p-6 ring-1 ring-hairline transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-zinc-900/5"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-zinc-50 text-2xl ring-1 ring-hairline transition-colors group-hover:bg-accent-soft">
                {category.emoji}
              </span>
              <span className="text-sm font-medium text-zinc-800">{category.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="py-14">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Featured</h2>
            <p className="mt-1 text-sm text-zinc-500">New arrivals and customer favourites</p>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-accent transition-colors hover:text-indigo-500"
          >
            See everything →
          </Link>
        </div>
        <ProductGrid products={homeFeatured} />
      </section>

      {/* Value props */}
      <section className="py-14">
        <div className="grid gap-4 rounded-3xl border border-hairline bg-white p-6 sm:grid-cols-3 sm:p-10">
          {[
            {
              icon: "M2 18h1.7a2 2 0 0 0 3.9 0h5a2 2 0 0 0 3.9 0H22m-20-6H8l3-4h9a2 2 0 0 1 2 2v8a1 1 0 0 1-1 1h-1.7M6 18a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Zm12 0a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Z",
              title: "Free shipping over $50",
              copy: "Every order, domestic and over the threshold — no code needed.",
            },
            {
              icon: "M6 11h12m0-2 2 2-2 2M18 13H6m0 2-2-2 2-2M3 12h18M12 3v18",
              title: "30-day returns",
              copy: "Changed your mind? Send it back with a prepaid label, no questions.",
            },
            {
              icon: "M12 3a4 4 0 0 0-4 4v1H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2V7a4 4 0 0 0-4-4Zm-2 5V7a2 2 0 1 1 4 0v1Z",
              title: "2-year warranty",
              copy: "Faults happen — we cover parts, labour, and shipping both ways.",
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                <GlowIcon path={item.icon} />
              </span>
              <div>
                <h3 className="font-semibold text-zinc-900">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-500">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
"use client";

import { useMemo, useState } from "react";
import {
  products,
  CATEGORIES,
  isCategory,
  type Category,
} from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

const SORT_OPTIONS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function Catalog({
  initialCategory,
}: {
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">(
    initialCategory && isCategory(initialCategory) ? initialCategory : "all",
  );
  const [sort, setSort] = useState<Sort>("featured");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    let list = products.filter((product) => {
      const matchesQuery =
        needle.length === 0 ||
        `${product.name} ${product.shortDescription} ${product.category}`
          .toLowerCase()
          .includes(needle);
      const matchesCategory = category === "all" || product.category === category;
      return matchesQuery && matchesCategory;
    });

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
        break;
    }
    return list;
  }, [query, category, sort]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <label className="relative block max-w-sm flex-1">
          <span className="sr-only">Search products</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products…"
            className="h-11 w-full rounded-lg border border-hairline bg-white pl-10 pr-4 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </label>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="sr-only">
            Sort products
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            className="h-11 cursor-pointer rounded-lg border border-hairline bg-white px-3 text-sm text-zinc-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category pills */}
      <div className="mt-5 flex flex-wrap gap-2">
        {[
          { slug: "all" as const, label: "All" },
          ...CATEGORIES.map((category) => ({
            slug: category.slug as Category,
            label: category.label,
          })),
        ].map((item) => {
          const active = category === item.slug;
          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => setCategory(item.slug)}
              className={`inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors ${
                active
                  ? "bg-foreground text-white"
                  : "bg-surface text-zinc-700 ring-1 ring-hairline hover:ring-zinc-300"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-zinc-500" aria-live="polite">
        {filtered.length === 0
          ? "No products match your filters."
          : `${filtered.length} product${filtered.length === 1 ? "" : "s"}`}
      </p>

      {/* Grid */}
      <div className="mt-4 pb-4">
        {filtered.length > 0 ? (
          <ProductGrid products={filtered} />
        ) : (
          <div className="card flex flex-col items-center px-6 py-20 text-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-10 w-10 text-zinc-300"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" strokeLinecap="round" />
            </svg>
            <h2 className="mt-4 text-lg font-semibold text-zinc-900">Nothing found</h2>
            <p className="mt-1 max-w-sm text-sm text-zinc-500">
              Try a different search term, or clear the category filter to see the full catalog.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
              className="btn-primary mt-6"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
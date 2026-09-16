"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, formatPrice, type Product } from "@/lib/products";

const fieldClasses =
  "h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20 border-hairline";
const labelClasses = "mb-1.5 block text-sm font-medium text-zinc-700";

const BADGE_OPTIONS = ["", "New", "Sale", "Bestseller"] as const;

type FormState = {
  name: string;
  category: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  badge: string;
  shortDescription: string;
  description: string;
  image: string;
  emoji: string;
};

const INITIAL: FormState = {
  name: "",
  category: "audio",
  price: "",
  compareAtPrice: "",
  stock: "25",
  badge: "",
  shortDescription: "",
  description: "",
  image: "",
  emoji: "",
};

export default function AdminPanel({ products }: { products: Product[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setNotice("");
    setErrors({});
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: form.price ? Number(form.price) : "",
          compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : "",
          stock: Number(form.stock),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotice(`✅ Added “${form.name}” — it's live on the store now.`);
        setForm(INITIAL);
        router.refresh();
      } else if (data.errors) {
        setErrors(data.errors);
      } else {
        setNotice("Something went wrong. Try again.");
      }
    } catch {
      setNotice("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete “${product.name}”? This removes it from the store.`)) return;
    setNotice("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id }),
      });
      if (res.ok) {
        setNotice(`🗑️ Deleted “${product.name}”.`);
        router.refresh();
      } else {
        setNotice("Couldn't delete that product.");
      }
    } catch {
      setNotice("Network error. Try again.");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* ── Add a product ─────────────────────────────────────────── */}
      <section className="card p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Add a product</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Fill the form and hit “Add product” — it goes live on the store immediately.
        </p>

        {notice && (
          <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
            {notice}
          </div>
        )}

        <form onSubmit={handleCreate} noValidate className="mt-6 flex flex-col gap-4">
          <label className="block">
            <span className={labelClasses}>Product name</span>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Soft Glow Desk Lamp"
              className={fieldClasses}
            />
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClasses}>Category</span>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className={fieldClasses}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.emoji} {c.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClasses}>Badge (optional)</span>
              <select
                value={form.badge}
                onChange={(e) => update("badge", e.target.value)}
                className={fieldClasses}
              >
                <option value="">None</option>
                {BADGE_OPTIONS.filter((b) => b).map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClasses}>Price (USD)</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                placeholder="49.99"
                className={fieldClasses}
              />
              {errors.price && <p className="mt-1 text-xs text-rose-600">{errors.price}</p>}
            </label>

            <label className="block">
              <span className={labelClasses}>Compare-at price (optional)</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.compareAtPrice}
                onChange={(e) => update("compareAtPrice", e.target.value)}
                placeholder="Shows a strikethrough deal"
                className={fieldClasses}
              />
              {errors.compareAtPrice && (
                <p className="mt-1 text-xs text-rose-600">{errors.compareAtPrice}</p>
              )}
            </label>

            <label className="block">
              <span className={labelClasses}>Stock</span>
              <input
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => update("stock", e.target.value)}
                className={fieldClasses}
              />
              {errors.stock && <p className="mt-1 text-xs text-rose-600">{errors.stock}</p>}
            </label>

            <label className="block">
              <span className={labelClasses}>Emoji for tile (optional)</span>
              <input
                value={form.emoji}
                onChange={(e) => update("emoji", e.target.value)}
                placeholder="e.g. 💡 (blank = category emoji)"
                className={fieldClasses}
              />
            </label>
          </div>

          <label className="block">
            <span className={labelClasses}>Short description (shown on cards)</span>
            <input
              value={form.shortDescription}
              onChange={(e) => update("shortDescription", e.target.value)}
              placeholder="One clear sentence about the product"
              className={fieldClasses}
            />
            {errors.shortDescription && (
              <p className="mt-1 text-xs text-rose-600">{errors.shortDescription}</p>
            )}
          </label>

          <label className="block">
            <span className={labelClasses}>Full description</span>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="A few sentences for the product page"
              rows={4}
              className="w-full rounded-lg border bg-white px-3.5 py-3 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20 border-hairline"
            />
          </label>

          <label className="block">
            <span className={labelClasses}>Photo path (optional)</span>
            <input
              value={form.image}
              onChange={(e) => update("image", e.target.value)}
              placeholder="Leave blank to use the emoji tile — or /products/my-item.jpg"
              className={fieldClasses}
            />
            <p className="mt-1 text-xs text-zinc-500">
              Blank = a colored tile with the emoji. To use a real photo, add the file to the
              {" "}public/products folder first, then type its path.
            </p>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary mt-2 hover:bg-zinc-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Adding…" : "Add product"}
          </button>
        </form>
      </section>

      {/* ── Current products ──────────────────────────────────────── */}
      <section className="card p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Current products ({products.length})
        </h2>
        <p className="mt-1 text-sm text-zinc-500">Everything currently on the store.</p>

        <ul className="mt-4 flex flex-col divide-y divide-hairline">
          {products.map((product) => (
            <li key={product.id} className="flex items-center gap-3 py-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-zinc-50 text-xl ring-1 ring-hairline">
                {product.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900">{product.name}</p>
                <p className="text-xs capitalize text-zinc-500">
                  {product.category} · stock {product.stock}
                </p>
              </div>
              <span className="text-sm font-medium text-zinc-900">
                {formatPrice(product.price)}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(product)}
                className="rounded-md px-2 py-1 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
                aria-label={`Delete ${product.name}`}
              >
                Delete
              </button>
            </li>
          ))}
          {products.length === 0 && (
            <li className="py-8 text-center text-sm text-zinc-500">
              No products yet — add your first one.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
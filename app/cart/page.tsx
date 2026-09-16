"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  getProduct,
  getCategoryLabel,
  cartSubtotal,
  shippingFor,
  estimatedTax,
  formatPrice,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/products";
import { ProductTile } from "@/components/ProductBits";

export default function CartPage() {
  const { items, loaded, setQty, removeItem } = useCart();

  const subtotal = cartSubtotal(items);
  const shipping = shippingFor(subtotal);
  const tax = estimatedTax(subtotal);
  const total = subtotal + shipping + tax;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min(100, Math.max(0, (subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  // Show a subtle loading state only until the persisted cart has been read.
  if (!loaded) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <p className="text-sm text-zinc-500">Loading your cart…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-white text-4xl ring-1 ring-hairline">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-zinc-300"
            aria-hidden="true"
          >
            <path d="M6 7h12l1.2 12.2a1 1 0 0 1-1 1.1H5.8a1 1 0 0 1-1-1.1L6 7Z" />
            <path d="M9 10V6a3 3 0 0 1 6 0v4" />
          </svg>
        </span>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-900">
          Your cart is empty
        </h1>
        <p className="mt-2 max-w-sm text-zinc-600">
          Looks like you haven&apos;t added anything yet. Browse the catalog and find something you
          love.
        </p>
        <Link
          href="/products"
          className="btn-primary mt-8 hover:bg-zinc-700 active:scale-[0.99]"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Your cart</h1>
          <p className="mt-2 text-zinc-600">
            {items.reduce((sum, item) => sum + item.qty, 0)} item
            {items.reduce((sum, item) => sum + item.qty, 0) === 1 ? "" : "s"}
          </p>
        </div>
        <div className="w-full max-w-sm lg:w-80">
          <p className="text-sm text-zinc-600">
            {remaining > 0 ? (
              <>
                Add{" "}
                <span className="font-semibold text-zinc-900">
                  {formatPrice(remaining)}
                </span>{" "}
                more for free shipping
              </>
            ) : (
              <span className="font-medium text-emerald-600">
                You&apos;ve unlocked free shipping 🎉
              </span>
            )}
          </p>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={FREE_SHIPPING_THRESHOLD}
            aria-valuenow={Math.min(subtotal, FREE_SHIPPING_THRESHOLD)}
            aria-label="Progress toward free shipping"
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200"
          >
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <ul className="flex flex-col gap-3">
          {items.map((item) => {
            const product = getProduct(item.productId);
            if (!product) return null;
            return (
              <li
                key={item.productId}
                className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-hairline"
              >
                <Link
                  href={`/products/${product.id}`}
                  className="block h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24"
                  aria-label={product.name}
                >
                  <ProductTile product={product} className="h-full w-full rounded-none" />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <Link
                      href={`/products/${product.id}`}
                      className="block truncate text-sm font-medium text-zinc-900 hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {getCategoryLabel(product.category)} · {formatPrice(product.price)} each
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="mt-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-rose-600"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="inline-flex h-9 items-center rounded-lg border border-hairline bg-white">
                      <button
                        type="button"
                        onClick={() => setQty(item.productId, item.qty - 1)}
                        className="flex h-9 w-9 items-center justify-center text-lg text-zinc-600 hover:text-zinc-900"
                        aria-label={`Decrease quantity of ${product.name}`}
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-zinc-900">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(item.productId, item.qty + 1)}
                        className="flex h-9 w-9 items-center justify-center text-lg text-zinc-600 hover:text-zinc-900"
                        aria-label={`Increase quantity of ${product.name}`}
                      >
                        +
                      </button>
                    </div>
                    <span className="w-20 text-right text-sm font-semibold text-zinc-900">
                      {formatPrice(product.price * item.qty)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Summary */}
        <aside className="h-fit lg:sticky lg:top-24">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-zinc-900">Order summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-600">Subtotal</dt>
                <dd className="font-medium text-zinc-900">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-600">Shipping</dt>
                <dd className="font-medium text-zinc-900">
                  {shipping === 0 ? (
                    <span className="text-emerald-600">Free</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-600">Tax (est.)</dt>
                <dd className="font-medium text-zinc-900">{formatPrice(tax)}</dd>
              </div>
              <div className="border-t border-hairline pt-3 text-base">
                <div className="flex justify-between">
                  <dt className="font-semibold text-zinc-900">Total</dt>
                  <dd className="font-bold text-zinc-900">{formatPrice(total)}</dd>
                </div>
              </div>
            </dl>

            {shipping > 0 && (
              <p className="mt-4 rounded-lg bg-accent-soft px-3 py-2 text-xs text-accent">
                Add {formatPrice(remaining)} more to unlock free shipping.
              </p>
            )}

            <Link
              href="/checkout"
              className="btn-primary mt-5 w-full hover:bg-zinc-700 active:scale-[0.99]"
            >
              Proceed to checkout →
            </Link>
            <Link
              href="/products"
              className="mt-3 flex h-11 w-full items-center justify-center rounded-lg text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              Continue shopping
            </Link>

            <p className="mt-4 flex items-center justify-center gap-1.5 border-t border-hairline pt-4 text-xs text-zinc-400">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              Secure checkout — encrypted and private
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
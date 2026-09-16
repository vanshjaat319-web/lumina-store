"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  getProduct,
  cartSubtotal,
  shippingFor,
  estimatedTax,
  formatPrice,
} from "@/lib/products";
import { ProductTile } from "@/components/ProductBits";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming",
];

function fieldClasses(error?: string) {
  return `h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 ${
    error
      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
      : "border-hairline focus:border-indigo-500 focus:ring-indigo-500/20"
  }`;
}

/** Numbered section header: "1 · Contact" style. */
function SectionHeader({ step, title }: { step: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-foreground text-xs font-semibold text-white">
        {step}
      </span>
      <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
    </div>
  );
}

function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default function CheckoutPage() {
  const { items, loaded, clear } = useCart();
  const [placed, setPlaced] = useState(false);
  const [orderNumber] = useState(
    () => `LUM-${Math.floor(10000 + Math.random() * 90000)}`,
  );
  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cartSubtotal(items);
  const shipping = shippingFor(subtotal);
  const tax = estimatedTax(subtotal);
  const total = subtotal + shipping + tax;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries()) as Record<string, string>;
    const nextErrors: Record<string, string> = {};

    if (!values.email || !/.+@.+\..+/.test(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    for (const field of ["firstName", "lastName", "address", "city", "state", "zip", "country"]) {
      if (!values[field]?.trim()) {
        nextErrors[field] = "Required.";
      }
    }
    if (!/^\d{5}(-\d{4})?$/.test(values.zip ?? "")) {
      nextErrors.zip = "Enter a 5-digit ZIP code.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // No backend behind this — simulate a short payment delay, then confirm.
    setPlacing(true);
    window.setTimeout(() => {
      setPlaced(true);
      clear();
    }, 1200);
  }

  // Cart hasn't loaded yet.
  if (!loaded) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <p className="text-sm text-zinc-500">Loading checkout…</p>
      </div>
    );
  }

  // Order confirmed (cart is cleared at this point).
  if (placed) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-emerald-50 ring-1 ring-inset ring-emerald-600/20">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-9 w-9 text-emerald-600"
            aria-hidden="true"
          >
            <path d="m5 13 4 4L19 7" />
          </svg>
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900">
          Order confirmed!
        </h1>
        <p className="mt-3 max-w-md leading-7 text-zinc-600">
          Thanks for trying the demo. Your order{" "}
          <span className="font-semibold text-zinc-900">{orderNumber}</span> has been placed and a
          receipt is on its way. No payment was taken and nothing will be shipped.
        </p>
        <Link
          href="/products"
          className="btn-primary mt-8 hover:bg-zinc-700 active:scale-[0.99]"
        >
          Keep shopping
        </Link>
      </div>
    );
  }

  // Empty cart — nothing to check out.
  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-white text-4xl ring-1 ring-hairline">
          <LockIcon className="h-8 w-8 text-zinc-300" />
        </span>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-900">
          Nothing to check out
        </h1>
        <p className="mt-2 text-zinc-600">Your cart is empty. Add something first.</p>
        <Link
          href="/products"
          className="btn-primary mt-8 hover:bg-zinc-700 active:scale-[0.99]"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Checkout</h1>
      <p className="mt-2 text-zinc-600">Guest checkout — no account needed.</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <fieldset className="card p-6">
            <legend className="sr-only">Contact details</legend>
            <SectionHeader step="1" title="Contact" />
            <label className="mt-5 block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={fieldClasses(errors.email)}
              />
              {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
            </label>
          </fieldset>

          <fieldset className="card mt-6 p-6">
            <legend className="sr-only">Shipping address</legend>
            <SectionHeader step="2" title="Shipping address" />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-zinc-700">First name</span>
                <input name="firstName" autoComplete="given-name" className={fieldClasses(errors.firstName)} />
                {errors.firstName && <p className="mt-1 text-xs text-rose-600">{errors.firstName}</p>}
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-zinc-700">Last name</span>
                <input name="lastName" autoComplete="family-name" className={fieldClasses(errors.lastName)} />
                {errors.lastName && <p className="mt-1 text-xs text-rose-600">{errors.lastName}</p>}
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-zinc-700">Street address</span>
                <input name="address" autoComplete="street-address" placeholder="123 Main St" className={fieldClasses(errors.address)} />
                {errors.address && <p className="mt-1 text-xs text-rose-600">{errors.address}</p>}
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-zinc-700">City</span>
                <input name="city" autoComplete="address-level2" className={fieldClasses(errors.city)} />
                {errors.city && <p className="mt-1 text-xs text-rose-600">{errors.city}</p>}
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-zinc-700">State</span>
                <select name="state" autoComplete="address-level1" defaultValue="" className={fieldClasses(errors.state)}>
                  <option value="" disabled>
                    Select state…
                  </option>
                  {US_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="mt-1 text-xs text-rose-600">{errors.state}</p>}
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-zinc-700">ZIP code</span>
                <input name="zip" inputMode="numeric" autoComplete="postal-code" placeholder="94000" className={fieldClasses(errors.zip)} />
                {errors.zip && <p className="mt-1 text-xs text-rose-600">{errors.zip}</p>}
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-zinc-700">Country</span>
                <select name="country" defaultValue="US" className={fieldClasses(errors.country)}>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                </select>
                {errors.country && <p className="mt-1 text-xs text-rose-600">{errors.country}</p>}
              </label>
            </div>
          </fieldset>

          <fieldset className="card mt-6 p-6">
            <legend className="sr-only">Payment</legend>
            <SectionHeader step="3" title="Payment" />
            <div className="mt-5 rounded-xl border border-dashed border-hairline bg-zinc-50/60 px-5 py-4 text-sm text-zinc-500">
              This is a demo checkout — no payment details are requested or stored. The
              &ldquo;Place order&rdquo; step below simulates a secure payment.
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={placing}
            className="btn-primary mt-6 w-full hover:bg-zinc-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {placing ? "Placing order…" : `Place order · ${formatPrice(total)}`}
          </button>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-zinc-400">
            <LockIcon className="h-3.5 w-3.5" />
            Secured &amp; encrypted — no payment is taken in this demo.
          </p>
        </form>

        {/* Summary */}
        <aside className="h-fit lg:sticky lg:top-24">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-zinc-900">Order summary</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {items.map((item) => {
                const product = getProduct(item.productId);
                if (!product) return null;
                return (
                  <li key={item.productId} className="flex items-center gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                      <ProductTile product={product} className="h-full w-full rounded-none" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-900">{product.name}</p>
                      <p className="text-xs text-zinc-500">Qty {item.qty}</p>
                    </div>
                    <span className="text-sm font-medium text-zinc-900">
                      {formatPrice(product.price * item.qty)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-5 space-y-3 border-t border-hairline pt-4 text-sm">
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
              <div className="flex justify-between border-t border-hairline pt-3 text-base">
                <dt className="font-semibold text-zinc-900">Total</dt>
                <dd className="font-bold text-zinc-900">{formatPrice(total)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
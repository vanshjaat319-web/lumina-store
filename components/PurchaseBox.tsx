"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";

/** Quantity stepper + add-to-cart for the product detail page. */
export default function PurchaseBox({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product.id, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  if (product.stock <= 0) {
    return (
      <div className="rounded-xl border border-rose-600/20 bg-rose-50 p-5 text-sm font-medium text-rose-700">
        Out of stock — check back soon.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="inline-flex h-12 items-center rounded-lg border border-hairline bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setQty((value) => Math.max(1, value - 1))}
            className="flex h-12 w-11 items-center justify-center text-xl text-zinc-600 transition-colors hover:text-zinc-900"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span
            className="w-10 text-center text-sm font-semibold text-zinc-900"
            aria-live="polite"
          >
            {qty}
          </span>
          <button
            type="button"
            onClick={() =>
              setQty((value) => Math.min(product.stock, Math.min(value + 1, 99)))
            }
            className="flex h-12 w-11 items-center justify-center text-xl text-zinc-600 transition-colors hover:text-zinc-900"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`btn-primary h-12 flex-1 ${
            added ? "bg-emerald-600!" : "hover:bg-zinc-700 active:scale-[0.99]"
          }`}
        >
          {added ? "Added to cart ✓" : "Add to cart"}
        </button>
      </div>

      <p className="text-xs text-zinc-500">
        <span
          className={
            product.stock <= 15 ? "font-medium text-amber-600" : "font-medium text-emerald-600"
          }
        >
          {product.stock <= 15 ? `Only ${product.stock} left in stock` : "In stock"}
        </span>{" "}
        · Ships free over $50 · 30-day returns
      </p>
    </div>
  );
}
"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";

/** Purchase button. Variants: full pill, or a small circular + for card hover overlays. */
export default function AddToCartButton({
  product,
  qty = 1,
  full = false,
  variant = "pill",
  className = "",
}: {
  product: Product;
  qty?: number;
  /** If true the button fills its container width. */
  full?: boolean;
  /** "pill" = labelled button · "icon" = compact round plus, for photo overlays. */
  variant?: "pill" | "icon";
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem(product.id, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  if (product.stock <= 0) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        className={`${variant === "icon" ? "h-10 w-10 rounded-full bg-white/60 text-zinc-300" : "h-10 rounded-lg bg-zinc-100 px-4 text-sm font-medium text-zinc-400"} ${full ? "w-full" : ""} ${className}`}
      >
        {variant === "icon" ? (
          <span className="text-lg leading-none">＋</span>
        ) : (
          "Out of stock"
        )}
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Add ${product.name} to cart`}
        className={`grid h-10 w-10 place-items-center rounded-full shadow-sm transition-colors ${
          added
            ? "bg-emerald-600 text-white"
            : "bg-white text-zinc-900 ring-1 ring-black/10 hover:bg-zinc-900 hover:text-white"
        } ${className}`}
      >
        {added ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`h-10 rounded-lg px-4 text-sm font-semibold transition-all ${full ? "w-full" : ""} ${
        added
          ? "bg-emerald-600 text-white"
          : "bg-zinc-900 text-white hover:bg-zinc-700 active:scale-[0.98]"
      } ${className}`}
    >
      {added ? "Added to cart ✓" : "Add to cart"}
    </button>
  );
}
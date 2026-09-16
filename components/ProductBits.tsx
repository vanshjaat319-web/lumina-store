import Image from "next/image";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";

const SIZE = {
  "text-sm": "text-sm",
  "text-base": "text-base",
} as const;

export function Stars({
  rating,
  reviews,
  size = "text-sm",
}: {
  rating: number;
  reviews?: number;
  size?: keyof typeof SIZE;
}) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center gap-0.5 text-amber-400 ${SIZE[size]}`}
        role="img"
        aria-label={`Rated ${rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          // Half star is rendered at reduced opacity so the row stays aligned.
          <span key={i} className={i === full && half ? "opacity-50" : ""}>
            {i < full || (i === full && half) ? "★" : "☆"}
          </span>
        ))}
      </span>
      {typeof reviews === "number" && (
        <span className="text-xs text-zinc-500">
          {rating} ({reviews.toLocaleString()})
        </span>
      )}
    </span>
  );
}

/**
 * Product media: real photo when `product.image` exists, gradient+emoji
 * tile as fallback. The parent must position the tile (or for `fill`,
 * be `relative`) — the image keeps square crop via object-cover.
 */
export function ProductTile({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-100 ${className}`}
      aria-hidden="true"
    >
      {product.image ? (
        <Image
          src={product.image}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 320px"
          className="object-cover transition-transform duration-300"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient}`}>
          <span className="flex h-full w-full items-center justify-center text-5xl leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)] sm:text-6xl">
            {product.emoji}
          </span>
        </div>
      )}
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
    </div>
  );
}

export function Badge({ badge }: { badge: NonNullable<Product["badge"]> }) {
  const styles: Record<NonNullable<Product["badge"]>, string> = {
    New: "text-emerald-700",
    Sale: "text-rose-600",
    Bestseller: "text-indigo-700",
  };
  return (
    <span
      className={`inline-flex rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide backdrop-blur-sm ring-1 ring-black/5 ${styles[badge]}`}
    >
      {badge}
    </span>
  );
}

export function Price({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className="font-medium text-zinc-900">{formatPrice(product.price)}</span>
      {product.compareAtPrice && (
        <span className="text-sm text-zinc-400 line-through">
          {formatPrice(product.compareAtPrice)}
        </span>
      )}
    </span>
  );
}
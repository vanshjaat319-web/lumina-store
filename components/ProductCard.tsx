import Link from "next/link";
import type { Product } from "@/lib/products";
import { getCategoryLabel } from "@/lib/products";
import { Badge, Price, ProductTile, Stars } from "@/components/ProductBits";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group card flex flex-col overflow-hidden transition-shadow hover:shadow-lg hover:shadow-zinc-900/5">
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-zinc-100"
        aria-label={product.name}
      >
        <div className="absolute inset-0 transition-transform duration-300 ease-out group-hover:scale-[1.04]">
          <ProductTile product={product} className="h-full w-full rounded-none" />
        </div>
        {product.badge && (
          <div className="absolute left-3 top-3 z-10">
            <Badge badge={product.badge} />
          </div>
        )}
        {/* Circular quick-add — appears over the photo on hover (touch hides it;
            the inline button below covers small screens). */}
        <div className="absolute bottom-3 right-3 z-10 translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 max-sm:hidden">
          <AddToCartButton product={product} variant="icon" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <Link href={`/products/${product.id}`} className="group-hover:underline">
          <h3 className="text-sm font-medium text-zinc-900">{product.name}</h3>
        </Link>
        <p className="text-xs text-zinc-500">{getCategoryLabel(product.category)}</p>
        <Stars rating={product.rating} />
        <div className="mt-auto flex items-center justify-between gap-3 pt-2.5">
          <Price product={product} />
          <span className="text-[11px] text-zinc-400">
            {product.stock <= 15 ? (
              <span className="font-medium text-amber-600">Low stock</span>
            ) : (
              <span className="hidden sm:block">In stock</span>
            )}
          </span>
        </div>
        <div className="mt-1 sm:hidden">
          <AddToCartButton product={product} full />
        </div>
      </div>
    </div>
  );
}
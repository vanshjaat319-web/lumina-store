import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-28 text-center sm:px-6">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-white ring-1 ring-hairline">
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
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4m0 4h.01" />
        </svg>
      </span>
      <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-accent">
        404 — Page not found
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-3 max-w-sm leading-7 text-zinc-600">
        The page you&apos;re looking for doesn&apos;t exist, or may have moved. Let&apos;s get you back to
        the good stuff.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary hover:bg-zinc-700 active:scale-[0.99]">
          Back home
        </Link>
        <Link
          href="/products"
          className="btn-secondary hover:border-zinc-300 active:scale-[0.99]"
        >
          Browse the shop
        </Link>
      </div>
    </div>
  );
}
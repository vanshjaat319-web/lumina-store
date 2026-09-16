# Lumina — a demo storefront

A complete shopping frontend built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS v4**. No backend — the catalog is static demo data and the cart lives in `localStorage`.

## What's inside

| Route | Page |
| --- | --- |
| `/` | Hero, shop-by-category, featured products, value props |
| `/products` | Full catalog with live search, category filters, and sorting |
| `/products?category=audio` | Catalog pre-filtered by category |
| `/products/[id]` | Product detail with quantity + add-to-cart, related products |
| `/cart` | Cart items, quantity controls, order summary, free-shipping nudge |
| `/checkout` | Mock guest checkout with validation and a confirming "order placed" state |
| anything else | Custom 404 page |

## Features

- **Static catalog** — `lib/products.ts` holds 12 fictional products across 5 categories. The rest of the app reads only through its helper functions, so it can be swapped for a real API later without touching components.
- **Persistent cart** — React Context + `localStorage`, safe across reloads, with a one-time hydration read (no SSR/client mismatches).
- **Search / filter / sort** — client-side, instant, based on category query params from the server.
- **Product photos** — each product has a locally cached photo in `public/products/` (sourced from Unsplash, free to use), rendered with `next/image`. A gradient-and-emoji tile is the fallback if a photo is missing.
- **SSG product pages** — all 12 detail pages prerendered via `generateStaticParams`.

## Run it

```bash
npm install        # deps (already installed)
npm run dev        # dev server at http://localhost:3000
npm run build      # typecheck + production build
npm start          # serve the production build
npm run lint       # ESLint
```

## Swap in a real backend

Everything reads from `lib/products.ts` (`products`, `getProduct`, `relatedProducts`, cart math). Point those at your API and the rest of the app keeps working.
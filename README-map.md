# Lumina — code map for the owner

A plain-English map of where every feature lives, so you can find and edit the
right code without knowing the codebase.

## The golden rule

**Every page's URL matches a file in the `app` folder.**

- URL `/cart` → file `app/cart/page.tsx`
- URL `/products` → file `app/products/page.tsx`
- URL `/products/aura-headphones` → file `app/products/[id]/page.tsx`
- URL `/account` → file `app/account/page.tsx`

## How to find the exact spot to edit

1. Open the project in VS Code.
2. Press **⌘ + Shift + F** (search).
3. Type a word that appears on the screen — e.g. `Cart`, `Free shipping`, a
   product name. The search jumps straight to the file and line.

Skip line numbers in this doc — they change every time code is edited. The
**filename is the permanent address**; use search to find the exact line.

## Feature → where the code lives

| What you want to change | File |
|---|---|
| Cart logic (add/remove/quantities, what's saved) | `context/CartContext.tsx` |
| Cart page | `app/cart/page.tsx` |
| Cart icon + item count in top bar | `components/Header.tsx` |
| "Add to cart" button on a product | `components/AddToCartButton.tsx` |
| Shop page (search/filter/sort) | `app/products/page.tsx` + `components/Catalog.tsx` |
| Single product page (details) | `app/products/[id]/page.tsx` |
| Checkout page (address + pay) | `app/checkout/page.tsx` |
| Login page | `app/login/page.tsx` |
| Sign up page | `app/signup/page.tsx` |
| Account + order history | `app/account/page.tsx` |
| Order receipt (after payment) | `app/account/orders/[id]/page.tsx` |
| Homepage (hero, categories, featured) | `app/page.tsx` |
| Footer | `components/Footer.tsx` |
| **Add / manage products (no code!)** | **`/admin` page** — `app/admin/page.tsx` + `components/AdminPanel.tsx` |
| Prices, shipping & tax formulas | `lib/products.ts` |
| Database tables & queries | `lib/db/` |
| Payments (Stripe) | `lib/stripe.ts`, `app/api/checkout/`, `app/api/webhooks/stripe/` |
| Login/logout API | `app/api/auth/` |

## Notes

- Most of a file is styling. The **part to edit** is usually a small spot near
  the top — a button, a name, a sentence. Search inside the file for the word
  you want to change.
- After adding a product in the **admin page**, it appears on the store
  instantly — no code, no redeploy needed.
// Static demo catalog for the Lumina storefront.
// Swap this module for an API/data fetch later — the rest of the app
// only reads from these functions, so the shape is the contract.

export type Category = "audio" | "home" | "desk" | "wearables" | "accessories";

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  /** Pre-discount price, shown struck-through when present. */
  compareAtPrice?: number;
  rating: number; // 0–5
  reviews: number;
  shortDescription: string;
  description: string;
  /** Local product photo (public/products/<id>.jpg), served via next/image. */
  image: string;
  /** Emoji + gradient are the fallback tile, shown only when no photo exists. */
  emoji: string;
  /** Tailwind gradient stops, e.g. "from-indigo-500 to-violet-600". */
  gradient: string;
  badge?: "New" | "Sale" | "Bestseller";
  stock: number;
};

export type CartItem = { productId: string; qty: number };

export const CATEGORIES: { slug: Category; label: string; emoji: string }[] = [
  { slug: "audio", label: "Audio", emoji: "🎧" },
  { slug: "home", label: "Home", emoji: "🏡" },
  { slug: "desk", label: "Desk", emoji: "⌨️" },
  { slug: "wearables", label: "Wearables", emoji: "⌚" },
  { slug: "accessories", label: "Accessories", emoji: "🎒" },
];

export const FREE_SHIPPING_THRESHOLD = 50;
export const FLAT_SHIPPING_FEE = 5.99;

export const products: Product[] = [
  {
    id: "aura-headphones",
    name: "Aura Noise-Cancelling Headphones",
    category: "audio",
    price: 129,
    compareAtPrice: 179,
    rating: 4.8,
    reviews: 1247,
    shortDescription: "Over-ear wireless headphones with adaptive noise cancelling and 40-hour battery life.",
    description:
      "Block out the world and stay lost in the music. Aura pairs adaptive ANC with plush memory-foam earcups, punchy 40mm drivers, and multipoint Bluetooth so you can hop between laptop and phone without missing a beat. A single charge runs 40 hours with ANC on.",
    image: "/products/aura-headphones.jpg",
    emoji: "🎧",
    gradient: "from-indigo-800 to-violet-600",
    badge: "Sale",
    stock: 42,
  },
  {
    id: "echo-speaker",
    name: "Echo Mini Bluetooth Speaker",
    category: "audio",
    price: 49,
    rating: 4.5,
    reviews: 862,
    shortDescription: "Palm-sized speaker with surprisingly big, room-filling 360° sound.",
    description:
      "An egg-cup-sized speaker with a serious low end. Echo Mini radiates 360° audio from a single aluminium housing, survives beach, bath, and rain-proofing, and connects two units for true stereo. IP67 rated, 12 hours of playtime.",
    image: "/products/echo-speaker.jpg",
    emoji: "🎶",
    gradient: "from-rose-500 to-orange-400",
    badge: "Bestseller",
    stock: 100,
  },
  {
    id: "studio-earbuds",
    name: "Studio Earbuds Pro",
    category: "audio",
    price: 89,
    compareAtPrice: 119,
    rating: 4.6,
    reviews: 540,
    shortDescription: "True-wireless earbuds with spatial audio and wireless charging.",
    description:
      "Studio-grade tuning in a featherweight bud. Spatial audio, six microphones for crisp calls, and a case that tops up wirelessly. Comfortable enough for all-day wear with five ear-tip sizes in the box.",
    image: "/products/studio-earbuds.jpg",
    emoji: "🎵",
    gradient: "from-fuchsia-500 to-pink-500",
    badge: "New",
    stock: 28,
  },
  {
    id: "hearth-diffuser",
    name: "Hearth Aroma Diffuser",
    category: "home",
    price: 34,
    rating: 4.4,
    reviews: 318,
    shortDescription: "Quiet ultrasonic diffuser that mists a room in warm, candle-free light.",
    description:
      "A gentle mist and a soft amber glow — no open flame. Hearth runs whisper-quiet through the night, auto-sleeps when dry, and diffuses up to 40mL of water per hour across a spacious room.",
    image: "/products/hearth-diffuser.jpg",
    emoji: "🪔",
    gradient: "from-amber-400 to-orange-600",
    stock: 76,
  },
  {
    id: "mason-mug-set",
    name: "Mason Ceramic Mug Set",
    category: "home",
    price: 28,
    rating: 4.7,
    reviews: 209,
    shortDescription: "Set of four stackable stoneware mugs, oven- and dishwasher-safe.",
    description:
      "Hand-glazed stoneware with a comfortable two-finger handle and a lip that keeps the coffee in the cup. Stack neatly to save shelf space and take the microwave without complaint.",
    image: "/products/mason-mug-set.jpg",
    emoji: "☕",
    gradient: "from-yellow-300 to-amber-500",
    stock: 150,
  },
  {
    id: "dawn-lamp",
    name: "Dawn Table Lamp",
    category: "home",
    price: 74,
    compareAtPrice: 96,
    rating: 4.3,
    reviews: 143,
    shortDescription: "Dimmable, warm-white task light with a ribbed glass shade.",
    description:
      "A soft gradient of light that fades from dusk to warm white as you dim it. Machined brass details, a solid steel base, and a simple touch dial that remembers your last brightness.",
    image: "/products/dawn-lamp.jpg",
    emoji: "💡",
    gradient: "from-sky-400 to-indigo-500",
    badge: "Sale",
    stock: 33,
  },
  {
    id: "nomad-keyboard",
    name: "Nomad Mechanical Keyboard",
    category: "desk",
    price: 139,
    rating: 4.9,
    reviews: 981,
    shortDescription: "Gasket-mounted 75% board with pre-lubed switches and hot-swap sockets.",
    description:
      "A satisfying clack without the furniture-rattling. Nomad comes pre-built with lubed linear switches, sound-dampening layers, and per-key RGB you can tone down to a single warm colour. Hot-swap sockets mean you can change switches in minutes.",
    image: "/products/nomad-keyboard.jpg",
    emoji: "🎹",
    gradient: "from-zinc-700 to-zinc-900",
    badge: "Bestseller",
    stock: 60,
  },
  {
    id: "bamboo-rest",
    name: "Ergo Bamboo Wrist Rest",
    category: "desk",
    price: 19,
    rating: 4.2,
    reviews: 174,
    shortDescription: "Sloped bamboo wrist rest with a non-slip cork base.",
    description:
      "A gently sloped platform that keeps your wrists neutral while you type. Smooth-sanded bamboo with a grippy cork underbelly, sized to sit beside any keyboard without sliding around.",
    image: "/products/bamboo-rest.jpg",
    emoji: "🌿",
    gradient: "from-lime-500 to-emerald-600",
    stock: 200,
  },
  {
    id: "pulse-watch",
    name: "Pulse Smartwatch",
    category: "wearables",
    price: 199,
    rating: 4.6,
    reviews: 402,
    shortDescription: "Always-on AMOLED, heart-rate and sleep tracking, 10-day battery.",
    description:
      "Your health stats at a glance, without charging anxiety. Always-on AMOLED display, optical heart-rate and SpO₂ sensors, sleep coaching, and a 10-day battery that lasts a full work trip.",
    image: "/products/pulse-watch.jpg",
    emoji: "⌚",
    gradient: "from-teal-500 to-cyan-500",
    badge: "New",
    stock: 25,
  },
  {
    id: "flux-ring",
    name: "Flux Smart Ring",
    category: "wearables",
    price: 159,
    compareAtPrice: 189,
    rating: 4.4,
    reviews: 96,
    shortDescription: "Slim titanium ring that tracks sleep, activity, and recovery.",
    description:
      "A fitness tracker you'll forget you're wearing. Featherweight titanium with sensors that read sleep stages, resting heart rate, and daily activity over a full week between charges.",
    image: "/products/flux-ring.jpg",
    emoji: "💍",
    gradient: "from-violet-500 to-purple-700",
    badge: "Sale",
    stock: 40,
  },
  {
    id: "voyager-tote",
    name: "Voyager Canvas Tote",
    category: "accessories",
    price: 42,
    rating: 4.5,
    reviews: 255,
    shortDescription: "Heavyweight cotton tote with an interior pocket and zip closure.",
    description:
      "Built from 15oz waxed canvas that only looks better with wear. Fits a 16-inch laptop, has a padded interior sleeve, and closes with a tidy zip so nothing escapes on the commute.",
    image: "/products/voyager-tote.jpg",
    emoji: "👜",
    gradient: "from-orange-400 to-rose-500",
    stock: 90,
  },
  {
    id: "cord-keeper",
    name: "Uniq Cord Keeper Set",
    category: "accessories",
    price: 15,
    rating: 4.0,
    reviews: 88,
    shortDescription: "Six silicone cable ties for a desk that doesn't look like spaghetti.",
    description:
      "Twist, snap, done. Six silicone ties in three lengths keep chargers, earbuds, and camera cables coiled and labelled where they live.",
    image: "/products/cord-keeper.jpg",
    emoji: "🔌",
    gradient: "from-slate-400 to-slate-600",
    stock: 300,
  },
];

export function isCategory(value: string): value is Category {
  return CATEGORIES.some((c) => c.slug === value);
}

export function getCategoryLabel(slug: Category): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function relatedProducts(id: string, limit = 4): Product[] {
  const current = getProduct(id);
  if (!current) return [];
  return products.filter((p) => p.id !== id && p.category === current.category).slice(0, limit);
}

export const homeFeatured: Product[] = products
  .filter((p) => p.badge === "Bestseller" || p.badge === "New")
  .slice(0, 4);

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const product = getProduct(item.productId);
    return product ? sum + product.price * item.qty : sum;
  }, 0);
}

export function shippingFor(subtotal: number): number {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
}

export function estimatedTax(subtotal: number): number {
  return Math.round(subtotal * 0.0825 * 100) / 100;
}

export function discountFor(product: Product): number {
  if (!product.compareAtPrice) return 0;
  return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
}
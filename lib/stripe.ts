import Stripe from "stripe";

/** Lazily construct the Stripe client. Returns null when key is missing (dev without Stripe). */
let _stripe: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (_stripe !== undefined) return _stripe;
  if (!process.env.STRIPE_SECRET_KEY) {
    _stripe = null;
    return null;
  }
  _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return _stripe;
}

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
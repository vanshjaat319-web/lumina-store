import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "FAQs — Lumina",
  description: "Quick answers on shipping, returns, warranty, and your account.",
};

const FAQS = [
  {
    q: "How long does shipping take?",
    a: "Standard shipping is 3–6 business days across the US, and free on orders over $50. Express (2–3 days) is available at checkout for $12.99.",
  },
  {
    q: "Do you ship internationally?",
    a: "Not yet — we currently ship within the United States. Sign up for the newsletter and we'll email when international shipping opens up.",
  },
  {
    q: "Can I return a product if I change my mind?",
    a: "Yes. You have 30 days from delivery to start a return for a full refund. Items should be unused and in their original packaging, and we cover the prepaid return label.",
  },
  {
    q: "What if my order arrives damaged or defective?",
    a: "Sorry about that. Email photos to support@lumina.example within 72 hours of delivery and we'll ship a replacement or refund immediately — no return required.",
  },
  {
    q: "How does the 2-year warranty work?",
    a: "If something fails on its own during the first two years, we repair or replace it for free, shipping included. This doesn't cover normal wear, accidental damage, or water damage.",
  },
  {
    q: "Can I change or cancel my order?",
    a: "If it hasn't shipped yet, yes — reply to your order confirmation with the change and we'll handle it. Once a tracking number is generated, the order can no longer be changed.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Visa, Mastercard, American Express, PayPal, and Apple Pay. Our checkout is fully encrypted and your payment details never touch our servers.",
  },
];

export default function FaqsPage() {
  return (
    <InfoPage
      eyebrow="Help"
      title="Frequently asked questions"
      intro="The answers most people are looking for. Still stuck? Contact support and a real human will reply within one business day."
      sections={FAQS.map((faq, i) => ({
        id: `faq-${i + 1}`,
        title: faq.q,
        body: <p>{faq.a}</p>,
      }))}
    />
  );
}
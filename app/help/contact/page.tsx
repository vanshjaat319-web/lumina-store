import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact support — Lumina",
  description: "Get in touch with the Lumina support team.",
};

export default function ContactPage() {
  return (
    <InfoPage
      eyebrow="Help"
      title="Contact support"
      intro="We reply within one business day, usually much faster. For the quickest resolution, include your order number if you have one."
      sections={[
        {
          id: "form",
          title: "Send us a message",
          body: <ContactForm />,
        },
        {
          id: "other-channels",
          title: "Other ways to reach us",
          body: (
            <ul className="list-none space-y-2">
              <li>
                <span className="font-medium text-zinc-800">Email.</span>{" "}
                support@lumina.example — best for order-specific questions.
              </li>
              <li>
                <span className="font-medium text-zinc-800">Live chat.</span> Available in the
                bottom-right corner, Mon–Fri 9am–6pm ET (US only).
              </li>
              <li>
                <span className="font-medium text-zinc-800">Mail.</span> Lumina Inc., 100 Market
                Street, Suite 5, Portland, OR 97201.
              </li>
            </ul>
          ),
        },
      ]}
    />
  );
}
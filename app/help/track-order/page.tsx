import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
import TrackOrderForm from "@/components/TrackOrderForm";

export const metadata: Metadata = {
  title: "Track your order — Lumina",
  description: "Check the delivery status of your Lumina order.",
};

export default function TrackOrderPage() {
  return (
    <InfoPage
      eyebrow="Help"
      title="Track your order"
      intro="Enter your tracking number to see where your package is. The confirmation email contains a link to this page with the number prefilled."
      sections={[
        {
          id: "tracking",
          title: "Check delivery status",
          body: <TrackOrderForm />,
        },
        {
          id: "no-tracking-number",
          title: "No tracking number yet?",
          body: (
            <p>
              Orders placed before 2pm ET ship the same business day; tracking numbers are emailed
              within a few hours of dispatch. If yours hasn&apos;t arrived, allow up to 24 hours
              after checkout and check your spam folder before contacting support.
            </p>
          ),
        },
      ]}
    />
  );
}
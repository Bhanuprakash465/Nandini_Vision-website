import type { Metadata } from "next";
import AvailabilityPreview from "@/components/AvailabilityPreview";

export const metadata: Metadata = {
  title: "Availability",
  description: "Check real-time availability for your wedding, event or shoot date with Nandini Vision.",
};

export default function AvailabilityPage() {
  return (
    <section className="bg-ink text-bone px-6 md:px-12 pt-40 pb-32 min-h-screen">
      <AvailabilityPreview />
    </section>
  );
}

import type { Metadata } from "next";
import AvailabilityChecker from "@/components/AvailabilityChecker";

export const metadata: Metadata = {
  title: "Availability",
  description: "Check whether your wedding, event or shoot date is open with Nandini Vision.",
  alternates: { canonical: "/availability" },
};

export default function AvailabilityPage() {
  return (
    <section className="on-dark min-h-[calc(100svh-var(--header-h))] bg-[image:var(--gradient-dusk)] text-white">
      <div className="page-pad py-24 md:py-36">
        <h1 className="sr-only">Check availability</h1>
        <AvailabilityChecker />
      </div>
    </section>
  );
}

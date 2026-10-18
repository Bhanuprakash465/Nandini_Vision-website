import type { Metadata } from "next";
import WorkArchive from "@/components/WorkArchive";

export const metadata: Metadata = {
  title: "Work",
  description: "The Nandini Vision archive: weddings, pre-wedding stories and celebrations across Andhra Pradesh.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <section className="page-pad pb-32 pt-16 md:pt-24">
      <h1 className="font-display text-6xl font-normal leading-none md:text-9xl">Work</h1>
      <p className="mb-16 mt-6 max-w-lg text-[17px] leading-relaxed text-black/70">
        Stories from weddings and celebrations, told in the order the day unfolded.
      </p>
      <WorkArchive />
    </section>
  );
}

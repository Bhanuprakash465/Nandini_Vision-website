import type { Metadata } from "next";
import WorkArchive from "@/components/WorkArchive";

export const metadata: Metadata = {
  title: "Work",
  description: "The complete Nandini Vision archive — weddings, pre-wedding stories and celebrations across Andhra Pradesh.",
};

export default function WorkPage() {
  return (
    <section className="px-6 md:px-12 pt-36 pb-32">
      <h1 className="font-display text-5xl md:text-7xl font-medium mb-16">Work</h1>
      <WorkArchive />
    </section>
  );
}

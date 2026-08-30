import type { Metadata } from "next";
import ConsultationForm from "@/components/ConsultationForm";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Tell us about your day and we'll be in touch to plan your Nandini Vision coverage.",
};

export default function ConsultationPage() {
  return (
    <section className="px-6 md:px-12 pt-36 pb-32">
      <h1 className="font-display text-5xl md:text-6xl font-medium mb-12">Book a Consultation</h1>
      <ConsultationForm />
    </section>
  );
}

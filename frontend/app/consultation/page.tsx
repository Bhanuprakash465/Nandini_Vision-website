import type { Metadata } from "next";
import ConsultationForm from "@/components/ConsultationForm";
import Photo from "@/components/Photo";

export const metadata: Metadata = {
  title: "Book a consultation",
  description: "Tell us about your day and we'll be in touch to plan your Nandini Vision coverage.",
  alternates: { canonical: "/consultation" },
};

type SP = { [key: string]: string | string[] | undefined };
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default function ConsultationPage({ searchParams }: { searchParams: SP }) {
  const collection = one(searchParams.collection);
  return (
    <section className="page-pad grid gap-16 pb-28 pt-16 md:pt-24 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <h1 className="font-display text-5xl font-normal leading-none md:text-7xl">Book a consultation</h1>
        <p className="mb-14 mt-6 max-w-lg text-[17px] leading-relaxed text-black/70">
          Tell us about your day. We&rsquo;ll read every detail and reply personally.
        </p>
        <ConsultationForm
          initial={{
            event: one(searchParams.event),
            date: one(searchParams.date),
            location: one(searchParams.location),
            message: collection ? `I'm interested in the ${collection.slice(0, 40)} collection.` : undefined,
          }}
        />
      </div>
      <aside className="hidden lg:col-span-5 lg:block" aria-hidden="true">
        <div className="sticky top-32">
          <div className="relative aspect-[4/5] w-[calc(100%-20px)]">
            <div className="absolute inset-0 translate-x-5 translate-y-5 bg-cobalt" />
            <div className="absolute inset-0 overflow-hidden">
              <Photo tone="mono" label="Photograph to be supplied" sizes="40vw" />
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}

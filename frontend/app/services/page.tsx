import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import { Arrow } from "@/components/Arrow";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description: "Wedding photography, cinematic films, drone coverage, portraits and more from Nandini Vision.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <section className="page-pad grid gap-14 pb-28 pt-16 md:pt-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <h1 className="font-display text-6xl font-normal leading-none md:text-8xl">Services</h1>
            <p className="mt-6 max-w-sm text-[17px] leading-relaxed text-black/70">
              Photography and film for weddings, families and brands, shaped around the day in front of us.
            </p>
            <div className="relative mt-12 hidden aspect-[4/5] w-[calc(100%-20px)] lg:block">
              <div aria-hidden="true" className="absolute inset-0 translate-x-5 translate-y-5 bg-cobalt" />
              <div className="absolute inset-0 overflow-hidden">
                <Photo tone="mono" alt="Studio portrait" label="Photograph to be supplied" sizes="40vw" />
              </div>
            </div>
          </div>
        </div>

        <ul className="lg:col-span-7">
          {services.map((s) => (
            <Reveal as="li" key={s.title} className="border-t border-black/15 last:border-b">
              <Link
                href={`/consultation?event=${encodeURIComponent(s.eventType)}`}
                className="group flex items-start justify-between gap-6 py-8 transition-all duration-500 hover:bg-cobalt hover:px-6 hover:text-white"
              >
                <span>
                  <span className="block font-display text-3xl md:text-4xl">{s.title}</span>
                  <span className="mt-3 block max-w-md text-[15px] leading-relaxed text-black/65 transition-colors group-hover:text-white/80">{s.desc}</span>
                  <span className="mt-4 block text-[15px] font-medium">Enquire about this</span>
                </span>
                <Arrow className="mt-3 h-6 w-6 shrink-0 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="on-dark bg-[image:var(--gradient-night)] text-white">
        <div className="page-pad flex flex-wrap items-center justify-between gap-8 py-20">
          <p className="max-w-xl font-display text-3xl leading-tight md:text-5xl">Not sure which fits your day?</p>
          <Link href="/consultation" className="btn-ghost-light">Tell us about it</Link>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "The Nandini Vision studio: our philosophy and how we approach a wedding day.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="page-pad pb-24 pt-16 md:pt-24">
        <h1 className="max-w-4xl font-display text-5xl font-normal leading-[1.02] md:text-8xl">
          We photograph people, <em className="text-cobalt">not poses.</em>
        </h1>

        <div className="mt-20 grid items-center gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <div className="relative aspect-[4/5] w-[calc(100%-20px)]">
              <div aria-hidden="true" className="absolute inset-0 translate-x-5 translate-y-5 bg-cobalt" />
              <div className="absolute inset-0 overflow-hidden">
                <Photo tone="mono" alt="The Nandini Vision studio" label="Studio photograph to be supplied" sizes="(min-width: 768px) 42vw, 100vw" />
              </div>
            </div>
          </Reveal>

          <Reveal className="grid gap-12 md:col-span-6 md:col-start-7">
            <div>
              <h2 className="mb-4 font-display text-3xl">The studio</h2>
              <p className="max-w-prose text-[17px] leading-[1.75] text-black/75">
                Nandini Vision is a wedding photography and film studio based in Andhra Pradesh, working across
                India and at destinations worldwide.
              </p>
            </div>
            <div>
              <h2 className="mb-4 font-display text-3xl">Our approach</h2>
              <p className="max-w-prose text-[17px] leading-[1.75] text-black/75">
                We want an album to feel the way the day did, not like a performance for the camera. That means
                getting to know the families, and knowing when to step back, when to stay close, and when to let a
                moment happen without us in the middle of it.
              </p>
            </div>
            <div>
              <h2 className="mb-4 font-display text-3xl">The rhythm of the ritual</h2>
              <p className="max-w-prose text-[17px] leading-[1.75] text-black/75">
                South Indian ceremonies move quickly and mean a great deal. We plan our coverage around that
                rhythm so that nothing important passes unseen.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="on-dark bg-[image:var(--gradient-night)] text-white">
        <div className="page-pad flex flex-wrap items-center justify-between gap-8 py-24">
          <p className="max-w-2xl font-display text-4xl leading-tight md:text-6xl">
            Tell us about your day and we&rsquo;ll tell you how we&rsquo;d tell it.
          </p>
          <Link href="/consultation" className="btn-ghost-light">Book a consultation</Link>
        </div>
      </section>
    </>
  );
}

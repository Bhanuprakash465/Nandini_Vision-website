import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "The Nandini Vision studio story, philosophy and creative process.",
};

export default function AboutPage() {
  return (
    <section className="px-6 md:px-12 pt-36 pb-32">
      <Reveal>
        <h1 className="font-display text-5xl md:text-7xl font-medium max-w-3xl leading-tight">
          We photograph people, not poses.
        </h1>
      </Reveal>

      <div className="grid md:grid-cols-2 gap-16 mt-24">
        <Reveal className="h-[520px]">
          <Placeholder tone="gold" className="h-full w-full" />
        </Reveal>
        <Reveal delay={100} className="flex flex-col justify-center gap-8">
          <div>
            <h2 className="font-display text-2xl mb-3">The Studio</h2>
            <p className="text-greige leading-relaxed">
              Nandini Vision was founded in Andhra Pradesh with one belief: that a wedding album should feel like
              the day did, not like a performance for the camera. We work in small, deliberate teams so every
              photograph carries the same eye and the same restraint.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl mb-3">Our Approach</h2>
            <p className="text-greige leading-relaxed">
              We spend time with families before the event, not just on the day of. That's how we know when to
              step back, when to stay close, and when to simply let a moment happen without us in the middle of it.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl mb-3">Why Us</h2>
            <p className="text-greige leading-relaxed">
              South Indian rituals move fast and mean a great deal — we've spent years learning their rhythm, so
              nothing important passes us by.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

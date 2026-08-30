import Link from "next/link";
import Placeholder from "@/components/Placeholder";
import Reveal from "@/components/Reveal";
import TestimonialsRotator from "@/components/TestimonialsRotator";
import AvailabilityPreview from "@/components/AvailabilityPreview";
import { projects, services, collections, site } from "@/lib/data";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section data-testid="hero-section" className="relative h-[100svh] flex flex-col justify-end px-6 md:px-12 pb-16">
        <Placeholder tone="maroon" label="TEMPORARY PLACEHOLDER — South Indian bridal portrait" className="absolute inset-0 -z-20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/15 via-ink/5 to-ink/70" />
        <div className="text-[11px] uppercase tracking-[0.28em] text-bone/85 mb-4">{site.location.toUpperCase().replace(", ", " · ")}</div>
        <h1 className="font-display text-bone text-5xl md:text-8xl font-medium leading-[1.02] max-w-4xl">
          {site.headline}
        </h1>
        <p className="font-display italic text-bone/85 text-lg md:text-2xl mt-5">{site.tagline}</p>
        <div className="flex gap-4 mt-11 flex-wrap">
          <Link href="/consultation" className="border border-gold bg-gold text-ink px-8 py-4 text-[11px] uppercase tracking-[0.16em] font-semibold">
            Book Your Date
          </Link>
          <Link href="/work" className="border border-bone text-bone px-8 py-4 text-[11px] uppercase tracking-[0.16em] font-semibold hover:bg-bone hover:text-ink transition-colors">
            View Our Stories
          </Link>
        </div>
      </section>

      {/* SELECTED STORIES */}
      <section id="stories" className="pt-32 pb-24 md:pt-40" data-testid="selected-stories">
        <Reveal className="flex flex-wrap justify-between items-end gap-6 px-6 md:px-12 mb-16">
          <h2 className="font-display text-4xl md:text-6xl font-medium">Selected<br />Stories</h2>
          <p className="max-w-xs text-greige text-sm leading-relaxed">
            Four weddings, four landscapes of Andhra Pradesh — from riverbanks to temple courtyards.
          </p>
        </Reveal>
        <div className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-5">
          {projects.map((p, idx) => (
            <Reveal
              key={p.slug}
              delay={idx * 80}
              className={
                idx === 0
                  ? "md:col-span-7 h-[420px] md:h-[640px]"
                  : idx === 1
                  ? "md:col-span-5 h-[420px] md:h-[640px] md:mt-24"
                  : idx === 2
                  ? "md:col-span-5 h-[380px] md:h-[460px] md:mt-10"
                  : "md:col-span-7 h-[380px] md:h-[460px]"
              }
            >
              <Link href={`/work/${p.slug}`} className="group block h-full" data-testid={`story-${p.slug}`}>
                <div className="h-[85%] overflow-hidden">
                  <Placeholder tone={p.cover} className="h-full w-full transition-transform duration-[1.1s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105" />
                </div>
                <div className="flex justify-between items-baseline mt-4">
                  <h3 className="text-xl font-medium">{p.title}</h3>
                  <span className="text-[11px] uppercase tracking-[0.1em] text-greige">
                    {p.category} · {p.location} · {p.year}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* STUDIO STATEMENT */}
      <section className="bg-ink text-bone text-center px-6 md:px-12 py-40" data-testid="studio-statement">
        <Reveal>
          <div className="text-[11px] uppercase tracking-[0.2em] text-bone/50 mb-6">Studio Philosophy</div>
          <h2 className="font-display text-3xl md:text-6xl leading-tight max-w-4xl mx-auto">
            We don&rsquo;t photograph <em className="text-gold not-italic font-normal italic">what happened.</em>
            <br />
            We photograph <em className="text-gold not-italic font-normal italic">how it felt.</em>
          </h2>
          <p className="max-w-lg mx-auto mt-8 text-bone/65 text-sm leading-loose">
            Every ritual, every glance held a second too long, every hand reaching for another — these are not
            moments we stage. They are moments we wait for, in the quiet space between frames.
          </p>
        </Reveal>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="px-6 md:px-12 py-32" data-testid="services-preview">
        <Reveal className="mb-10">
          <h2 className="font-display text-4xl md:text-6xl font-medium">Services</h2>
        </Reveal>
        <div>
          {services.slice(0, 6).map((s, idx) => (
            <Reveal key={s.title} delay={idx * 50}>
              <Link
                href="/services"
                className="group flex items-center gap-6 py-8 border-t border-ink/10 last:border-b hover:bg-maroon/5 hover:pl-4 transition-all duration-500"
              >
                <span className="text-xs text-greige w-10">{String(idx + 1).padStart(2, "0")}</span>
                <h3 className="flex-1 font-display text-2xl md:text-4xl font-medium group-hover:text-maroon group-hover:translate-x-1.5 transition-all duration-500">
                  {s.title}
                </h3>
                <span className="text-xl text-greige group-hover:text-maroon group-hover:translate-x-2 transition-all duration-300">→</span>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <Link href="/services" className="text-xs uppercase tracking-[0.16em] border-b border-ink pb-1">
            View all services →
          </Link>
        </Reveal>
      </section>

      {/* SHOWREEL */}
      <section className="px-6 md:px-12 pb-32" data-testid="cinematic-showreel">
        <Reveal>
          <div className="relative h-[78vh] max-h-[720px] bg-ink flex items-center justify-center overflow-hidden">
            <Placeholder tone="maroon" label="TEMPORARY PLACEHOLDER — showreel poster frame" className="absolute inset-0 opacity-55" />
            <div className="relative z-10 text-center text-bone">
              <div className="text-[11px] uppercase tracking-[0.2em] text-gold mb-4">The Showreel</div>
              <h3 className="font-display text-3xl md:text-5xl">Stories in motion, 2023–2024</h3>
              <button
                aria-label="Play showreel"
                className="mt-8 w-20 h-20 rounded-full border border-bone/50 flex items-center justify-center mx-auto hover:scale-105 hover:bg-bone/10 transition-all"
              >
                ▶
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 md:px-12 pb-32">
        <TestimonialsRotator />
      </section>

      {/* COLLECTIONS */}
      <section className="px-6 md:px-12 pb-32" data-testid="collections">
        <Reveal className="mb-10">
          <h2 className="font-display text-4xl md:text-6xl font-medium">Collections</h2>
          <p className="text-greige text-sm mt-3 max-w-md">
            Three ways to work with us — every collection is tailored, never templated.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-px bg-ink/10">
          {collections.map((c, idx) => (
            <Reveal key={c.name} delay={idx * 80}>
              <div className="group bg-bone hover:bg-ink hover:text-bone transition-colors duration-500 p-10 min-h-[380px] flex flex-col justify-between">
                <span className="text-[11px] uppercase tracking-[0.2em] text-greige">
                  {["I.", "II.", "III."][idx]}
                </span>
                <div>
                  <h3 className="font-display text-2xl mt-6 mb-3">{c.name}</h3>
                  <p className="text-sm text-greige leading-relaxed mb-8">{c.desc}</p>
                  <Link
                    href="/consultation"
                    className="inline-block border border-current text-[11px] uppercase tracking-[0.14em] px-5 py-3 group-hover:border-gold group-hover:text-gold"
                  >
                    Request the Collection
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* AVAILABILITY */}
      <section id="availability-preview" className="bg-ink text-bone px-6 md:px-12 py-32">
        <AvailabilityPreview />
      </section>

      {/* CONSULTATION CTA */}
      <section className="px-6 md:px-12 py-40 text-center">
        <Reveal>
          <div className="text-[11px] uppercase tracking-[0.2em] text-greige mb-6">Begin the Story</div>
          <h2 className="font-display text-4xl md:text-7xl leading-tight max-w-3xl mx-auto">
            Let&rsquo;s talk about your day — however it&rsquo;s meant to unfold.
          </h2>
          <div className="flex justify-center gap-4 mt-11 flex-wrap">
            <Link href="/consultation" className="border border-ink px-8 py-4 text-[11px] uppercase tracking-[0.16em] font-semibold hover:bg-maroon hover:border-maroon hover:text-bone transition-colors">
              Book a Consultation
            </Link>
          </div>
        </Reveal>
      </section>

      {/* INSTAGRAM */}
      <section className="px-6 md:px-12 pb-32" data-testid="instagram-section">
        <Reveal className="mb-8">
          <h2 className="font-display text-4xl md:text-6xl font-medium">Follow the Stories</h2>
          <p className="text-greige text-sm mt-2">{site.instagram}</p>
        </Reveal>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {(["maroon", "gold", "bone", "maroon", "gold"] as const).map((tone, idx) => (
            <div key={idx} className="aspect-square overflow-hidden group">
              <Placeholder tone={tone} label="PLACEHOLDER" className="h-full w-full transition-transform duration-500 group-hover:scale-110" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

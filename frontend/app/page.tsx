import Link from "next/link";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import AvailabilityChecker from "@/components/AvailabilityChecker";
import { Arrow } from "@/components/Arrow";
import { projects, services, collections, site, verifiedTestimonials } from "@/lib/data";

const storyLayout = [
  "md:col-span-7",
  "md:col-span-5 md:mt-28",
  "md:col-span-5 md:-mt-8",
  "md:col-span-7 md:mt-8",
];
const storyAspect = ["aspect-[4/3] md:aspect-[7/5]", "aspect-[4/5]", "aspect-[4/5]", "aspect-[4/3] md:aspect-[7/5]"];

export default function Home() {
  const filmService = services.find((s) => s.title.startsWith("Videography"));

  return (
    <>
      {/* HERO — the one memorable moment: headline rising in front of a cobalt-framed portrait */}
      <section
        data-testid="hero-section"
        className="on-dark relative overflow-hidden bg-black text-white lg:min-h-[calc(100svh-var(--header-h))]"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_85%_35%,rgba(44,52,128,0.55),transparent_70%)]" />
        <div className="page-pad relative grid items-center gap-12 pb-16 pt-10 lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="order-2 lg:order-1 lg:col-span-7">
            <p className="hero-fade mb-8 text-[15px] text-white/70">Wedding photography and films · {site.location}</p>
            <h1 className="font-display text-[clamp(3.1rem,8.4vw,8rem)] font-normal leading-[0.96] tracking-tight">
              <span className="hero-line"><span>Photography</span></span>
              <span className="hero-line"><span>for the</span></span>
              <span className="hero-line"><span className="italic text-cobalt-light">beautifully lived.</span></span>
            </h1>
            <p className="hero-fade mt-8 max-w-md font-display text-xl italic text-white/75 md:text-2xl">{site.tagline}</p>
            <div className="hero-fade mt-10 flex flex-wrap gap-4">
              <Link href="/consultation" className="btn-cobalt">Book your date</Link>
              <Link href="/work" className="btn-ghost-light">View our stories</Link>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-5">
            <div className="relative mx-auto ml-0 aspect-[4/3] w-[calc(100%-14px)] sm:aspect-[4/3.4] lg:ml-auto lg:aspect-[4/5] lg:w-[calc(100%-24px)]">
              <div aria-hidden="true" className="absolute inset-0 translate-x-3.5 translate-y-3.5 bg-cobalt lg:translate-x-6 lg:translate-y-6" />
              <div className="absolute inset-0 overflow-hidden">
                <Photo
                  src={projects[0].image}
                  tone="cobalt"
                  alt="Featured wedding portrait"
                  label="Featured portrait — photograph to be supplied"
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SELECTED STORIES */}
      <section id="stories" className="page-pad pb-28 pt-28 md:pb-36 md:pt-40" data-testid="selected-stories">
        <Reveal className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-5xl font-normal leading-none md:text-7xl">Selected stories</h2>
          <p className="max-w-xs text-[15px] leading-relaxed text-black/65">
            Weddings and celebrations from across Andhra Pradesh, from riverbanks to temple courtyards.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-12">
          {projects.map((p, idx) => (
            <Reveal key={p.slug} className={storyLayout[idx % storyLayout.length]}>
              <Link href={`/work/${p.slug}`} className="group block" data-testid={`story-${p.slug}`}>
                <div className={`relative overflow-hidden ${storyAspect[idx % storyAspect.length]}`}>
                  <Photo
                    src={p.image}
                    tone={p.cover}
                    alt={`${p.title}, ${p.category} in ${p.location}`}
                    className="transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.03]"
                  />
                  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-cobalt-light transition-transform duration-500 group-hover:scale-x-100" />
                </div>
                <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="font-display text-3xl transition-colors group-hover:text-cobalt">{p.title}</h3>
                  <span className="text-[15px] text-black/60">
                    {p.category}, {p.location}, {p.year}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-16">
          <Link href="/work" className="link-line text-[15px] font-medium">See the full archive</Link>
        </div>
      </section>

      {/* STUDIO STATEMENT */}
      <section className="on-dark relative overflow-hidden bg-[image:var(--gradient-night)] text-white" data-testid="studio-statement">
        <div className="page-pad py-32 md:py-48">
          <Reveal className="max-w-5xl">
            <h2 className="font-display text-4xl font-normal leading-[1.08] md:text-7xl">
              We don&rsquo;t photograph <em className="text-cobalt-light">what happened.</em>
              <br />
              We photograph <em className="text-cobalt-light">how it felt.</em>
            </h2>
            <p className="mt-10 max-w-lg text-[17px] leading-relaxed text-white/75">
              Every ritual, every glance held a second too long, every hand reaching for another. These are not
              moments we stage. They are moments we wait for, in the quiet space between frames.
            </p>
            <Link href="/about" className="link-line mt-10 text-[15px] font-medium">About the studio</Link>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="page-pad grid gap-12 py-28 md:py-40 lg:grid-cols-12" data-testid="services-preview">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <h2 className="font-display text-5xl font-normal leading-none md:text-7xl">Services</h2>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-black/65">
              From a single afternoon to a multi-day wedding, covered with the same quiet attention.
            </p>
            <Link href="/services" className="link-line mt-8 text-[15px] font-medium">All services</Link>
          </div>
        </Reveal>
        <ul className="lg:col-span-8">
          {services.slice(0, 6).map((s) => (
            <li key={s.title} className="border-t border-black/15 last:border-b">
              <Link
                href={`/consultation?event=${encodeURIComponent(s.eventType)}`}
                className="group flex items-center justify-between gap-6 px-0 py-7 transition-all duration-500 hover:bg-cobalt hover:px-6 hover:text-white"
              >
                <span>
                  <span className="block font-display text-2xl md:text-4xl">{s.title}</span>
                  <span className="mt-2 block max-w-md text-[15px] text-black/60 transition-colors group-hover:text-white/80">{s.desc}</span>
                </span>
                <Arrow className="h-6 w-6 shrink-0 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* FILMS */}
      <section className="on-dark bg-black text-white" data-testid="cinematic-showreel">
        <div className="page-pad grid items-center gap-12 py-24 md:py-36 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2 className="font-display text-5xl font-normal leading-none md:text-7xl">Films</h2>
            <p className="mt-6 max-w-sm text-[17px] leading-relaxed text-white/75">
              {filmService?.desc} Every film is cut to the rhythm of the day it records.
            </p>
            <Link href="/consultation?event=Wedding" className="btn-cobalt mt-10">Ask about wedding films</Link>
          </Reveal>
          <Reveal className="lg:col-span-7">
            <div className="relative aspect-video overflow-hidden bg-black">
              {site.showreelSrc ? (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  controls
                  preload="none"
                  playsInline
                  poster={site.showreelPoster}
                  aria-label="Nandini Vision showreel"
                >
                  <source src={site.showreelSrc} />
                </video>
              ) : (
                <Photo tone="cobalt" alt="Wedding film frame" label="Showreel not yet uploaded" sizes="(min-width: 1024px) 58vw, 100vw" />
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS — only genuine, approved quotes are ever rendered */}
      {verifiedTestimonials.length > 0 && (
        <section className="page-pad py-28 md:py-40" data-testid="testimonials" aria-labelledby="kind-words">
          <h2 id="kind-words" className="mb-14 font-display text-5xl font-normal md:text-7xl">Kind words</h2>
          <div className="grid gap-12 md:grid-cols-3">
            {verifiedTestimonials.map((t) => (
              <figure key={t.who} className="border-t-2 border-cobalt pt-6">
                <blockquote className="font-display text-2xl italic leading-snug">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-5 text-[15px] text-black/65">{t.who}, {t.event}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* COLLECTIONS */}
      <section className="page-pad pb-28 pt-8 md:pb-40" data-testid="collections">
        <Reveal className="mb-14 max-w-xl">
          <h2 className="font-display text-5xl font-normal leading-none md:text-7xl">Collections</h2>
          <p className="mt-6 text-[15px] leading-relaxed text-black/65">
            Three ways to work with us. Every collection is shaped around your day, never templated.
          </p>
        </Reveal>
        <div className="grid border-t border-black/15 md:grid-cols-3">
          {collections.map((c) => (
            <Reveal key={c.name} className="group border-b border-black/15 py-10 transition-colors duration-500 hover:bg-cobalt hover:text-white md:border-b-0 md:border-l md:px-8 md:first:border-l-0 md:first:pl-0 md:hover:first:pl-8">
              <h3 className="font-display text-4xl">{c.name}</h3>
              <p className="mb-10 mt-4 max-w-xs text-[15px] leading-relaxed text-black/65 transition-colors group-hover:text-white/80">{c.desc}</p>
              <Link
                href={`/consultation?collection=${encodeURIComponent(c.name)}`}
                className="link-line text-[15px] font-medium"
              >
                Request the {c.name} collection
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* AVAILABILITY */}
      <section id="availability-preview" className="on-dark bg-[image:var(--gradient-dusk)] text-white">
        <div className="page-pad py-28 md:py-40">
          <AvailabilityChecker />
        </div>
      </section>

      {/* CONSULTATION CTA */}
      <section className="page-pad py-32 md:py-48">
        <Reveal className="max-w-4xl">
          <h2 className="font-display text-5xl font-normal leading-[1.05] md:text-8xl">
            Let&rsquo;s talk about your day, however it&rsquo;s meant to unfold.
          </h2>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/consultation" className="btn-cobalt-on-light">Book a consultation</Link>
            <Link href="/work" className="btn-ghost-dark">Browse the work</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

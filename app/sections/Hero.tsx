import Link from "next/link";
import { ImageMedia } from "@/components/ImageMedia";
import { studio } from "@/lib/content";

export function Hero() {
  return (
    <section className="hero" data-testid="hero-section" aria-label="Introduction">
      <div className="hero__media">
        <ImageMedia
          src="/images/hero/hero-vijayawada-wedding.jpg"
          alt="Indian bride and groom in maroon and gold attire standing in a bone-white courtyard"
          priority
          eager
          sizes="100vw"
          fallbackAspect="16 / 10"
        />
      </div>
      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__grain" aria-hidden="true" />

      <div className="container hero__content">
        <span className="eyebrow hero__eyebrow">
          {studio.location} · {studio.serviceArea}
        </span>

        <h1 className="hero__title">
          <span className="hero__reveal">
            <span>Photography</span>
          </span>
          <span className="hero__reveal">
            <span>for the <em>beautifully</em></span>
          </span>
          <span className="hero__reveal">
            <span>lived.</span>
          </span>
        </h1>

        <p className="hero__sub">{studio.supportingStatement}.</p>

        <div className="hero__actions">
          <Link href="/availability" className="btn btn--light">
            Book Your Date
          </Link>
          <Link href="/work" className="btn btn--ghost-light">
            Explore Our Work
          </Link>
        </div>

        <div className="hero__bottom">
          <span className="hero__scroll">Scroll to explore</span>
          <span className="meta" style={{ color: "rgba(243,239,233,0.55)" }}>
            Est. Andhra Pradesh
          </span>
        </div>
      </div>
    </section>
  );
}

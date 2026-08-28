import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ImageMedia } from "@/components/ImageMedia";

export function ConsultationCta() {
  return (
    <section className="cta-band" data-testid="consultation-cta">
      <div className="cta-band__media" aria-hidden="true">
        <ImageMedia
          src="/images/projects/the-gold-hour-1.jpg"
          alt=""
          sizes="100vw"
          fallbackAspect="16 / 9"
        />
      </div>
      <div className="container cta-band__content">
        <Reveal>
          <span className="gold-line" aria-hidden="true" />
          <h2>
            Your story is <em>waiting</em> to be told.
          </h2>
          <p>
            Tell us about your day. We&rsquo;ll tell you if we&rsquo;re there —
            and how we&rsquo;d photograph it.
          </p>
          <Link href="/consultation" className="btn btn--gold">
            <span className="btn__orbit" aria-hidden="true" />
            <span>Book a Consultation</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

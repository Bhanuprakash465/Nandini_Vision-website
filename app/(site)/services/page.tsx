import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ImageMedia } from "@/components/ImageMedia";
import { ServicesJsonLd } from "@/components/JsonLd";
import { services, seo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Photography Services | Weddings, Portraits & Events",
  description:
    "Wedding photography, pre-wedding shoots, events, family portraits, fashion, corporate, videography, drone coverage and fine-art albums — by Nandini Vision, Andhra Pradesh, available worldwide.",
  alternates: { canonical: `${seo.url}/services` },
  openGraph: {
    title: "Photography Services | Nandini Vision",
    description:
      "Eleven disciplines, one philosophy: less direction, more noticing.",
    url: `${seo.url}/services`,
    images: [{ url: seo.ogImage }],
  },
};

export default function ServicesPage() {
  return (
    <>
      <ServicesJsonLd />
      <div className="page-enter">
        <header className="page-hero">
          <div className="container">
            <span className="eyebrow">Services</span>
            <h1>What we photograph</h1>
            <p className="lead">
              Eleven disciplines, one philosophy — less direction, more noticing.
              Every service begins with a conversation about your day.
            </p>
          </div>
        </header>

        <section className="section" data-testid="services-section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="services-list">
              {services.map((service, i) => (
                <Reveal key={service.number} delay={i * 50} as="div">
                  <article className="service-row">
                    <span className="service-row__number">{service.number}</span>
                    <div>
                      <h3>{service.title}</h3>
                      <p style={{ marginTop: "0.5rem" }}>{service.description}</p>
                    </div>
                    <Link
                      href="/consultation"
                      className="service-row__arrow"
                      aria-label={`Enquire about ${service.title}`}
                    >
                      →
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={120}>
              <div className="collections" style={{ marginTop: "var(--space-4xl)" }}>
                {services.slice(0, 3).map((service) => (
                  <div key={service.number} className="collection">
                    <div className="collection__media img-reveal" data-cursor="view">
                      <ImageMedia
                        src={service.image.src}
                        alt={service.image.alt}
                        cursor="view"
                        sizes="(max-width: 900px) 100vw, 33vw"
                        fallbackAspect="3 / 4"
                      />
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <div style={{ marginTop: "var(--space-4xl)", textAlign: "center" }}>
              <p className="lead">Not sure which service fits? Tell us your story.</p>
              <div style={{ marginTop: "var(--space-l)" }}>
                <Link href="/consultation" className="btn btn--maroon">
                  Book a Consultation
                </Link>
              </div>
            </div>

            <p className="demo-note" style={{ marginTop: "var(--space-3xl)" }}>
              Temporary placeholder imagery · generated for development
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

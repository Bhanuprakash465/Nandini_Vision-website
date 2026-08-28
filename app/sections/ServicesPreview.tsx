import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { services } from "@/lib/content";

export function ServicesPreview() {
  const featured = services.slice(0, 4);

  return (
    <section className="section section--bone-deep" data-testid="services-section">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div>
              <span className="eyebrow">What we do</span>
              <h2>Services</h2>
            </div>
            <Link href="/services" className="link-underline section-head__action">
              All services
            </Link>
          </div>
        </Reveal>

        <div className="services-list services-preview">
          {featured.map((service, i) => (
            <Reveal key={service.number} delay={i * 70} as="div">
              <Link href="/services" className="service-row" style={{ display: "grid" }}>
                <span className="service-row__number">{service.number}</span>
                <div>
                  <h3>{service.title}</h3>
                  <p style={{ marginTop: "0.5rem" }}>{service.description}</p>
                </div>
                <span className="service-row__arrow" aria-hidden="true">→</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

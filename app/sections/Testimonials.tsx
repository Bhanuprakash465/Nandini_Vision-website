import { Reveal } from "@/components/Reveal";
import { testimonials } from "@/lib/content";

export function Testimonials() {
  return (
    <section className="section" data-testid="testimonials-section" aria-label="Client testimonials">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div>
              <span className="eyebrow">Kind words</span>
              <h2>What families say</h2>
            </div>
          </div>
        </Reveal>

        <div>
          {testimonials.map((t, i) => (
            <Reveal key={t.client} delay={i * 60}>
              <figure className="testimonial">
                <span className="testimonial__index" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <blockquote className="testimonial__quote">
                  <p>“{t.quote}”</p>
                  <figcaption className="testimonial__attribution">
                    <strong>{t.client}</strong>
                    <span aria-hidden="true" className="dot" />
                    <span>{t.event}</span>
                    <span aria-hidden="true" className="dot" />
                    <span>{t.location}</span>
                  </figcaption>
                </blockquote>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

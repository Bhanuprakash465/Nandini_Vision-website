import { Reveal } from "@/components/Reveal";
import { InstagramGrid } from "@/components/InstagramGrid";

export function InstagramSection() {
  return (
    <section className="section" data-testid="instagram-section">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div>
              <span className="eyebrow">Instagram</span>
              <h2>Life, lately.</h2>
            </div>
            <p className="section-head__action demo-note">
              Demo grid · @nandinistudio.demo
            </p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <InstagramGrid />
        </Reveal>
        <Reveal delay={150}>
          <p className="demo-note" style={{ marginTop: "var(--space-l)" }}>
            Demonstration content only — images are not scraped from Instagram.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

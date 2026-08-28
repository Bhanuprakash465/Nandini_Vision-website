import { Reveal } from "@/components/Reveal";
import { ImageMedia } from "@/components/ImageMedia";

export function Philosophy() {
  return (
    <section className="section" data-testid="studio-philosophy">
      <div className="container philosophy">
        <Reveal variant="left">
          <span className="eyebrow">The studio</span>
          <h2 className="philosophy__statement" style={{ marginTop: "var(--space-m)" }}>
            Less direction. <em>More noticing.</em>
          </h2>
          <p className="lead" style={{ marginTop: "var(--space-m)" }}>
            We never stage a feeling. We wait for it, position ourselves around it,
            and keep the quiet seconds most people forget they lived.
          </p>
        </Reveal>

        <div className="philosophy__body">
          <Reveal delay={120}>
            <div className="img-reveal philosophy__image">
              <ImageMedia
                src="/images/projects/a-red-thread-3.jpg"
                alt="A quiet ritual moment between a bride and groom"
                cursor="view"
                sizes="(max-width: 900px) 100vw, 45vw"
                fallbackAspect="4 / 5"
              />
            </div>
          </Reveal>
          <Reveal delay={200}>
            <p style={{ marginTop: "var(--space-l)" }}>
              Based in {`Andhra Pradesh`} and available worldwide, Nandini Vision photographs
              weddings, families, celebrations and campaigns with the same principle: the feeling
              between frames is the photograph.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

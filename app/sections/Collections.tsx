import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ImageMedia } from "@/components/ImageMedia";
import { collections } from "@/lib/content";

export function Collections() {
  return (
    <section className="section section--bone-deep" data-testid="premium-collections">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div>
              <span className="eyebrow">Collections</span>
              <h2>Ways to work together</h2>
            </div>
            <p className="section-head__action meta">Prices shared privately</p>
          </div>
        </Reveal>

        <div className="collections">
          {collections.map((collection, i) => (
            <Reveal key={collection.name} delay={i * 100}>
              <article className="collection">
                <div className="collection__media img-reveal" data-cursor="view">
                  <ImageMedia
                    src={collection.image.src}
                    alt={collection.image.alt}
                    cursor="view"
                    sizes="(max-width: 900px) 100vw, 33vw"
                    fallbackAspect="3 / 4"
                  />
                  <span className="collection__tag">{collection.tagline}</span>
                </div>
                <h3>{collection.name}</h3>
                <p>{collection.description}</p>
                <ul className="collection__features">
                  {collection.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link href={collection.cta.href} className="link-underline">
                  {collection.cta.label}
                </Link>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150}>
          <p className="demo-note" style={{ marginTop: "var(--space-xl)" }}>
            Prices are shared after a conversation — no pricing cards here.
            Temporary placeholder imagery · generated for development.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

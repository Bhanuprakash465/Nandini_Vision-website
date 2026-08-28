import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ImageMedia } from "@/components/ImageMedia";
import { projects } from "@/lib/content";

const layout = ["", "work-feature--flip", "work-feature--wide", ""];

export function SelectedWork() {
  const featured = projects.slice(0, 4);

  return (
    <section className="section" data-testid="selected-work">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div>
              <span className="eyebrow">Portfolio</span>
              <h2>Selected Work</h2>
            </div>
            <Link href="/work" className="link-underline section-head__action">
              View all stories
            </Link>
          </div>
        </Reveal>

        {featured.map((project, i) => (
          <Reveal key={project.slug} delay={i * 60}>
            <article className={`work-feature ${layout[i % layout.length]}`}>
              <div className="work-feature__media">
                <span className="work-feature__number" aria-hidden="true">
                  0{i + 1}
                </span>
                <Link href={`/work/${project.slug}`} className="img-reveal img-reveal--hover" data-cursor="view" aria-label={`View project: ${project.title}`}>
                  <ImageMedia
                    src={project.hero.src}
                    alt={project.hero.alt}
                    cursor="view"
                    sizes="(max-width: 900px) 100vw, 65vw"
                    fallbackAspect="3 / 4"
                  />
                </Link>
              </div>

              <div className="work-feature__copy">
                <span className="meta">{project.category}</span>
                <h3>{project.title}</h3>
                <p className="work-feature__meta">
                  <span className="meta">{project.location}</span>
                  <span className="dot" aria-hidden="true" />
                  <span className="meta">{project.year}</span>
                </p>
                <p>{project.blurb}</p>
                <Link href={`/work/${project.slug}`} className="link-underline">
                  View Project
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

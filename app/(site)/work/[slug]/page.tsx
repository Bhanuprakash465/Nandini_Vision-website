import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { ImageMedia } from "@/components/ImageMedia";
import { BreadcrumbJsonLd, ProjectJsonLd } from "@/components/JsonLd";
import { projects, seo } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const url = `${seo.url}/work/${project.slug}`;
  return {
    title: `${project.title} — ${project.location} ${project.year}`,
    description: project.blurb,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.title} | Nandini Vision`,
      description: project.blurb,
      url,
      images: [{ url: `${seo.url}${project.hero.src}` }],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const related = projects.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: project.title, path: `/work/${project.slug}` },
        ]}
      />
      <ProjectJsonLd type="item" items={projects} slug={slug} />

      <article className="page-enter" data-testid="project-detail">
        <header className="project-hero">
          <div className="container">
            <span className="eyebrow">{project.category}</span>
            <h1>{project.title}</h1>
            <div className="project-hero__meta">
              <span className="meta">{project.location}</span>
              <span className="dot" aria-hidden="true" />
              <span className="meta">{project.year}</span>
              <span className="dot" aria-hidden="true" />
              <span className="meta">{project.meta.eventType}</span>
            </div>
          </div>
          <div className="container">
            <div className="project-hero__image img-reveal" data-cursor="view">
              <ImageMedia
                src={project.hero.src}
                alt={project.hero.alt}
                sizes="100vw"
                fallbackAspect="16 / 9"
              />
            </div>
          </div>
        </header>

        <div className="container">
          <div className="project-layout">
            <aside className="project-layout__side">
              <Reveal>
                <span className="rail" aria-hidden="true" />
                <h2 style={{ fontSize: "var(--text-2xl)", marginTop: "var(--space-m)" }}>
                  The story
                </h2>
                <ul className="project-facts">
                  <li>
                    <span className="label">Event</span>
                    <span>{project.meta.eventType}</span>
                  </li>
                  <li>
                    <span className="label">Coverage</span>
                    <span>{project.meta.coverage}</span>
                  </li>
                  <li>
                    <span className="label">Deliverables</span>
                    <span>{project.meta.deliverables.join(" · ")}</span>
                  </li>
                </ul>
              </Reveal>
            </aside>

            <div className="project-story">
              {project.story.map((paragraph, i) => (
                <Reveal key={i} delay={i * 90}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="project-gallery" data-testid="project-gallery">
            {project.gallery.map((image, i) => (
              <Reveal key={image.src} delay={(i % 2) * 80} as="div">
                <figure className={`gallery-item ${i % 2 === 0 ? "gallery-item--tall" : "gallery-item--wide"}`}>
                  <div className="img-reveal" style={{ height: "100%" }} data-cursor="view">
                    <ImageMedia
                      src={image.src}
                      alt={image.alt}
                      cursor="view"
                      sizes="(max-width: 760px) 100vw, 60vw"
                      fallbackAspect={i % 2 === 0 ? "3 / 4" : "4 / 3"}
                    />
                  </div>
                </figure>
              </Reveal>
            ))}
          </div>

          <p className="demo-note" style={{ marginBottom: "var(--space-l)" }}>
            Temporary placeholder imagery · generated for development
          </p>
        </div>

        <section className="section">
          <div className="container">
            <Reveal>
              <div className="section-head">
                <div>
                  <span className="eyebrow">Continue</span>
                  <h2>Related work</h2>
                </div>
              </div>
            </Reveal>
            <div className="work-archive">
              {related.map((p, i) => (
                <article key={p.slug} className="work-card" style={{ animationDelay: `${i * 70}ms` }}>
                  <Link href={`/work/${p.slug}`}>
                    <div className="work-card__media" data-cursor="view">
                      <ImageMedia
                        src={p.hero.src}
                        alt={p.hero.alt}
                        cursor="view"
                        sizes="(max-width: 720px) 100vw, 40vw"
                        fallbackAspect="4 / 5"
                      />
                    </div>
                    <div className="work-card__body">
                      <div>
                        <h3 style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tracking-wider)" }}>
                          {p.title}
                        </h3>
                        <p className="work-card__meta">{p.location} · {p.year}</p>
                      </div>
                      <span className="work-card__arrow" aria-hidden="true">→</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            <nav className="project-nav" aria-label="Project navigation">
              <Link href={`/work/${prev.slug}`}>
                <span className="meta">Previous</span>
                <strong>{prev.title}</strong>
                <span className="meta">{prev.location} · {prev.year}</span>
              </Link>
              <Link href={`/work/${next.slug}`}>
                <span className="meta">Next</span>
                <strong>{next.title}</strong>
                <span className="meta">{next.location} · {next.year}</span>
              </Link>
            </nav>
          </div>
        </section>
      </article>
    </>
  );
}

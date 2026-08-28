"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ImageMedia } from "@/components/ImageMedia";
import type { Project } from "@/lib/types";

interface WorkArchiveProps {
  projects: Project[];
  categories: readonly string[];
}

export function WorkArchive({ projects, categories }: WorkArchiveProps) {
  const [active, setActive] = useState<string>("All");

  const filtered = useMemo(
    () =>
      active === "All"
        ? projects
        : projects.filter((p) => p.categories.includes(active)),
    [active, projects]
  );

  return (
    <section className="section" data-testid="work-archive" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="filter-bar" role="group" aria-label="Filter projects by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className="filter-chip"
              aria-pressed={active === cat}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state" data-testid="work-empty-state">
            <h2>No stories here yet.</h2>
            <p>Try another filter — or write to us about yours.</p>
          </div>
        ) : (
          <div className="work-archive" key={active}>
            {filtered.map((project, i) => (
              <article key={project.slug} className="work-card" style={{ animationDelay: `${i * 70}ms` }}>
                <Link href={`/work/${project.slug}`}>
                  <div className="work-card__media img-reveal" data-cursor="view">
                    <ImageMedia
                      src={project.hero.src}
                      alt={project.hero.alt}
                      cursor="view"
                      sizes="(max-width: 720px) 100vw, 55vw"
                      fallbackAspect="4 / 5"
                    />
                  </div>
                  <div className="work-card__body">
                    <div>
                      <h2>{project.title}</h2>
                      <p className="work-card__meta">
                        {project.location} · {project.year}
                      </p>
                    </div>
                    <span className="work-card__arrow" aria-hidden="true">→</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        <p className="demo-note" style={{ marginTop: "var(--space-3xl)" }}>
          Temporary placeholder imagery · generated for development
        </p>
      </div>
    </section>
  );
}

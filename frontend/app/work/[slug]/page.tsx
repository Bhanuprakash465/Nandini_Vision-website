import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Placeholder from "@/components/Placeholder";
import { projects } from "@/lib/data";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return {};
  return {
    title: project.title,
    description: `${project.category} in ${project.location}, ${project.year} — ${project.story}`,
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const index = projects.findIndex((p) => p.slug === params.slug);
  if (index === -1) notFound();
  const project = projects[index];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <article>
      <div className="relative h-[70vh]">
        <Placeholder tone={project.cover} className="absolute inset-0" label={`TEMPORARY PLACEHOLDER — ${project.title}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        <div className="absolute bottom-0 left-0 px-6 md:px-12 pb-12 text-bone">
          <span className="text-[11px] uppercase tracking-[0.2em] text-bone/70">
            {project.category} · {project.location} · {project.year}
          </span>
          <h1 className="font-display text-5xl md:text-7xl mt-3">{project.title}</h1>
        </div>
      </div>

      <div className="px-6 md:px-12 py-20 max-w-2xl">
        <p className="text-lg leading-relaxed text-ink/80">{project.story}</p>
      </div>

      <div className="px-6 md:px-12 pb-20 grid md:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[340px]">
            <Placeholder tone={i % 2 === 0 ? project.cover : "bone"} className="h-full w-full" />
          </div>
        ))}
      </div>

      <div className="px-6 md:px-12 py-16 border-t border-ink/10 flex justify-between">
        <Link href={`/work/${prev.slug}`} className="text-sm">
          ← <span className="uppercase tracking-[0.1em] text-xs text-greige">Previous</span>
          <br />
          <span className="font-display text-xl">{prev.title}</span>
        </Link>
        <Link href={`/work/${next.slug}`} className="text-sm text-right">
          <span className="uppercase tracking-[0.1em] text-xs text-greige">Next</span> →
          <br />
          <span className="font-display text-xl">{next.title}</span>
        </Link>
      </div>
    </article>
  );
}

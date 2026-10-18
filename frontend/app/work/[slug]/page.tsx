import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Photo from "@/components/Photo";
import { Arrow } from "@/components/Arrow";
import { projects } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return {};
  return {
    title: project.title,
    description: `${project.category} in ${project.location}, ${project.year}. ${project.story}`,
    alternates: { canonical: `/work/${project.slug}` },
  };
}

const eventForCategory: Record<string, string> = {
  Wedding: "Wedding",
  "Pre-Wedding": "Pre-Wedding",
  Celebration: "Event",
};

const frames = [
  { span: "md:col-span-7", aspect: "aspect-[7/5]", tone: "cover" as const },
  { span: "md:col-span-5", aspect: "aspect-[4/5]", tone: "mono" as const },
  { span: "md:col-span-5", aspect: "aspect-[4/5]", tone: "mono" as const },
  { span: "md:col-span-7", aspect: "aspect-[7/5]", tone: "cover" as const },
];

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const index = projects.findIndex((p) => p.slug === params.slug);
  if (index === -1) notFound();
  const project = projects[index];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <article>
      <header className="on-dark relative flex min-h-[72svh] items-end overflow-hidden bg-black text-white">
        <Photo src={project.image} tone={project.cover} alt={`${project.title}, ${project.location}`} label={`${project.title} — photograph to be supplied`} priority sizes="100vw" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="page-pad relative w-full pb-12 pt-32">
          <Link href="/work" className="link-line mb-8 text-[15px] text-white/80">All stories</Link>
          <h1 className="font-display text-6xl font-normal leading-none md:text-9xl">{project.title}</h1>
        </div>
      </header>

      <div className="page-pad grid gap-12 py-20 md:grid-cols-12 md:py-28">
        <dl className="grid grid-cols-[auto_1fr] content-start gap-x-8 gap-y-3 border-l-2 border-cobalt pl-6 text-[15px] md:col-span-4">
          <dt className="text-black/60">Category</dt>
          <dd>{project.category}</dd>
          <dt className="text-black/60">Location</dt>
          <dd>{project.location}</dd>
          <dt className="text-black/60">Year</dt>
          <dd>{project.year}</dd>
        </dl>
        <p className="font-display text-3xl leading-snug md:col-span-8 md:text-4xl">{project.story}</p>
      </div>

      <div className="page-pad grid gap-6 pb-24 md:grid-cols-12">
        {frames.map((f, i) => (
          <div key={i} className={`relative overflow-hidden ${f.span} ${f.aspect}`}>
            <Photo
              src={project.gallery?.[i]}
              tone={f.tone === "cover" ? project.cover : f.tone}
              alt={`${project.title}, frame ${i + 1}`}
              label="Gallery frame — photograph to be supplied"
              sizes="(min-width: 768px) 58vw, 100vw"
            />
          </div>
        ))}
      </div>

      <section className="on-dark bg-[image:var(--gradient-night)] text-white">
        <div className="page-pad flex flex-wrap items-center justify-between gap-8 py-20">
          <p className="max-w-xl font-display text-3xl leading-tight md:text-5xl">Planning something like this?</p>
          <Link href={`/consultation?event=${encodeURIComponent(eventForCategory[project.category] ?? "Other")}`} className="btn-ghost-light">
            Book a consultation
          </Link>
        </div>
      </section>

      <nav aria-label="More stories" className="page-pad grid gap-px bg-black/15 md:grid-cols-2">
        <Link href={`/work/${prev.slug}`} className="group flex items-center gap-6 bg-white py-12 transition-colors hover:bg-cobalt hover:text-white md:px-8 md:first:pl-0 md:hover:first:pl-8">
          <Arrow className="h-6 w-6 rotate-180" />
          <span>
            <span className="block text-sm text-black/60 group-hover:text-white/75">Previous story</span>
            <span className="font-display text-3xl">{prev.title}</span>
          </span>
        </Link>
        <Link href={`/work/${next.slug}`} className="group flex items-center justify-end gap-6 bg-white py-12 text-right transition-colors hover:bg-cobalt hover:text-white md:px-8">
          <span>
            <span className="block text-sm text-black/60 group-hover:text-white/75">Next story</span>
            <span className="font-display text-3xl">{next.title}</span>
          </span>
          <Arrow className="h-6 w-6" />
        </Link>
      </nav>
    </article>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import Photo from "@/components/Photo";
import { projects, workFilters } from "@/lib/data";

const spans = ["md:col-span-7", "md:col-span-5 md:mt-24", "md:col-span-5", "md:col-span-7 md:mt-12"];
const aspects = ["aspect-[7/5]", "aspect-[4/5]", "aspect-[4/5]", "aspect-[7/5]"];

export default function WorkArchive() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      <div role="group" aria-label="Filter stories by category" className="mb-6 flex flex-wrap gap-3">
        {workFilters.map((f) => {
          const on = active === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              aria-pressed={on}
              className={`min-h-[44px] border px-5 text-[15px] transition-colors duration-300 ${
                on
                  ? "border-cobalt bg-cobalt text-white"
                  : "border-black/30 text-black hover:border-cobalt hover:text-cobalt"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>
      <p className="mb-12 text-sm text-black/60" role="status" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "story" : "stories"}
        {active === "All" ? "" : ` in ${active}`}
      </p>

      <div className="grid gap-x-6 gap-y-14 md:grid-cols-12">
        {filtered.length === 0 && (
          <p className="text-[17px] text-black/70 md:col-span-12">
            There are no stories in this category yet. <button type="button" className="link-line font-medium" onClick={() => setActive("All")}>Show all stories</button>
          </p>
        )}
        {filtered.map((p, idx) => (
          <article key={p.slug} className={spans[idx % spans.length]}>
            <Link href={`/work/${p.slug}`} className="group block">
              <div className={`relative overflow-hidden ${aspects[idx % aspects.length]}`}>
                <Photo
                  src={p.image}
                  tone={p.cover}
                  alt={`${p.title}, ${p.category} in ${p.location}`}
                  className="transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.03]"
                />
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-cobalt-light transition-transform duration-500 group-hover:scale-x-100" />
              </div>
              <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h2 className="font-display text-3xl transition-colors group-hover:text-cobalt">{p.title}</h2>
                <span className="text-[15px] text-black/60">
                  {p.category}, {p.location}, {p.year}
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

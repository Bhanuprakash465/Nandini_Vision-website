"use client";
import { useState } from "react";
import Link from "next/link";
import Placeholder from "@/components/Placeholder";
import Reveal from "@/components/Reveal";
import { projects, workFilters } from "@/lib/data";

const categoryMap: Record<string, string[]> = {
  All: [],
  Weddings: ["Wedding"],
  "Pre-Wedding": ["Pre-Wedding"],
  Events: ["Celebration"],
  Family: [],
  "Baby & Maternity": [],
  Fashion: [],
  Corporate: [],
  Videography: [],
  Drone: [],
  Other: [],
};

export default function WorkArchive() {
  const [active, setActive] = useState("All");
  const filtered =
    active === "All" ? projects : projects.filter((p) => (categoryMap[active] || []).includes(p.category));

  return (
    <div>
      <div className="flex flex-wrap gap-x-6 gap-y-3 mb-14">
        {workFilters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`text-xs uppercase tracking-[0.14em] pb-1 border-b-2 transition-colors ${
              active === f ? "border-maroon text-maroon" : "border-transparent text-greige hover:text-ink"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-10">
        {filtered.length === 0 && (
          <p className="text-greige text-sm col-span-2">No stories in this category yet — check back soon.</p>
        )}
        {filtered.map((p, idx) => (
          <Reveal key={p.slug} delay={idx * 60}>
            <Link href={`/work/${p.slug}`} className="group block">
              <div className="h-[420px] overflow-hidden">
                <Placeholder tone={p.cover} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="flex justify-between items-baseline mt-4">
                <h3 className="text-xl font-medium">{p.title}</h3>
                <span className="text-[11px] uppercase tracking-[0.1em] text-greige">
                  {p.category} · {p.location} · {p.year}
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

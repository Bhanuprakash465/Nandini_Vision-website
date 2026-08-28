import type { Metadata } from "next";
import { WorkArchive } from "@/components/WorkArchive";
import { ProjectJsonLd } from "@/components/JsonLd";
import { filterCategories, projects, seo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Wedding & Editorial Photography Portfolio",
  description:
    "Explore Nandini Vision's selected work — weddings, pre-wedding stories, family sessions and celebrations across Andhra Pradesh and worldwide.",
  alternates: { canonical: `${seo.url}/work` },
  openGraph: {
    title: "Wedding & Editorial Photography Portfolio | Nandini Vision",
    description:
      "Selected work from Nandini Vision — weddings, pre-wedding stories and celebrations in Andhra Pradesh and worldwide.",
    url: `${seo.url}/work`,
    images: [{ url: seo.ogImage }],
  },
};

export default function WorkPage() {
  return (
    <>
      <ProjectJsonLd type="collection" items={projects} />
      <div className="page-enter">
        <header className="page-hero">
          <div className="container">
            <span className="eyebrow">Portfolio</span>
            <h1>Work</h1>
            <p className="lead">
              Stories we’ve been trusted with — weddings, pre-wedding journeys,
              families and celebrations across Andhra Pradesh and beyond.
            </p>
          </div>
        </header>
        <WorkArchive categories={filterCategories} projects={projects} />
      </div>
    </>
  );
}

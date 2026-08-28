import { collections, seo, studio } from "@/lib/content";
import type { Project } from "@/lib/types";

const base = seo.url;

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${base}/#studio`,
    name: studio.name,
    description: studio.brandStatement,
    url: base,
    image: `${base}${seo.ogImage}`,
    email: studio.email,
    telephone: studio.phone.replace(/\s/g, ""),
    address: {
      "@type": "PostalAddress",
      addressRegion: "Andhra Pradesh",
      addressCountry: "IN",
    },
    areaServed: "Worldwide",
    priceRange: "₹₹₹",
    sameAs: [studio.instagram],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    url: base,
    name: studio.name,
    description: studio.brandStatement,
    publisher: { "@id": `${base}/#studio` },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function ServicesJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Photography services",
    itemListElement: collections.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function ProjectJsonLd({
  type,
  items,
  slug,
}: {
  type: "collection" | "item";
  items?: Project[];
  slug?: string;
}) {
  if (type === "collection" && items) {
    const data = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Selected work",
      itemListElement: items.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${base}/work/${p.slug}`,
        name: p.title,
      })),
    };
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
  }

  const project = items?.find((p) => p.slug === slug);
  if (!project) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.blurb,
    url: `${base}/work/${project.slug}`,
    image: `${base}${project.hero.src}`,
    genre: "Photography",
    about: project.category,
    locationCreated: {
      "@type": "Place",
      name: project.location,
      address: { "@type": "PostalAddress", addressRegion: "Andhra Pradesh", addressCountry: "IN" },
    },
    dateCreated: project.year,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${base}${item.path}`,
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

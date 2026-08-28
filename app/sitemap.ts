import type { MetadataRoute } from "next";
import { projects, seo } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = seo.url;
  const now = new Date();

  const staticRoutes = [
    { path: "/", priority: 1, changefreq: "weekly" as const },
    { path: "/work", priority: 0.9, changefreq: "weekly" as const },
    { path: "/services", priority: 0.8, changefreq: "monthly" as const },
    { path: "/about", priority: 0.7, changefreq: "monthly" as const },
    { path: "/availability", priority: 0.9, changefreq: "weekly" as const },
    { path: "/consultation", priority: 0.9, changefreq: "monthly" as const },
    { path: "/contact", priority: 0.6, changefreq: "monthly" as const },
  ];

  const projectRoutes = projects.map((p) => ({
    path: `/work/${p.slug}`,
    priority: 0.8,
    changefreq: "monthly" as const,
    lastModified: new Date(`${p.year}-01-01`),
  }));

  return [
    ...staticRoutes.map((r) => ({
      url: `${base}${r.path}`,
      lastModified: now,
      changeFrequency: r.changefreq,
      priority: r.priority,
    })),
    ...projectRoutes.map((r) => ({
      url: `${base}${r.path}`,
      lastModified: r.lastModified,
      changeFrequency: r.changefreq,
      priority: r.priority,
    })),
  ];
}

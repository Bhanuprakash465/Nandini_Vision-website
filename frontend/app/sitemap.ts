import type { MetadataRoute } from "next";
import { projects, site } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/work", "/services", "/about", "/availability", "/consultation"].map((p) => ({
    url: `${site.url}${p}`,
    lastModified: now,
  }));
  const projectRoutes = projects.map((p) => ({ url: `${site.url}/work/${p.slug}`, lastModified: now }));
  return [...staticRoutes, ...projectRoutes];
}

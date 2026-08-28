import type { MetadataRoute } from "next";
import { seo } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/login", "/api/"],
      },
    ],
    sitemap: `${seo.url}/sitemap.xml`,
    host: seo.url,
  };
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The live preview proxies the dev server through a sandbox host
  // (e.g. 3000-<sandbox>.e2b.app). Next.js dev blocks cross-origin
  // dev resources (JS chunks, HMR, fonts) by default, which leaves
  // the page un-hydrated — allow all e2b.app preview origins.
  allowedDevOrigins: ["*.e2b.app", "*.sandbox.e2b.app"],
  images: {
    // Photography-first site; remote images (Unsplash placeholders for now)
    // will be served through the Next.js image optimizer.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    // Long-lived caching for hashed static assets only in production;
    // in development we keep Next's defaults for hot-reload correctness.
    if (process.env.NODE_ENV === "production") {
      return [
        {
          // Static assets: long-lived cache. Next handles hashed filenames.
          source: "/_next/static/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
        {
          // Fonts and images served from /public.
          source: "/:all*(svg|woff2|jpg|jpeg|png|webp|avif|mp4|webm)",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=604800, stale-while-revalidate=86400",
            },
          ],
        },
      ];
    }
    return [];
  },
};

export default nextConfig;

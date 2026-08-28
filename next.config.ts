import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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

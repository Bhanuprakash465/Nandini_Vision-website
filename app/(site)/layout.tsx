import { CustomCursor } from "@/components/CustomCursor";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LocalBusinessJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import { seo, studio } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: `${studio.name} — Luxury Photography Studio | Andhra Pradesh`,
    template: `%s | ${studio.name}`,
  },
  description: seo.description,
  metadataBase: new URL(seo.url),
  alternates: { canonical: "/" },
  openGraph: {
    siteName: studio.name,
    title: `${studio.name} — Luxury Photography Studio | Andhra Pradesh`,
    description: seo.description,
    url: seo.url,
    type: "website",
    locale: "en_IN",
    images: [{ url: seo.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${studio.name} — Luxury Photography Studio | Andhra Pradesh`,
    description: seo.description,
    images: [seo.ogImage],
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LocalBusinessJsonLd />
      <WebSiteJsonLd />
      <CustomCursor />
      <SiteHeader />
      <div className="site-frame">
        <main id="main">{children}</main>
        <SiteFooter />
      </div>
    </>
  );
}

import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bodoni-moda/opsz.css";
import "@fontsource-variable/bodoni-moda/opsz-italic.css";
import "@fontsource-variable/instrument-sans/wght.css";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site } from "@/lib/data";

const title = "Nandini Vision — Photography for the beautifully lived.";
const description =
  "Nandini Vision is a wedding photography and cinematic film studio based in Andhra Pradesh, serving clients across India and worldwide.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s — Nandini Vision" },
  description,
  applicationName: "Nandini Vision",
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description: "Wedding photography, cinematic films and visual stories from South India and beyond.",
    siteName: "Nandini Vision",
    locale: "en_IN",
    type: "website",
    url: "/",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Nandini Vision",
  description: "Wedding photography and cinematic film studio in Andhra Pradesh, India.",
  url: site.url,
  areaServed: "IN",
  address: { "@type": "PostalAddress", addressRegion: "Andhra Pradesh", addressCountry: "IN" },
  ...(site.instagramHandle ? { sameAs: [`https://instagram.com/${site.instagramHandle}`] } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

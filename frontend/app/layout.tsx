import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  display: "swap",
});
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://nandinivision.demo"),
  title: {
    default: "Nandini Vision — Photography for the beautifully lived.",
    template: "%s — Nandini Vision",
  },
  description:
    "Nandini Vision is a premium wedding photography and cinematic film studio based in Andhra Pradesh, serving clients across India and worldwide.",
  openGraph: {
    title: "Nandini Vision — Photography for the beautifully lived.",
    description: "Wedding photography, cinematic films and visual stories from South India and beyond.",
    locale: "en_IN",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${manrope.variable}`}>
      <body className="font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Nandini Vision",
              description: "Premium wedding photography and cinematic film studio in Andhra Pradesh, India.",
              areaServed: "IN",
              address: { "@type": "PostalAddress", addressRegion: "Andhra Pradesh", addressCountry: "IN" },
            }),
          }}
        />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

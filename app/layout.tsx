import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

/**
 * Typefaces — Playfair Display for editorial display type,
 * Manrope for body, navigation, forms and metadata.
 *
 * Self-hosted variable fonts loaded via next/font/local (no runtime
 * request to Google Fonts; zero layout shift; preloaded automatically).
 */
const display = localFont({
  src: [
    {
      path: "../fonts/playfair-display-latin-wght-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../fonts/playfair-display-latin-wght-italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const sans = localFont({
  src: [
    {
      path: "../fonts/manrope-latin-wght-normal.woff2",
      weight: "200 800",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});

const SITE_NAME = "Nandini Vision";
const SITE_DESCRIPTION =
  "Photography for the beautifully lived. Nandini Vision is a premium photography studio in Andhra Pradesh, India — weddings, editorial portraits, events and cinematic films, available worldwide.";

export const metadata: Metadata = {
  // Expanded per-route SEO is implemented with the public pages (Phase 11).
  title: {
    default: `${SITE_NAME} — Luxury Photography Studio | Andhra Pradesh`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "photography studio",
    "wedding photographer",
    "Andhra Pradesh",
    "Nandini Vision",
  ],
  authors: [{ name: SITE_NAME }],
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#F9F8F6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="site-frame">{children}</div>
      </body>
    </html>
  );
}

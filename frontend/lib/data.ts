// Centralized content. Swap copy and media here without touching layout code.
//
// Business details that are not yet confirmed (email, Instagram, WhatsApp, domain)
// come from environment variables and are simply hidden when unset, so the site
// never shows demo contact details as if they were real.

const clean = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);

export const site = {
  name: "Nandini Vision",
  tagline: "The feeling between frames.",
  headline: "Photography for the beautifully lived.",
  location: "Andhra Pradesh, India",
  url: (clean(process.env.NEXT_PUBLIC_SITE_URL) ?? "https://nandini-vision-frontend.onrender.com").replace(/\/$/, ""),
  email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  instagramHandle: clean(process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE)?.replace(/^@/, ""),
  // Digits only, with country code, e.g. 919876543210
  whatsappNumber: clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)?.replace(/\D/g, ""),
  // Direct URL to a real showreel video (mp4/webm). When unset, no player is shown.
  showreelSrc: clean(process.env.NEXT_PUBLIC_SHOWREEL_URL),
  showreelPoster: clean(process.env.NEXT_PUBLIC_SHOWREEL_POSTER),
};

// While true, every placeholder frame is labelled so nobody mistakes it for a real
// Nandini Vision photograph. Set to false once real photography replaces them.
export const SHOW_PLACEHOLDER_LABELS = true;

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Availability", href: "/availability" },
  { label: "Contact", href: "/consultation" },
];

export type Tone = "cobalt" | "mono" | "light";

export type Project = {
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string;
  story: string;
  cover: Tone;
  /** Path under /public, e.g. "/images/work/a-red-thread/cover.jpg". Placeholder is shown until set. */
  image?: string;
  /** Additional frames for the project page. Placeholders are shown for missing ones. */
  gallery?: string[];
};

export const projects: Project[] = [
  {
    slug: "a-red-thread",
    title: "A Red Thread",
    category: "Wedding",
    location: "Vijayawada",
    year: "2024",
    story:
      "A three-day Telugu wedding woven from ritual, colour and family — from the first haldi to the last reception dance.",
    cover: "cobalt",
  },
  {
    slug: "between-river-and-sky",
    title: "Between River & Sky",
    category: "Pre-Wedding",
    location: "Araku Valley",
    year: "2024",
    story:
      "A pre-wedding story shot across the misted hills of Araku, chasing golden hour through coffee estates.",
    cover: "mono",
  },
  {
    slug: "the-gold-hour",
    title: "The Gold Hour",
    category: "Wedding",
    location: "Rajahmundry",
    year: "2023",
    story:
      "A riverside temple wedding, photographed in the hour before dusk when the light turns the same shade as the bride's jewellery.",
    cover: "mono",
  },
  {
    slug: "a-little-more-life",
    title: "A Little More Life",
    category: "Celebration",
    location: "Visakhapatnam",
    year: "2023",
    story:
      "A joint family celebration on the Vizag coastline — three generations, one long table, and a lot of laughter.",
    cover: "light",
  },
];

/** Filters are derived from the categories that actually have projects, so no filter is ever empty. */
export const workFilters = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

export const eventTypes = [
  "Wedding",
  "Pre-Wedding",
  "Event",
  "Family / Portrait",
  "Baby / Maternity",
  "Corporate",
  "Other",
];

export type Service = { title: string; desc: string; eventType: string };

export const services: Service[] = [
  { title: "Wedding Photography", desc: "Full-day and multi-day coverage of every ritual, from mehendi to reception.", eventType: "Wedding" },
  { title: "Pre-Wedding & Couple Shoots", desc: "Location-led editorial stories across Andhra Pradesh's coasts, hills and old towns.", eventType: "Pre-Wedding" },
  { title: "Events & Celebrations", desc: "Engagements, sangeet, receptions and family functions, documented candidly.", eventType: "Event" },
  { title: "Family & Portrait Photography", desc: "Considered portraits for families, generations and milestone moments.", eventType: "Family / Portrait" },
  { title: "Baby & Maternity Photography", desc: "Gentle, unhurried sessions for new and growing families.", eventType: "Baby / Maternity" },
  { title: "Fashion & Portfolio Photography", desc: "Editorial portfolios for models, designers and personal brands.", eventType: "Other" },
  { title: "Corporate & Product Photography", desc: "Clean, considered imagery for businesses and product lines.", eventType: "Corporate" },
  { title: "Videography & Cinematic Films", desc: "Same-day edits and full wedding films, shot documentary-style.", eventType: "Wedding" },
  { title: "Drone Photography & Videography", desc: "Aerial coverage for venues, landscapes and large celebrations.", eventType: "Other" },
  { title: "Photo Editing & Retouching", desc: "Colour grading and retouching that stays true to skin and light.", eventType: "Other" },
  { title: "Albums & Photo Prints", desc: "Archival-quality albums and fine art prints, designed in-house.", eventType: "Other" },
];

export type Testimonial = { quote: string; who: string; event: string; verified: boolean };

// The quotes below were written as sample copy and have not been confirmed as real
// client words. They are NOT shown on the site until `verified` is set to true
// for a testimonial the studio has permission to publish.
export const testimonials: Testimonial[] = [
  { quote: "It felt less like a photoshoot and more like someone quietly preserving every important moment.", who: "Sruthi & Kiran", event: "Wedding, Vijayawada", verified: false },
  { quote: "They understood our families before they understood our angles. That's rare.", who: "Deepika & Aravind", event: "Wedding, Rajahmundry", verified: false },
  { quote: "Two years later, the album still makes my mother cry. In the good way.", who: "Lakshmi N.", event: "Pre-Wedding, Araku Valley", verified: false },
];
export const verifiedTestimonials = testimonials.filter((t) => t.verified);

export const collections = [
  { name: "Signature", desc: "A single day, fully covered — for intimate ceremonies and focused celebrations." },
  { name: "Editorial", desc: "Multi-day coverage with a dedicated film team — for weddings with many chapters." },
  { name: "Bespoke", desc: "Fully custom — destination weddings, extended families, and once-in-a-lifetime days." },
];

// Must match the BudgetRange enum in backend/app/models.py exactly.
export const budgetOptions = [
  "Prefer not to say",
  "Under \u20b950,000",
  "\u20b950,000\u2013\u20b91,00,000",
  "\u20b91,00,000\u2013\u20b92,00,000",
  "\u20b92,00,000\u2013\u20b93,00,000",
  "\u20b93,00,000+",
  "Bespoke / Discuss",
];

// Centralized content architecture — swap copy/media here without touching layout code.

export const site = {
  name: "Nandini Vision",
  tagline: "The feeling between frames.",
  headline: "Photography for the beautifully lived.",
  location: "Andhra Pradesh, India",
  instagram: "@nandinistudio.demo",
  email: "hello@nandinistudio.demo",
  whatsapp: "+91 98765 43210",
  whatsappNumber: "919876543210",
};

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Availability", href: "/availability" },
  { label: "Contact", href: "/consultation" },
];

export type Project = {
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string;
  story: string;
  cover: "maroon" | "gold" | "bone";
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
    cover: "maroon",
  },
  {
    slug: "between-river-and-sky",
    title: "Between River & Sky",
    category: "Pre-Wedding",
    location: "Araku Valley",
    year: "2024",
    story:
      "A pre-wedding story shot across the misted hills of Araku, chasing golden hour through coffee estates.",
    cover: "gold",
  },
  {
    slug: "the-gold-hour",
    title: "The Gold Hour",
    category: "Wedding",
    location: "Rajahmundry",
    year: "2023",
    story:
      "A riverside temple wedding, photographed in the hour before dusk when the light turns the same shade as the bride's jewellery.",
    cover: "gold",
  },
  {
    slug: "a-little-more-life",
    title: "A Little More Life",
    category: "Celebration",
    location: "Visakhapatnam",
    year: "2023",
    story:
      "A joint family celebration on the Vizag coastline — three generations, one long table, and a lot of laughter.",
    cover: "bone",
  },
];

export const services = [
  { title: "Wedding Photography", desc: "Full-day and multi-day coverage of every ritual, from mehendi to reception." },
  { title: "Pre-Wedding & Couple Shoots", desc: "Location-led editorial stories across Andhra Pradesh's coasts, hills and old towns." },
  { title: "Events & Celebrations", desc: "Engagements, sangeet, receptions and family functions, documented candidly." },
  { title: "Family & Portrait Photography", desc: "Considered portraits for families, generations and milestone moments." },
  { title: "Baby & Maternity Photography", desc: "Gentle, unhurried sessions for new and growing families." },
  { title: "Fashion & Portfolio Photography", desc: "Editorial portfolios for models, designers and personal brands." },
  { title: "Corporate & Product Photography", desc: "Clean, considered imagery for businesses and product lines." },
  { title: "Videography & Cinematic Films", desc: "Same-day edits and full wedding films, shot documentary-style." },
  { title: "Drone Photography & Videography", desc: "Aerial coverage for venues, landscapes and large celebrations." },
  { title: "Photo Editing & Retouching", desc: "Colour grading and retouching that stays true to skin and light." },
  { title: "Albums & Photo Prints", desc: "Archival-quality albums and fine art prints, designed in-house." },
];

export const testimonials = [
  { quote: "It felt less like a photoshoot and more like someone quietly preserving every important moment.", who: "Sruthi & Kiran", event: "Wedding, Vijayawada" },
  { quote: "They understood our families before they understood our angles. That's rare.", who: "Deepika & Aravind", event: "Wedding, Rajahmundry" },
  { quote: "Two years later, the album still makes my mother cry. In the good way.", who: "Lakshmi N.", event: "Pre-Wedding, Araku Valley" },
];

export const collections = [
  { name: "Signature", desc: "A single day, fully covered — for intimate ceremonies and focused celebrations." },
  { name: "Editorial", desc: "Multi-day coverage with a dedicated film team — for weddings with many chapters." },
  { name: "Bespoke", desc: "Fully custom — destination weddings, extended families, and once-in-a-lifetime days." },
];

export const budgetOptions = [
  "Prefer not to say",
  "Under \u20b950,000",
  "\u20b950,000\u2013\u20b91,00,000",
  "\u20b91,00,000\u2013\u20b92,00,000",
  "\u20b92,00,000\u2013\u20b93,00,000",
  "\u20b93,00,000+",
  "Bespoke / Discuss",
];

export const eventTypes = ["Wedding", "Pre-Wedding", "Event", "Family / Portrait", "Baby / Maternity", "Corporate", "Other"];

export const workFilters = ["All", "Weddings", "Pre-Wedding", "Events", "Family", "Baby & Maternity", "Fashion", "Corporate", "Videography", "Drone", "Other"];

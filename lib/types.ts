/**
 * Nandini Vision — shared domain types.
 * Kept framework-agnostic so the FastAPI backend and the frontend
 * can treat them as the same contract.
 */

export type BookingStatus =
  | "available"
  | "pending"
  | "hold"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface StudioInfo {
  name: string;
  brandStatement: string;
  supportingStatement: string;
  location: string;
  serviceArea: string;
  email: string;
  phone: string;
  phoneDisplay: string;
  phoneIntl: string; // E.164 for wa.me links
  instagram: string;
  instagramHandle: string;
  demoNotice: string;
}

export interface NavLink {
  label: string;
  href: string;
  cta?: boolean;
}

export interface ServiceItem {
  number: string;
  title: string;
  description: string;
  image: ImageRef;
}

export interface ImageRef {
  src: string;
  alt: string;
  /** aspect-ratio CSS value, e.g. "4 / 5" — keeps CLS at zero */
  aspect?: string;
  priority?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  location: string;
  year: string;
  category: string;
  categories: string[];
  blurb: string;
  story: string[];
  hero: ImageRef;
  gallery: ImageRef[];
  meta: {
    eventType: string;
    coverage: string;
    deliverables: string[];
  };
}

export interface Collection {
  name: string;
  tagline: string;
  description: string;
  cta: { label: string; href: string };
  features: string[];
  image: ImageRef;
}

export interface Testimonial {
  quote: string;
  client: string;
  event: string;
  location: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: ImageRef;
  demo?: boolean;
}

export type AvailabilityResultStatus = "available" | "booked" | "hold" | "pending";

export interface AvailabilityResult {
  status: AvailabilityResultStatus;
  message: string;
  date: string;
  formattedDate?: string;
  nextAvailable?: string;
}

export interface ConsultationFormValues {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  eventDuration?: number;
  guestCount?: string;
  services?: string[];
  budgetRange?: string;
  photographyRequirements?: string;
  message?: string;
}

export interface InquiryConfirmation {
  inquiry_id: string;
  name: string;
  event_type: string;
  event_date: string;
  formatted_date: string;
  event_location: string;
  status: string;
  whatsapp_url: string;
  notification: { mode: "mock" | "email" | "console"; delivery_status: string };
}

export interface AdminBooking {
  _id: string;
  booking_id: string;
  client_name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string; // YYYY-MM-DD
  event_location: string;
  event_duration: number;
  guest_count?: string;
  services: string[];
  budget_range?: string;
  message?: string;
  status: BookingStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_inquiries: number;
  total_bookings: number;
  upcoming_bookings: number;
  pending_bookings: number;
  confirmed_bookings: number;
  hold_bookings: number;
  cancelled_bookings: number;
  completed_bookings: number;
}

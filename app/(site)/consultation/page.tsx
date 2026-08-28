"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { submitInquiry } from "@/lib/api";
import { budgetRanges, durationOptions, eventTypes, whatsapp } from "@/lib/content";
import type { InquiryConfirmation } from "@/lib/types";

type FieldErrors = Partial<Record<string, string>>;

const initialValues = {
  name: "",
  phone: "",
  email: "",
  eventType: eventTypes[0],
  eventDate: "",
  eventLocation: "",
  eventDuration: 1,
  guestCount: "",
  budgetRange: budgetRanges[0],
  photographyRequirements: "",
  message: "",
};

/**
 * Consultation flow: form → check availability hint → submit →
 * MongoDB → personalised confirmation → WhatsApp handoff.
 */
export default function ConsultationPage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<InquiryConfirmation | null>(null);

  useEffect(() => {
    document.title = "Book a Photography Consultation | Nandini Vision";
  }, []);

  const set = (key: keyof typeof initialValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [key]: key === "eventDuration" ? Number(value) : value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (values.name.trim().length < 2) errs.name = "Please tell us your name.";
    if (!/^[+\d][\d\s\-()]{7,}$/.test(values.phone.trim()))
      errs.phone = "Enter a valid phone number, e.g. +91 98765 43210.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      errs.email = "Enter a valid email address.";
    if (!values.eventDate) errs.eventDate = "Choose your event date.";
    if (values.eventLocation.trim().length < 2)
      errs.eventLocation = "Where is the event?";
    return errs;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const first = Object.keys(errs)[0];
      document.getElementById(first)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitInquiry({
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        eventType: values.eventType,
        eventDate: values.eventDate,
        eventLocation: values.eventLocation.trim(),
        eventDuration: values.eventDuration,
        guestCount: values.guestCount.trim() || undefined,
        budgetRange: values.budgetRange,
        photographyRequirements: values.photographyRequirements.trim() || undefined,
        message: values.message.trim() || undefined,
      });
      setConfirmation(res);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setServerError(
        err instanceof Error && err.message
          ? err.message
          : "We couldn't connect right now. Please try again or contact us on WhatsApp."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    const firstName = confirmation.name.split(" ")[0];
    return (
      <div className="page-enter">
        <section className="section" style={{ paddingTop: "calc(var(--header-height) + var(--space-3xl))" }}>
          <div className="container container--narrow">
            <div className="booking-success" data-testid="booking-success">
              <span className="booking-success__mark" aria-hidden="true">✓</span>
              <h2>
                Thank you, <span>{firstName}</span>.
              </h2>
              <p className="follow">
                We received your {confirmation.event_type.toLowerCase()} enquiry.
              </p>
              <p className="lead" style={{ marginTop: "var(--space-m)" }}>
                Your story is now on our radar. The Nandini Vision studio will be in touch shortly.
              </p>

              <ul className="booking-success__summary">
                <li>
                  <span className="label">Name</span>
                  <span data-testid="confirmation-name">{confirmation.name}</span>
                </li>
                <li>
                  <span className="label">Event</span>
                  <span>{confirmation.event_type}</span>
                </li>
                <li>
                  <span className="label">Date</span>
                  <span>{confirmation.formatted_date}</span>
                </li>
                <li>
                  <span className="label">Location</span>
                  <span>{confirmation.event_location}</span>
                </li>
              </ul>

              <p className="booking-success__ref" data-testid="enquiry-reference">
                {confirmation.inquiry_id}
              </p>
              <p className="form-note" style={{ marginTop: "var(--space-s)" }}>
                Saved to the studio book · Email delivery is mocked while credentials are
                unconfigured · {whatsapp.demoNote}
              </p>

              <div className="booking-success__actions">
                <a
                  href={confirmation.whatsapp_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--maroon"
                  data-testid="whatsapp-continue"
                >
                  Continue on WhatsApp
                </a>
                <Link href="/" className="btn btn--ghost">
                  Return Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Consultation</span>
          <h1>Book a consultation</h1>
          <p className="lead">
            Tell us about your celebration. We’ll reply with availability, ideas
            and a collection that fits.
          </p>
        </div>
      </header>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container consultation-layout">
          <aside className="consultation-side">
            <span className="rail" aria-hidden="true" />
            <h2 style={{ marginTop: "var(--space-m)" }}>How it works</h2>
            <ol>
              <li>
                <strong>01</strong>
                <span>Tell us about your event and the date you have in mind.</span>
              </li>
              <li>
                <strong>02</strong>
                <span>We check the studio calendar and reply within 24 hours.</span>
              </li>
              <li>
                <strong>03</strong>
                <span>We talk through ideas, coverage and collections — no pressure.</span>
              </li>
              <li>
                <strong>04</strong>
                <span>Your date is reserved. The feeling between frames is ours to find.</span>
              </li>
            </ol>
            <p className="demo-note" style={{ marginTop: "var(--space-l)" }}>
              Demo form · submissions are stored in the development database
            </p>
          </aside>

          <form
            className="consultation-form"
            onSubmit={onSubmit}
            noValidate
            data-testid="consultation-form"
          >
            <h2>Your enquiry</h2>

            <div className="form-grid">
              <div className={`field ${errors.name ? "field--error" : ""}`}>
                <label htmlFor="name">
                  Name <span className="req" aria-hidden="true">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={set("name")}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="field__error" id="name-error" role="alert">✕ {errors.name}</p>
                )}
              </div>

              <div className={`field ${errors.phone ? "field--error" : ""}`}>
                <label htmlFor="phone">
                  Phone <span className="req" aria-hidden="true">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={set("phone")}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && (
                  <p className="field__error" id="phone-error" role="alert">✕ {errors.phone}</p>
                )}
              </div>

              <div className={`field span-2 ${errors.email ? "field--error" : ""}`}>
                <label htmlFor="email">
                  Email <span className="req" aria-hidden="true">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={set("email")}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="field__error" id="email-error" role="alert">✕ {errors.email}</p>
                )}
              </div>

              <div className="field span-2">
                <label htmlFor="eventType">
                  Event type <span className="req" aria-hidden="true">*</span>
                </label>
                <select id="eventType" value={values.eventType} onChange={set("eventType")}>
                  {eventTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className={`field ${errors.eventDate ? "field--error" : ""}`}>
                <label htmlFor="eventDate">
                  Event date <span className="req" aria-hidden="true">*</span>
                </label>
                <input
                  id="eventDate"
                  type="date"
                  value={values.eventDate}
                  onChange={set("eventDate")}
                  aria-invalid={!!errors.eventDate}
                  aria-describedby={errors.eventDate ? "eventDate-error" : undefined}
                />
                {errors.eventDate && (
                  <p className="field__error" id="eventDate-error" role="alert">✕ {errors.eventDate}</p>
                )}
              </div>

              <div className="field">
                <label htmlFor="eventDuration">Coverage duration</label>
                <select id="eventDuration" value={values.eventDuration} onChange={set("eventDuration")}>
                  {durationOptions.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div className={`field span-2 ${errors.eventLocation ? "field--error" : ""}`}>
                <label htmlFor="eventLocation">
                  Location <span className="req" aria-hidden="true">*</span>
                </label>
                <input
                  id="eventLocation"
                  type="text"
                  value={values.eventLocation}
                  onChange={set("eventLocation")}
                  aria-invalid={!!errors.eventLocation}
                  aria-describedby={errors.eventLocation ? "eventLocation-error" : undefined}
                  placeholder="City, state or venue"
                />
                {errors.eventLocation && (
                  <p className="field__error" id="eventLocation-error" role="alert">
                    ✕ {errors.eventLocation}
                  </p>
                )}
              </div>

              <div className="field">
                <label htmlFor="guestCount">Expected guest count</label>
                <input
                  id="guestCount"
                  type="text"
                  inputMode="numeric"
                  value={values.guestCount}
                  onChange={set("guestCount")}
                  placeholder="Approximately"
                />
              </div>

              <div className="field">
                <label htmlFor="budgetRange">Budget range</label>
                <select id="budgetRange" value={values.budgetRange} onChange={set("budgetRange")}>
                  {budgetRanges.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="field span-2">
                <label htmlFor="requirements">Photography requirements</label>
                <textarea
                  id="requirements"
                  value={values.photographyRequirements}
                  onChange={set("photographyRequirements")}
                  placeholder="Frames you can't miss, traditions to honour, coverage you're dreaming of…"
                />
              </div>

              <div className="field span-2">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  value={values.message}
                  onChange={set("message")}
                  placeholder="Anything else we should know about your day?"
                />
              </div>
            </div>

            {serverError && (
              <p className="form-alert" role="alert" style={{ marginTop: "var(--space-m)" }}>
                {serverError}
              </p>
            )}

            <div style={{ marginTop: "var(--space-l)" }}>
              <button
                type="submit"
                className="btn btn--maroon btn--full"
                disabled={submitting}
                data-testid="consultation-submit"
              >
                {submitting ? "Sending…" : "Submit Enquiry"}
              </button>
            </div>

            <p className="form-note">
              By submitting you agree to our privacy policy. We reply by phone or WhatsApp
              within 24 hours. {whatsapp.demoNote}
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { submitInquiry } from "@/lib/api";
import { studio } from "@/lib/content";

/**
 * Contact page — studio details plus a lightweight enquiry form that
 * routes into the same inquiries pipeline as the consultation form.
 */
export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  useEffect(() => {
    document.title = "Contact Nandini Vision | Photography Studio";
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errs.email = "Enter a valid email address.";
    if (form.message.trim().length < 10)
      errs.message = "Tell us a little more (at least ten characters).";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setState("sending");
    try {
      await submitInquiry({
        name: form.name.trim(),
        phone: "",
        email: form.email.trim(),
        eventType: "Other",
        eventDate: "",
        eventLocation: studio.location,
        message: form.message.trim(),
      });
      setState("done");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setState("error");
    }
  };

  return (
    <div className="page-enter">
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Contact</span>
          <h1>Say hello</h1>
          <p className="lead">
            Questions, ideas, or a date worth holding — we read everything.
          </p>
        </div>
      </header>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container contact-grid">
          <div>
            <span className="rail" aria-hidden="true" />
            <div className="contact-detail" style={{ marginTop: "var(--space-l)" }}>
              <div>
                <span className="meta meta-label">Email</span>
                <a href={`mailto:${studio.email}`}>{studio.email}</a>
              </div>
              <div>
                <span className="meta meta-label">WhatsApp</span>
                <a href={`https://wa.me/${studio.phoneIntl}`} target="_blank" rel="noreferrer">
                  {studio.phoneDisplay}
                </a>
              </div>
              <div>
                <span className="meta meta-label">Instagram</span>
                <a href={studio.instagram} target="_blank" rel="noreferrer">
                  {studio.instagramHandle}
                </a>
              </div>
              <div>
                <span className="meta meta-label">Studio</span>
                <p>{studio.location}</p>
              </div>
              <div>
                <span className="meta meta-label">Service area</span>
                <p>{studio.serviceArea}</p>
              </div>
            </div>
            <p className="demo-note" style={{ marginTop: "var(--space-l)" }}>
              Demo contact information — replace before launch.
            </p>
          </div>

          <form className="consultation-form" onSubmit={onSubmit} noValidate data-testid="contact-form">
            <h2>Write to us</h2>
            <div className="form-grid">
              <div className={`field span-2 ${errors.name ? "field--error" : ""}`}>
                <label htmlFor="c-name">Name *</label>
                <input
                  id="c-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="field__error" role="alert">{errors.name}</p>}
              </div>
              <div className={`field span-2 ${errors.email ? "field--error" : ""}`}>
                <label htmlFor="c-email">Email *</label>
                <input
                  id="c-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="field__error" role="alert">{errors.email}</p>}
              </div>
              <div className={`field span-2 ${errors.message ? "field--error" : ""}`}>
                <label htmlFor="c-message">Message *</label>
                <textarea
                  id="c-message"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  aria-invalid={!!errors.message}
                />
                {errors.message && <p className="field__error" role="alert">{errors.message}</p>}
              </div>
            </div>

            {state === "done" && (
              <p className="form-alert" role="status" style={{ color: "var(--color-success)", borderColor: "rgba(47,93,67,0.4)", background: "rgba(47,93,67,0.06)" }}>
                Thank you — your message is on our radar. We’ll reply shortly.
              </p>
            )}
            {state === "error" && (
              <p className="form-alert" role="alert">
                We couldn’t connect right now. Please try again or contact us on WhatsApp.
              </p>
            )}

            <div style={{ marginTop: "var(--space-l)" }}>
              <button type="submit" className="btn btn--maroon btn--full" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : "Send message"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

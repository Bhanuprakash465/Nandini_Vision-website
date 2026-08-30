"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { budgetOptions, eventTypes, site } from "@/lib/data";

const initial = {
  client_name: "",
  phone: "",
  email: "",
  event_type: "",
  date: "",
  location: "",
  guest_count: "",
  requirements: "",
  budget: budgetOptions[0],
  message: "",
};

export default function ConsultationForm() {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  function update<K extends keyof typeof initial>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        ...form,
        guest_count: form.guest_count ? Number(form.guest_count) : null,
      };
      const res = await api.createEnquiry(payload);
      setResult(res);
    } catch (err: any) {
      setError(err.message || "Something went wrong submitting your enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    const waText = encodeURIComponent(
      `Hi Nandini Vision! I'm ${result.client_name}. Enquiry ID: ${result.enquiry_id}. Event: ${result.event_type} on ${result.date} in ${result.location}.`
    );
    const waLink = `https://wa.me/${site.whatsappNumber}?text=${waText}`;

    return (
      <div className="max-w-xl" data-testid="consultation-confirmation">
        <h1 className="font-display text-4xl md:text-5xl mb-4">Thank you, {result.client_name}.</h1>
        <p className="text-lg text-greige mb-8">
          We received your {result.event_type} enquiry.
        </p>
        <div className="border border-ink/15 p-6 mb-8 text-sm space-y-2">
          <p><span className="text-greige">Event type</span> — {result.event_type}</p>
          <p><span className="text-greige">Date</span> — {result.date}</p>
          <p><span className="text-greige">Location</span> — {result.location}</p>
          <p><span className="text-greige">Enquiry ID</span> — <strong>{result.enquiry_id}</strong></p>
          <p className="text-xs text-greige pt-2">
            Owner email notification: {result.email_delivery === "sent" ? "sent" : result.email_delivery === "failed" ? "failed to send" : "queued (mock mode — no email provider configured yet)"}
          </p>
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-maroon text-bone px-8 py-4 text-[11px] uppercase tracking-[0.16em] font-semibold"
        >
          Continue on WhatsApp →
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl grid gap-6" data-testid="consultation-form">
      <div className="grid md:grid-cols-2 gap-6">
        <Field label="Name *">
          <input required value={form.client_name} onChange={(e) => update("client_name", e.target.value)} className="input" />
        </Field>
        <Field label="Phone *">
          <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} className="input" placeholder="+91 98765 43210" />
        </Field>
      </div>
      <Field label="Email *">
        <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="input" />
      </Field>
      <div className="grid md:grid-cols-2 gap-6">
        <Field label="Event Type *">
          <select required value={form.event_type} onChange={(e) => update("event_type", e.target.value)} className="input">
            <option value="">Select</option>
            {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Event Date *">
          <input required type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className="input" />
        </Field>
      </div>
      <Field label="Location *">
        <input required value={form.location} onChange={(e) => update("location", e.target.value)} className="input" placeholder="e.g. Vijayawada" />
      </Field>
      <div className="grid md:grid-cols-2 gap-6">
        <Field label="Expected Guest Count">
          <input type="number" min={0} value={form.guest_count} onChange={(e) => update("guest_count", e.target.value)} className="input" />
        </Field>
        <Field label="Budget Range">
          <select value={form.budget} onChange={(e) => update("budget", e.target.value)} className="input">
            {budgetOptions.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Photography Requirements">
        <textarea value={form.requirements} onChange={(e) => update("requirements", e.target.value)} className="input min-h-[90px]" />
      </Field>
      <Field label="Message">
        <textarea value={form.message} onChange={(e) => update("message", e.target.value)} className="input min-h-[90px]" />
      </Field>

      {error && <p className="text-sm text-maroon">{error} — is the API running at NEXT_PUBLIC_API_URL?</p>}

      <button type="submit" disabled={submitting} className="bg-ink text-bone py-4 text-[11px] uppercase tracking-[0.16em] font-semibold disabled:opacity-60">
        {submitting ? "Submitting…" : "Submit Enquiry"}
      </button>

      <style jsx>{`
        .input {
          width: 100%;
          background: transparent;
          border-bottom: 1px solid rgba(17, 17, 17, 0.2);
          padding: 10px 0;
          outline: none;
          font-family: var(--font-manrope);
        }
        .input:focus { border-color: #6B2226; }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.14em] text-greige mb-2">{label}</span>
      {children}
    </label>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { api, type Enquiry } from "@/lib/api";
import { budgetOptions, eventTypes, site } from "@/lib/data";
import { formatDate, isEmail, isPastDate, phoneDigits, todayISO } from "@/lib/validation";
import { SelectField, TextAreaField, TextField } from "@/components/FormFields";

type Initial = { event?: string; date?: string; location?: string; message?: string };

type Values = {
  client_name: string;
  phone: string;
  email: string;
  event_type: string;
  date: string;
  location: string;
  guest_count: string;
  requirements: string;
  budget: string;
  message: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const ORDER: (keyof Values)[] = ["client_name", "phone", "email", "event_type", "date", "location", "guest_count"];

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.client_name.trim().length < 2) e.client_name = "Enter your name (at least 2 characters).";
  if (phoneDigits(v.phone).length < 7) e.phone = "Enter a phone number we can reach you on, with country code if outside India.";
  if (!isEmail(v.email.trim())) e.email = "Enter a valid email address, like name@example.com.";
  if (!v.event_type) e.event_type = "Choose the type of event.";
  if (!v.date) e.date = "Choose the date of your event.";
  else if (isPastDate(v.date)) e.date = "That date has already passed. Choose a future date.";
  if (!v.location.trim()) e.location = "Tell us where the event will take place.";
  if (v.guest_count && (!/^\d+$/.test(v.guest_count) || Number(v.guest_count) > 100000)) {
    e.guest_count = "Enter a whole number of guests, or leave this blank.";
  }
  return e;
}

export default function ConsultationForm({ initial = {} }: { initial?: Initial }) {
  const [form, setForm] = useState<Values>({
    client_name: "",
    phone: "",
    email: "",
    event_type: initial.event && eventTypes.includes(initial.event) ? initial.event : "",
    date: initial.date && !isPastDate(initial.date) ? initial.date : "",
    location: initial.location ?? "",
    guest_count: "",
    requirements: "",
    budget: budgetOptions[0],
    message: initial.message ?? "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [result, setResult] = useState<Enquiry | null>(null);
  const busy = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (result) headingRef.current?.focus();
  }, [result]);

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy.current) return; // ignore double clicks / repeated Enter

    const found = validate(form);
    setErrors(found);
    setApiError("");
    const firstBad = ORDER.find((k) => found[k]);
    if (firstBad) {
      document.getElementById(`enq-${firstBad}`)?.focus();
      return;
    }

    busy.current = true;
    setSubmitting(true);
    try {
      const res = await api.createEnquiry({
        client_name: form.client_name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        event_type: form.event_type,
        date: form.date,
        location: form.location.trim(),
        guest_count: form.guest_count ? Number(form.guest_count) : null,
        requirements: form.requirements.trim() || null,
        budget: form.budget,
        message: form.message.trim() || null,
      });
      setResult(res);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Something went wrong submitting your enquiry.");
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  }

  if (result) {
    const waText = encodeURIComponent(
      `Hi Nandini Vision! I'm ${result.client_name}. Enquiry ID: ${result.enquiry_id}. Event: ${result.event_type} on ${result.date} in ${result.location}.`
    );
    return (
      <div className="max-w-xl" data-testid="consultation-confirmation" role="status">
        <h2 ref={headingRef} tabIndex={-1} className="font-display text-4xl outline-none md:text-6xl">
          Thank you, {result.client_name.split(" ")[0]}.
        </h2>
        <p className="mt-5 text-lg text-black/70">
          We&rsquo;ve received your {result.event_type.toLowerCase()} enquiry and will reply to {result.email}.
        </p>
        <dl className="mt-10 grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 border-l-2 border-cobalt pl-6 text-[15px]">
          <dt className="text-black/60">Event</dt>
          <dd>{result.event_type}</dd>
          <dt className="text-black/60">Date</dt>
          <dd>{formatDate(result.date)}</dd>
          <dt className="text-black/60">Location</dt>
          <dd>{result.location}</dd>
          <dt className="text-black/60">Enquiry ID</dt>
          <dd className="font-medium">{result.enquiry_id}</dd>
        </dl>
        {site.whatsappNumber && (
          <a
            href={`https://wa.me/${site.whatsappNumber}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cobalt-on-light mt-10"
          >
            Continue on WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid max-w-2xl gap-8" data-testid="consultation-form" aria-label="Consultation enquiry">
      <p className="text-sm text-black/60">Fields marked * are required.</p>

      <div className="grid gap-8 md:grid-cols-2">
        <TextField id="enq-client_name" label="Name" required autoComplete="name" value={form.client_name} onChange={(e) => update("client_name", e.target.value)} error={errors.client_name} />
        <TextField id="enq-phone" label="Phone" required type="tel" inputMode="tel" autoComplete="tel" maxLength={20} placeholder="+91 98765 43210" value={form.phone} onChange={(e) => update("phone", e.target.value)} error={errors.phone} />
      </div>
      <TextField id="enq-email" label="Email" required type="email" autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} error={errors.email} />
      <div className="grid gap-8 md:grid-cols-2">
        <SelectField id="enq-event_type" label="Event type" required value={form.event_type} onChange={(e) => update("event_type", e.target.value)} error={errors.event_type}>
          <option value="">Select an event type</option>
          {eventTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </SelectField>
        <TextField id="enq-date" label="Event date" required type="date" min={todayISO()} value={form.date} onChange={(e) => update("date", e.target.value)} error={errors.date} />
      </div>
      <TextField id="enq-location" label="Location" required autoComplete="off" placeholder="e.g. Vijayawada" value={form.location} onChange={(e) => update("location", e.target.value)} error={errors.location} />
      <div className="grid gap-8 md:grid-cols-2">
        <TextField id="enq-guest_count" label="Expected guests" type="text" inputMode="numeric" value={form.guest_count} onChange={(e) => update("guest_count", e.target.value.replace(/[^\d]/g, ""))} error={errors.guest_count} hint="Optional" />
        <SelectField id="enq-budget" label="Budget range" value={form.budget} onChange={(e) => update("budget", e.target.value)} hint="Optional">
          {budgetOptions.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </SelectField>
      </div>
      <TextAreaField id="enq-requirements" label="Photography requirements" value={form.requirements} onChange={(e) => update("requirements", e.target.value)} hint="Optional. Rituals, shot lists, films, albums." />
      <TextAreaField id="enq-message" label="Anything else we should know" value={form.message} onChange={(e) => update("message", e.target.value)} hint="Optional" />

      <div aria-live="assertive" role="alert" className="empty:hidden">
        {apiError && (
          <p className="border-l-2 border-black bg-black/[0.04] p-4 text-[15px] font-medium">
            Your enquiry wasn&rsquo;t sent. {apiError}
          </p>
        )}
      </div>

      <button type="submit" disabled={submitting} className="btn-cobalt-on-light w-full sm:w-fit">
        {submitting ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}

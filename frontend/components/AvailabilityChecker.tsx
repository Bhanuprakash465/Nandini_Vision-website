"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { eventTypes } from "@/lib/data";
import { formatDate, isPastDate, todayISO } from "@/lib/validation";
import { SelectField, TextField } from "@/components/FormFields";

type Result = { status: string; note?: string | null; date: string };

const OUTCOMES: Record<string, { heading: string; tone: "open" | "pending" | "closed" }> = {
  AVAILABLE: { heading: "This date is open", tone: "open" },
  PENDING: { heading: "An enquiry is already pending for this date", tone: "pending" },
  HOLD: { heading: "This date is booked", tone: "closed" },
  CONFIRMED: { heading: "This date is booked", tone: "closed" },
  UNAVAILABLE: { heading: "This date is booked", tone: "closed" },
};

export default function AvailabilityChecker() {
  const [form, setForm] = useState({ date: "", event_type: "", location: "" });
  const [errors, setErrors] = useState<{ date?: string }>({});
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const busy = useRef(false);
  const dateRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy.current) return;

    const next: { date?: string } = {};
    if (!form.date) next.date = "Choose the date of your event.";
    else if (isPastDate(form.date)) next.date = "That date has already passed. Choose a future date.";
    setErrors(next);
    setApiError("");
    setResult(null);
    if (next.date) {
      dateRef.current?.focus();
      return;
    }

    busy.current = true;
    setLoading(true);
    try {
      const r = await api.checkAvailability({
        date: form.date,
        event_type: form.event_type || undefined,
        location: form.location.trim() || undefined,
      });
      setResult(r);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }

  const outcome = result ? OUTCOMES[result.status] : undefined;
  const params = new URLSearchParams();
  if (form.date) params.set("date", form.date);
  if (form.event_type) params.set("event", form.event_type);
  if (form.location.trim()) params.set("location", form.location.trim());

  return (
    <div className="on-dark grid items-start gap-14 md:grid-cols-2" data-testid="availability-checker">
      <div>
        <h2 className="font-display text-4xl font-normal leading-[1.08] md:text-6xl">
          Tell us when you&rsquo;re celebrating.
          <br />
          <span className="italic text-cobalt-light">We&rsquo;ll tell you if we&rsquo;re there.</span>
        </h2>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/70">
          We check your date against the bookings we already hold. Event type and location are optional and only
          pre-fill your enquiry.
        </p>
      </div>

      <form onSubmit={onSubmit} noValidate className="grid gap-7" aria-label="Check availability">
        <TextField
          dark
          required
          id="avail-date"
          label="Event date"
          type="date"
          min={todayISO()}
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          error={errors.date}
          ref={dateRef}
        />
        <SelectField
          dark
          id="avail-event"
          label="Event type"
          value={form.event_type}
          onChange={(e) => setForm({ ...form, event_type: e.target.value })}
        >
          <option value="">Not sure yet</option>
          {eventTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </SelectField>
        <TextField
          dark
          id="avail-location"
          label="Location"
          placeholder="e.g. Vijayawada"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <button type="submit" disabled={loading} className="btn-cobalt mt-2 w-full sm:w-fit">
          {loading ? "Checking…" : "Check this date"}
        </button>

        <div aria-live="polite" role="status" className="min-h-[1px]">
          {apiError && (
            <p className="border border-white/40 p-4 text-[15px]">
              We couldn&rsquo;t check that date: {apiError}. Please try again in a moment.
            </p>
          )}
          {result && outcome && (
            <div
              className={`border p-5 ${
                outcome.tone === "open" ? "border-cobalt-light bg-cobalt/40" : "border-white/30"
              }`}
              data-testid="availability-result"
            >
              <p className="text-sm text-white/65">{formatDate(result.date)}</p>
              <p className="mt-1 font-display text-2xl">{outcome.heading}</p>
              {result.note && <p className="mt-2 text-[15px] text-white/75">{result.note}</p>}
              {outcome.tone !== "closed" && (
                <Link href={`/consultation?${params.toString()}`} className="btn-ghost-light mt-5">
                  {outcome.tone === "open" ? "Book a consultation for this date" : "Enquire about this date"}
                </Link>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

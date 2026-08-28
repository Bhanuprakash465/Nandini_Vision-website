"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { checkAvailability } from "@/lib/api";
import { durationOptions, eventTypes } from "@/lib/content";
import type { AvailabilityResult } from "@/lib/types";

function toInputDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

/**
 * Availability checker — the result always comes from the backend,
 * never hardcoded. Announces status via aria-live so screen readers
 * hear the outcome without relying on colour alone.
 */
export default function AvailabilityPage() {
  const today = new Date();
  const [eventType, setEventType] = useState(eventTypes[0]);
  const [date, setDate] = useState(toInputDate(new Date(today.getTime() + 90 * 86400000)));
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AvailabilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Check Photography Availability | Nandini Vision";
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!date) {
      setError("Please choose an event date.");
      return;
    }
    if (!location.trim()) {
      setError("Please tell us where your event will be.");
      return;
    }
    setLoading(true);
    try {
      const res = await checkAvailability({
        event_type: eventType,
        event_date: date,
        event_location: location.trim(),
        event_duration: duration,
      });
      setResult(res);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "We couldn't connect right now. Please try again or contact us on WhatsApp."
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="page-enter">
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Availability</span>
          <h1>Find your date.</h1>
          <p className="lead">Tell us when you’re celebrating. We’ll tell you if we’re there.</p>
        </div>
      </header>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container availability-layout">
          <form className="availability-card" onSubmit={onSubmit} data-testid="availability-form" noValidate>
            <h2 className="availability-card__title">Check a date</h2>

            <div className="form-grid">
              <div className="field span-2">
                <label htmlFor="event-type">Event type</label>
                <select id="event-type" value={eventType} onChange={(e) => setEventType(e.target.value)}>
                  {eventTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="event-date">
                  Event date <span className="req" aria-hidden="true">*</span>
                </label>
                <input
                  id="event-date"
                  type="date"
                  required
                  min={toInputDate(today)}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  aria-required="true"
                />
              </div>

              <div className="field">
                <label htmlFor="event-duration">Coverage</label>
                <select id="event-duration" value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                  {durationOptions.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field span-2">
                <label htmlFor="event-location">
                  Location <span className="req" aria-hidden="true">*</span>
                </label>
                <input
                  id="event-location"
                  type="text"
                  required
                  placeholder="City, state (or country)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  aria-required="true"
                />
              </div>
            </div>

            {error && (
              <p className="form-alert" role="alert" style={{ marginTop: "var(--space-m)" }}>
                {error}
              </p>
            )}

            <div style={{ marginTop: "var(--space-l)" }}>
              <button
                type="submit"
                className="btn btn--maroon btn--full"
                disabled={loading}
                data-testid="availability-submit"
              >
                {loading ? "Checking…" : "Check Availability"}
              </button>
            </div>
            <p className="form-note">
              Availability is checked live against the studio booking calendar.
            </p>
          </form>

          <div aria-live="polite">
            {result ? (
              <div
                className={`availability-result availability-result--${result.status}`}
                data-testid="availability-result"
              >
                <div>
                  <span className="availability-result__status">
                    {result.status === "available"
                      ? "Available"
                      : result.status === "hold"
                        ? "On hold"
                        : "Booked"}
                  </span>
                  <p className="availability-result__date" style={{ marginTop: "var(--space-m)" }}>
                    {result.formattedDate ?? result.date}
                  </p>
                  <p className="availability-result__message" style={{ marginTop: "var(--space-s)" }}>
                    {result.message}
                  </p>
                  {result.status === "available" && (
                    <p style={{ marginTop: "var(--space-s)", fontSize: "var(--text-sm)", color: "var(--color-stone)" }}>
                      Want this date? Send an enquiry and we’ll hold it for you.
                    </p>
                  )}
                </div>

                <div className="availability-result__actions">
                  {result.status === "available" ? (
                    <Link href="/consultation" className="btn btn--maroon">
                      Book a Consultation
                    </Link>
                  ) : (
                    <Link href="/consultation" className="btn">
                      Discuss alternatives
                    </Link>
                  )}
                  <button type="button" className="btn btn--ghost" onClick={reset}>
                    Check another date
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="availability-band__date"
                style={{ minHeight: "100%", display: "grid", placeContent: "center", gap: "var(--space-s)" }}
              >
                <span className="meta">The studio calendar</span>
                <span className="date" style={{ textAlign: "center" }}>
                  {result === null ? "?" : ""}
                </span>
                <span className="meta" style={{ textAlign: "center" }}>
                  Results appear here after you check
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

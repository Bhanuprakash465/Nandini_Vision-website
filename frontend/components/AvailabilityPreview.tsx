"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { eventTypes } from "@/lib/data";

export default function AvailabilityPreview() {
  const [form, setForm] = useState({ event_type: "", date: "", location: "", duration: "Full Day" });
  const [result, setResult] = useState<{ status: string; note: string; date: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const r = await api.checkAvailability(form);
      setResult(r);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-14 items-start" data-testid="availability-checker">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-bone/50 mb-4">Find Your Date</div>
        <h2 className="font-display text-3xl md:text-5xl leading-tight">
          Tell us when you&rsquo;re celebrating.
          <br />
          We&rsquo;ll tell you if we&rsquo;re there.
        </h2>
      </div>
      <form onSubmit={onSubmit} className="grid gap-5">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.14em] text-bone/50 mb-2">Event Type</label>
          <select
            required
            value={form.event_type}
            onChange={(e) => setForm({ ...form, event_type: e.target.value })}
            className="w-full bg-transparent border-b border-bone/25 py-2 text-bone focus:border-gold outline-none"
          >
            <option value="" className="text-ink">Select</option>
            {eventTypes.map((t) => (
              <option key={t} value={t} className="text-ink">{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[0.14em] text-bone/50 mb-2">Event Date</label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full bg-transparent border-b border-bone/25 py-2 text-bone focus:border-gold outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[0.14em] text-bone/50 mb-2">Location</label>
          <input
            type="text"
            required
            placeholder="e.g. Vijayawada"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full bg-transparent border-b border-bone/25 py-2 text-bone focus:border-gold outline-none placeholder:text-bone/30"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[0.14em] text-bone/50 mb-2">Duration</label>
          <select
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="w-full bg-transparent border-b border-bone/25 py-2 text-bone focus:border-gold outline-none"
          >
            <option className="text-ink">Half Day</option>
            <option className="text-ink">Full Day</option>
            <option className="text-ink">Multi-Day</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-gold text-ink py-4 text-[11px] uppercase tracking-[0.16em] font-bold disabled:opacity-60"
        >
          {loading ? "Checking…" : "Check Availability"}
        </button>
        {error && <p className="text-sm text-red-300">{error} — is the API running at NEXT_PUBLIC_API_URL?</p>}
        {result && (
          <div className="mt-2 border border-bone/20 p-4">
            <div className="text-[11px] tracking-[0.14em] text-bone/50">
              {new Date(result.date + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase()}
            </div>
            <div className="font-display text-xl text-gold mt-1">{result.status}</div>
            <p className="text-xs text-bone/50 mt-2">{result.note}</p>
          </div>
        )}
      </form>
    </div>
  );
}

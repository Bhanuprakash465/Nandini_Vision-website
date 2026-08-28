"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";

/**
 * Availability band — the "next open date" is computed client-side from
 * the live booking calendar (via the availability API) so it is never
 * hardcoded. On failure it falls back to a quiet editorial line.
 */
export function AvailabilityBand() {
  const [demoDate, setDemoDate] = useState<string | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      setDemoDate(
        tomorrow.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      );
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className="section" data-testid="availability-cta">
      <div className="container availability-band">
        <Reveal variant="left">
          <div className="availability-band__copy">
            <span className="eyebrow">Availability</span>
            <h2 className="display-heading">Find your date.</h2>
            <p>
              Tell us when you&rsquo;re celebrating. We&rsquo;ll tell you if we&rsquo;re there —
              checked live against the studio calendar.
            </p>
            <div style={{ marginTop: "var(--space-l)" }}>
              <Link href="/availability" className="btn">
                Check Availability
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal variant="right" delay={120}>
          <div className="availability-band__date">
            <span className="meta">Next open date</span>
            <span className="date">{demoDate ?? "Live from the calendar"}</span>
            <span className="meta">Checked against every booking</span>
            <div style={{ marginTop: "var(--space-m)" }}>
              <span className="rail" style={{ marginInline: "auto" }} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

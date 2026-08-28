"use client";

import { useEffect, useState } from "react";
import { studio } from "@/lib/content";

/**
 * Elegant brand preloader — name, maroon line, tagline.
 * Fast (~1.4s), removed from the accessibility tree after completion,
 * and skipped almost instantly under prefers-reduced-motion.
 */
export function Preloader() {
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const fadeAfter = reduced ? 250 : 1550;
    const removeAfter = reduced ? 600 : 2300;

    const t1 = setTimeout(() => setDone(true), fadeAfter);
    const t2 = setTimeout(() => setHidden(true), removeAfter);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className={`preloader ${done ? "preloader--done" : ""}`}
      role="status"
      aria-label={`${studio.name} — ${studio.supportingStatement}`}
      data-testid="preloader"
      aria-hidden={done}
    >
      <p className="preloader__name" aria-hidden="true">
        {studio.name.split("").map((char, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.04}s` }}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </p>
      <span className="preloader__line" aria-hidden="true" />
      <p className="preloader__tag" aria-hidden="true">
        Stories in stillness
      </p>
    </div>
  );
}

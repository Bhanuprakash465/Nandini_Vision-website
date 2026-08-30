"use client";
import { useEffect, useState } from "react";
import { testimonials } from "@/lib/data";

export default function TestimonialsRotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, []);
  const t = testimonials[i];
  return (
    <div className="max-w-3xl mx-auto text-center" data-testid="testimonials">
      <p className="font-display italic text-2xl md:text-4xl leading-snug transition-opacity duration-500">
        &ldquo;{t.quote}&rdquo;
      </p>
      <p className="mt-6 text-xs uppercase tracking-[0.1em] text-greige">
        {t.who} — {t.event}
      </p>
      <div className="flex justify-center gap-2 mt-10">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Show testimonial ${idx + 1}`}
            className={`h-[7px] rounded-full transition-all ${idx === i ? "w-6 bg-maroon" : "w-[7px] bg-ink/20"}`}
          />
        ))}
      </div>
    </div>
  );
}

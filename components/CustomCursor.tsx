"use client";

import { useEffect, useRef } from "react";

/**
 * Elegant custom cursor for fine-pointer devices only.
 * Expands into a maroon "VIEW" disc over portfolio imagery
 * (elements with [data-cursor="view"]). Hidden on touch devices.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let ringX = x;
    let ringY = y;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px)`;

      const target = (e.target as HTMLElement | null)?.closest?.(
        '[data-cursor="view"], [data-cursor="link"], a, button, [role="button"]'
      );
      ring.classList.toggle("cursor--view", !!target?.closest?.('[data-cursor="view"]'));
      ring.classList.toggle("cursor--link", !!target && !target.closest('[data-cursor="view"]'));
    };

    const loop = () => {
      ringX += (x - ringX) * 0.16;
      ringY += (y - ringY) * 0.16;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true" data-testid="custom-cursor">
      <div ref={dotRef} className="cursor__dot" />
      <div ref={ringRef} className="cursor__ring">
        <span>View</span>
      </div>
    </div>
  );
}

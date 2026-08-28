"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  variant?: "up" | "scale" | "left" | "right";
  delay?: number;
  as?: "div" | "li" | "section" | "figure" | "span";
  testId?: string;
}

/**
 * Lightweight scroll-reveal system (IntersectionObserver + CSS).
 * Respects prefers-reduced-motion via CSS in globals.
 */
export function Reveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
  as: Tag = "div",
  testId,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const ioRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      // Environments without IO: reveal immediately via rAF (async, so
      // this never sets state synchronously inside the effect body).
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    ioRef.current = io;
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const variantClass = variant === "up" ? "" : `reveal--${variant}`;

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`reveal ${variantClass} ${visible ? "reveal--in" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      data-testid={testId}
    >
      {children}
    </Tag>
  );
}

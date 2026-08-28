"use client";

import Image from "next/image";
import type { ImageRef } from "@/lib/types";

interface ImageMediaProps extends ImageRef {
  className?: string;
  sizes?: string;
  cursor?: "view" | "link";
  eager?: boolean;
  fallbackAspect?: string;
}

/**
 * Next/image wrapper — AVIF/WebP negotiation via the image optimizer,
 * lazy loading by default, zero-CLS via aspect-ratio, descriptive alt.
 */
export function ImageMedia({
  src,
  alt,
  aspect,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  cursor,
  eager = false,
  fallbackAspect = "1 / 1",
}: ImageMediaProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={eager}
      loading={eager ? "eager" : "lazy"}
      className={`fit-image ${className}`}
      data-cursor={cursor}
      style={{ aspectRatio: aspect ?? fallbackAspect }}
    />
  );
}

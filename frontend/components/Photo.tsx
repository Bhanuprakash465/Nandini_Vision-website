import Image from "next/image";
import { SHOW_PLACEHOLDER_LABELS, type Tone } from "@/lib/data";

const tones: Record<Tone, string> = {
  // Black into cobalt
  cobalt: "bg-[image:var(--gradient-night)]",
  // Black into white through neutral greys
  mono: "bg-[linear-gradient(160deg,#000_0%,#3a3a3a_55%,#bdbdbd_100%)]",
  // White into soft grey with a cobalt wash at the base
  light: "bg-[linear-gradient(180deg,#fff_0%,#ececec_62%,#c9ccea_100%)]",
};

type Props = {
  /** Real photograph path under /public. When absent, an intentional placeholder frame is drawn. */
  src?: string;
  alt?: string;
  tone?: Tone;
  className?: string;
  /** Text on the placeholder. Ignored for real photographs. */
  label?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * Photograph or placeholder. Parent must be `relative` with a defined height or aspect ratio.
 * Real photographs use next/image (AVIF/WebP, lazy loading, no layout shift).
 */
export default function Photo({
  src,
  alt = "",
  tone = "cobalt",
  className = "",
  label,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: Props) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover ${className}`}
      />
    );
  }

  const dark = tone !== "light";
  return (
    <div
      role="img"
      aria-label={alt ? `Placeholder for photograph: ${alt}` : "Placeholder image"}
      className={`absolute inset-0 overflow-hidden ${tones[tone]} ${className}`}
    >
      {/* Soft cobalt bloom keeps flat gradients from reading as empty boxes. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 45% at 70% 28%, rgba(124,133,230,0.28), transparent 70%), radial-gradient(80% 50% at 20% 100%, rgba(44,52,128,0.45), transparent 70%)",
        }}
      />
      {SHOW_PLACEHOLDER_LABELS && (
        <span
          className={`absolute bottom-3 left-3 max-w-[85%] border px-2 py-1 text-[11px] leading-snug ${
            dark ? "border-white/30 bg-black/40 text-white/80" : "border-black/25 bg-white/60 text-black/70"
          }`}
        >
          {label ?? "Photograph to be supplied"}
        </span>
      )}
    </div>
  );
}

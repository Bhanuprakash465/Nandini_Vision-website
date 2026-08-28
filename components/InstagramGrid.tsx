import { ImageMedia } from "@/components/ImageMedia";
import { instagramGrid, studio } from "@/lib/content";

export function InstagramGrid() {
  return (
    <div className="insta-grid">
      {instagramGrid.map((img) => (
        <a
          key={img.src}
          href={studio.instagram}
          target="_blank"
          rel="noreferrer"
          aria-label={`View on Instagram: ${img.alt} (demo)`}
          data-cursor="link"
        >
          <ImageMedia
            src={img.src}
            alt={img.alt}
            sizes="(max-width: 900px) 33vw, 16vw"
            fallbackAspect="1 / 1"
          />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
          </svg>
        </a>
      ))}
    </div>
  );
}

import { showreel, studio } from "@/lib/content";

/**
 * Cinematic showreel — muted autoplay, playsinline, poster, lazy video.
 * A mobile-optimised version is served to small viewports via <source media>.
 */
export function Showreel() {
  return (
    <section className="showreel" aria-label="Cinematic showreel" data-testid="cinematic-showreel">
      <div className="showreel__heading">
        <h2>
          Stories in stillness
          <em>A film from recent celebrations</em>
        </h2>
      </div>

      <video
        className="showreel__video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={showreel.poster}
        aria-label={`${studio.name} cinematic showreel — temporary placeholder footage`}
      >
        <source src={showreel.mobileSrc} type="video/mp4" media="(max-width: 768px)" />
        <source src={showreel.src} type="video/mp4" />
        Your browser does not support HTML video.
      </video>

      <p className="showreel__label">
        <span className="demo-note">Temporary placeholder footage · generated for development</span>
      </p>
    </section>
  );
}

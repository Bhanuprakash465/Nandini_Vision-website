import Link from "next/link";

/**
 * PHASE 1 — foundation page (temporary).
 * Replaced by the real homepage in Phase 2.
 */
export default function Home() {
  const swatches = [
    { name: "Bone", value: "#F9F8F6", color: "var(--color-bone)" },
    { name: "Ink", value: "#111111", color: "var(--color-ink)" },
    { name: "Stone", value: "#817B74", color: "var(--color-stone)" },
    { name: "Maroon", value: "#6B2226", color: "var(--color-maroon)" },
    { name: "Antique Gold", value: "#C5A059", color: "var(--color-gold)" },
  ];

  return (
    <main id="main" className="foundation">
      <div className="container">
        <header className="foundation__header">
          <p className="foundation__mark">Nandini Vision</p>
          <p className="foundation__status">Phase 1 · Foundation</p>
        </header>
      </div>

      <div className="container foundation__hero">
        <span className="eyebrow">Design system</span>
        <h1 className="foundation__title">
          Photography for the <em>beautifully</em> lived.
        </h1>
        <p className="foundation__subtitle">
          The Nandini Vision design foundation is in place — bone and ink,
          Playfair Display and Manrope, maroon rails and antique gold, set
          against generous whitespace.
        </p>
        <div>
          <span className="rail" aria-hidden="true" />
        </div>

        <div className="foundation__swatches" aria-label="Brand palette">
          {swatches.map((swatch) => (
            <div className="swatch" key={swatch.name}>
              <span
                className="swatch__chip"
                style={{ background: swatch.color }}
              />
              <span className="swatch__name">{swatch.name}</span>
              <span className="swatch__value">{swatch.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        <footer className="foundation__footer">
          <p>© 2026 Nandini Vision</p>
          <Link href="/" className="link-underline" aria-label="Return home">
            Return home
          </Link>
        </footer>
      </div>
    </main>
  );
}

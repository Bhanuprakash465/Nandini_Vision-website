import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms",
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <div className="page-enter">
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Legal</span>
          <h1>Terms</h1>
          <p className="lead">Development-version terms — review before launch.</p>
        </div>
      </header>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container container--narrow stack">
          <p>
            These terms govern use of the Nandini Vision demo website. Bookings made here
            are demonstration enquiries in this development version and do not constitute
            a paid engagement.
          </p>
          <h2>Bookings & availability</h2>
          <p>
            Availability shown reflects the studio calendar. A date is only reserved once
            a booking is confirmed and a written agreement is in place.
          </p>
          <h2>Imagery</h2>
          <p>
            All portfolio imagery in this development version is temporary placeholder
            content and does not represent actual client work.
          </p>
          <h2>Contact</h2>
          <p>
            Questions: <Link href="/contact">contact us</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}

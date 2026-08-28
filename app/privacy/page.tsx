import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <div className="page-enter">
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Legal</span>
          <h1>Privacy Policy</h1>
          <p className="lead">Development-version policy — review before launch.</p>
        </div>
      </header>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container container--narrow stack">
          <p>
            Nandini Vision collects the information you share through our consultation and
            booking forms (name, phone, email, event details) solely to respond to your
            enquiry and manage your booking.
          </p>
          <p>
            In this development version, submissions are stored in the studio&rsquo;s demo
            database. Contact information is demo/placeholder data and should be replaced
            before production launch.
          </p>
          <h2>What we do with it</h2>
          <p>
            Enquiry details are used to check availability, prepare a proposal, and keep
            the studio calendar accurate. We do not sell personal information.
          </p>
          <h2>Contact</h2>
          <p>
            Questions about this policy: <Link href="/contact">contact us</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}

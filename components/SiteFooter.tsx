import Link from "next/link";
import { navigation, studio } from "@/lib/content";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" data-testid="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <h2>{studio.name}</h2>
            <p className="site-footer__tagline">{studio.brandStatement}</p>
            <p
              className="demo-note"
              style={{ color: "var(--color-stone-light)", borderColor: "var(--color-bone-line)" }}
            >
              Demo studio information
            </p>
          </div>

          <div className="site-footer__column">
            <h3>Explore</h3>
            <ul>
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__column">
            <h3>Contact</h3>
            <ul className="site-footer__contact">
              <li>
                <span className="label">Email</span>
                <a href={`mailto:${studio.email}`}>{studio.email}</a>
              </li>
              <li>
                <span className="label">WhatsApp</span>
                <a href={`https://wa.me/${studio.phoneIntl}`}>{studio.phoneDisplay}</a>
              </li>
              <li>
                <span className="label">Instagram</span>
                <a href={studio.instagram} rel="noreferrer" target="_blank">
                  {studio.instagramHandle}
                </a>
              </li>
              <li>
                <span className="label">Studio</span>
                <span>{studio.location}</span>
              </li>
              <li>
                <span className="label">Area</span>
                <span>{studio.serviceArea}</span>
              </li>
            </ul>
          </div>

          <div className="site-footer__column">
            <h3>The studio</h3>
            <ul>
              <li>
                <Link href="/about">Our story</Link>
              </li>
              <li>
                <Link href="/work">Selected work</Link>
              </li>
              <li>
                <Link href="/availability">Check availability</Link>
              </li>
              <li>
                <Link href="/consultation">Book a consultation</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© {year} {studio.name}</p>
          <div className="site-footer__legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/login">Studio login</Link>
          </div>
        </div>

        <div className="site-footer__notice">
          <p>
            {studio.demoNotice}
            <br />
            Built with Next.js · FastAPI · MongoDB
          </p>
          <Link href="/consultation" className="btn btn--gold btn--sm" style={{ color: "var(--color-on-dark)" }}>
            <span className="btn__orbit" aria-hidden="true" />
            <span>Book a Consultation</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { site, nav } from "@/lib/data";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="bg-ink text-bone px-6 md:px-12 pt-24 pb-10">
      <h2 className="font-display text-5xl md:text-8xl">Nandini Vision</h2>
      <p className="font-display italic text-bone/60 mt-4 text-base">{site.headline}</p>

      <div className="flex flex-wrap justify-between gap-10 mt-24 pt-10 border-t border-bone/10">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-bone/35 mb-4">Navigate</div>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="block text-sm text-bone/60 hover:text-gold mb-3">
              {item.label}
            </Link>
          ))}
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-bone/35 mb-4">Connect (demo)</div>
          <p className="text-sm text-bone/60 mb-3">Instagram — {site.instagram}</p>
          <p className="text-sm text-bone/60 mb-3">WhatsApp — {site.whatsapp}</p>
          <p className="text-sm text-bone/60 mb-3">Email — {site.email}</p>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-bone/35 mb-4">Studio</div>
          <p className="text-sm text-bone/60 mb-3">{site.location}</p>
          <p className="text-sm text-bone/60 mb-3">Serving India &amp; worldwide</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-3 mt-14 text-[11px] text-bone/35">
        <span>© 2026 Nandini Vision</span>
        <span>All imagery is temporary placeholder content</span>
      </div>
    </footer>
  );
}

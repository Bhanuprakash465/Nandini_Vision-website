import Link from "next/link";
import Logo from "./Logo";
import { site, nav, SHOW_PLACEHOLDER_LABELS } from "@/lib/data";

export default function Footer() {
  const whatsappHref = site.whatsappNumber ? `https://wa.me/${site.whatsappNumber}` : null;
  const igHref = site.instagramHandle ? `https://instagram.com/${site.instagramHandle}` : null;

  return (
    <footer data-testid="site-footer" className="on-dark relative overflow-hidden bg-black text-white">
      {/* Cobalt rising from the base: the one place the footer carries colour. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(0deg,rgba(44,52,128,0.55),transparent)]" />

      <div className="page-pad relative pb-10 pt-24">
        <div className="flex items-center gap-5">
          <Logo className="h-14 w-14 md:h-20 md:w-20" />
          <p className="font-display text-5xl leading-none md:text-8xl">Nandini Vision</p>
        </div>
        <p className="mt-6 max-w-md font-display text-xl italic text-white/70">{site.headline}</p>

        <div className="mt-20 grid gap-12 border-t border-cobalt-light/40 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="mb-4 text-sm font-medium text-white/60">Explore</h2>
            <ul className="space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[15px] text-white/85 transition-colors hover:text-cobalt-light">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-medium text-white/60">Get in touch</h2>
            <ul className="space-y-3 text-[15px]">
              <li>
                <Link href="/consultation" className="text-white/85 transition-colors hover:text-cobalt-light">
                  Book a consultation
                </Link>
              </li>
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`} className="text-white/85 transition-colors hover:text-cobalt-light">
                    {site.email}
                  </a>
                </li>
              )}
              {whatsappHref && (
                <li>
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-white/85 transition-colors hover:text-cobalt-light">
                    WhatsApp
                  </a>
                </li>
              )}
              {igHref && (
                <li>
                  <a href={igHref} target="_blank" rel="noopener noreferrer" className="text-white/85 transition-colors hover:text-cobalt-light">
                    Instagram
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-medium text-white/60">Studio</h2>
            <p className="text-[15px] text-white/85">{site.location}</p>
            <p className="mt-3 text-[15px] text-white/85">Serving India and destinations worldwide.</p>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/60">
          <span>&copy; {new Date().getFullYear()} Nandini Vision</span>
          {SHOW_PLACEHOLDER_LABELS && <span>Imagery on this site is temporary placeholder content.</span>}
        </div>
      </div>
    </footer>
  );
}

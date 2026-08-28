"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation, studio } from "@/lib/content";

/**
 * Site header — integrates with the hero (transparent, light text) on the
 * homepage, then switches to bone + border after scrolling. Includes a
 * full-screen accessible mobile menu.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => setMenuOpen(false);

  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Lock body scroll + ESC close while the menu is open.
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("no-scroll");
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeMenu();
      };
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.classList.remove("no-scroll");
        window.removeEventListener("keydown", onKey);
      };
    }
  }, [menuOpen]);

  // Close the menu on route change and restore focus.
  useEffect(() => {
    if (menuOpen) {
      const raf = requestAnimationFrame(() => {
        closeMenu();
        toggleRef.current?.focus();
      });
      return () => cancelAnimationFrame(raf);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const solid = scrolled || !onHome || menuOpen;

  return (
    <>
      <header
        className={`site-header ${solid ? "site-header--solid" : "site-header--overlay"}`}
        data-testid="site-navigation"
      >
        <div className="container site-header__inner">
          <Link href="/" className="site-header__logo" aria-label={`${studio.name} — home`}>
            Nandini Vision
            <em>Photography</em>
          </Link>

          <nav className="site-header__nav" aria-label="Primary">
            {navigation
              .filter((item) => !item.cta)
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="site-header__menu-link"
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
          </nav>

          <Link href="/consultation" className="btn btn--sm site-header__cta">
            Book a Consultation
          </Link>

          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile / full-screen navigation */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        data-testid="mobile-navigation"
        aria-hidden={!menuOpen}
      >
        <div className="mobile-menu__top">
          <div className="container site-header__inner" style={{ height: "100%" }}>
            <span className="site-header__logo">
              Nandini Vision
              <em>Photography</em>
            </span>
            <button
              type="button"
              className="mobile-menu__close"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
          </div>
        </div>

        <nav className="mobile-menu__links" aria-label="Mobile">
          {navigation.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-menu__link"
              onClick={closeMenu}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
              <small aria-hidden="true">0{i + 1}</small>
            </Link>
          ))}
        </nav>

        <div className="mobile-menu__footer">
          <span>
            {studio.location} · {studio.serviceArea}
          </span>
          <a href={`tel:${studio.phone.replace(/\s/g, "")}`}>{studio.phoneDisplay}</a>
        </div>
      </div>
    </>
  );
}

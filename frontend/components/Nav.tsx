"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { nav } from "@/lib/data";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  // Close the menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // Menu behaviour: Escape closes, page scroll locks, focus moves in and returns to the toggle.
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      document.body.style.overflow = "hidden";
      closeRef.current?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
      };
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      toggleRef.current?.focus();
    }
  }, [open]);

  return (
    <>
      <header
        data-testid="site-header"
        className="on-dark sticky top-0 z-50 border-b border-white/10 bg-black text-white"
      >
        <div className="page-pad flex h-[var(--header-h)] items-center justify-between">
          <Link href="/" className="flex items-center gap-3" data-testid="logo" aria-label="Nandini Vision, home">
            <Logo />
            <span className="font-display text-lg tracking-[0.12em]">NANDINI VISION</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative py-2 text-[15px] transition-colors hover:text-cobalt-light ${
                    active ? "text-white" : "text-white/70"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-0.5 h-px bg-cobalt-light transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <Link href="/consultation" className="btn-cobalt hidden !min-h-[44px] !py-2 md:inline-flex">
            Book a consultation
          </Link>

          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 min-h-[48px] min-w-[48px] px-2 text-[15px] font-medium md:hidden"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            data-testid="mobile-menu-open"
          >
            Menu
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        data-testid="mobile-menu"
        className={`on-dark fixed inset-0 z-[60] flex flex-col justify-center bg-[image:var(--gradient-night)] px-8 text-white transition-[transform,visibility] duration-500 ease-[cubic-bezier(.76,0,.24,1)] ${
          open ? "visible translate-y-0" : "invisible -translate-y-full"
        }`}
      >
        <button
          ref={closeRef}
          type="button"
          className="absolute right-4 top-4 min-h-[48px] min-w-[48px] px-3 text-[15px] font-medium"
          onClick={() => setOpen(false)}
        >
          Close
        </button>
        <nav aria-label="Mobile">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="block border-b border-white/15 py-4 font-display text-4xl"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/consultation" className="btn-ghost-light mt-8 w-fit">
          Book a consultation
        </Link>
      </div>
    </>
  );
}

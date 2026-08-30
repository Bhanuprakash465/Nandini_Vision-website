"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { nav, site } from "@/lib/data";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        data-testid="site-header"
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "bg-bone/90 backdrop-blur-md py-4 border-b border-ink/10" : "py-6 border-b border-transparent"
        } px-6 md:px-12`}
      >
        <Link href="/" className="flex items-center gap-3" data-testid="logo">
          <Logo />
          <span className="font-display text-sm tracking-[0.18em]">NANDINI VISION</span>
        </Link>

        <nav className="hidden md:flex gap-9">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs uppercase tracking-[0.14em] relative group"
            >
              {item.label}
              <span className="absolute left-0 -bottom-1 h-px w-0 bg-maroon transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <Link
          href="/consultation"
          className="hidden md:inline-block border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.16em] font-semibold hover:bg-maroon hover:border-maroon hover:text-bone transition-colors duration-300"
        >
          Book a Consultation
        </Link>

        <button
          className="md:hidden text-[11px] tracking-[0.2em] font-semibold"
          onClick={() => setOpen(true)}
          data-testid="mobile-menu-open"
        >
          MENU
        </button>
      </header>

      <div
        data-testid="mobile-menu"
        className={`fixed inset-0 z-[60] bg-ink flex flex-col justify-center px-8 transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <button
          className="absolute top-6 right-6 text-bone text-[11px] tracking-[0.2em] font-semibold"
          onClick={() => setOpen(false)}
        >
          CLOSE
        </button>
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="font-display text-bone text-3xl py-3 border-b border-bone/10"
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/consultation"
          onClick={() => setOpen(false)}
          className="mt-6 border border-gold text-gold text-xs tracking-[0.16em] px-6 py-4 w-fit"
        >
          Book a Consultation
        </Link>
      </div>
    </>
  );
}

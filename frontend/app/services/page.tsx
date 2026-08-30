import type { Metadata } from "next";
import Link from "next/link";
import Placeholder from "@/components/Placeholder";
import Reveal from "@/components/Reveal";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description: "Wedding photography, cinematic films, drone coverage, portraits and more from Nandini Vision.",
};

export default function ServicesPage() {
  return (
    <section className="px-6 md:px-12 pt-36 pb-32">
      <h1 className="font-display text-5xl md:text-7xl font-medium mb-16">Services</h1>
      <div>
        {services.map((s, idx) => (
          <Reveal key={s.title} delay={idx * 40}>
            <Link
              href="/consultation"
              className="group flex items-center gap-6 py-8 border-t border-ink/10 last:border-b hover:bg-maroon/5 hover:pl-4 transition-all duration-500"
            >
              <span className="text-xs text-greige w-10">{String(idx + 1).padStart(2, "0")}</span>
              <div className="w-0 group-hover:w-28 h-20 overflow-hidden transition-all duration-500 flex-shrink-0">
                <Placeholder tone={idx % 3 === 0 ? "maroon" : idx % 3 === 1 ? "gold" : "bone"} className="h-full w-full" label="" />
              </div>
              <div className="flex-1 group-hover:ml-6 transition-all duration-500">
                <h3 className="font-display text-2xl md:text-4xl font-medium group-hover:text-maroon transition-colors duration-300">
                  {s.title}
                </h3>
                <p className="text-sm text-greige mt-1 max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {s.desc}
                </p>
              </div>
              <span className="text-xl text-greige group-hover:text-maroon group-hover:translate-x-2 transition-all duration-300">→</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

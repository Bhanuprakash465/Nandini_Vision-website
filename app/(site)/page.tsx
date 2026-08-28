import { Preloader } from "@/components/Preloader";
import { Hero } from "@/app/sections/Hero";
import { Showreel } from "@/app/sections/Showreel";
import { Philosophy } from "@/app/sections/Philosophy";
import { SelectedWork } from "@/app/sections/SelectedWork";
import { ServicesPreview } from "@/app/sections/ServicesPreview";
import { Testimonials } from "@/app/sections/Testimonials";
import { Collections } from "@/app/sections/Collections";
import { InstagramSection } from "@/app/sections/InstagramSection";
import { AvailabilityBand } from "@/app/sections/AvailabilityBand";
import { ConsultationCta } from "@/app/sections/ConsultationCta";

export default function Home() {
  return (
    <>
      <Preloader />
      <Hero />
      <Showreel />
      <Philosophy />
      <SelectedWork />
      <ServicesPreview />
      <Testimonials />
      <Collections />
      <InstagramSection />
      <AvailabilityBand />
      <ConsultationCta />
    </>
  );
}

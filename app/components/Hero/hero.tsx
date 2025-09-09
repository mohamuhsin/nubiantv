"use client";

import HeroSlider from "./hero-slider";
import HeroContent from "./hero-content";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[80vh] md:min-h-[90vh] lg:min-h-screen overflow-hidden">
      {/* Background slider shifted below navbar */}
      <div className="absolute inset-0 top-16">
        <HeroSlider />
      </div>

      {/* Overlay content with same offset */}
      <div className="relative pt-16">
        <HeroContent />
      </div>
    </section>
  );
}

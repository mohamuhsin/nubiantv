"use client";

import HeroSlider from "./hero-slider";
import HeroContent from "./hero-content";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[80vh] md:min-h-[90vh] lg:min-h-screen overflow-hidden">
      {/* Background slider */}
      <div className="absolute inset-0">
        <HeroSlider />
      </div>

      {/* Overlay content */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <HeroContent />
      </div>
    </section>
  );
}

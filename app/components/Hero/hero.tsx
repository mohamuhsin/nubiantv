"use client";

import HeroSlider from "./hero-slider";
import HeroContent from "./hero-content";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[80vh] md:min-h-[90vh] lg:min-h-screen overflow-hidden flex items-center justify-center">
      {/* Background slider */}
      <div className="absolute inset-0 w-full h-full">
        <HeroSlider />
      </div>

      {/* Overlay content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-6xl">
        <HeroContent />
      </div>
    </section>
  );
}

"use client";

import HeroSlider from "./hero-slider";
import HeroContent from "./hero-content";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] overflow-hidden pt-16">
      {/* Background slider */}
      <HeroSlider />

      {/* Overlay content */}
      <HeroContent />
    </section>
  );
}

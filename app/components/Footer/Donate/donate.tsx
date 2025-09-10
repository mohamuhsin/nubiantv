"use client";

import { DonateButton } from "../../Navbar/donate";

export default function SupportSection() {
  return (
    <section className="w-full py-12 sm:py-16 bg-gray-50 flex flex-col items-center">
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-gray-900 mb-6 sm:mb-6 px-2 sm:px-4 md:px-6 leading-snug">
        SUPPORT NUBIAN TV
      </h2>

      {/* Description */}
      <p className="text-center text-base sm:text-lg max-w-2xl mb-8 px-4 sm:px-0 text-gray-700">
        Nubian TV is the heartbeat of the global Nubian community. By supporting
        us, you help preserve our culture, share our stories, and empower our
        voices to reach the world. Every contribution brings us closer to a
        stronger, connected Nubian community.
      </p>

      {/* CTA Button */}
      <DonateButton />
    </section>
  );
}

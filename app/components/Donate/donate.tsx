"use client";

import { ReusableButton } from "../Navbar/donate";

export default function SupportSection() {
  return (
    <section className="w-full py-16 bg-gray-50 flex flex-col items-center px-4 sm:px-6 md:px-8">
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-gray-900 mb-6 leading-snug">
        SUPPORT NUBIAN TV
      </h2>

      {/* Description */}
      <p className="text-center text-base sm:text-lg md:text-xl max-w-4xl mb-8 text-gray-700 leading-relaxed">
        Support Nubian TV to preserve our culture, share our stories, and
        amplify our voices around the world.
      </p>

      {/* CTA Button */}
      <div className="mt-4">
        <ReusableButton text="DONATE NOW" href="#donate" target="_blank" />
      </div>
    </section>
  );
}

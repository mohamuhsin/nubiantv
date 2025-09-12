"use client";

import Image from "next/image";
import { ReusableButton } from "../Navbar/donate";

export default function PartnersSection() {
  const partners = [
    "/partners/devon.png",
    "/partners/nidat.png",
    "/partners/empathy.png",
    "/partners/shalila.png",
    "/partners/devonfoods.png",
    "/partners/rashmedia.png",
    "/partners/hanie.png",
  ];

  return (
    <section className="w-full py-16 bg-white flex flex-col items-center px-4 sm:px-6 md:px-8">
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-gray-900 mb-6">
        OUR PARTNERS
      </h2>

      {/* Description */}
      <p className="text-center text-base sm:text-lg max-w-3xl mb-12 text-gray-700">
        We are proud to collaborate with organizations that share our mission of
        connecting and empowering the Nubian community worldwide.
      </p>

      {/* Partner Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 w-full max-w-6xl justify-items-center mb-14">
        {partners.map((logo, idx) => (
          <div
            key={idx}
            className="bg-white shadow rounded-xl flex items-center justify-center aspect-square
                       hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            <Image
              src={logo}
              alt={`Partner ${idx + 1}`}
              width={800}
              height={800}
              className="object-contain w-4/5 h-4/5"
            />
          </div>
        ))}
      </div>

      {/* Become a Partner Button */}
      <ReusableButton
        text="BECOME A PARTNER"
        href="https://wa.me/256700755257"
        target="_blank"
      />
    </section>
  );
}

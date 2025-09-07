"use client";

import Link from "next/link";
import {
  FaRegHandshake,
  FaHandHoldingHeart,
  FaCalendarAlt,
  FaAward,
} from "react-icons/fa";

interface Card {
  title: string;
  icon: React.ComponentType<{ "aria-hidden"?: boolean }>;
  href: string; // add a link for navigation
}

const cards: Card[] = [
  { title: "Services", icon: FaRegHandshake, href: "/services" },
  { title: "Charity", icon: FaHandHoldingHeart, href: "/charity" },
  { title: "Events", icon: FaCalendarAlt, href: "/events" },
  { title: "Awards", icon: FaAward, href: "/awards" },
];

export default function NavCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-4 lg:gap-6 w-full justify-center">
      {cards.map(({ title, icon: Icon, href }) => (
        <Link
          key={title}
          href={href}
          className="flex flex-col items-center justify-center bg-white rounded-xl shadow-lg cursor-pointer aspect-square py-3 sm:py-4 md:py-3 px-3 sm:px-4 md:px-4 group transition-transform duration-300 hover:scale-105"
        >
          {/* Icon wrapper */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-18 md:h-18 lg:w-20 lg:h-20 mb-1 flex items-center justify-center">
            {/* Outer circle */}
            <div className="absolute inset-0 rounded-full border-4 sm:border-5 md:border-3 border-[#030268] flex items-center justify-center transition-colors duration-300 group-hover:border-[#ff7e1c]">
              {/* Inner circle */}
              <div className="w-3/4 h-3/4 rounded-full bg-[#030268] flex items-center justify-center text-white text-2xl sm:text-3xl md:text-2xl lg:text-3xl transition-colors duration-300 group-hover:bg-[#ff7e1c] group-hover:text-white">
                <Icon aria-hidden />
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-lg sm:text-xl md:text-lg lg:text-xl text-center text-black mt-0">
            {title}
          </h3>
        </Link>
      ))}
    </div>
  );
}

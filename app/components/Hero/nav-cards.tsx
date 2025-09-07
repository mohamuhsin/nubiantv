"use client";

import {
  FaRegHandshake,
  FaHandHoldingHeart,
  FaCalendarAlt,
  FaAward,
} from "react-icons/fa";

interface Card {
  title: string;
  icon: React.ComponentType<{ "aria-hidden"?: boolean }>;
}

const cards: Card[] = [
  { title: "Services", icon: FaRegHandshake },
  { title: "Charity", icon: FaHandHoldingHeart },
  { title: "Events", icon: FaCalendarAlt },
  { title: "Awards", icon: FaAward },
];

export default function NavCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-4 lg:gap-6 w-full justify-center">
      {cards.map(({ title, icon: Icon }) => (
        <div
          key={title}
          className="flex flex-col items-center justify-center bg-white rounded-xl shadow-lg cursor-pointer aspect-square py-3 sm:py-4 md:py-3 px-3 sm:px-4 md:px-4 group transition-transform duration-300 hover:scale-105"
        >
          {/* Icon wrapper */}
          <div className="relative w-16 h-16 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 mb-1 flex items-center justify-center">
            {/* Outer circle */}
            <div className="absolute inset-0 rounded-full border-3 border-[#12114a] flex items-center justify-center transition-colors duration-300 group-hover:border-[#ff7e1c]">
              {/* Inner circle */}
              <div className="w-3/4 h-3/4 rounded-full bg-[#12114a] flex items-center justify-center text-white text-xl sm:text-xl md:text-2xl lg:text-3xl transition-colors duration-300 group-hover:bg-[#ff7e1c] group-hover:text-white">
                <Icon aria-hidden />
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-lg sm:text-xl md:text-lg lg:text-xl text-center text-black mt-0">
            {title}
          </h3>
        </div>
      ))}
    </div>
  );
}

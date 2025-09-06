"use client";

import Link from "next/link";
import { JSX } from "react";

export function LiveButton(): JSX.Element {
  return (
    <Link
      href="https://www.youtube.com/@pearlfmnews8016/videos"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Watch Pearl FM live stream on YouTube"
      className="mx-4 my-2"
    >
      <button
        type="button"
        className="bg-[#ff7d1c] text-white py-2 px-5 rounded-lg text-xs md:text-sm lg:text-base font-extrabold
                   relative overflow-hidden flex justify-center items-center shrink-0
                   transition-colors duration-300 hover:bg-[#e06f19] focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
      >
        DONATE NOW
      </button>
    </Link>
  );
}

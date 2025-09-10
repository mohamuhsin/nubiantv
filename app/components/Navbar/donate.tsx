"use client";

import { Button } from "@headlessui/react";
import Link from "next/link";
import { JSX } from "react";

export function DonateButton(): JSX.Element {
  return (
    <Link
      href="#s"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Donate to Nubian TV"
      className="mx-4 my-2"
    >
      <Button
        as="button"
        type="button"
        className="bg-[#ff7d1c] text-white font-extrabold
                   py-3 px-6 text-base sm:text-base md:py-2 md:px-5 md:text-sm lg:py-2 lg:px-5 lg:text-base
                   rounded-lg
                   flex justify-center items-center shrink-0
                   transition-colors duration-300 hover:bg-[#e06f19]
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
      >
        DONATE NOW
      </Button>
    </Link>
  );
}

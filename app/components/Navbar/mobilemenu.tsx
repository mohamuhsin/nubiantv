/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { JSX } from "react";
import ContactInfo from "./contact";

interface MobileMenuProps {
  onClose?: () => void; // optional callback if needed in future
}

export default function MobileMenu({ onClose }: MobileMenuProps): JSX.Element {
  return (
    <aside
      aria-label="Mobile menu"
      className="fixed top-16 left-0 w-full bg-[#030268] text-white flex flex-col items-start md:items-center py-4 shadow-md md:hidden transition-transform duration-300 ease-in-out px-6 z-50"
    >
      <ContactInfo />
    </aside>
  );
}

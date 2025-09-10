"use client";

import { Button } from "@headlessui/react";
import Link from "next/link";
import { JSX, ReactNode } from "react";

interface ReusableButtonProps {
  text?: string;
  href?: string;
  target?: string;
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
}

export function ReusableButton({
  text = "Click Me",
  href = "#",
  target = "_self",
  className = "",
  onClick,
  children,
}: ReusableButtonProps): JSX.Element {
  const content = children || text;

  return (
    <Link
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      aria-label={text}
      className={className}
    >
      <Button
        as="button"
        type="button"
        onClick={onClick}
        className="bg-[#ff7d1c] text-white font-extrabold
                   py-3 px-6 text-base sm:text-base md:py-2 md:px-5 md:text-sm lg:py-2 lg:px-5 lg:text-base
                   rounded-lg
                   flex justify-center items-center shrink-0
                   transition-colors duration-300 hover:bg-[#e06f19]
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
      >
        {content}
      </Button>
    </Link>
  );
}

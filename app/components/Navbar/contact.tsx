"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaHome, FaTiktok } from "react-icons/fa";
import { LiveButton } from "./donate";
import { JSX } from "react";

// Define a type for contact items
interface Contact {
  href: string;
  icon: React.ComponentType<{ "aria-hidden"?: boolean }>;
  label: string;
  type: "internal" | "external";
}

// Array of contacts
const contacts: Contact[] = [
  { href: "/", icon: FaHome, label: "Home", type: "internal" },
  {
    href: "tel:+256700755257",
    icon: FaPhoneAlt,
    label: "+256 700 755 257",
    type: "external",
  },
  {
    href: "mailto:info@nubiantv.live",
    icon: FaEnvelope,
    label: "info@nubiantv.live",
    type: "external",
  },
  {
    href: "https://www.tiktok.com/@nubiantv",
    icon: FaTiktok,
    label: "Tiktok Account: Nubian Tv",
    type: "external",
  },
];

// Motion variants for animations
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.2, duration: 0.4, ease: "easeOut" },
  }),
};

export default function ContactInfo(): JSX.Element {
  return (
    <motion.nav
      aria-label="Contact Information"
      initial="hidden"
      animate="visible"
      className="flex flex-wrap md:flex-nowrap w-full items-center justify-between gap-y-4 md:gap-x-12 text-[10px] md:text-xs lg:text-sm px-6 py-4 min-w-0"
    >
      {/* Left side contacts */}
      <div className="flex flex-wrap md:flex-nowrap items-center gap-6 md:gap-8">
        {contacts.map(({ href, icon: Icon, label, type }, index) => {
          const commonClasses =
            "flex items-center gap-3 text-white hover:text-[#ff7e1c] transition duration-300";

          const iconWrapperClasses =
            "w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#030268] hover:bg-[#ff7e1c] hover:text-white transition duration-300 text-[16px]";

          return (
            <motion.div
              key={label}
              custom={index}
              variants={itemVariants}
              className="w-full md:w-auto shrink-0"
            >
              {type === "internal" ? (
                <Link
                  href={href}
                  aria-label={`Go to ${label}`}
                  className={commonClasses}
                >
                  <div className={iconWrapperClasses}>
                    <Icon aria-hidden />
                  </div>
                  <span className="text-[14px] md:text-xs lg:text-sm font-bold">
                    {label}
                  </span>
                </Link>
              ) : (
                <a
                  href={href}
                  className={commonClasses}
                  aria-label={`Call or email ${label}`}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                >
                  <div className={iconWrapperClasses}>
                    <Icon aria-hidden />
                  </div>
                  <span className="text-[14px] md:text-xs lg:text-sm font-bold">
                    {label}
                  </span>
                </a>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Right side button */}
      <motion.div
        custom={contacts.length}
        variants={itemVariants}
        className="shrink-0 mt-4 md:mt-0"
      >
        <LiveButton />
      </motion.div>
    </motion.nav>
  );
}

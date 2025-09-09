"use client";

import Link from "next/link";
import { FaFacebookF, FaTiktok, FaYoutube, FaInstagram } from "react-icons/fa6";

import SocialIcon from "./social-icon";
import { JSX } from "react/jsx-runtime";

interface QuickLink {
  href: string;
  label: string;
}

export default function Follow(): JSX.Element {
  const currentYear: number = new Date().getFullYear();

  const quickLinks: QuickLink[] = [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
  ];

  return (
    <section
      className="bg-gray-900 pt-16 pb-0 text-white"
      aria-labelledby="follow-section"
    >
      <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Let's Connect Section */}
        <div>
          <h2
            id="follow-section"
            className="text-[clamp(2rem,5vw,3rem)] font-extrabold leading-tight mb-6"
          >
            Let&apos;s Connect
          </h2>

          <div className="flex flex-wrap gap-6 sm:gap-8">
            <SocialIcon
              href="https://www.tiktok.com/@pearlfmradio?_t=ZM-8uNSv1MGmDV&_r=1"
              icon={<FaTiktok />}
              label="Follow on TikTok"
              color="hover:text-[#69C9D0]"
            />
            <SocialIcon
              href="https://www.facebook.com/share/14yxNZZ4ao/"
              icon={<FaFacebookF />}
              label="Follow on Facebook"
              color="hover:text-[#1877F2]"
            />

            <SocialIcon
              href="https://www.youtube.com/@pearlfmnews8016/videos"
              icon={<FaYoutube />}
              label="Subscribe on YouTube"
              color="hover:text-[#FF0000]"
            />
            <SocialIcon
              href="https://www.instagram.com/pearlfmuganda?igsh=ZzZzODg5d2NycmZr"
              icon={<FaInstagram />}
              label="Follow on Instagram"
              color="hover:text-[#E4405F]"
            />
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="text-left lg:text-right">
          <h2
            id="quick-links-section"
            className="text-[clamp(2rem,5vw,3rem)] font-extrabold leading-tight mb-6"
          >
            Quick Links
          </h2>

          <nav className="space-y-4">
            {quickLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block text-base sm:text-lg md:text-xl text-gray-400 hover:text-white transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-700 px-6 sm:px-10 lg:px-16">
        <div className="py-6 flex items-center justify-center text-center">
          <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
            © {currentYear} Nubian Tv Live. All rights reserved. | Site managed
            by{" "}
            <Link
              href="https://iventics.com"
              className="font-semibold hover:text-white hover:underline transition-colors"
            >
              Iventics Technologies
            </Link>
          </p>
        </div>
      </footer>
    </section>
  );
}

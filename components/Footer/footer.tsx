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
    { href: "/events", label: "Events" },
    { href: "/charity", label: "Charity" },
    { href: "/awards", label: "Awards" },
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
          <p className="text-gray-400 text-base sm:text-lg md:text-xl mb-10 max-w-prose">
            Nubian TV is a platform for the Nubian community worldwide,
            showcasing our heritage, empowering voices, and celebrating our
            identity.
          </p>
          <div className="flex flex-wrap gap-6 sm:gap-8">
            <SocialIcon
              href="https://www.tiktok.com/@nubiantv"
              icon={<FaTiktok />}
              label="Follow on TikTok"
              color="hover:text-[#69C9D0]"
            />
            <SocialIcon
              href="https://www.facebook.com/share/g/16xKa7PwTS/?mibextid=wwXIfr"
              icon={<FaFacebookF />}
              label="Follow on Facebook"
              color="hover:text-[#1877F2]"
            />

            <SocialIcon
              href="https://www.youtube.com/@akwine/videos"
              icon={<FaYoutube />}
              label="Subscribe on YouTube"
              color="hover:text-[#FF0000]"
            />
            <SocialIcon
              href="https://www.instagram.com/nubian_tv_asas_ta_nubi?igsh=MWw3YTExdGJ3NTRqeA%3D%3D&utm_source=qr"
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
            © {currentYear} Nubian Tv. All rights reserved. App by{" "}
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

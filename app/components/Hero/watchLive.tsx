"use client";

import Image from "next/image";
import Link from "next/link";

export default function WatchLiveButton() {
  return (
    <div className="hidden sm:flex w-2/5 items-center justify-center">
      <Link
        href="https://www.youtube.com/@akwine"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Watch nubian Tv on YouTube"
        className="relative"
      >
        {/* Watch Live Image */}
        <Image
          src="/watch-live.png"
          alt="Watch Live"
          width={400}
          height={400}
          className="rounded-full shadow-lg"
          priority
        />

        {/* Circular Pulse Wave Effects */}
        <span
          className="absolute inset-0 rounded-full animate-pulse-wave"
          aria-hidden="true"
        />
        <span
          className="absolute inset-0 rounded-full animate-pulse-wave delay-1000"
          aria-hidden="true"
        />
        <span
          className="absolute inset-0 rounded-full animate-pulse-wave delay-2000"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}

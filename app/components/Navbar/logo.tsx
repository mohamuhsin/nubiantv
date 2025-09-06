"use client";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <div className="h-16 flex items-center justify-center px-2 sm:px-4">
      <Link href="/" className="block">
        <Image
          src="/nubiantv.png"
          alt="NubianTV Logo"
          width={150}
          height={80}
          priority
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 120px"
          className="w-auto h-auto max-h-12 md:max-h-14 lg:max-h-16 object-contain"
        />
      </Link>
    </div>
  );
}

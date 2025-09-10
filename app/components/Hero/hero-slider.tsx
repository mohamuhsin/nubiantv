"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Image from "next/image";

const slides = [
  { src: "/bg/nubian.jpeg", alt: "", title: "" },
  { src: "/bg/nubiantv00.jpeg", alt: "", title: "" },
  { src: "/bg/nubiantv001.jpeg", alt: "", title: "" },
  { src: "/bg/nubiantv002.jpeg", alt: "", title: "" },
];

export default function heroSlider() {
  return (
    <Swiper
      modules={[Autoplay, EffectFade]}
      slidesPerView={1}
      loop
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      effect="fade"
      speed={1000}
      className="w-full h-[90vh] sm:h-[100vh] md:h-[125vh] lg:h-[125vh]"
      aria-label="Hero image slider"
      role="region"
    >
      {slides.map(({ src, alt, title }, index) => (
        <SwiperSlide key={index}>
          <div className="relative w-full h-full">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/60 pointer-events-none" />
            {title && (
              <div
                className="absolute bottom-10 left-10 text-white text-2xl font-semibold drop-shadow-lg"
                aria-live="polite"
              >
                {title}
              </div>
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

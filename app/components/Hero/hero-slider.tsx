"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const slides = [
  "/images/slide1.jpg",
  "/images/slide2.jpg",
  "/images/slide3.jpg",
];

export default function HeroSlider() {
  return (
    <div className="absolute inset-0">
      <Swiper loop autoplay className="h-full w-full">
        {slides.map((src, idx) => (
          <SwiperSlide key={idx}>
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${src})` }}
            >
              {/* dark overlay */}
              <div className="absolute inset-0 bg-black/50" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

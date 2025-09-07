"use client";

import NavCards from "./nav-cards";
// import YoutubePreview from "./youtube-preview";

export default function HeroContent() {
  return (
    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-center h-full text-white px-2 sm:px-4 md:px-6 pt-20 md:pt-24 lg:pt-28 max-w-6xl mx-auto">
      {/* Left section: Heading + Nav Cards */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left md:w-[60%] gap-6">
        {/* Heading */}
        <h1 className="whitespace-nowrap text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-extrabold leading-snug md:leading-tight text-white overflow-x-auto">
          Nubian TV, Asas Ta Nubi.
        </h1>

        {/* Navigation Cards */}
        <div className="mt-6 w-full">
          <NavCards />
        </div>
      </div>

      {/* Right section: YouTube preview */}
      <div className="mt-8 md:mt-0 md:w-[40%] flex justify-center">
        {/* <YoutubePreview /> */}
      </div>
    </div>
  );
}

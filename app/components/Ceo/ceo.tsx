"use client";

import YouTube from "react-youtube";

export default function CEOMessage() {
  return (
    <section className="w-full py-12 sm:py-16 bg-gray-50 flex flex-col items-center">
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-gray-900 mb-6 sm:mb-10 px-4 sm:px-0 leading-snug">
        A Word from Our CEO
      </h2>

      {/* Video Wrapper */}
      <div className="w-full px-4 sm:px-0 flex justify-center">
        <div
          className="relative w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-5xl"
          style={{ paddingTop: "56.25%" }}
        >
          <YouTube
            videoId="uQFHa8NiQaU"
            className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0,
              },
            }}
          />
        </div>
      </div>
    </section>
  );
}

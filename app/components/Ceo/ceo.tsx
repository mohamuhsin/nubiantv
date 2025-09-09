"use client";

import YouTube from "react-youtube";

export default function CEOMessage() {
  return (
    <section className="w-full py-12 sm:py-16 bg-gray-50 flex flex-col items-center">
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-gray-900 mb-14 sm:mb-14 px-2 sm:px-4 md:px-6 leading-snug">
        MESSAGE FROM OUR CEO
      </h2>

      {/* Video Wrapper */}
      <div className="w-full px-2 sm:px-4 md:px-6 flex justify-center">
        {/* Parent container has the aspect ratio */}
        <div className="relative w-full max-w-6xl rounded-xl shadow-lg overflow-hidden bg-gray-50 pt-[75%] sm:pt-[56.25%] lg:pt-[45%]">
          <YouTube
            videoId="3NuU1mse1aM"
            className="absolute top-0 left-0 w-full h-full rounded-xl"
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

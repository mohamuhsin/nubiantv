"use client";

interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function Heading({ title, description }: PageHeaderProps) {
  return (
    <header className="relative bg-gradient-to-br from-[#101727] to-[#101727] text-white min-h-[300px] sm:min-h-[350px] md:min-h-[400px] flex items-center justify-center px-4 overflow-hidden shadow-xl">
      {/* Bigger Modern Dot + Grid Pattern */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMinYMin meet"
      >
        <defs>
          <pattern
            id="dotsGrid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="5" cy="5" r="2" fill="rgba(255,255,255,0.05)" />
            <circle cx="40" cy="40" r="2" fill="rgba(255,255,255,0.05)" />
            <line
              x1="0"
              y1="0"
              x2="80"
              y2="0"
              stroke="rgba(255,255,255,0.02)"
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="80"
              stroke="rgba(255,255,255,0.02)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotsGrid)" />
      </svg>

      {/* Soft Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent)] pointer-events-none" />

      {/* Title Content */}
      <div className="relative z-10 text-center max-w-full sm:max-w-3xl md:max-w-4xl px-2 sm:px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-snug sm:leading-tight md:leading-tight lg:leading-tight tracking-tight drop-shadow-lg break-words">
          {title}
        </h1>
        {description && (
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-white/70 max-w-full sm:max-w-xl mx-auto break-words">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}

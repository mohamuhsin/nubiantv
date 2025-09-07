"use client";

export default function YoutubePreview() {
  return (
    <div className="bg-white/10 rounded-xl p-6 backdrop-blur-md">
      <h2 className="text-xl font-bold mb-4">Watch Live</h2>
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          className="w-full h-full rounded-lg"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="Nubian TV YouTube Live"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function SkeletonCard() {
  return (
    <Card className="flex flex-col w-full max-w-sm mx-auto rounded-xl shadow-md bg-white overflow-hidden relative">
      {/* Image Skeleton */}
      <div className="relative w-full aspect-[16/9] bg-gray-200 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
      </div>

      {/* Card Content Skeleton */}
      <CardContent className="flex flex-col gap-2 px-4 pt-4 pb-4 flex-1">
        {/* Title Skeleton */}
        <div className="h-6 sm:h-7 md:h-8 w-3/4 mx-auto bg-gray-200 relative overflow-hidden rounded-md">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
        </div>

        {/* Vote Button Skeleton */}
        <div className="h-10 sm:h-11 w-full bg-gray-200 relative overflow-hidden rounded-lg mt-2">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
        </div>

        {/* See Results Button Skeleton */}
        <div className="h-10 sm:h-11 w-full bg-gray-200 relative overflow-hidden rounded-lg mt-2">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
        </div>
      </CardContent>
    </Card>
  );
}

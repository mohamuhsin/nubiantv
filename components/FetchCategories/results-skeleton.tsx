"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ResultsListSkeletonProps {
  rows?: number;
}

export default function ResultsListSkeleton({
  rows = 4,
}: ResultsListSkeletonProps) {
  const Row = ({ w1, w2 }: { w1: string; w2: string }) => (
    <div className="flex justify-between items-center px-4 py-2 rounded-sm">
      <Skeleton className={`h-4 ${w1} rounded-md`} />
      <Skeleton className={`h-4 ${w2} rounded-md`} />
    </div>
  );

  return (
    <Card className="flex flex-col w-full rounded-xl shadow-md overflow-hidden">
      {/* Header Row Skeleton */}
      <Row w1="w-3/5" w2="w-1/5" />

      {/* Data Rows */}
      <CardContent className="flex flex-col gap-2 px-0 py-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Row key={i} w1="w-3/5" w2="w-1/5" />
        ))}
      </CardContent>
    </Card>
  );
}

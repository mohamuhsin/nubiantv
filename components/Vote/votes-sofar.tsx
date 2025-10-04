"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface VoteResponse {
  totalVotes: number;
  uniqueVoters: number;
  votesToday: number;
}

async function fetchVotes(): Promise<VoteResponse> {
  const res = await fetch("/api/votes");
  if (!res.ok) throw new Error("Failed to fetch votes");
  return res.json();
}

function StatCard({
  title,
  value,
  description,
  isLoading,
}: {
  title: string;
  value?: number;
  description: string;
  isLoading?: boolean;
}) {
  return (
    <Card className="flex flex-col w-full max-w-sm mx-auto rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-900 overflow-hidden">
      <CardContent className="flex flex-col gap-2 px-4 pt-4 pb-4 flex-1 items-center text-center">
        <h3 className="font-bold text-gray-900 text-lg sm:text-lg md:text-xl leading-snug">
          {title}
        </h3>
        {isLoading ? (
          <>
            <Skeleton className="h-7 w-24 mt-2" />
            <Skeleton className="h-4 w-20 mt-1" />
          </>
        ) : (
          <>
            <p
              className="text-2xl font-bold text-[#ff7d1d] mt-2"
              aria-label={`${title} Count`}
            >
              {value?.toLocaleString("en-US")}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function VotesSoFar() {
  const { data, isLoading, isError } = useQuery<VoteResponse>({
    queryKey: ["votes"],
    queryFn: fetchVotes,
    refetchInterval: 5000,
    staleTime: 10_000,
  });

  return (
    <section
      aria-labelledby="votes-heading"
      className="w-full px-4 sm:px-6 lg:px-8"
    >
      <h2 id="votes-heading" className="sr-only">
        Voting statistics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isError ? (
          <Card className="flex flex-col w-full max-w-sm mx-auto rounded-xl shadow-md bg-white dark:bg-gray-900 overflow-hidden">
            <CardContent className="px-4 pt-4 pb-4 text-center">
              <p className="text-red-500 font-medium">
                ❌ Failed to load votes
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <StatCard
              title="Total Votes"
              value={data?.totalVotes}
              description="All votes cast"
              isLoading={isLoading}
            />
            <StatCard
              title="People Voted"
              value={data?.uniqueVoters}
              description="Unique voters so far"
              isLoading={isLoading}
            />
            <StatCard
              title="Votes Today"
              value={data?.votesToday}
              description="Votes in the last 24h"
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </section>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface VoteResponse {
  totalVotes: number;
  uniqueVoters: number;
}

async function fetchVotes(): Promise<VoteResponse> {
  const res = await fetch("/api/votes");
  if (!res.ok) throw new Error("Failed to fetch votes");
  return res.json();
}

export default function VotesSoFar() {
  const { data, isLoading, isError } = useQuery<VoteResponse>({
    queryKey: ["votes"],
    queryFn: fetchVotes,
    refetchInterval: 5000,
    staleTime: 10_000,
  });

  const Heading = (
    <h2 className="text-center font-bold text-[20px] leading-[28px] mb-8 text-[oklch(0.21_0.034_264.665)]">
      Voting Statistics
    </h2>
  );

  if (isLoading) {
    return (
      <section className="py-14 px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-6">
          {Heading}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Card
                key={i}
                className="border border-[#ff7d1d]/40 min-h-[100px]"
              >
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="py-14 px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-6">
          {Heading}
          <p className="text-red-500 text-center">❌ Failed to load votes</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 w-full">
      <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-6">
        {Heading}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
          <Card className="border border-[#ff7d1d]/40 hover:border-[#ff7d1d] transition-colors duration-300 min-h-[100px]">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Total Votes
              </p>
              <p
                className="text-2xl font-bold text-[#ff7d1d]"
                aria-label="Total Votes Count"
              >
                {data.totalVotes}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                All votes cast
              </p>
            </CardContent>
          </Card>
          <Card className="border border-[#ff7d1d]/40 hover:border-[#ff7d1d] transition-colors duration-300 min-h-[100px]">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                People Voted
              </p>
              <p
                className="text-2xl font-bold text-[#ff7d1d]"
                aria-label="Unique Voters Count"
              >
                {data.uniqueVoters}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Unique voters so far
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

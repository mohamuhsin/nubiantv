"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface VoteResponse {
  totalVotes: number;
  uniqueVoters: number;
  votesToday: number;
  timezone?: string;
}

// ✅ Fetch function
async function fetchVotes(): Promise<VoteResponse> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const res = await fetch(
    `/api/votes?timezone=${encodeURIComponent(timezone)}`
  );
  if (!res.ok) throw new Error("Failed to fetch votes summary");
  return res.json();
}

// ✅ Helper to format large numbers
const formatNumber = (num?: number) => {
  if (!num) return "0";
  return num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();
};

// ✅ Card component
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
    <Card className="flex flex-col w-full max-w-sm mx-auto rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 overflow-hidden">
      <CardContent className="flex flex-col gap-2 px-4 py-6 flex-1 items-center text-center">
        <h3 className="font-bold text-gray-900 dark:text-gray-50 text-lg sm:text-lg md:text-xl">
          {title}
        </h3>

        {isLoading ? (
          <>
            <Skeleton className="h-7 w-24 mt-2" />
            <Skeleton className="h-4 w-20 mt-1" />
          </>
        ) : (
          <>
            <p className="text-3xl font-extrabold text-[#ff7d1d] mt-1">
              {formatNumber(value)}
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

// ✅ Main component
export default function VotesSoFar() {
  const { data, isLoading, isError } = useQuery<VoteResponse>({
    queryKey: ["votes-summary"],
    queryFn: fetchVotes,
    refetchInterval: 5000,
    staleTime: 10_000,
  });

  return (
    <section
      aria-labelledby="votes-heading"
      className="w-full py-10 px-4 sm:px-6 lg:px-8"
    >
      <h2 id="votes-heading" className="sr-only">
        Voting statistics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {isError ? (
          <Card className="w-full max-w-sm rounded-xl shadow-md bg-white dark:bg-gray-900">
            <CardContent className="px-4 py-6 text-center">
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
              value={0} // intentionally 0
              description={`Since 12:00 AM (${data?.timezone || "Local"})`}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </section>
  );
}

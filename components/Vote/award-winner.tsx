"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface Award {
  category: string;
  winner: string;
  votes?: number;
}

interface AwardWinnersCardProps {
  title?: string;
  data?: Award[];
  isLoading?: boolean;
}

export default function AwardWinnersCard({
  title = "Award Winners",
  data,
  isLoading,
}: AwardWinnersCardProps) {
  // ✅ Sort by votes descending
  const sortedData = data
    ?.slice()
    .sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));

  // ✅ Format numbers (1,200 → 1.2K)
  const formatVotes = (votes?: number) => {
    if (!votes) return "0";
    return votes >= 1000 ? `${(votes / 1000).toFixed(1)}K` : votes.toString();
  };

  return (
    <section
      aria-labelledby="award-winners-heading"
      className="w-full py-10 px-4 sm:px-6 lg:px-8" // ✅ identical to VotesSoFar padding
    >
      <Card className="w-full max-w-6xl mx-auto rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-900 overflow-hidden animate-fadeIn">
        {/* Header */}
        <CardHeader className="border-b border-gray-200 dark:border-gray-800 px-6 sm:px-8 py-4">
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-50 text-center tracking-tight uppercase">
            {title}
          </CardTitle>
        </CardHeader>

        {/* Content */}
        <CardContent className="py-6 px-2 sm:px-4 md:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-5 w-1/2 mx-auto" />
              <Skeleton className="h-5 w-2/3 mx-auto" />
              <Skeleton className="h-5 w-1/3 mx-auto" />
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div
                className="overflow-x-auto hidden sm:block"
                aria-label="Award winners table"
              >
                <Table className="min-w-full border-collapse border border-gray-100 dark:border-gray-800">
                  <TableHeader className="bg-gray-50 dark:bg-gray-800/60">
                    <TableRow>
                      <TableHead className="text-left font-semibold tracking-wide text-gray-700 dark:text-gray-300 uppercase text-xs sm:text-sm">
                        Award Category
                      </TableHead>
                      <TableHead className="text-left font-semibold tracking-wide text-gray-700 dark:text-gray-300 uppercase text-xs sm:text-sm">
                        Award Winner
                      </TableHead>
                      <TableHead className="text-right font-semibold tracking-wide text-gray-700 dark:text-gray-300 uppercase text-xs sm:text-sm">
                        Votes
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {sortedData && sortedData.length > 0 ? (
                      sortedData.map((award, index) => (
                        <TableRow
                          key={index}
                          className={`transition-colors ${
                            index % 2 === 0
                              ? "bg-gray-50 dark:bg-gray-800/30"
                              : "bg-white dark:bg-gray-900"
                          } hover:bg-gray-100 dark:hover:bg-gray-800`}
                        >
                          <TableCell className="text-gray-900 dark:text-gray-50 font-medium">
                            {award.category}
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-300">
                            {award.winner}
                          </TableCell>
                          <TableCell className="text-right text-[#ff7d1d] font-semibold">
                            {formatVotes(award.votes)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-gray-500 dark:text-gray-400 py-6"
                        >
                          No awards found yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="block sm:hidden space-y-4">
                {sortedData && sortedData.length > 0 ? (
                  sortedData.map((award, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-100 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                        {award.category}
                      </p>
                      <p className="text-base font-medium text-gray-900 dark:text-gray-50">
                        {award.winner}
                      </p>
                      <p className="text-right text-[#ff7d1d] font-semibold mt-2">
                        {formatVotes(award.votes)} votes
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No awards found yet.
                  </p>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

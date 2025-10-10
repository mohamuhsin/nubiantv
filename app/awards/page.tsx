"use client";

import Heading from "@/components/Heading/heading";
import Categories from "@/components/FetchCategories/categories";
import VotesSoFar from "@/components/Vote/votes-sofar";
import AwardWinnersCard from "@/components/Vote/award-winner";

export default function AwardsPage() {
  const winners = [
    {
      category: "Most Viral Nubian Tiktoker Award",
      winner: "Waslat Shubra",
      votes: 808,
    },
    {
      category: "Best Nubian Property Master Award",
      winner: "Kakande Properties",
      votes: 642,
    },
    {
      category: "Best Nubian Tiktok Influencer Award",
      winner: "Aisha Amar",
      votes: 523,
    },
    {
      category: "Best Nubian Event Award",
      winner: "Nubian Festival",
      votes: 351,
    },
    {
      category: "Best Nubian Song Award",
      winner: "Mama – Mad Fire",
      votes: 305,
    },
    {
      category: "Best Nubian Restaurant Award",
      winner: "Devon Foods",
      votes: 305,
    },
    { category: "Best Nubian Artist Award", winner: "Ramos Yusuf", votes: 269 },
    {
      category: "Best Nubian Cultural Group Award",
      winner: "Sister Club",
      votes: 181,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <Heading
        title="Nubian TV Awards"
        description="Celebrating excellence and creativity in our community."
      />

      <main className="flex-grow w-full">
        {/* 🏆 Award Winners */}
        <section
          aria-labelledby="winners-heading"
          className="py-14 px-4 sm:px-6 lg:px-8 w-full bg-white dark:bg-gray-900"
        >
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2
              id="winners-heading"
              className="font-extrabold text-[24px] sm:text-[28px] md:text-[32px] leading-tight text-[oklch(0.21_0.034_264.665)]"
            >
              NUBIAN TV AWARDS 2025 WINNERS
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Meet the champions who made it to the top.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <AwardWinnersCard data={winners} />
          </div>
        </section>

        {/* 📊 Voting Statistics */}
        <section
          aria-labelledby="stats-heading"
          className="py-14 px-4 sm:px-6 lg:px-8 w-full bg-gray-50 dark:bg-gray-800"
        >
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2
              id="stats-heading"
              className="font-extrabold text-[24px] sm:text-[28px] md:text-[32px] leading-tight mb-3 text-[oklch(0.21_0.034_264.665)]"
            >
              VOTING STATISTICS
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Real-time overview of the votes received so far.
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <VotesSoFar />
          </div>
        </section>

        {/* 🗳️ Category Vote Results Section */}
        <section
          aria-labelledby="categories-heading"
          className="py-14 px-4 sm:px-6 lg:px-8 w-full space-y-12 bg-white dark:bg-gray-900"
        >
          <div className="text-center max-w-2xl mx-auto">
            <h2
              id="categories-heading"
              className="font-extrabold text-[24px] sm:text-[28px] md:text-[32px] leading-tight text-[oklch(0.21_0.034_264.665)]"
            >
              CATEGORY VOTE RESULTS
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
              View the final voting results by category.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Categories />
          </div>
        </section>
      </main>
    </div>
  );
}

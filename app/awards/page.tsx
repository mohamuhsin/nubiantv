"use client";

import Heading from "@/components/Heading/heading";
import Categories from "@/components/FetchCategories/categories";
import { AwardNotice } from "@/components/AwardsNotice/awards-notice";
import VotesSoFar from "@/components/Vote/votes-sofar";

export default function AwardsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Announcement Banner */}
      <AwardNotice />

      {/* Top Navigation */}
      <header className="py-6">{/* <Navbar /> */}</header>

      {/* Hero Section */}
      <Heading
        title="Nubian TV Awards"
        description="Celebrating excellence in our community."
      />

      {/* Main Content */}
      <main className="flex-grow w-full">
        {/* Categories Section */}
        <section
          aria-labelledby="categories-heading"
          className="py-14 px-4 sm:px-6 lg:px-8 w-full space-y-12"
        >
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto">
            <h2
              id="categories-heading"
              className="
              font-extrabold
              text-[24px] sm:text-[28px] md:text-[32px]
              leading-[32px] sm:leading-[36px] md:leading-[40px]
              text-[oklch(0.21_0.034_264.665)]
            "
            >
              Vote by Category
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Explore the award categories and cast your vote.
            </p>
          </div>

          {/* Categories List */}
          <div className="max-w-6xl mx-auto">
            <Categories />
          </div>
        </section>

        {/* Voting Statistics Section */}
        <section
          aria-labelledby="stats-heading"
          className="py-14 px-4 sm:px-6 lg:px-8 w-full bg-gray-50 dark:bg-gray-800"
        >
          <div className="text-center max-w-2xl mx-auto">
            <h2
              id="stats-heading"
              className="
              text-center font-extrabold
              text-[24px] sm:text-[28px] md:text-[32px]
              leading-[32px] sm:leading-[36px] md:leading-[40px]
              mb-8
              text-[oklch(0.21_0.034_264.665)]
            "
            >
              Voting Statistics
            </h2>
          </div>

          <div className="max-w-6xl mx-auto">
            <VotesSoFar />
          </div>
        </section>
      </main>
    </div>
  );
}

{
  /* <h1 className="text-3xl font-bold mb-4">We’re Under Maintenance</h1>
        <p className="text-muted-foreground max-w-md">
          We’re currently performing some updates to improve your experience.
          Please check back soon.
        </p> */
}

// {
//   /* Categories Section */
// }
// <section
//   aria-labelledby="categories-heading"
//   className="py-14 px-4 sm:px-6 lg:px-8 w-full space-y-12"
// >
//   {/* Section Heading */}
//   <div className="text-center max-w-2xl mx-auto">
//     <h2
//       id="categories-heading"
//       className="
//               font-extrabold
//               text-[24px] sm:text-[28px] md:text-[32px]
//               leading-[32px] sm:leading-[36px] md:leading-[40px]
//               text-[oklch(0.21_0.034_264.665)]
//             "
//     >
//       Vote by Category
//     </h2>
//     <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
//       Explore the award categories and cast your vote.
//     </p>
//   </div>

//   {/* Categories List */}
//   <div className="max-w-6xl mx-auto">
//     <Categories />
//   </div>
// </section>;

// {
//   /* Voting Statistics Section */
// }
// <section
//   aria-labelledby="stats-heading"
//   className="py-14 px-4 sm:px-6 lg:px-8 w-full bg-gray-50 dark:bg-gray-800"
// >
//   <div className="text-center max-w-2xl mx-auto">
//     <h2
//       id="stats-heading"
//       className="
//               text-center font-extrabold
//               text-[24px] sm:text-[28px] md:text-[32px]
//               leading-[32px] sm:leading-[36px] md:leading-[40px]
//               mb-8
//               text-[oklch(0.21_0.034_264.665)]
//             "
//     >
//       Voting Statistics
//     </h2>
//   </div>

//   <div className="max-w-6xl mx-auto">
//     <VotesSoFar />
//   </div>
// </section>;

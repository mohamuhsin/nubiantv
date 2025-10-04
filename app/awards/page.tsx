"use client";

import { useState } from "react";
import Heading from "@/components/Heading/heading";
import { CategorySearch } from "@/components/Filter/cat-filter";
import Categories from "@/components/FetchCategories/categories";
import { AwardNotice } from "@/components/AwardsNotice/awards-notice";
import VotesSoFar from "@/components/Vote/votes-sofar";

export default function AwardsPage() {
  const [searchQuery, setSearchQuery] = useState("");

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
        <section className="py-14 px-4 sm:px-6 lg:px-8 w-full space-y-12">
          {/* Search Component */}
          <div className="w-full">
            <CategorySearch value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* Categories List */}
          <Categories searchQuery={searchQuery} />

          {/* ✅ Votes Section */}
          <VotesSoFar />
        </section>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import Heading from "@/components/Heading/heading";
import { CategorySearch } from "@/components/Filter/cat-filter";

export default function AwardsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="py-6">{/* <Navbar /> */}</header>

      {/* Hero Section */}
      <Heading
        title="Nubian TV Awards"
        description="Celebrating excellence in our community."
      />

      {/* Main Content */}
      <main className="flex-grow w-full">
        <section className="py-14 px-4 sm:px-6 lg:px-8 w-full">
          {/* Search Component */}
          <div className="mb-10 w-full">
            <CategorySearch value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* Later: Cards / Categories list */}
        </section>
      </main>
    </div>
  );
}

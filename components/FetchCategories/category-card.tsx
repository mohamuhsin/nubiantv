"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ResultsList from "./result-list";
import VoteModal from "../Vote/vote-modal"; // <-- use the wrapper here

interface Nominee {
  _id: string;
  name: string;
  voteCount?: number;
}

interface Category {
  _id: string;
  name: string;
  image: string;
  nominees: Nominee[];
}

interface CategoryCardProps {
  category: Category;
  index: number;
  loadingResults: boolean;
  isOpen: boolean;
  onToggle: (index: number, categoryId: string | null) => void;
}

export default function CategoryCard({
  category,
  index,
  loadingResults,
  isOpen,
  onToggle,
}: CategoryCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Card className="flex flex-col w-full max-w-sm mx-auto rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-white overflow-hidden">
      <div className="relative w-full aspect-[16/9] bg-gray-100 flex items-center justify-center overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          width={1080}
          height={1080}
          className="object-contain"
        />
      </div>

      <CardContent className="flex flex-col gap-2 px-4 pt-4 pb-4 flex-1">
        <h3 className="text-center font-bold text-gray-900 text-lg sm:text-lg md:text-xl leading-snug break-words overflow-hidden h-14 sm:h-16">
          {category.name}
        </h3>

        {/* Use the wrapper VoteModal instead of VotingModal */}
        <Button
          style={{ backgroundColor: "#ff7d1d" }}
          className="w-full py-2 font-semibold text-white hover:bg-[#e66c00] transition-all duration-300 rounded-lg text-sm sm:text-base md:text-base"
          onClick={() => setModalOpen(true)}
        >
          Vote Now
        </Button>

        <VoteModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          category={category}
        />

        <div className="mt-2">
          <button
            onClick={() => onToggle(index, isOpen ? null : category._id)}
            className="w-full flex justify-between items-center px-4 py-2 rounded-lg bg-transparent border border-gray-300 hover:border-[#ff7d1d] hover:text-[#ff7d1d] text-gray-800 font-medium text-sm sm:text-base transition-colors duration-200"
          >
            {loadingResults ? (
              <span className="flex items-center gap-2 text-[#ff7d1d]">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#ff7d1d"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="#ff7d1d"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              "View Results"
            )}

            <svg
              className={`w-5 h-5 ml-2 transition-transform duration-300 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="mt-2 px-0 border-t-0 border-b-0">
              <ResultsList
                nominees={category.nominees}
                loading={loadingResults}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

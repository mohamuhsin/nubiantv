"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import ResultsList from "./result-list";

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
  onToggle: (index: number, categoryId: string) => void;
}

export default function CategoryCard({
  category,
  index,
  loadingResults,
  isOpen,
  onToggle,
}: CategoryCardProps) {
  return (
    <Card className="flex flex-col w-full max-w-sm mx-auto rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-white overflow-hidden">
      {/* Image Section */}
      <div className="relative w-full aspect-[16/9] bg-gray-100 flex items-center justify-center overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          width={1080}
          height={1080}
          className="object-contain"
        />
      </div>

      {/* Card Content */}
      <CardContent className="flex flex-col gap-2 px-4 pt-4 pb-4 flex-1">
        {/* Title */}
        <div className="h-14 sm:h-16">
          <h3 className="text-center font-bold text-gray-900 text-base sm:text-lg md:text-xl leading-snug break-words overflow-hidden">
            {category.name}
          </h3>
        </div>

        {/* Vote Button */}
        <Button
          style={{ backgroundColor: "#ff7d1d" }}
          className="w-full py-2 font-semibold text-white hover:bg-[#e66c00] transition-all duration-300 rounded-lg text-sm sm:text-base md:text-base"
        >
          Vote Now
        </Button>

        {/* Accordion */}
        <Accordion
          type="single"
          collapsible
          value={isOpen ? category._id : undefined}
          onValueChange={(val) => {
            if (val === undefined) {
              onToggle(index, "close"); // signal close
            } else {
              onToggle(index, category._id);
            }
          }}
          className="mt-2"
        >
          <AccordionItem value={category._id} className="border-b-0">
            <AccordionTrigger className="w-full flex justify-between items-center px-4 py-2 rounded-lg bg-transparent border border-gray-300 hover:border-[#ff7d1d] hover:text-[#ff7d1d] text-gray-800 font-medium text-sm sm:text-base transition-colors duration-200 no-underline">
              {loadingResults ? "Loading..." : "See Results"}
              <span
                className={`transition-transform duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </AccordionTrigger>
            <AccordionContent className="mt-2 px-0 border-t-0 border-b-0">
              <ResultsList
                nominees={category.nominees}
                loading={loadingResults}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

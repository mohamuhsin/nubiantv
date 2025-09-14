"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";

interface CategorySearchProps {
  value: string;
  onChange: (val: string) => void;
}

export function CategorySearch({ value, onChange }: CategorySearchProps) {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* Heading */}
      <Label
        htmlFor="category-search"
        className="mb-2 block text-center text-sm sm:text-base lg:text-lg font-medium text-muted-foreground"
      >
        Search Award Categories
      </Label>

      {/* Input container */}
      <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
        {/* Search Icon */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

        {/* Input */}
        <Input
          id="category-search"
          placeholder="Type to search..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-12 py-3 rounded-md border border-input bg-background 
                     text-base lg:text-lg shadow-sm hover:shadow-md transition 
                     focus:border-[#ff7d1d] focus:ring-2 focus:ring-[#ff7d1d]"
        />

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 
                       p-2 text-muted-foreground hover:text-destructive transition"
          >
            <X className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>
        )}
      </div>
    </div>
  );
}

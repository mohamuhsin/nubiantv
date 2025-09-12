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
    <div className="w-full px-4 sm:px-6 lg:px-8">
      {/* Responsive Label */}
      <Label
        htmlFor="category-search"
        className="block text-sm lg:text-base font-medium mb-2 text-muted-foreground text-center lg:text-left"
      >
        Search Awards Categories
      </Label>

      {/* Input container */}
      <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto lg:mx-0">
        {/* Search Icon */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

        {/* Input */}
        <Input
          id="category-search"
          placeholder="Type to search..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full 
            pl-10 pr-12 py-3 
            rounded-md 
            border border-input 
            bg-background 
            focus:ring-2 focus:ring-primary 
            text-base lg:text-lg 
            shadow-sm hover:shadow-md 
            transition
          "
        />

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="
              absolute right-3 top-1/2 -translate-y-1/2 
              p-2 text-muted-foreground 
              hover:text-destructive 
              transition
            "
          >
            <X className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>
        )}
      </div>
    </div>
  );
}

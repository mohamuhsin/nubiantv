"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SkeletonCard from "./skeleton-card";
import CategoryCard from "./category-card";
import ErrorFallback from "./error-fallback";

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

interface CategoriesProps {
  searchQuery?: string;
}

// Fetch categories from API
const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

export default function Categories({ searchQuery = "" }: CategoriesProps) {
  const queryClient = useQueryClient();
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const {
    data: categories,
    error,
    isLoading,
  } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const handleToggleResults = useCallback(
    async (index: number, categoryId: string) => {
      if (!categories) return;

      // Close if already open
      if (openIndex === index) {
        setOpenIndex(null);
        return;
      }

      setLoadingIndex(index);

      try {
        const res = await fetch(`/api/categories/${categoryId}`);
        if (!res.ok) throw new Error("Failed to fetch category results");
        const data: Category = await res.json();

        queryClient.setQueryData<Category[]>(["categories"], (old) =>
          old?.map((cat, i) =>
            i === index ? { ...cat, nominees: data.nominees } : cat
          )
        );

        setOpenIndex(index);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingIndex(null);
      }
    },
    [categories, openIndex, queryClient]
  );

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  if (error) {
    return (
      <ErrorFallback
        error={error}
        resetErrorBoundary={() =>
          queryClient.invalidateQueries({ queryKey: ["categories"] })
        }
      />
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {isLoading
        ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
        : filteredCategories.map((cat, index) => (
            <div key={cat._id} className="w-full max-w-sm mx-auto">
              <CategoryCard
                category={cat}
                index={index}
                onToggle={handleToggleResults}
                loadingResults={loadingIndex === index}
                isOpen={openIndex === index}
              />
            </div>
          ))}
    </section>
  );
}

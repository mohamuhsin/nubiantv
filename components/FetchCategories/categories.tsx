"use client";

import { useState, useMemo } from "react";
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
  nominees?: Nominee[];
}

interface CategoriesProps {
  searchQuery?: string;
}

// Fetch categories list (without nominees)
const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

// Fetch detailed category (with nominees + votes)
const fetchCategoryResults = async (categoryId: string): Promise<Category> => {
  const res = await fetch(`/api/categories/${categoryId}`);
  if (!res.ok) throw new Error(`Failed to fetch category ${categoryId}`);
  return res.json();
};

export default function Categories({ searchQuery = "" }: CategoriesProps) {
  const queryClient = useQueryClient();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const {
    data: categories,
    error,
    isLoading,
  } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });

  const handleToggleResults = async (
    index: number,
    categoryId: string | null
  ) => {
    if (!categories) return;

    // Close instantly
    if (openIndex === index || categoryId === null) {
      setOpenIndex(null);
      return;
    }

    // Open instantly
    setOpenIndex(index);
    setLoadingIndex(index);

    try {
      const data = await fetchCategoryResults(categoryId);

      if (data) {
        queryClient.setQueryData<Category[]>(["categories"], (old) =>
          old?.map((cat, i) =>
            i === index ? { ...cat, nominees: data.nominees || [] } : cat
          )
        );
      } else {
        queryClient.setQueryData<Category[]>(["categories"], (old) =>
          old?.map((cat, i) => (i === index ? { ...cat, nominees: [] } : cat))
        );
      }
    } catch (err) {
      console.error(err);
      queryClient.setQueryData<Category[]>(["categories"], (old) =>
        old?.map((cat, i) => (i === index ? { ...cat, nominees: [] } : cat))
      );
    } finally {
      setLoadingIndex(null);
    }
  };

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
                category={{ ...cat, nominees: cat.nominees || [] }}
                index={index}
                onToggle={handleToggleResults}
                isOpen={openIndex === index}
                loadingResults={loadingIndex === index}
              />
            </div>
          ))}
    </section>
  );
}

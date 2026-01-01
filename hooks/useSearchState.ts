import { useState } from "react";

export interface SearchFilters {
  query: string;
  location: string;
  isFeatured: boolean;
  sortBy: string;
  currentPage: number;
  totalPages: number;
  totalResults: number;
}

export interface SearchResult {
  _id: string;
  slug: string;
  name: string;
  description: string;
  images: Array<{ url: string; altText?: string }>;
  category?: { name: string; slug: string };
  subCategory?: { name: string; slug: string };
  listingLocation?: { city: string };
  features?: string[];
  price: {
    currentPrice: number;
    discountedPrice?: number;
  };
  isFeatured?: boolean;
}

export const useSearchState = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const resetSearch = () => {
    setCurrentPage(1);
    setSearchResults([]);
    setTotalResults(0);
    setTotalPages(1);
    setHasSearched(false);
  };

  const updateFilters = (updates: Partial<SearchFilters>) => {
    setCurrentPage(1); // Reset to first page when filters change
    if (updates.query !== undefined) setSearchQuery(updates.query);
    if (updates.location !== undefined) setLocation(updates.location);
    if (updates.isFeatured !== undefined) setIsFeatured(updates.isFeatured);
    if (updates.sortBy !== undefined) setSortBy(updates.sortBy);
  };

  return {
    // State
    searchQuery,
    location,
    isFeatured,
    sortBy,
    currentPage,
    totalPages,
    totalResults,
    isSearchLoading,
    searchResults,
    hasSearched,

    // Setters
    setSearchQuery,
    setLocation,
    setIsFeatured,
    setSortBy,
    setCurrentPage,
    setTotalPages,
    setTotalResults,
    setIsSearchLoading,
    setSearchResults,
    setHasSearched,

    // Helpers
    resetSearch,
    updateFilters,
  };
};

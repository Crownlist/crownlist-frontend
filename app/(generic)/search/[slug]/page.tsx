/* eslint-disable */
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header1";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import { useSearchState } from "@/hooks/useSearchState";
import { useSearchFunctionality } from "@/hooks/useSearchFunctionality";
import {
  SearchBar,
  SearchFilters,
  SearchResults,
  SearchPagination,
} from "@/components/Search";

export default function SearchPage() {
  const { slug: searchSlug } = useParams();

  // Custom hooks
  const searchState = useSearchState();
  const {
    searchQuery,
    isFeatured,
    sortBy,
    currentPage,
    totalPages,
    totalResults,
    isSearchLoading,
    searchResults,
    hasSearched,
    setSearchQuery,
    setCurrentPage,
    resetSearch,
  } = searchState;

  const {
    performAdvancedSearch,
    handleSearch,
    handleFilterChange,
    handlePageChange,
  } = useSearchFunctionality({
    searchQuery,
    isFeatured,
    sortBy,
    currentPage,
    setSearchResults: searchState.setSearchResults,
    setTotalResults: searchState.setTotalResults,
    setTotalPages: searchState.setTotalPages,
    setIsSearchLoading: searchState.setIsSearchLoading,
    setHasSearched: searchState.setHasSearched,
    setIsFeatured: searchState.setIsFeatured,
    setSortBy: searchState.setSortBy,
  });

  // Initialize search on mount - prefill search input
  useEffect(() => {
    if (searchSlug && !hasSearched) {
      const decodedQuery = decodeURIComponent(searchSlug as string);
      setSearchQuery(decodedQuery);
      performAdvancedSearch(decodedQuery, 1, false, "newest");
    }
  }, [searchSlug]);

  const handleClearFilters = () => {
    resetSearch();
    setSearchQuery("");
  };

  // Show search results interface when loading OR when search has completed
  if (isSearchLoading || hasSearched) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header hidden={false} />

        {/* Mobile Sticky Search and Filters */}
        <div className="sticky top-0 z-40 bg-white border-b shadow-sm md:hidden">
          <div className="container mx-auto px-4 py-3">
            <SearchBar
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onSearch={handleSearch}
              isMobile
            />

            <SearchFilters
              isFeatured={isFeatured}
              sortBy={sortBy}
              onFilterChange={handleFilterChange}
              isMobile
            />

            {totalResults > 0 && (
              <div className="text-xs text-gray-500 mt-2">
                {totalResults} results found
              </div>
            )}
          </div>
        </div>

        {/* Desktop Search and Filters */}
        <div className="hidden md:block bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex gap-4 items-center">
              <SearchBar
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                onSearch={handleSearch}
              />

              <SearchFilters
                isFeatured={isFeatured}
                sortBy={sortBy}
                onFilterChange={handleFilterChange}
              />
            </div>

            <div className="text-sm text-gray-600 mt-2">
              {isSearchLoading
                ? "Searching..."
                : `${totalResults} results found`}
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="container mx-auto py-6 px-4 md:px-0">
          <SearchResults
            searchResults={searchResults}
            isSearchLoading={isSearchLoading}
            onClearFilters={handleClearFilters}
          />

          {/* Only show pagination when not loading and there are results */}
          {!isSearchLoading && totalPages > 1 && (
            <SearchPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        <Footer />
      </div>
    );
  }

  // No products found - show request form
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header hidden={false} />
      <div className="container mx-auto py-6 max-md:px-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
          <ChevronRight size={16} />
          <span className="text-gray-700">Search</span>
        </div>

        {/* No Results Message */}
        <div className="flex flex-row gap-0 mb-6">
          <p className="font-semibold">Search results -{searchSlug}</p>
          <p className="font-light">(0 results found)</p>
        </div>

        {/* Request Form */}
        <div className="bg-white shadow rounded-lg overflow-hidden w-full">
          <div className="flex flex-col md:flex-row w-full justify-between">
            <div className="p-6 md:w-1/2">
              <h2 className="text-xl font-medium mb-2">
                Request product/services
              </h2>
              <p className="text-gray-500 mb-6">
                If you can't find the product you're looking for, please enter
                the product or service details below.
              </p>
              {/* Request form would go here - simplified for now */}
              <div className="text-center text-gray-500 py-8">
                Request form component would be here
              </div>
            </div>
            <div className="w-full h-auto relative md:w-1/2 p-6 max-sm:hidden bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500">Product image placeholder</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

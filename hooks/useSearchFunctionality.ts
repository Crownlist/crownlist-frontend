import { useRouter } from "next/navigation";
import { apiClientPublic } from "@/lib/interceptor";
import { SearchResult } from "./useSearchState";

interface SearchApiResponse {
  products: SearchResult[];
  total?: number;
  [key: string]: unknown;
}

interface UseSearchFunctionalityProps {
  searchQuery: string;
  isFeatured: boolean;
  sortBy: string;
  currentPage: number;
  setSearchResults: (results: SearchResult[]) => void;
  setTotalResults: (total: number) => void;
  setTotalPages: (pages: number) => void;
  setIsSearchLoading: (loading: boolean) => void;
  setHasSearched: (searched: boolean) => void;
  setIsFeatured: (featured: boolean) => void;
  setSortBy: (sort: string) => void;
}

export const useSearchFunctionality = ({
  searchQuery,
  isFeatured,
  sortBy,
  currentPage,
  setSearchResults,
  setTotalResults,
  setTotalPages,
  setIsSearchLoading,
  setHasSearched,
  setIsFeatured,
  setSortBy,
}: UseSearchFunctionalityProps) => {
  const router = useRouter();

  const performAdvancedSearch = async (
    query: string = searchQuery,
    page: number = currentPage,
    featured: boolean = isFeatured,
    sort: string = sortBy
  ) => {
    try {
      setIsSearchLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      if (query.trim()) params.append("q", query.trim());
      params.append("limit", "12");
      params.append("page", page.toString());
      if (featured) params.append("isFeatured", "true");
      if (sort && sort !== "newest") params.append("sortBy", sort);

      const res = await apiClientPublic.get(
        `/products/search?${params.toString()}`
      );
      const responseData = res.data as SearchApiResponse;

      if (responseData.products && responseData.products.length > 0) {
        setSearchResults(responseData.products);
        setTotalResults(responseData.total || responseData.products.length);
        setTotalPages(
          Math.ceil((responseData.total || responseData.products.length) / 12)
        );
      } else {
        setSearchResults([]);
        setTotalResults(0);
        setTotalPages(1);
      }

      // Only set hasSearched to true after successful completion
      setHasSearched(true);
    } catch (e: unknown) {
      const error = e as { message?: string };
      console.log(`Failed to search products: ${String(error?.message || e)}`);
      setSearchResults([]);
      setTotalResults(0);
      setTotalPages(1);
      // Don't set hasSearched to true on error - keep it false
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to new search term route
      const newUrl = `/search/${encodeURIComponent(searchQuery.trim())}`;
      router.push(newUrl);
    }
  };

  const handleFilterChange = (
    filterType: "featured" | "sort",
    value: boolean | string
  ) => {
    // Update state first
    if (filterType === "featured") {
      setIsFeatured(value as boolean);
    } else if (filterType === "sort") {
      setSortBy(value as string);
    }

    // Then perform search with updated values
    performAdvancedSearch(
      searchQuery,
      1, // Reset to first page
      filterType === "featured" ? (value as boolean) : isFeatured,
      filterType === "sort" ? (value as string) : sortBy
    );
  };

  const handlePageChange = (page: number) => {
    performAdvancedSearch(searchQuery, page, isFeatured, sortBy);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    performAdvancedSearch,
    handleSearch,
    handleFilterChange,
    handlePageChange,
  };
};

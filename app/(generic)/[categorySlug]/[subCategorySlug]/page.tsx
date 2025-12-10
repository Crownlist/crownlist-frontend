"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header1";
import Footer from "@/components/Footer";
import { EmptyState } from "@/components/EmptyState";
import {
  Breadcrumb,
  PageHeader,
  FiltersSidebar,
  MobileFilters,
  ProductGrid,
  ProductList,
  Pagination,
  LoadingSkeleton,
  ErrorState,
} from "@/components/Subcategory";
import { useSubcategoryProductsQuery } from "@/hooks/useSubcategoryProducts";

interface SubcategoryPageProps {
  params: Promise<{ categorySlug: string; subCategorySlug: string }>;
}

export default function SubcategoryPage({ params }: SubcategoryPageProps) {
  const [categorySlug, setCategorySlug] = useState<string>("");
  const [subCategorySlug, setSubCategorySlug] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState("newest");

  // Filters state
  const [isFeatured, setIsFeatured] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedFilters, setExpandedFilters] = useState<{
    [key: string]: boolean;
  }>({
    location: false,
    price: false,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sliderValues, setSliderValues] = useState<number[]>([0, 1000000]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Initialize params
  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setCategorySlug(resolvedParams.categorySlug);
      setSubCategorySlug(resolvedParams.subCategorySlug);
    };
    fetchParams();
  }, [params]);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setIsFiltering(true);
  }, [
    isFeatured,
    sortOption,
    selectedLocation,
    priceRange.min,
    priceRange.max,
  ]);

  // Use the React Query hook for data fetching
  const {
    data: productsData,
    isLoading: loading,
    isError,
    error,
    refetch: refetchProducts,
  } = useSubcategoryProductsQuery(subCategorySlug, {
    page: currentPage,
    sortBy: sortOption,
    isFeatured,
    minPrice: priceRange.min ? parseInt(priceRange.min) : undefined,
    maxPrice: priceRange.max ? parseInt(priceRange.max) : undefined,
    location: selectedLocation || undefined,
  });

  // Reset filtering state when loading completes
  useEffect(() => {
    if (!loading) {
      setIsFiltering(false);
      // When we've finished the first fetch for a real subcategory, stop the initial loading state
      if (subCategorySlug) {
        setInitialLoading(false);
      }
    }
  }, [loading, subCategorySlug]);

  // Helper functions
  const toggleFilter = (filter: string) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleSortOptionSelect = (option: string) => {
    // Map display options to API sort parameters
    const sortMapping: { [key: string]: string } = {
      All: "",
      "Price: Low to High": "price-asc",
      "Price: High to Low": "price-desc",
      Rating: "rating",
      Likes: "likes",
      Trending: "trending",
      Newest: "newest",
      Oldest: "oldest",
      "Name: A to Z": "name-asc",
      "Name: Z to A": "name-desc",
      Promoted: "promoted",
    };
    setSortOption(sortMapping[option] || "");
    setSortDropdownOpen(false);
  };

  const toggleLocation = (location: string) => {
    setSelectedLocation(selectedLocation === location ? "" : location);
  };

  const handleSliderChange = (values: number[]) => {
    setSliderValues(values);
    setPriceRange({
      min: values[0].toString(),
      max: values[1].toString(),
    });
  };

  const retryFetch = () => {
    refetchProducts();
  };

  const products = productsData?.products || [];
  const totalProducts = productsData?.totalProducts || 0;
  const totalPages = productsData?.totalPages || 1;
  const sortOptionsDisplay = [
    "All",
    "Price: Low to High",
    "Price: High to Low",
    "Rating",
    "Likes",
    "Trending",
    "Newest",
    "Oldest",
    "Name: A to Z",
    "Name: Z to A",
    "Promoted",
  ];

  // Helper to get display text from sort value
  const getSortDisplayText = (sortValue: string) => {
    const displayMapping: { [key: string]: string } = {
      "": "All",
      "price-asc": "Price: Low to High",
      "price-desc": "Price: High to Low",
      rating: "Rating",
      likes: "Likes",
      trending: "Trending",
      newest: "Newest",
      oldest: "Oldest",
      "name-asc": "Name: A to Z",
      "name-desc": "Name: Z to A",
      promoted: "Promoted",
    };
    return displayMapping[sortValue] || "All";
  };

  const formatTitle = (slug: string) =>
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const subcategoryTitle = formatTitle(subCategorySlug);
  const locations = [
    "Lagos",
    "Abuja",
    "Port Harcourt",
    "Kano",
    "Ibadan",
    "Enugu",
  ];

  const filteredLocations = locations.filter((location) =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // Initial loading state with skeleton
  if ((loading || initialLoading) && !isFiltering) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header hidden={false} />
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <LoadingSkeleton viewMode={viewMode} />
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header hidden={false} />
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Breadcrumb
            categorySlug={categorySlug}
            subcategorySlug={subCategorySlug}
          />
          <ErrorState error={error} onRetry={retryFetch} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header hidden={false} />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumb
          categorySlug={categorySlug}
          subcategorySlug={subCategorySlug}
        />

        <PageHeader
          subcategoryTitle={subcategoryTitle}
          totalProducts={totalProducts}
          showMobileFilters={showMobileFilters}
          setShowMobileFilters={setShowMobileFilters}
          isFeatured={isFeatured}
          setIsFeatured={setIsFeatured}
          sortOption={sortOption}
          sortDropdownOpen={sortDropdownOpen}
          setSortDropdownOpen={setSortDropdownOpen}
          sortOptionsDisplay={sortOptionsDisplay}
          getSortDisplayText={getSortDisplayText}
          handleSortOptionSelect={handleSortOptionSelect}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <MobileFilters
          showMobileFilters={showMobileFilters}
          setShowMobileFilters={setShowMobileFilters}
          expandedFilters={expandedFilters}
          toggleFilter={toggleFilter}
          locationSearch={locationSearch}
          setLocationSearch={setLocationSearch}
          filteredLocations={filteredLocations}
          selectedLocation={selectedLocation}
          toggleLocation={toggleLocation}
          sliderValues={sliderValues}
          handleSliderChange={handleSliderChange}
        />

        <div className="flex flex-col md:flex-row gap-8">
          <FiltersSidebar
            expandedFilters={expandedFilters}
            toggleFilter={toggleFilter}
            locationSearch={locationSearch}
            setLocationSearch={setLocationSearch}
            selectedLocation={selectedLocation}
            toggleLocation={toggleLocation}
            sliderValues={sliderValues}
            handleSliderChange={handleSliderChange}
            filteredLocations={filteredLocations}
          />

          {/* Products Grid/List */}
          <div className="flex-1">
            {isFiltering ? (
              <LoadingSkeleton viewMode={viewMode} />
            ) : products.length === 0 ? (
              <EmptyState
                categorySlug={categorySlug}
                subcategorySlug={subCategorySlug}
              />
            ) : (
              <>
                {viewMode === "grid" ? (
                  <ProductGrid products={products} />
                ) : (
                  <ProductList products={products} />
                )}

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />

                {/* Results Count */}
                <div className="flex justify-end items-center mt-4 text-sm text-gray-500">
                  <span>
                    Showing {products.length} of {totalProducts}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

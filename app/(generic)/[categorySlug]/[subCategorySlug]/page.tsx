"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Heart,
  MapPin,
  ArrowLeft,
  ArrowRight,
  List,
  LayoutGrid,
  Check,
  Search,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Header from "@/components/Header1";
import Footer from "@/components/Footer";
import { apiClientPublic } from "@/lib/interceptor";
import { Product } from "@/types/product/product";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";

interface SubcategoryPageProps {
  params: Promise<{ categorySlug: string; subCategorySlug: string }>;
}

export default function SubcategoryPage({ params }: SubcategoryPageProps) {
  const [categorySlug, setCategorySlug] = useState<string>("");
  const [subCategorySlug, setSubCategorySlug] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState("All");
  const [isFeatured, setIsFeatured] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedFilters, setExpandedFilters] = useState<{ [key: string]: boolean }>({
    location: false,
    price: false,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const itemsPerPage = 12;

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setCategorySlug(resolvedParams.categorySlug);
      setSubCategorySlug(resolvedParams.subCategorySlug);
    };
    fetchParams();
  }, [params]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = isFeatured
        ? `?slug=${subCategorySlug}&isFeatured=true`
        : `?slug=${subCategorySlug}`;

      const response = await apiClientPublic.get(`/products${queryParams}`);
      const data = response.data?.data?.products || [];
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [subCategorySlug, isFeatured]);

  useEffect(() => {
    if (subCategorySlug) {
      fetchProducts();
    }
  }, [subCategorySlug, isFeatured, fetchProducts]);

  const retryFetch = () => {
    fetchProducts();
  };

  const toggleFilter = (filter: string) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const toggleLocation = (location: string) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations((prev) => prev.filter((l) => l !== location));
    } else {
      setSelectedLocations((prev) => [...prev, location]);
    }
  };

  const handleSortOptionSelect = (option: string) => {
    setSortOption(option);
    setSortDropdownOpen(false);
  };

  const filteredProducts = products.filter((product) => {
    // Location filter
    if (selectedLocations.length > 0) {
      const productLocation = `${product.listingLocation?.city}, ${product.listingLocation?.country}`;
      if (!selectedLocations.some(loc => productLocation.toLowerCase().includes(loc.toLowerCase()))) {
        return false;
      }
    }

    // Price filter
    if (priceRange.min && product.price?.currentPrice < parseInt(priceRange.min)) {
      return false;
    }
    if (priceRange.max && product.price?.currentPrice > parseInt(priceRange.max)) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "Lowest price":
        return (a.price?.currentPrice || 0) - (b.price?.currentPrice || 0);
      case "Highest price":
        return (b.price?.currentPrice || 0) - (a.price?.currentPrice || 0);
      case "Newest first":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatTitle = (slug: string) =>
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const categoryTitle = formatTitle(categorySlug);
  const subcategoryTitle = formatTitle(subCategorySlug);

  const sortOptions = ["All", "Newest first", "Lowest price", "Highest price"];
  const locations = ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Enugu"];

  const filteredLocations = locations.filter((location) =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // Loading state with skeleton
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header hidden={false} />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
            <ChevronRight size={16} />
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            <ChevronRight size={16} />
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Header skeleton */}
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex items-center gap-4">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters sidebar skeleton */}
            <div className="w-full md:w-[220px] shrink-0 space-y-4">
              <div className="border-b pb-4">
                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-2">
                  <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Products grid skeleton */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header hidden={false} />
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700">
              Home
            </Link>
            <ChevronRight size={16} />
            <Link href={`/${categorySlug}`} className="hover:text-gray-700">
              {categoryTitle}
            </Link>
            <ChevronRight size={16} />
            <span className="text-gray-700">{subcategoryTitle}</span>
          </div>

          {/* Error message */}
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center max-w-md">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Something went wrong
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                onClick={retryFetch}
                className="bg-[#1F058F] hover:bg-[#2a0bc0] text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header hidden={false} />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
          <ChevronRight size={16} />
          <Link href={`/${categorySlug}`} className="hover:text-gray-700">
            {categoryTitle}
          </Link>
          <ChevronRight size={16} />
          <span className="text-gray-700">{subcategoryTitle}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-[13px] sm:text-lg font-medium">
            {subcategoryTitle}
            <span className="text-gray-500"> ({sortedProducts.length} results found)</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {/* Mobile Filter Toggle */}
            <button
              className="md:hidden flex items-center gap-1 text-sm border rounded px-3 py-1"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <Search size={16} />
              Filters
            </button>

            {/* Featured Filter */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="featured" className="text-sm">
                Featured only
              </label>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-[13px] max-sm:text-sm relative">
              <span className="text-gray-500 hidden sm:inline">Sort by:</span>
              <button
                className="font-medium flex items-center gap-1"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              >
                {sortOption}
                <ChevronDown size={14} className="ml-1" />
              </button>

              {sortDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white shadow-md rounded-md z-10 w-36 py-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        option === sortOption ? "bg-gray-50" : ""
                      }`}
                      onClick={() => handleSortOptionSelect(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1">
              <button
                className={`p-1 rounded ${viewMode === "grid" ? "bg-gray-100" : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                className={`p-1 rounded ${viewMode === "list" ? "bg-gray-100" : ""}`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Filters */}
        {showMobileFilters && (
          <div className="md:hidden bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {/* Location Filter */}
              <div className="border-b pb-4">
                <button
                  className="flex items-center justify-between w-full text-left mb-4"
                  onClick={() => toggleFilter("location")}
                >
                  <span className="font-medium">Location</span>
                  {expandedFilters.location ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {expandedFilters.location && (
                  <div className="space-y-3">
                    <div className="flex rounded-full overflow-hidden border border-gray-300">
                      <div className="flex-1 flex items-center pl-3">
                        <Search size={14} className="text-gray-400 mr-2" />
                        <input
                          type="text"
                          placeholder="Search"
                          className="w-full py-1.5 text-sm focus:outline-none"
                          value={locationSearch}
                          onChange={(e) => setLocationSearch(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2">
                      {filteredLocations.map((location) => (
                        <div key={location} className="flex items-center gap-2">
                          <div
                            className={`h-4 w-4 rounded flex items-center justify-center ${
                              selectedLocations.includes(location) ? "bg-green-500 text-white" : "border border-gray-300"
                            }`}
                            onClick={() => toggleLocation(location)}
                          >
                            {selectedLocations.includes(location) && <Check size={12} />}
                          </div>
                          <label
                            className="text-sm cursor-pointer"
                            onClick={() => toggleLocation(location)}
                          >
                            {location}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="border-b pb-4">
                <button
                  className="flex items-center justify-between w-full text-left mb-4"
                  onClick={() => toggleFilter("price")}
                >
                  <span className="font-medium">Price</span>
                  {expandedFilters.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {expandedFilters.price && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-sm text-gray-500 mb-1 block">Min</label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded p-2 text-sm"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        />
                      </div>
                      <div className="pt-6">→</div>
                      <div className="flex-1">
                        <label className="text-sm text-gray-500 mb-1 block">Max</label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded p-2 text-sm"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-[220px] md:h-[150px] shrink-0">
            <div className="space-y-4">
              {/* Location Filter */}
              <div className="border-b pb-4">
                <button
                  className="flex items-center justify-between w-full text-left mb-4"
                  onClick={() => toggleFilter("location")}
                >
                  <span className="font-medium">Location</span>
                  {expandedFilters.location ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {expandedFilters.location && (
                  <div className="space-y-3">
                    <div className="flex rounded-full overflow-hidden border border-gray-300">
                      <div className="flex-1 flex items-center pl-3">
                        <Search size={14} className="text-gray-400 mr-2" />
                        <input
                          type="text"
                          placeholder="Search"
                          className="w-full py-1.5 text-sm focus:outline-none"
                          value={locationSearch}
                          onChange={(e) => setLocationSearch(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2">
                      {filteredLocations.map((location) => (
                        <div key={location} className="flex items-center gap-2">
                          <div
                            className={`h-4 w-4 rounded flex items-center justify-center ${
                              selectedLocations.includes(location) ? "bg-green-500 text-white" : "border border-gray-300"
                            }`}
                            onClick={() => toggleLocation(location)}
                          >
                            {selectedLocations.includes(location) && <Check size={12} />}
                          </div>
                          <label
                            className="text-sm cursor-pointer"
                            onClick={() => toggleLocation(location)}
                          >
                            {location}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="border-b pb-4">
                <button
                  className="flex items-center justify-between w-full text-left mb-4"
                  onClick={() => toggleFilter("price")}
                >
                  <span className="font-medium">Price</span>
                  {expandedFilters.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {expandedFilters.price && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-sm text-gray-500 mb-1 block">Min</label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded p-2 text-sm"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        />
                      </div>
                      <div className="pt-6">→</div>
                      <div className="flex-1">
                        <label className="text-sm text-gray-500 mb-1 block">Max</label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded p-2 text-sm"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            {paginatedProducts.length === 0 ? (
              <EmptyState categorySlug={categorySlug} subcategorySlug={subCategorySlug} />
            ) : (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedProducts.map((product) => (
                      <div key={product._id} className="border rounded-lg overflow-hidden">
                        <Link href={`/product/${product.slug}`}>
                          <div className="relative h-[200px]">
                            <Image
                              src={product.images?.[0]?.url || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                            <button className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md">
                              <Heart size={18} className="text-gray-600" />
                            </button>
                            {product.isFeatured && (
                              <div className="absolute top-3 left-3 bg-yellow-400 text-black px-2 py-1 text-xs font-medium rounded">
                                Featured
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {product.description}
                            </p>

                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex items-center gap-1 text-gray-500 text-sm">
                                <MapPin size={14} />
                                <span>
                                  {product.listingLocation?.city}, {product.listingLocation?.country}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2 mb-3">
                              {product.facility?.facilities?.slice(0, 2).map((facility, index) => (
                                <div
                                  key={index}
                                  className="text-xs bg-gray-100 px-2 py-1 rounded"
                                >
                                  {facility.label}: {facility.value}
                                </div>
                              ))}
                            </div>

                            <div className="font-medium">
                              ₦{product.price?.currentPrice?.toLocaleString()}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {paginatedProducts.map((product) => (
                      <div key={product._id} className="border rounded-lg overflow-hidden flex flex-col md:flex-row">
                        <div className="relative h-[200px] md:h-auto md:w-[300px] flex-shrink-0">
                          <Image
                            src={product.images?.[0]?.url || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                          <button className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md">
                            <Heart size={18} className="text-gray-600" />
                          </button>
                          {product.isFeatured && (
                            <div className="absolute top-3 left-3 bg-yellow-400 text-black px-2 py-1 text-xs font-medium rounded">
                              Featured
                            </div>
                          )}
                        </div>

                        <div className="p-4 flex-1">
                          <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                          <p className="text-gray-600 text-sm mb-3">{product.description}</p>

                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                              <MapPin size={14} />
                              <span>
                                {product.listingLocation?.city}, {product.listingLocation?.country}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 mb-3">
                            {product.facility?.facilities?.map((facility, index) => (
                              <div
                                key={index}
                                className="text-xs bg-gray-100 px-2 py-1 rounded"
                              >
                                {facility.label}: {facility.value}
                              </div>
                            ))}
                          </div>

                          <div className="font-medium">
                            ₦{product.price?.currentPrice?.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-8">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 text-sm disabled:opacity-50"
                    >
                      <ArrowLeft size={14} /> Previous
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-8 h-8 rounded-md text-sm ${
                            currentPage === i + 1 ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 text-sm disabled:opacity-50"
                    >
                      Next <ArrowRight size={14} />
                    </button>
                  </div>
                )}

                {/* Results Count */}
                <div className="flex justify-end items-center mt-4 text-sm text-gray-500">
                  <span>Showing {paginatedProducts.length} of {sortedProducts.length}</span>
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

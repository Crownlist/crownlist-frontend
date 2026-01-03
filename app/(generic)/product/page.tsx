/* eslint-disable */
"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Heart, ChevronLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header1";
import Footer from "@/components/Footer";
import { useProducts, ApiProduct } from "@/hooks/useProducts";
import { useLikedProducts } from "@/hooks/useLikedProducts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function ProductContent() {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const searchTerm = searchParams?.get("search") || "";
  const locationFilter = searchParams?.get("location") || "";

  const options = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      location: locationFilter,
    }),
    [currentPage, itemsPerPage, searchTerm, locationFilter]
  );

  const { products: apiProducts, loading, pagination } = useProducts(options);

  const [liked, setLiked] = useState<boolean>(false);
  const [toggling, setToggling] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const { toggleLike } = useLikedProducts();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, locationFilter]);

  // Pagination
  const totalPages = pagination?.totalPages || 1;
  const paginatedProducts = apiProducts;
  const totalResults = pagination?.totalProducts || 0;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const getPageNumbers = (currentPage: number, totalPages: number) => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 7) {
        // If current is 8 or more, show ellipsis after 1
        pages.push("…");
      } else {
        // Show consecutive pages up to current +1 or 7
        const end = Math.min(7, currentPage + 1);
        for (let i = 2; i <= end; i++) {
          pages.push(i);
        }
      }

      // Show pages around current if not already included
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 6) {
        // If current is far from end, show ellipsis before last
        pages.push("…");
      }

      // Always show last page if not already included
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const convertApiProductToProduct = (p: ApiProduct) => ({
    id: p._id,
    slug: p.slug,
    image: p.images?.[0]?.url || "/placeholder.svg",
    title: p.name,
    description: p.description || "",
    price: p.price?.currentPrice
      ? `₦${p.price.currentPrice.toLocaleString()}`
      : "",
    time: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "",
    location: p.listingLocation
      ? `${p.listingLocation.city || ""}${p.listingLocation.city ? ", " : ""}${
          p.listingLocation.country || ""
        }`
      : "",
    distance: "",
    condition: "New",
    features: p.features || [],
    category: p.category,
    subCategory: p.subCategory,
  });

  const handleLike = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (toggling) return;

    // Check authentication
    const isAuthenticated =
      typeof window !== "undefined" && !!localStorage.getItem("leoKey");
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    setToggling(true);
    const newLiked = !liked;
    setLiked(newLiked);

    try {
      await toggleLike(id);
    } catch (err: any) {
      setLiked(!newLiked); // revert
      toast("error", err.message || "Failed to toggle like");
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header hidden={false} />
      <div className="container mx-auto py-6 max-md:px-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-700">
            {searchTerm ? `Search results for "${searchTerm}"` : "All Products"}
            {locationFilter && ` in ${locationFilter}`}
          </span>
        </div>

        {/* Results Header */}
        <div className="flex flex-row gap-0 mb-6">
          <p className="font-semibold">
            {searchTerm ? `Search results for "${searchTerm}"` : "All Products"}
            {locationFilter && ` in ${locationFilter}`}
          </p>
          <p className="font-light">
            ({totalResults} result{totalResults !== 1 ? "s" : ""} found)
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <div className="h-40 bg-gray-200 animate-pulse" />
                <div className="p-3 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-full animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                  <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : apiProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4 text-purple-600">
              <Image
                src="/binocular.png"
                width={60}
                height={60}
                alt="No results"
                className="mx-auto"
              />
            </div>
            <h2 className="text-xl font-medium mb-2">
              No search results found
            </h2>
            <div className="text-gray-500 max-w-md mx-auto space-y-2">
              <p>Try using different or more general keywords</p>
              <p>Remove filters or search for a broader category</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedProducts.map((product) => {
              const displayProduct = convertApiProductToProduct(product);
              return (
                <Link href={`/product/${product.slug}`} key={product._id}>
                  <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    <div className="relative h-40">
                      <Image
                        src={displayProduct.image}
                        alt={displayProduct.title}
                        fill
                        className="object-cover"
                      />
                      {/* <button
                        onClick={(e) => handleLike(e, displayProduct.id)}
                        disabled={toggling}
                        aria-label={liked ? "Unlike" : "Like"}
                        className="absolute top-2 right-2 h-7 w-7 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
                        <Heart className={cn("h-5 w-5 transition-colors", liked ? "fill-red-500 text-red-500" : "text-gray-500")} />
                      </button>  */}
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {displayProduct.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {displayProduct.description}
                      </p>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {displayProduct.location && (
                          <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {displayProduct.location}
                          </div>
                        )}
                        {displayProduct.features
                          .slice(0, 2)
                          .map((feature, index) => (
                            <div
                              key={index}
                              className="text-xs bg-gray-100 px-2 py-1 rounded"
                            >
                              {feature}
                            </div>
                          ))}
                      </div>
                      <div className="font-medium text-sm mt-2">
                        {displayProduct.price}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-row justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft size={14} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex gap-1 flex-wrap justify-center">
              {getPageNumbers(currentPage, totalPages).map((page, index) =>
                typeof page === "number" ? (
                  <button
                    key={index}
                    onClick={() => handlePageChange(page)}
                    className={`px-2 sm:px-3 py-2 text-xs sm:text-sm border rounded-md ${
                      currentPage === page
                        ? "bg-primary text-white border-primary"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={index} className="px-2 py-2 text-xs sm:text-sm">
                    ...
                  </span>
                )
              )}
            </div>

            <button
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col min-h-screen bg-white justify-center items-center">
          <div>Loading...</div>
        </div>
      }
    >
      <ProductContent />
    </Suspense>
  );
}

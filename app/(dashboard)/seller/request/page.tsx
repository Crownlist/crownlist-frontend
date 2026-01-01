"use client";
import CategoryModal from "@/components/Home/CategoryModal";
import ProductRequestCard from "@/components/ProductRequestCard";
import ContactBuyerModal from "@/components/ContactBuyerModal";
import ProductRequestDetailModal from "@/components/ProductRequestDetailModal";
import RequestSearch from "@/components/RequestSearch";
import CustomLoader from "@/components/CustomLoader";
import { AlignJustify, LayoutGrid } from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import { useProductRequests } from "@/lib/useProductRequests";
import { ProductRequest } from "@/types/product/request";
import { useToast } from "@/lib/useToastMessage";
import { useCategories } from "@/hooks/useCategories";
import { Category, Subcategory } from "@/types/category/category";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductRequestsPage() {
  const [openCat, setOpenCat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedRequest, setSelectedRequest] = useState<ProductRequest | null>(
    null
  );
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedRequestForContact, setSelectedRequestForContact] =
    useState<ProductRequest | null>(null);

  // Category and subcategory filter state
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<string>("all-categories");
  const [selectedSubcategoryId, setSelectedSubcategoryId] =
    useState<string>("all-subcategories");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [availableSubcategories, setAvailableSubcategories] = useState<
    Subcategory[]
  >([]);

  console.log(selectedRequest);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { handleMessage } = useToast();

  // Categories hook
  const { categories, loading: categoriesLoading } = useCategories();

  const { data, isLoading, error, refetch } = useProductRequests({
    userType: "seller",
  });

  // Client-side filtering logic
  const allRequests = useMemo(() => data?.data?.productRequests || [], [data]);

  const filteredRequests = useMemo(() => {
    let filtered = allRequests;

    // Filter by category
    if (selectedCategoryId !== "all-categories") {
      filtered = filtered.filter(
        (request) => request.category._id === selectedCategoryId
      );
    }

    // Filter by subcategory
    if (selectedSubcategoryId !== "all-subcategories") {
      filtered = filtered.filter(
        (request) => request.subCategory._id === selectedSubcategoryId
      );
    }

    // Filter by search query (case-insensitive)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.name.toLowerCase().includes(query) ||
          request.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allRequests, selectedCategoryId, selectedSubcategoryId, searchQuery]);

  // Calculate pagination for filtered results
  const itemsPerPage = 12;
  const totalFilteredItems = filteredRequests.length;
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);

  // Get current page items
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRequests.slice(startIndex, endIndex);
  }, [filteredRequests, currentPage, itemsPerPage]);

  console.log("data", data);
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (categoryId: string) => {
    // Handle empty string values (when Select clears selection)
    if (!categoryId || categoryId === "all-categories") {
      setSelectedCategoryId("all-categories");
      setSelectedCategory(null);
      setAvailableSubcategories([]);
      setSelectedSubcategoryId("all-subcategories");
    } else {
      const category = categories.find((cat) => cat._id === categoryId);
      setSelectedCategoryId(categoryId);
      setSelectedCategory(category || null);
      setAvailableSubcategories(category?.subCategories || []);
      setSelectedSubcategoryId("all-subcategories"); // Reset subcategory when category changes
    }
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    // Handle empty string values (when Select clears selection)
    if (!subcategoryId || subcategoryId === "all-subcategories") {
      setSelectedSubcategoryId("all-subcategories");
    } else {
      setSelectedSubcategoryId(subcategoryId);
    }
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleClearFilters = () => {
    setSelectedCategoryId("all-categories");
    setSelectedSubcategoryId("all-subcategories");
    setSelectedCategory(null);
    setAvailableSubcategories([]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleViewRequest = (request: ProductRequest) => {
    setSelectedRequest(request);
    // Open the request detail modal
  };

  return (
    <div className="p-4 md:p-6 flex flex-col w-full min-h-screen bg-gray-50">
      <div className="w-full mx-auto">
        {/* Header Section - Responsive */}
        <div className="flex flex-col  justify-between gap-4 mb-8">
          {/* Title and Search Row */}
          <div className="flex flex-row lg:justify-between lg:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold mb-1">
                Product Requests
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Keep track and manage your product requests
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#EDE9FF] text-[#1F058F]"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-[#EDE9FF] text-[#1F058F]"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <AlignJustify size={18} />
              </button>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Select
                  value={selectedCategoryId || "all-categories"}
                  onValueChange={handleCategoryChange}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger className="w-[140px] focus:ring-2 focus:ring-[#1F058F] focus:border-transparent">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-categories">
                      All Categories
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategory Filter */}
              <div className="flex items-center gap-2">
                <Select
                  value={selectedSubcategoryId || "all-subcategories"}
                  onValueChange={handleSubcategoryChange}
                  disabled={
                    !selectedCategory || availableSubcategories.length === 0
                  }
                >
                  <SelectTrigger className="w-[140px] focus:ring-2 focus:ring-[#1F058F] focus:border-transparent disabled:bg-gray-100">
                    <SelectValue placeholder="Select Subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-subcategories">
                      All Subcategories
                    </SelectItem>
                    {availableSubcategories.map((subcategory) => (
                      <SelectItem key={subcategory._id} value={subcategory._id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {(selectedCategoryId !== "all-categories" ||
                selectedSubcategoryId !== "all-subcategories" ||
                searchQuery) && (
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className="w-full lg:w-auto lg:min-w-[300px] ">
            <RequestSearch
              onSearch={handleSearch}
              placeholder="Search requests by name..."
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          {error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-red-100 p-3 mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Failed to load requests
              </h3>
              <p className="text-gray-600 text-center mb-4">
                There was an error loading your product requests. Please try
                again.
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-[#1F058F] text-white rounded-lg hover:bg-[#1F058F]/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-12">
              <CustomLoader />
            </div>
          ) : paginatedRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4">
                <Image
                  src={"/box.png"}
                  width={80}
                  height={80}
                  alt="No requests"
                />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-center">
                {searchQuery ||
                selectedCategoryId !== "all-categories" ||
                selectedSubcategoryId !== "all-subcategories"
                  ? "No matching requests found"
                  : "No product requests"}
              </h3>
              <p className="text-gray-500 text-center text-sm md:text-base px-4 mb-4">
                {searchQuery ||
                selectedCategoryId !== "all-categories" ||
                selectedSubcategoryId !== "all-subcategories"
                  ? "Try adjusting your filters or search terms."
                  : "There are currently no product requests to display."}
              </p>
              {!searchQuery &&
                selectedCategoryId === "all-categories" &&
                selectedSubcategoryId === "all-subcategories" && (
                  <div className="text-center text-gray-600 text-xs md:text-sm px-4">
                    <p>For further assistance reach out via our 24/7 support</p>
                    <p>
                      via email at{" "}
                      <a
                        href="mailto:crownliststore@gmail.com"
                        className="text-[#1F058F] hover:underline"
                      >
                        crownliststore@gmail.com
                      </a>
                    </p>
                  </div>
                )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {paginatedRequests.length} of {totalFilteredItems}{" "}
                  requests
                </p>
              </div>

              {/* Requests Grid/List */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    : "space-y-3"
                }
              >
                {paginatedRequests.map((request) => (
                  <ProductRequestCard
                    key={request._id}
                    request={request}
                    viewMode={viewMode}
                    onClick={handleViewRequest}
                    onContact={(req) => {
                      setSelectedRequestForContact(req);
                      setContactModalOpen(true);
                    }}
                  />
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            page === currentPage
                              ? "text-[#1F058F] bg-[#EDE9FF] border-[#1F058F]"
                              : "text-gray-500 bg-white border-gray-300"
                          } border hover:bg-gray-50`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CategoryModal isOpen={openCat} onClose={() => setOpenCat(false)} />
      {selectedRequest && (
        <ProductRequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
      {contactModalOpen && selectedRequestForContact && (
        <ContactBuyerModal
          request={selectedRequestForContact as ProductRequest}
          onClose={() => setContactModalOpen(false)}
        />
      )}
    </div>
  );
}

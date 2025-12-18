"use client";
import CategoryModal from "@/components/Home/CategoryModal";
import ProductRequestCard from "@/components/ProductRequestCard";
import RequestSearch from "@/components/RequestSearch";
import CustomLoader from "@/components/CustomLoader";
import ProductRequestForm from "@/components/ProductRequestForm";
import { AlignJustify, LayoutGrid, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useProductRequests } from "@/lib/useProductRequests";
import { ProductRequest } from "@/types/product/request";
import ProductRequestDetailModal from "@/components/ProductRequestDetailModal";

export default function BuyerProductRequestsPage() {
  const [openCat, setOpenCat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedRequest, setSelectedRequest] = useState<ProductRequest | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [requestToEdit, setRequestToEdit] = useState<ProductRequest | null>(
    null
  );

  const { data, isLoading, error, refetch } = useProductRequests({
    q: searchQuery || undefined,
    page: currentPage,
    limit: 12,
    userType: "buyer",
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleViewRequest = (request: ProductRequest) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedRequest(null);
  };

  const handleEditRequest = (request: ProductRequest) => {
    setRequestToEdit(request);
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setRequestToEdit(null);
  };

  const requests = data?.data?.productRequests || [];
  const pagination = data?.data?.pagination;

  return (
    <div className="p-4 md:p-6 flex flex-col w-full min-h-screen bg-gray-50">
      <div className="w-full mx-auto">
        {/* Header Section - Responsive */}
        <div className="flex flex-col  justify-between gap-4 mb-8">
          {/* Title and Search Row */}
          <div className="flex flex-col md:flex-row lg:justify-between lg:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold mb-1">
                My Product Requests
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Track and manage your product requests
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

            {/* Controls Section - Responsive */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  setRequestToEdit(null);
                  setShowFormModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#1F058F] text-white rounded-lg hover:bg-[#1F058F]/90 transition-colors"
              >
                <Plus size={16} />
                New Request
              </button>
            </div>
          </div>

          <div className="w-full lg:w-auto lg:min-w-[300px] ">
            <RequestSearch
              onSearch={handleSearch}
              placeholder="Search my requests by name..."
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
          ) : requests.length === 0 ? (
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
                {searchQuery
                  ? "No matching requests found"
                  : "No product requests"}
              </h3>
              <p className="text-gray-500 text-center text-sm md:text-base px-4 mb-4">
                {searchQuery
                  ? `No requests match "${searchQuery}". Try a different search term.`
                  : "There are currently no product requests to display."}
              </p>
              {!searchQuery && (
                <div className="text-center text-gray-600 text-xs md:text-sm px-4">
                  <button
                    onClick={() => {
                      setRequestToEdit(null);
                      setShowFormModal(true);
                    }}
                    className="px-6 py-2 bg-[#1F058F] text-white rounded-lg hover:bg-[#1F058F]/90 transition-colors"
                  >
                    Submit a product request to get started
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {requests.length} of {pagination?.total || 0} requests
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
                {requests.map((request) => (
                  <ProductRequestCard
                    key={request._id}
                    request={request}
                    viewMode={viewMode}
                    onClick={handleViewRequest}
                    onEdit={handleEditRequest}
                    isCurrentUserBuyer={true}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: pagination.pages },
                      (_, i) => i + 1
                    ).map((page) => (
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
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage(
                        Math.min(pagination.pages, currentPage + 1)
                      )
                    }
                    disabled={currentPage === pagination.pages}
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
      {showDetailModal && selectedRequest && (
        <ProductRequestDetailModal
          request={selectedRequest}
          onClose={handleCloseModal}
        />
      )}
      {showFormModal && (
        <ProductRequestForm
          isOpen={showFormModal}
          onClose={handleCloseFormModal}
          onSuccess={() => {
            refetch();
            setRequestToEdit(null);
          }}
          requestToEdit={requestToEdit}
        />
      )}
    </div>
  );
}

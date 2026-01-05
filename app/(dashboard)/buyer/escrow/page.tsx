"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClientUser } from "@/lib/interceptor";
import { Star } from "lucide-react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { toast } from "sonner";

interface EscrowItem {
  _id: string;
  detailsType: string;
  product?: string; // Product ID reference
  details: {
    _id: string;
    price: {
      currentPrice: number;
      discountedPrice: number;
    };
    name: string;
    slug: string;
    description: string;
    images: Array<{
      url: string;
      altText: string;
      isPrimary: boolean;
      _id: string;
    }>;
  };
  seller: {
    _id: string;
    fullName: string;
    email: string;
    accountType: string;
    profilePicture: string;
  };
  buyer: {
    _id: string;
    fullName: string;
    email: string;
    accountType: string;
    profilePicture: string;
  };
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function EscrowPage() {
  const [escrows, setEscrows] = useState<EscrowItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });
  const [escrowDetails, setEscrowDetails] = useState<EscrowItem | null>(null);
  const [showEscrowDetails, setShowEscrowDetails] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedEscrowForRating, setSelectedEscrowForRating] =
    useState<EscrowItem | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const router = useRouter();

  const getStatusColor = (status: string) => {
    const statusMap = {
      waiting: "bg-[#FEF3C7] text-[#D97706]", // yellow - waiting
      reviewing: "bg-[#FED7AA] text-[#EA580C]", // orange - reviewing
      awaiting_payment: "bg-[#FED7AA] text-[#EA580C]", // orange - awaiting payment
      paid: "bg-[#D1FAE5] text-[#059669]", // green - paid
      in_progress: "bg-[#DBEAFE] text-[#2563EB]", // blue - in progress
      delivered: "bg-[#DBEAFE] text-[#2563EB]", // blue - delivered
      released: "bg-[#D1FAE5] text-[#059669]", // green - released
      declined: "bg-[#FEE2E2] text-[#DC2626]", // red - declined
      refunded: "bg-[#E0E7FF] text-[#1E40AF]", // indigo - refunded
    };
    return (
      statusMap[status.toLowerCase() as keyof typeof statusMap] ||
      "bg-gray-200 text-gray-700"
    );
  };

  const fetchEscrowDetails = async (escrowId: string) => {
    try {
      const response = await apiClientUser.get(`/escrows/${escrowId}`);
      setEscrowDetails(response.data.escrow);
      setShowEscrowDetails(true);
    } catch {
      toast.error("Failed to fetch escrow details");
    }
  };

  const handleMessageSeller = (escrow: EscrowItem) => {
    const params = new URLSearchParams({
      sellerId: escrow.seller._id,
      sellerName: escrow.seller.fullName || "Seller",
      sellerAvatar: escrow.seller.profilePicture || "/profile.png",
      escrowId: escrow._id,
      productName: escrow.details.name || "Product",
    });
    router.push(`/buyer/messages?${params.toString()}`);
  };

  const handleRateProduct = (escrow: EscrowItem) => {
    setSelectedEscrowForRating(escrow);
    setShowRatingModal(true);
    setRating(0);
    setHoverRating(0);
    setReviewText("");
  };

  const handleConfirmSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating before submitting");
      return;
    }
    setShowConfirmSubmit(true);
  };

  const submitProductReview = async () => {
    if (!selectedEscrowForRating || rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmittingReview(true);
    try {
      const payload: {
        productId: string;
        escrowId: string;
        rating: number;
        review?: string;
      } = {
        productId: selectedEscrowForRating.details._id,
        escrowId: selectedEscrowForRating._id,
        rating,
      };

      if (reviewText.trim()) {
        payload.review = reviewText.trim();
      }

      const response = await apiClientUser.post("/product-reviews", payload);

      // Show success toast with response message
      const successMessage =
        response?.data?.message ||
        "Review submitted successfully!";
      toast.success(successMessage);

      setShowConfirmSubmit(false);
      setShowRatingModal(false);
      setSelectedEscrowForRating(null);
      setRating(0);
      setReviewText("");
      // Refresh escrow list
      fetchEscrows(currentPage);
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      // Close confirmation modal on error so user can see the rating modal
      setShowConfirmSubmit(false);
      toast.error(error);
    } finally {
      setSubmittingReview(false);
      setShowConfirmSubmit(false);
      setShowRatingModal(false);
    }
  };

  const fetchEscrows = async (page: number) => {
    console.log(page);
    setLoading(true);
    setError(null);
    try {
      const response = await apiClientUser.get(`/escrows?role=buyer`);
      setEscrows(response.data.escrows);
      setPagination(response.data.pagination);
    } catch {
      setError("Failed to load escrow data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscrows(currentPage);
  }, [currentPage]);

  // Loading state
  if (loading) {
    return (
      <div className="p-4 md:p-6 h-full">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-1 justify-start flex">Escrow</h1>
          <p className="text-gray-600">
            Keep track and manage your escrow transactions
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F058F]"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 md:p-6 h-full">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-1 justify-start flex">Escrow</h1>
          <p className="text-gray-600">
            Keep track and manage your escrow transactions
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!escrows || escrows.length === 0) {
    return (
      <div className="p-4 md:p-6 h-full">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-1 justify-start flex">Escrow</h1>
          <p className="text-gray-600">
            Keep track and manage your escrow transactions
          </p>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="p-8 flex flex-col w-full items-center justify-center text-center max-w-3xl">
            <div className="mb-4">
              <Image src={"/box.png"} width={80} height={80} alt="box" />
            </div>
            <h3 className="text-xl font-medium mb-2">No escrow transactions</h3>
            <p className="text-gray-500 mb-6">
              You currently have no escrow transactions to display
            </p>
            <Link href={"/product"}>
              <Button className="bg-[#1F058F] hover:bg-[#2e0a94] text-white">
                Browse Products
              </Button>
            </Link>
          </div>
          <div className="mt-1 text-center text-gray-600">
            <p>For further assistance reach out via our 24/7</p>
            <p>
              via email at{" "}
              <a
                href="mailto:crownliststore@gmail.com"
                className="text-[#1a0066]"
              >
                crownliststore@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Table view with data
  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-3">
      <div className="flex flex-col mb-1">
        <h1 className="text-2xl font-bold mb-1">Escrow</h1>
        <p className="text-gray-600">
          Keep track and manage your escrow transactions
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden mt-6 sm:mt-12">
        {/* Table Header - Desktop */}
        <div className="hidden md:grid grid-cols-13 gap-3 px-6 py-3 bg-[#EDE9FF] rounded-full text-sm font-medium text-gray-700">
          <div className="col-span-3">Details</div>
          <div className="col-span-2">Seller</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Timestamp</div>
          <div className="col-span-2">Action</div>
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden px-4 pb-4">
          {escrows.map((item: EscrowItem) => {
            return (  
              <div
                key={item._id}
                className="bg-white border rounded-lg mb-4 p-4 space-y-3"
              >
                {/* Product Details */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded shrink-0 overflow-hidden">
                    <Image
                      src={
                        item.details.images?.find((img) => img.isPrimary)?.url ||
                        item.details.images?.[0]?.url ||
                        "/box.png"
                      }
                      width={48}
                      height={48}
                      alt={item.details.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">
                      {item.details.name}
                    </h4>
                    <p className="text-lg font-semibold text-[#1F058F]">
                      ₦{item.amount.toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>

                {/* Seller and Timestamp */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full shrink-0 overflow-hidden">
                      <Image
                        src={item.seller.profilePicture || "/profile.png"}
                        width={24}
                        height={24}
                        alt={item.seller.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-gray-600">{item.seller.fullName}</span>
                  </div>
                  <span className="text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <button
                    className="flex-1 px-3 py-2 text-xs font-medium rounded text-[#1F058F] border border-[#1F058F]"
                    onClick={() => fetchEscrowDetails(item._id)}
                  >
                    View
                  </button>
                  <button
                    className="flex-1 px-3 py-2 text-xs font-medium rounded text-[#1F058F] border border-[#1F058F]"
                    onClick={() => handleMessageSeller(item)}
                  >
                    Message
                  </button>
                  <button
                    className={`flex-1 px-3 py-2 text-xs font-medium rounded ${item.status.toLowerCase() === "released"
                      ? "text-[#1F058F] border border-[#1F058F]"
                      : "text-gray-400 border border-gray-300 cursor-not-allowed"
                      }`}
                    onClick={() => handleRateProduct(item)}
                    disabled={item.status.toLowerCase() !== "released"}
                  >
                    Rate
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Table Body - Desktop */}
        <div className="hidden md:block divide-y divide-gray-200">
          {escrows.map((item: EscrowItem) => (
            <div
              key={item._id}
              className="grid grid-cols-13 gap-3 px-6 py-4 items-center hover:bg-gray-50 border-b border-gray-200"
            >
              {/* Details */}
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded shrink-0 overflow-hidden">
                  <Image
                    src={
                      item.details.images?.find((img) => img.isPrimary)?.url ||
                      item.details.images?.[0]?.url ||
                      "/box.png"
                    }
                    width={48}
                    height={48}
                    alt={item.details.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-gray-900">
                  {item.details.name}
                </span>
              </div>

              {/* Seller */}
              <div className="col-span-2 flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full shrink-0 overflow-hidden">
                  <Image
                    src={item.seller.profilePicture || "/profile.png"}
                    width={32}
                    height={32}
                    alt={item.seller.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-gray-900">
                  {item.seller.fullName}
                </span>
              </div>

              {/* Amount */}
              <div className="col-span-2">
                <span className="text-sm text-gray-900">
                  ₦{item.amount.toLocaleString()}
                </span>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>

              {/* Timestamp */}
              <div className="col-span-2">
                <span className="text-sm text-gray-600">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-2 flex gap-2">
                <button
                  className="px-3 py-1 text-xs font-medium rounded text-[#1F058F]"
                  onClick={() => fetchEscrowDetails(item._id)}
                >
                  View
                </button>
                <button
                  className="px-3 py-1 text-xs font-medium rounded text-[#1F058F]"
                  onClick={() => handleMessageSeller(item)}
                >
                  Message
                </button>
                <button
                  className={`px-3 py-1 text-xs font-medium rounded ${item.status.toLowerCase() === "released"
                    ? "text-[#1F058F]"
                    : "text-gray-400 cursor-not-allowed"
                    }`}
                  onClick={() => handleRateProduct(item)}
                  disabled={item.status.toLowerCase() !== "released"}
                >
                  Rate
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`px-3 py-1 text-sm rounded ${page === currentPage
                      ? "bg-[#1F058F] text-white"
                      : "text-gray-600 hover:text-gray-900"
                      }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.pages}
              >
                Next →
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * pagination.limit + 1}-
                {Math.min(currentPage * pagination.limit, pagination.total)}
              </span>{" "}
              of <span className="font-medium">{pagination.total}</span>
            </div>
          </div>
        )}
      </div>

      {/* Escrow Details Modal */}
      {showEscrowDetails && escrowDetails && (
        <div
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-[500000px] p-4"
          onClick={() => {
            setShowEscrowDetails(false);
            setEscrowDetails(null);
          }}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Escrow Details</h2>
                <button
                  onClick={() => {
                    setShowEscrowDetails(false);
                    setEscrowDetails(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-700">
                      Product
                    </h3>
                    <p className="text-sm">{escrowDetails.details.name}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-700">
                      Amount
                    </h3>
                    <p className="text-sm">
                      ₦{escrowDetails.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-700">
                      Seller
                    </h3>
                    <div className="flex items-center gap-2">
                      <Image
                        src={
                          escrowDetails.seller.profilePicture || "/profile.png"
                        }
                        width={24}
                        height={24}
                        alt={escrowDetails.seller.fullName}
                        className="rounded-full"
                      />
                      <span className="text-sm">
                        {escrowDetails.seller.fullName}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-700">
                      Buyer
                    </h3>
                    <div className="flex items-center gap-2">
                      <Image
                        src={
                          escrowDetails.buyer.profilePicture || "/profile.png"
                        }
                        width={24}
                        height={24}
                        alt={escrowDetails.buyer.fullName}
                        className="rounded-full"
                      />
                      <span className="text-sm">
                        {escrowDetails.buyer.fullName}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-700">
                      Status
                    </h3>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        escrowDetails.status
                      )}`}
                    >
                      {escrowDetails.status.charAt(0).toUpperCase() +
                        escrowDetails.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-700">
                      Created
                    </h3>
                    <p className="text-sm">
                      {new Date(escrowDetails.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-gray-700 mb-2">
                    Product Description
                  </h3>
                  <p className="text-sm text-gray-600">
                    {escrowDetails.details.description ||
                      "No description available"}
                  </p>
                </div>

                {escrowDetails.details.images &&
                  escrowDetails.details.images.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-sm text-gray-700 mb-2">
                        Product Images
                      </h3>
                      <Carousel className="w-full max-w-xs mx-auto">
                        <CarouselContent>
                          {escrowDetails.details.images.map((image, index) => (
                            <CarouselItem key={image._id}>
                              <div className="p-1">
                                <div className="w-full aspect-square overflow-hidden rounded-lg">
                                  <Image
                                    src={image.url}
                                    alt={
                                      image.altText ||
                                      `${escrowDetails.details.name} - Image ${index + 1
                                      }`
                                    }
                                    width={300}
                                    height={300}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        {escrowDetails.details.images.length > 1 && (
                          <>
                            <CarouselPrevious className="left-1" />
                            <CarouselNext className="right-1" />
                          </>
                        )}
                      </Carousel>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmSubmit}
        onClose={() => setShowConfirmSubmit(false)}
        onConfirm={submitProductReview}
        title="Submit Review"
        description={`Are you sure you want to submit your ${rating}-star rating${reviewText.trim() ? " and review" : ""}?`}
        confirmText={submittingReview ? "Submitting..." : "Submit"}
        isPending={submittingReview}
      />

      {/* Rating Modal */}
      {showRatingModal && selectedEscrowForRating && (
        <div
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-[500000px] p-4"
          onClick={() => {
            setShowRatingModal(false);
            setSelectedEscrowForRating(null);
            setRating(0);
            setReviewText("");
          }}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Rate Product</h2>
                <button
                  onClick={() => {
                    setShowRatingModal(false);
                    setSelectedEscrowForRating(null);
                    setRating(0);
                    setReviewText("");
                  }}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>

              {/* Product Info */}
              <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded shrink-0 overflow-hidden">
                  <Image
                    src={
                      selectedEscrowForRating.details.images?.find(
                        (img) => img.isPrimary
                      )?.url ||
                      selectedEscrowForRating.details.images?.[0]?.url ||
                      "/box.png"
                    }
                    width={64}
                    height={64}
                    alt={selectedEscrowForRating.details.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-gray-900">
                    {selectedEscrowForRating.details.name}
                  </h3>
                  <p className="text-sm text-[#1F058F] font-semibold">
                    ₦{selectedEscrowForRating.amount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={40}
                        className={`${star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                          }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {rating} star{rating > 1 ? "s" : ""}
                  </p>
                )}
              </div>

              {/* Review Text */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review (Optional)
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F058F] focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {reviewText.length}/500 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRatingModal(false);
                    setSelectedEscrowForRating(null);
                    setRating(0);
                    setReviewText("");
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={submittingReview}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  disabled={rating === 0 || submittingReview}
                  className="flex-1 px-4 py-2 text-sm font-medium rounded bg-[#1F058F] text-white hover:bg-[#2e0a94] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

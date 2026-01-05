"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { apiClientUser } from "@/lib/interceptor";
import { Star, Trash2, Edit, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

interface ProductImage {
    url: string;
    altText: string;
    isPrimary: boolean;
    _id: string;
}

interface Product {
    _id: string;
    name: string;
    slug: string;
    images: ProductImage[];
    seller?: string;
}

interface Buyer {
    _id: string;
    fullName: string;
    profilePicture?: string;
    id: string;
}

interface Review {
    _id: string;
    product: Product;
    buyer: string | Buyer;
    escrow: string;
    rating: number;
    review: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
    limit: number;
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination>({
        currentPage: 1,
        totalPages: 1,
        totalReviews: 0,
        limit: 10,
    });

    // Modal states
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [detailedReview, setDetailedReview] = useState<Review | null>(null);

    // Edit form states
    const [editRating, setEditRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [editReviewText, setEditReviewText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchReviews = async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClientUser.get(
                `/product-reviews/my-reviews?page=${page}&limit=10`
            );
            setReviews(response.data.reviews);
            setPagination(response.data.pagination);
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            setError("Failed to load reviews");
            toast.error(err?.response?.data?.message || "Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    const fetchReviewDetails = async (reviewId: string) => {
        try {
            const response = await apiClientUser.get(`/product-reviews/${reviewId}`);
            setDetailedReview(response.data.review);
            setShowViewModal(true);
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            toast.error(err?.response?.data?.message || "Failed to load review details");
        }
    };

    const handleEdit = (review: Review) => {
        setSelectedReview(review);
        setEditRating(review.rating);
        setEditReviewText(review.review);
        setShowEditModal(true);
    };

    const handleUpdateReview = async () => {
        if (!selectedReview || editRating === 0) {
            toast.error("Please select a rating");
            return;
        }

        setSubmitting(true);
        try {
            const payload: { rating: number; review?: string } = {
                rating: editRating,
            };

            if (editReviewText.trim()) {
                payload.review = editReviewText.trim();
            }

            const response = await apiClientUser.put(
                `/product-reviews/${selectedReview._id}`,
                payload
            );

            toast.success(response?.data?.message || "Review updated successfully!");
            setShowEditModal(false);
            setSelectedReview(null);
            setEditRating(0);
            setEditReviewText("");
            fetchReviews(currentPage);
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            toast.error(err?.response?.data?.message || "Failed to update review");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async () => {
        if (!selectedReview) return;

        setSubmitting(true);
        try {
            const response = await apiClientUser.delete(
                `/product-reviews/${selectedReview._id}`
            );

            toast.success(response?.data?.message || "Review deleted successfully!");
            setShowDeleteConfirm(false);
            setSelectedReview(null);
            fetchReviews(currentPage);
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            toast.error(err?.response?.data?.message || "Failed to delete review");
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    const renderStars = (rating: number, size: "sm" | "lg" = "sm") => {
        const starSize = size === "lg" ? 24 : 16;
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={starSize}
                        className={`${star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                    />
                ))}
            </div>
        );
    };

    useEffect(() => {
        fetchReviews(currentPage);
    }, [currentPage]);

    // Loading state
    if (loading && reviews.length === 0) {
        return (
            <div className="p-4 md:p-6 h-full">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold mb-1">My Reviews</h1>
                    <p className="text-gray-600">Manage your product reviews</p>
                </div>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F058F]"></div>
                </div>
            </div>
        );
    }

    // Error state
    if (error && reviews.length === 0) {
        return (
            <div className="p-4 md:p-6 h-full">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold mb-1">My Reviews</h1>
                    <p className="text-gray-600">Manage your product reviews</p>
                </div>
                <div className="flex items-center justify-center h-64">
                    <p className="text-red-500">Error: {error}</p>
                </div>
            </div>
        );
    }

    // Empty state
    if (!reviews || reviews.length === 0) {
        return (
            <div className="p-4 md:p-6 h-full">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold mb-1">My Reviews</h1>
                    <p className="text-gray-600">Manage your product reviews</p>
                </div>
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <div className="p-8 flex flex-col w-full items-center justify-center text-center max-w-3xl">
                        <div className="mb-4">
                            <Image src={"/box.png"} width={80} height={80} alt="box" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">No reviews yet</h3>
                        <p className="text-gray-500 mb-6">
                            You have not reviewed any products yet. Purchase and review products to see them here.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 h-full flex flex-col gap-3">
            <div className="flex flex-col mb-1">
                <h1 className="text-2xl font-bold mb-1">My Reviews</h1>
                <p className="text-gray-600">Manage your product reviews</p>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {reviews.map((review) => (
                    <div
                        key={review._id}
                        className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                        {/* Product Image and Name */}
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-16 h-16 bg-gray-200 rounded shrink-0 overflow-hidden">
                                <Image
                                    src={
                                        review.product.images?.find((img) => img.isPrimary)?.url ||
                                        review.product.images?.[0]?.url ||
                                        "/box.png"
                                    }
                                    width={64}
                                    height={64}
                                    alt={review.product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm text-gray-900 truncate">
                                    {review.product.name}
                                </h3>
                                <div className="mt-1">{renderStars(review.rating)}</div>
                            </div>
                        </div>

                        {/* Review Preview */}
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {review.review}
                        </p>

                        {/* Date */}
                        <p className="text-xs text-gray-500 mb-3">
                            {formatDate(review.createdAt)}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => fetchReviewDetails(review._id)}
                                className="flex-1 px-3 py-1.5 text-xs font-medium rounded text-[#1F058F] border border-[#1F058F] hover:bg-[#1F058F]/10 flex items-center justify-center gap-1"
                            >
                                <Eye size={14} />
                                View
                            </button>
                            <button
                                onClick={() => handleEdit(review)}
                                className="flex-1 px-3 py-1.5 text-xs font-medium rounded text-[#1F058F] border border-[#1F058F] hover:bg-[#1F058F]/10 flex items-center justify-center gap-1"
                            >
                                <Edit size={14} />
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedReview(review);
                                    setShowDeleteConfirm(true);
                                }}
                                className="px-3 py-1.5 text-xs font-medium rounded text-red-600 border border-red-600 hover:bg-red-50 flex items-center justify-center gap-1"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous page"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                            (page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${page === currentPage
                                            ? "bg-[#1F058F] text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    {page}
                                </button>
                            )
                        )}
                    </div>

                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next page"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* View Details Modal */}
            {showViewModal && detailedReview && (
                <div
                    className="fixed inset-0 bg-black/85 flex items-center justify-center z-[500000px] p-4"
                    onClick={() => {
                        setShowViewModal(false);
                        setDetailedReview(null);
                    }}
                >
                    <div
                        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Review Details</h2>
                                <button
                                    onClick={() => {
                                        setShowViewModal(false);
                                        setDetailedReview(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-700 text-xl"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Product Info */}
                            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="w-20 h-20 bg-gray-200 rounded shrink-0 overflow-hidden">
                                    <Image
                                        src={
                                            detailedReview.product.images?.find((img) => img.isPrimary)
                                                ?.url ||
                                            detailedReview.product.images?.[0]?.url ||
                                            "/box.png"
                                        }
                                        width={80}
                                        height={80}
                                        alt={detailedReview.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">
                                        {detailedReview.product.name}
                                    </h3>
                                    <div className="mt-2">{renderStars(detailedReview.rating, "lg")}</div>
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="mb-4">
                                <h4 className="font-semibold text-sm text-gray-700 mb-2">Review</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {detailedReview.review}
                                </p>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Created</p>
                                    <p className="font-medium">{formatDate(detailedReview.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Updated</p>
                                    <p className="font-medium">{formatDate(detailedReview.updatedAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedReview && (
                <div
                    className="fixed inset-0 bg-black/85 flex items-center justify-center z-[500000px] p-4"
                    onClick={() => {
                        setShowEditModal(false);
                        setSelectedReview(null);
                        setEditRating(0);
                        setEditReviewText("");
                    }}
                >
                    <div
                        className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Edit Review</h2>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedReview(null);
                                        setEditRating(0);
                                        setEditReviewText("");
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
                                            selectedReview.product.images?.find((img) => img.isPrimary)
                                                ?.url ||
                                            selectedReview.product.images?.[0]?.url ||
                                            "/box.png"
                                        }
                                        width={64}
                                        height={64}
                                        alt={selectedReview.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-sm text-gray-900">
                                        {selectedReview.product.name}
                                    </h3>
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
                                            onClick={() => setEditRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                size={40}
                                                className={`${star <= (hoverRating || editRating)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "fill-gray-200 text-gray-200"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                {editRating > 0 && (
                                    <p className="text-center text-sm text-gray-600 mt-2">
                                        {editRating} star{editRating > 1 ? "s" : ""}
                                    </p>
                                )}
                            </div>

                            {/* Review Text */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Review (Optional)
                                </label>
                                <textarea
                                    value={editReviewText}
                                    onChange={(e) => setEditReviewText(e.target.value)}
                                    placeholder="Share your experience with this product..."
                                    rows={4}
                                    maxLength={500}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F058F] focus:border-transparent resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {editReviewText.length}/500 characters
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedReview(null);
                                        setEditRating(0);
                                        setEditReviewText("");
                                    }}
                                    className="flex-1 px-4 py-2 text-sm font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateReview}
                                    disabled={editRating === 0 || submitting}
                                    className="flex-1 px-4 py-2 text-sm font-medium rounded bg-[#1F058F] text-white hover:bg-[#2e0a94] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? "Updating..." : "Update Review"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => {
                    setShowDeleteConfirm(false);
                    setSelectedReview(null);
                }}
                onConfirm={handleDeleteReview}
                title="Delete Review"
                description={`Are you sure you want to delete your review for "${selectedReview?.product.name}"? This action cannot be undone.`}
                confirmText={submitting ? "Deleting..." : "Delete"}
                isPending={submitting}
                colour
            />
        </div>
    );
}

"use client";

import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, User } from "lucide-react";
import { ProductReview, ReviewPagination } from "@/lib/server/product-service";
import Image from "next/image";

interface ProductReviewsProps {
    reviews: ProductReview[];
    pagination: ReviewPagination;
    productId: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
    reviews,
    pagination,
}) => {
    const [expandedReviews, setExpandedReviews] = useState<Set<string>>(
        new Set()
    );

    // Calculate average rating
    const averageRating =
        reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            : 0;

    // Calculate rating distribution
    const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter((review) => review.rating === star).length;
        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
        return { star, count, percentage };
    });

    const toggleExpand = (reviewId: string) => {
        setExpandedReviews((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(reviewId)) {
                newSet.delete(reviewId);
            } else {
                newSet.add(reviewId);
            }
            return newSet;
        });
    };

    const isLongReview = (text: string): boolean => {
        return text.length > 200;
    };

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - date.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) return "Today";
            if (diffDays === 1) return "Yesterday";
            if (diffDays < 7) return `${diffDays} days ago`;
            if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
            if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
            return `${Math.floor(diffDays / 365)} years ago`;
        } catch {
            return new Date(dateString).toLocaleDateString();
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

    if (reviews.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Rating Summary */}
            <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Ratings & Reviews
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Average Rating */}
                    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6">
                        <div className="text-5xl font-bold text-gray-900 mb-2">
                            {averageRating.toFixed(1)}
                        </div>
                        {renderStars(Math.round(averageRating), "lg")}
                        <p className="text-sm text-gray-600 mt-2">
                            Based on {pagination.totalReviews}{" "}
                            {pagination.totalReviews === 1 ? "review" : "reviews"}
                        </p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                        {ratingDistribution.map(({ star, count, percentage }) => (
                            <div key={star} className="flex items-center gap-2">
                                <span className="text-sm text-gray-700 w-12">{star} star</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-yellow-400 h-full transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-600 w-8 text-right">
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div
                        key={review._id}
                        className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                    >
                        {/* Reviewer Info */}
                        <div className="flex items-start gap-3 mb-3">
                            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                {review.buyer.profilePicture ? (
                                    <Image
                                        src={review.buyer.profilePicture}
                                        alt={review.buyer.fullName}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                                        <User size={20} />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                    {review.buyer.fullName}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                    {renderStars(review.rating)}
                                    <span className="text-xs text-gray-500">
                                        {formatDate(review.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Review Text */}
                        <div className="mt-3">
                            <p
                                className={`text-sm text-gray-700 leading-relaxed ${!expandedReviews.has(review._id) && isLongReview(review.review)
                                    ? "line-clamp-3"
                                    : ""
                                    }`}
                            >
                                {review.review}
                            </p>
                            {isLongReview(review.review) && (
                                <button
                                    onClick={() => toggleExpand(review._id)}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold mt-2"
                                >
                                    {expandedReviews.has(review._id) ? "Read Less" : "Read More"}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                        disabled={pagination.currentPage === 1}
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
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${page === pagination.currentPage
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    {page}
                                </button>
                            )
                        )}
                    </div>

                    <button
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next page"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

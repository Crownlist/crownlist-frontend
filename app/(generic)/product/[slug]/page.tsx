/* eslint-disable */
"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header1";
import Footer from "@/components/Footer";
import ProductDetails from "@/components/Home/ProductDetails";
import { useParams, useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useProductData } from "@/hooks/useProductData";
import { useProductLike } from "@/hooks/useProductLike";
import {
  ProductImageGallery,
  ProductAccordion,
  SafetyTipsSection,
  SimilarProducts,
} from "@/components/Product";

export default function ProductDetailPage() {
  const { slug: productSlug } = useParams();
  const search = useSearchParams();
  const bcSub = search.get("sub") || "Property";
  const { products: similarProducts, loading: similarProductsLoading } =
    useProducts();

  // Custom hooks
  const { product, images, currentProduct, isLoading } = useProductData(
    productSlug as string
  );
  const { liked, toggling, showLoginPrompt, setShowLoginPrompt, handleLike } =
    useProductLike();

  // Handle like click for the product
  const onLikeClick = (e: React.MouseEvent) => {
    if (currentProduct?.id) {
      handleLike(currentProduct.id, e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header hidden={false} />
      <div className="container mx-auto px-2 py-6 max-md:px-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link
            href={`/${product?.category?.slug}/${product?.subCategory?.slug}`}
            className="hover:text-gray-700"
          >
            {product?.subCategory?.name || bcSub}
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-700 truncate">
            {product?.name || String(productSlug || "").toUpperCase()}
          </span>
        </div>

        {isLoading ? (
          // Loading skeleton
          <div className="flex flex-col md:flex-row gap-4 md:justify-between w-full">
            {/* Left Column - Product Images Skeleton */}
            <div className="w-full">
              <div className="space-y-6">
                {/* Main Image Skeleton */}
                <div className="relative h-[200px] md:h-[400px] w-full bg-gray-200 rounded-md"></div>

                {/* Thumbnails Skeleton */}
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-16 w-16 bg-gray-200 rounded-md"
                    ></div>
                  ))}
                </div>

                {/* Accordion Sections Skeleton */}
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>

                  <div className="border-b pb-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>

                  <div className="border-b pb-4">
                    <div className="h-6 bg-gray-200 rounded w-1/5 mb-2"></div>
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-4 bg-gray-200 rounded w-full"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product Details Skeleton for Mobile */}
                <div className="flex md:hidden bg-white border rounded-lg p-6 shadow-md">
                  <div className="space-y-4 w-full">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="space-y-2">
                      <div className="h-10 bg-gray-200 rounded"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Similar Products Skeleton */}
                <div className="mt-8">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="border rounded-lg overflow-hidden"
                      >
                        <div className="h-[160px] bg-gray-200"></div>
                        <div className="p-3 space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Product Details Skeleton */}
            <div className="hidden md:flex w-full max-w-md">
              <div className="bg-white border rounded-lg p-6 shadow-md w-full">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 md:justify-between w-full">
            {/* Left Column - Product Images and Info */}
            <div className="w-full">
              {/* Product Image Gallery */}
              <ProductImageGallery
                images={images}
                liked={liked}
                toggling={toggling}
                onLike={onLikeClick}
              />

              {/* Product Information Sections */}
              <ProductAccordion product={product!} />

              {/* Safety Tips Section */}
              <SafetyTipsSection />

              {/* Similar Products */}
              <SimilarProducts
                products={similarProducts}
                loading={similarProductsLoading}
              />

              {/* Product Details for Mobile */}
              <div className="flex md:hidden w-full h-full mt-2 md:justify-end">
                {currentProduct && (
                  <ProductDetails
                    postedDate={currentProduct.postedDate}
                    condition={currentProduct.condition as "Brand New" | "Used"}
                    product={product}
                  />
                )}
              </div>
            </div>

            {/* Right Column - Product Details for Desktop */}
            <div className="hidden md:flex w-full h-full mt-2 md:justify-end">
              {currentProduct && (
                <ProductDetails
                  postedDate={currentProduct.postedDate}
                  condition={currentProduct.condition as "Brand New" | "Used"}
                  product={product}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

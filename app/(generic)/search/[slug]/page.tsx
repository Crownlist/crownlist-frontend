/* eslint-disable */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Upload, Loader2, X } from "lucide-react";
import Header from "@/components/Header1";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import { useSearchState } from "@/hooks/useSearchState";
import { useSearchFunctionality } from "@/hooks/useSearchFunctionality";
import { useCategories } from "@/hooks/useCategories";
import { Category, Subcategory } from "@/types/category/category";
import { toast } from "sonner";
import { apiClientUser } from "@/lib/interceptor";
import Image from "next/image";
import {
  SearchBar,
  SearchFilters,
  SearchResults,
  SearchPagination,
} from "@/components/Search";

interface ProductImage {
  url: string;
  altText?: string;
  isPrimary: boolean;
}

interface FormData {
  name: string;
  description: string;
  category: string;
  subCategory: string;
  phone: string;
  images: File[];
}

export default function SearchPage() {
  const { slug: searchSlug } = useParams();

  // Form state for product request
  const { categories, loading: categoriesLoading } = useCategories();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    phone: "",
    images: [],
  });
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [availableSubcategories, setAvailableSubcategories] = useState<
    Subcategory[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // Custom hooks
  const searchState = useSearchState();
  const {
    searchQuery,
    isFeatured,
    sortBy,
    currentPage,
    totalPages,
    totalResults,
    isSearchLoading,
    searchResults,
    hasSearched,
    setSearchQuery,
    setCurrentPage,
    resetSearch,
  } = searchState;

  const {
    performAdvancedSearch,
    handleSearch,
    handleFilterChange,
    handlePageChange,
  } = useSearchFunctionality({
    searchQuery,
    isFeatured,
    sortBy,
    currentPage,
    setSearchResults: searchState.setSearchResults,
    setTotalResults: searchState.setTotalResults,
    setTotalPages: searchState.setTotalPages,
    setIsSearchLoading: searchState.setIsSearchLoading,
    setHasSearched: searchState.setHasSearched,
    setIsFeatured: searchState.setIsFeatured,
    setSortBy: searchState.setSortBy,
  });

  // Initialize search on mount - prefill search input
  useEffect(() => {
    if (searchSlug && !hasSearched) {
      const decodedQuery = decodeURIComponent(searchSlug as string);
      setSearchQuery(decodedQuery);
      performAdvancedSearch(decodedQuery, 1, false, "newest");
    }
  }, [searchSlug]);

  const handleClearFilters = () => {
    resetSearch();
    setSearchQuery("");
  };

  // Form handlers for product request
  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find((c) => c._id === categoryId);
    setSelectedCategory(category || null);
    setAvailableSubcategories(category?.subCategories || []);
    setFormData((prev) => ({
      ...prev,
      category: categoryId,
      subCategory: "", // Reset subcategory when category changes
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setFormData((prev) => ({ ...prev, images: files }));

    // Create preview URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(urls);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("fileType", "Product-request");

      const res = await apiClientUser.post("/users/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("image", res);
      return res?.data?.fileUrl;
    } catch (error: any) {
      console.error("Image upload error:", error);
      // If authentication error, skip upload and use placeholder
      if (
        error?.message?.includes("authentication") ||
        error?.message?.includes("token") ||
        error?.message?.includes("login")
      ) {
        return `/placeholder-image-${Date.now()}.jpg`; // Placeholder for unauthenticated users
      }
      throw new Error("Failed to upload image");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.category ||
      !formData.subCategory ||
      !formData.phone
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.description.length < 10) {
      toast.error("Description must be at least 10 characters long.");
      return;
    }

    // Images are optional for search page requests
    // if (formData.images.length === 0) {
    //   toast.error("Please select at least one image");
    //   return;
    // }

    setIsSubmitting(true);
    setIsUploadingImages(true);

    try {
      // Upload images to server to get URLs
      const uploadedImages: ProductImage[] = [];
      for (let i = 0; i < formData.images.length; i++) {
        const file = formData.images[i];
        const imageUrl = await uploadImage(file);
        uploadedImages.push({
          url: imageUrl,
          altText: `Image ${i + 1}`,
          isPrimary: i === 0, // First image is primary
        });
      }

      setIsUploadingImages(false);

      // Prepare payload for API
      const payload = {
        name: formData.name,
        description: formData.description,
        images: uploadedImages,
        category: formData.category,
        subCategory: formData.subCategory,
        phone: formData.phone,
      };

      // Submit to API
      await apiClientUser.post("/product-requests/create", payload);

      toast.success("Product request submitted successfully!");
      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        subCategory: "",
        phone: "",
        images: [],
      });
      setSelectedCategory(null);
      setAvailableSubcategories([]);
      setImagePreviewUrls([]);
    } catch (error) {
      console.error("Error submitting request:", error);
      if (isUploadingImages) {
        toast.error("Failed to upload images. Please try again.");
      } else {
        toast.error("Failed to submit request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
      setIsUploadingImages(false);
    }
  };

  // Show search results interface when loading OR when search has completed
  if (isSearchLoading || hasSearched) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header hidden={false} />

        {/* Mobile Sticky Search and Filters */}
        <div className="sticky top-0 z-40 bg-white border-b shadow-sm md:hidden">
          <div className="container mx-auto px-4 py-3">
            <SearchBar
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onSearch={handleSearch}
              isMobile
            />

            <SearchFilters
              isFeatured={isFeatured}
              sortBy={sortBy}
              onFilterChange={handleFilterChange}
              isMobile
            />

            {totalResults > 0 && (
              <div className="text-xs text-gray-500 mt-2">
                {totalResults} results found
              </div>
            )}
          </div>
        </div>

        {/* Desktop Search and Filters */}
        <div className="hidden md:block sticky top-0 z-[1000] bg-gray-50 border-b py-4 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex gap-4 items-center">
              <SearchBar
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                onSearch={handleSearch}
              />

              <SearchFilters
                isFeatured={isFeatured}
                sortBy={sortBy}
                onFilterChange={handleFilterChange}
              />
            </div>

            <div className="text-sm text-gray-600 mt-2">
              {isSearchLoading
                ? "Searching..."
                : `${totalResults} results found`}
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="container mx-auto py-6 px-4 md:px-0">
          <SearchResults
            searchResults={searchResults}
            isSearchLoading={isSearchLoading}
            onClearFilters={handleClearFilters}
          />

          {/* Show request product component when no results found */}
          {!isSearchLoading && hasSearched && searchResults.length === 0 && (
            <div className="mt-8">
              <div className="bg-white shadow rounded-lg overflow-hidden w-full">
                <div className="flex flex-col md:flex-row w-full justify-between">
                  <div className="p-6 md:w-1/2">
                    <h2 className="text-xl font-medium mb-2">
                      Request product/services
                    </h2>
                    <p className="text-gray-500 mb-6">
                      If you can't find the product you're looking for, please
                      enter the product or service details below.
                    </p>
                    {/* Product Request Form */}
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      {/* Product Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F058F] focus:border-transparent"
                          placeholder="Enter product name"
                          required
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F058F] focus:border-transparent"
                          rows={3}
                          placeholder="Describe the product you want to request"
                          required
                        />
                      </div>

                      {/* Category and Subcategory */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) =>
                              handleCategoryChange(e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F058F] focus:border-transparent"
                            required
                            disabled={categoriesLoading}
                          >
                            <option value="">
                              {categoriesLoading
                                ? "Loading..."
                                : "Select a category"}
                            </option>
                            {categories.map((category) => (
                              <option key={category._id} value={category._id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subcategory *
                          </label>
                          <select
                            value={formData.subCategory}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                subCategory: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F058F] focus:border-transparent disabled:bg-gray-100"
                            required
                            disabled={
                              !selectedCategory ||
                              availableSubcategories.length === 0
                            }
                          >
                            <option value="">
                              {!selectedCategory
                                ? "Select a category first"
                                : availableSubcategories.length === 0
                                ? "No subcategories available"
                                : "Select a subcategory"}
                            </option>
                            {availableSubcategories.map((subcategory) => (
                              <option
                                key={subcategory._id}
                                value={subcategory._id}
                              >
                                {subcategory.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F058F] focus:border-transparent"
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>

                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Images (Optional - Max 5)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <div className="text-center">
                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                            <div className="mt-2">
                              <label
                                htmlFor="file-upload"
                                className="cursor-pointer"
                              >
                                <span className="mt-2 block text-sm font-medium text-[#1F058F]">
                                  Upload images
                                </span>
                              </label>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG, GIF up to 10MB each
                            </p>
                          </div>
                        </div>

                        {/* Image Previews */}
                        {imagePreviewUrls.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                            {imagePreviewUrls.map((url, index) => (
                              <div key={index} className="relative">
                                <Image
                                  src={url}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-20 object-cover rounded-lg"
                                  width={80}
                                  height={80}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div className="pt-4">
                        <button
                          type="submit"
                          className="w-full px-6 py-3 bg-[#1F058F] text-white rounded-md hover:bg-[#1F058F]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          disabled={isSubmitting}
                        >
                          {isSubmitting && (
                            <Loader2 size={16} className="animate-spin" />
                          )}
                          {isUploadingImages
                            ? "Uploading Images..."
                            : isSubmitting
                            ? "Submitting..."
                            : "Submit Request"}
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="w-full h-auto relative md:w-1/2 p-6 max-sm:hidden bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500">
                      Product image placeholder
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Only show pagination when not loading and there are results */}
          {!isSearchLoading && totalPages > 1 && (
            <SearchPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        <Footer />
      </div>
    );
  }

  // No products found - show request form
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header hidden={false} />
      <div className="container mx-auto py-6 max-md:px-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
          <ChevronRight size={16} />
          <span className="text-gray-700">Search</span>
        </div>

        {/* No Results Message */}
        <div className="flex flex-row gap-0 mb-6">
          <p className="font-semibold">Search results -{searchSlug}</p>
          <p className="font-light">(0 results found)</p>
        </div>

        {/* Request Form */}
        <div className="bg-white shadow rounded-lg overflow-hidden w-full">
          <div className="flex flex-col md:flex-row w-full justify-between">
            <div className="p-6 md:w-1/2">
              <h2 className="text-xl font-medium mb-2">
                Request product/services
              </h2>
              <p className="text-gray-500 mb-6">
                If you can't find the product you're looking for, please enter
                the product or service details below.
              </p>
              {/* Request form would go here - simplified for now */}
              <div className="text-center text-gray-500 py-8">
                Request form component would be here
              </div>
            </div>
            <div className="w-full h-auto relative md:w-1/2 p-6 max-sm:hidden bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500">Product image placeholder</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
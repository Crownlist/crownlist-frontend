"use client";

import { useState, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { Category, Subcategory } from "@/types/category/category";
import { toast } from "sonner";
import { apiClientUser } from "@/lib/interceptor";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export default function ProductRequestForm({
  isOpen,
  onClose,
}: ProductRequestFormProps) {
  const { categories, loading: categoriesLoading } = useCategories();
  // console.log("categories", categories)
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

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
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
    }
  }, [isOpen]);

  // Handle category change
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

  // Handle file selection
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

  // Remove image
  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload image to server
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
    } catch (error) {
      console.error("Image upload error:", error);
      throw new Error("Failed to upload image");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
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

    if (formData.images.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

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
      const response = await fetch("/api/request-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Product request submitted successfully!");
        onClose();
      } else {
        toast.error(result.error || "Failed to submit request");
      }
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Request New Product</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
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
              rows={4}
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
              <Select
                value={formData.category}
                onValueChange={(value) => handleCategoryChange(value)}
                disabled={categoriesLoading}
              >
                <SelectTrigger className="w-full focus:ring-2 focus:ring-[#1F058F] focus:border-transparent">
                  <SelectValue
                    placeholder={
                      categoriesLoading ? "Loading..." : "Select a category"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory *
              </label>
              <Select
                value={formData.subCategory}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    subCategory: value,
                  }))
                }
                disabled={
                  !selectedCategory || availableSubcategories.length === 0
                }
              >
                <SelectTrigger className="w-full focus:ring-2 focus:ring-[#1F058F] focus:border-transparent disabled:bg-gray-100">
                  <SelectValue
                    placeholder={
                      !selectedCategory
                        ? "Select a category first"
                        : availableSubcategories.length === 0
                        ? "No subcategories available"
                        : "Select a subcategory"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableSubcategories.map((subcategory) => (
                    <SelectItem key={subcategory._id} value={subcategory._id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F058F] focus:border-transparent"
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images * (Max 5)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative w-full h-24">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
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
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#1F058F] text-white rounded-md hover:bg-[#1F058F]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isUploadingImages
                ? "Uploading Images..."
                : isSubmitting
                ? "Submitting..."
                : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";
import Image from "next/image";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import {toast} from "sonner";
import { useCategories } from "@/hooks/useCategories";
import { Category, Subcategory } from "@/types/category/category";
import { apiClientUser } from "@/lib/interceptor";

interface EmptyStateProps {
  categorySlug?: string;
  subcategorySlug?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function EmptyState({ categorySlug: _categorySlug, subcategorySlug: _subcategorySlug }: EmptyStateProps) {
  const { categories, loading: categoriesLoading } = useCategories();

  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    phone: "",
  });

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c._id === categoryId);
    setSelectedCategory(category || null);
    setAvailableSubcategories(category?.subCategories || []);
    setFormData(prev => ({
      ...prev,
      category: categoryId,
      subCategory: '' // Reset subcategory when category changes
    }));
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // Allow only numeric input for phone
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    // Filter for valid image types (SVG, PNG, JPG, GIF)
    const validFiles = selectedFiles.filter((file) =>
      ["image/svg+xml", "image/png", "image/jpeg", "image/gif"].includes(
        file.type
      )
    );
    setFiles(validFiles);
  };

  // Handle drag-and-drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    // Filter for valid image types
    const validFiles = droppedFiles.filter((file) =>
      ["image/svg+xml", "image/png", "image/jpeg", "image/gif"].includes(
        file.type
      )
    );
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.category ||
        !formData.subCategory || !formData.phone) {
      toast("Please fill in all required fields");
      return;
    }

    if (formData.description.length < 10) {
      toast.error("Description must be at least 10 characters long.");
      return;
    }

    if (files.length === 0) {
      toast("Please select at least one image");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: First upload images to get URLs
      // const uploadedImages = await uploadImagesToServer(files)

      // For now, simulate uploaded URLs
      const uploadedImages = files.map((file, index) => ({
        url: `https://example.com/uploads/${file.name}`,
        altText: `Image ${index + 1}`,
        isPrimary: index === 0
      }));

      const payload = {
        name: formData.name,
        description: formData.description,
        images: uploadedImages,
        category: formData.category,
        subCategory: formData.subCategory,
        phone: formData.phone
      };

      await apiClientUser.post('/product-requests/create', payload);

      toast.success("Request submitted successfully!");
      setFormData({
        name: "",
        description: "",
        category: "",
        subCategory: "",
        phone: "",
      });
      setSelectedCategory(null);
      setAvailableSubcategories([]);
      setFiles([]);
    } catch (error: unknown) {
      console.error("Submission error:", error);

      // Handle different error formats from backend
      let errorMessage = "An error occurred.";
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 px-4 w-full min-h-[500px]">
      <div className="text-center w-full max-w-none">
        <div className="mb-6 text-purple-600">
          <Image
            src={"/binocular.png"}
            width={60}
            height={60}
            alt="binocular"
            className="mx-auto"
          />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Can&apos;t find what you are looking for?
        </h2>
        <p className="text-gray-600 mb-8">
          Kindly make use of the request form below to let us know what you&apos;re looking for.
        </p>

        {/* Request Product Form */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full">
          <div className="flex flex-col md:flex-row w-full justify-between">
            <div className="p-6" >
              <h3 className="text-xl font-medium mb-2">
                Request product/services
              </h3>
              <p className="text-gray-500 mb-6">
                If you can&apos;t find the product you&apos;re looking for, please
                enter the product or service details below.
              </p>

              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block mb-2 text-sm font-medium text-start">Product Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={(e) => {
                      const filteredValue = e.target.value.replace(/[0-9]/g, "");
                      setFormData((prev) => ({ ...prev, name: filteredValue }));
                    }}
                    className="w-full"
                    pattern="[A-Za-z\s]+"
                    title="Only letters and spaces are allowed"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-start">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]+"
                    title="Phone number must be numeric"
                    className="w-full"
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-start">Category</label>
                    <Select
                      value={formData.category}
                      onValueChange={handleCategoryChange}
                      disabled={categoriesLoading}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={categoriesLoading ? "Loading..." : "Select a category"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-start">Subcategory</label>
                    <Select
                      value={formData.subCategory}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, subCategory: value }))}
                      disabled={!selectedCategory || availableSubcategories.length === 0}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={
                          !selectedCategory
                            ? "Select a category first"
                            : availableSubcategories.length === 0
                              ? "No subcategories available"
                              : "Select a subcategory"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubcategories.map((sub) => (
                          <SelectItem key={sub._id} value={sub._id}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-start">Image(s)</label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-[#1F058F] transition-colors"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <input
                      type="file"
                      accept="image/svg+xml,image/png,image/jpeg,image/gif"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Upload size={24} className="text-gray-400" />
                        <div className="text-sm">
                          <span className="text-[#1F058F] font-medium">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </div>
                        <div className="text-xs text-gray-400">
                          SVG, PNG, JPG or GIF (max. 800×400px)
                        </div>
                      </div>
                    </label>
                    {files.length > 0 && (
                      <div className="mt-4 text-sm text-gray-600">
                        <p>Selected files:</p>
                        <ul className="list-disc list-inside mt-2">
                          {files.map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-start">Description</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full min-h-[100px]"
                    placeholder="Describe the product or service you're looking for..."
                    required
                  />
                </div>
                <div className="flex w-full justify-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full max-w-md bg-[#1F058F] hover:bg-[#2a0bc0] text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Request product"}
                  </Button>
                </div>
              </form>
            </div>
            <div className="w-full h-auto relative  p-6 max-sm:hidden">
              <Image
                src="/hanger.png"
                alt="Clothing on hangers"
                width={600}
                height={600}
                className="object-cover h-full w-full rounded-r-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

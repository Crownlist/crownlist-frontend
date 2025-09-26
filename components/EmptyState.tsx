"use client";
import Image from "next/image";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCategories } from "@/hooks/useCategories";

interface EmptyStateProps {
  categorySlug?: string;
  subcategorySlug?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function EmptyState({ categorySlug: _categorySlug, subcategorySlug: _subcategorySlug }: EmptyStateProps) {
  // State for form data
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    description: "",
    category: "",
  });

  const { categories } = useCategories();

  const [files, setFiles] = useState<File[]>([]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "contactNumber") {
      // Allow only numeric input
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

    if (!/^[0-9]+$/.test(formData.contactNumber)) {
      toast("Contact number must be numeric.");
      return;
    }

    try {
      const response = await fetch("/api/request-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast("Request submitted successfully!");
        setFormData({
          fullName: "",
          contactNumber: "",
          description: "",
          category: "",
        });
        setFiles([]);
      } else {
        toast("Error submitting request.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast("An error occurred.");
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
                  <label className="block mb-2 text-sm font-medium text-start">Full name</label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={(e) => {
                      // Remove any numbers from input
                      const value = e.target.value.replace(/[0-9]/g, "");
                      handleChange({
                        ...e,
                        target: {
                          ...e.target,
                          value,
                        },
                      });
                    }}
                    className="w-full"
                    pattern="[A-Za-z\s]+"
                    title="Only letters and spaces are allowed"
                    onKeyPress={(e) => {
                      if (!/[A-Za-z\s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-start">
                    Contact number
                  </label>
                  <Input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    pattern="[0-9]+"
                    title="Contact number must be numeric"
                    className="w-full"
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-start">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1F058F] focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
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
                    className="w-full max-w-md bg-[#1F058F] hover:bg-[#2a0bc0] text-white py-3"
                  >
                    Request product
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

/* eslint-disable @next/next/no-img-element */
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ReactSelect from "react-select";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Subcategory,
  UploadedImage,
  LimitsCheckResult,
  Category,
} from "../types";
import { formatNumberInput, parseFormattedNumber } from "../utils/helpers";
import { nigeriaCities } from "../../../../../../constants/nigeriaCities";

interface ProductDetailsStepProps {
  // Form data
  productName: string;
  setProductName: (name: string) => void;
  formData: {
    description: string;
    price: string;
    discountPrice: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      images: string[];
      price: string;
      discountPrice: string;
      description: string;
      overview: string;
      contactInfo: {
        fullName: string;
        phoneNumber: string;
      };
    }>
  >;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedCategory: string | null;
  categories: Category[];
  selectedSubcategory: string | null;
  subcategories: Subcategory[];
  onSubcategoryChange: (subcategoryId: string | null) => void;
  loadingSubcategories: boolean;

  // Features
  selectedFeatures: string[];
  featureInput: string;
  setFeatureInput: React.Dispatch<React.SetStateAction<string>>;
  addFeatures: (raw: string) => void;
  removeFeature: (feature: string) => void;

  // Images
  uploadedImages: UploadedImage[];
  uploadingImage: boolean;
  onFilesSelected: (files: FileList | null) => void;
  setPrimaryImage: (index: number) => void;
  removeImage: (index: number) => void;
  updateAltText: (index: number, value: string) => void;

  // Limits
  limitsCheckResult: LimitsCheckResult | null;
  checkingLimits: boolean;
}

export const ProductDetailsStep = ({
  productName,
  setProductName,
  formData,
  setFormData,
  selectedCountry,
  setSelectedCountry,
  selectedCity,
  setSelectedCity,
  selectedCategory,
  categories,
  selectedSubcategory,
  subcategories,
  onSubcategoryChange,
  loadingSubcategories,
  selectedFeatures,
  featureInput,
  setFeatureInput,
  addFeatures,
  removeFeature,
  uploadedImages,
  uploadingImage,
  onFilesSelected,
  setPrimaryImage,
  removeImage,
  updateAltText,
  limitsCheckResult,
  checkingLimits,
}: ProductDetailsStepProps) => {
  const countryOptions = ["Nigeria"];
  const cityOptionsMap: Record<string, string[]> = {
    Nigeria: nigeriaCities,
  };

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link
          href="/seller/product"
          className="hover:text-[#1F058F] text-[17px] transition-colors"
        >
          Products
        </Link>
        <ArrowRight className="w-3 h-3" />
        <span className="text-[#1F058F] font-medium text-[17px]">
          Post details
        </span>
      </div>

      <div className="flex-1">
        <h1 className="text-2xl font-semibold">Post details</h1>
        <p className="text-gray-500">Enter post details below</p>
      </div>

      <div className="flex flex-col md:flex-row gap-10 flex-1 w-full mt-5">
        <div className="order-2 md:order-1 flex w-full flex-col gap-10">
          {/* Image upload */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Product images
            </label>
            <div className="border-2 border-dashed rounded-lg p-6 bg-gray-50">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="text-sm text-gray-600">
                  <div className="font-medium">Upload product images</div>
                  <div className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB each
                  </div>
                </div>
                <label className="inline-flex items-center px-4 py-2 bg-[#1F058F] text-white rounded-md cursor-pointer hover:bg-[#1F058F]/90">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={(e) => onFilesSelected(e.target.files)}
                  />
                  Choose files
                </label>
              </div>
              {uploadingImage && (
                <p className="text-xs text-gray-500 mt-2">Uploading...</p>
              )}
            </div>
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="border rounded-md p-2 space-y-2">
                    <img
                      src={img.url}
                      alt={img.altText || `Image ${idx + 1}`}
                      className="w-full h-28 object-cover rounded"
                    />
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        className={`text-xs px-2 py-1 rounded ${
                          img.isPrimary
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                        onClick={() => setPrimaryImage(idx)}
                      >
                        {img.isPrimary ? "Primary" : "Set primary"}
                      </button>
                      <button
                        type="button"
                        className="text-xs text-red-600"
                        onClick={() => removeImage(idx)}
                      >
                        Remove
                      </button>
                    </div>
                    <Input
                      value={img.altText || ""}
                      onChange={(e) => updateAltText(idx, e.target.value)}
                      placeholder="Alt text (optional)"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product name
              </label>
              <Input
                placeholder="Enter product name"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <ReactSelect
                value={
                  countryOptions.find((ct) => ct === selectedCountry)
                    ? { value: selectedCountry, label: selectedCountry }
                    : null
                }
                onChange={(option) => {
                  setSelectedCountry(option?.value || "");
                  setSelectedCity("");
                }}
                options={countryOptions.map((ct) => ({
                  value: ct,
                  label: ct,
                }))}
                placeholder="Select country"
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "40px",
                    borderColor: "#d1d5db",
                    "&:hover": {
                      borderColor: "#9ca3af",
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    maxHeight: "250px",
                  }),
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <ReactSelect
                isDisabled={!selectedCountry}
                value={
                  (cityOptionsMap[selectedCountry] || []).find(
                    (city) => city === selectedCity
                  )
                    ? { value: selectedCity, label: selectedCity }
                    : null
                }
                onChange={(option) => setSelectedCity(option?.value || "")}
                options={(cityOptionsMap[selectedCountry] || []).map(
                  (city) => ({ value: city, label: city })
                )}
                placeholder={
                  selectedCountry ? "Select city" : "Select country first"
                }
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "40px",
                    borderColor: "#d1d5db",
                    "&:hover": {
                      borderColor: "#9ca3af",
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    maxHeight: "250px",
                  }),
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <div className="relative">
                <Input
                  value={
                    categories.find((c) => c._id === selectedCategory)?.name ||
                    ""
                  }
                  className="bg-gray-100"
                  readOnly
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub-category
              </label>
              <ReactSelect
                value={
                  subcategories.find((sub) => sub._id === selectedSubcategory)
                    ? {
                        value: selectedSubcategory,
                        label: subcategories.find(
                          (sub) => sub._id === selectedSubcategory
                        )!.name,
                      }
                    : null
                }
                onChange={(option) =>
                  onSubcategoryChange(option?.value || null)
                }
                options={subcategories.map((sub) => ({
                  value: sub._id,
                  label: sub.name,
                }))}
                isDisabled={loadingSubcategories}
                placeholder={
                  loadingSubcategories ? "Loading..." : "Select sub-category"
                }
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "40px",
                    borderColor: "#d1d5db",
                    "&:hover": {
                      borderColor: "#9ca3af",
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    maxHeight: "250px",
                  }),
                }}
              />
              {/* Limits Warning */}
              {checkingLimits && selectedSubcategory && (
                <div className="mt-2 flex items-center gap-2 text-sm text-amber-600">
                  <div className="animate-spin rounded-full h-3 w-3 border border-amber-600 border-t-transparent"></div>
                  Checking limits...
                </div>
              )}
              {limitsCheckResult?.isSubcategoryNotInPlan && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <div className="text-red-600 mt-0.5">🚫</div>
                    <div className="text-sm text-red-800">
                      <div className="font-medium">
                        Subcategory Not Available in Your Plan
                      </div>
                      <div>
                        This subcategory is not included in your current{" "}
                        {limitsCheckResult.planName} subscription plan.
                      </div>
                      <div className="mt-1 font-medium">
                        Please select a different subcategory or upgrade your
                        plan to access more categories.
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {limitsCheckResult?.isAtLimit &&
                !limitsCheckResult?.isSubcategoryNotInPlan && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-start gap-2">
                      <div className="text-red-600 mt-0.5">⚠</div>
                      <div className="text-sm text-red-800">
                        <div className="font-medium">Listing Limit Reached</div>
                        <div>
                          You&apos;ve already posted{" "}
                          {limitsCheckResult.currentCount} out of{" "}
                          {limitsCheckResult.limit} allowed products in this
                          subcategory ({limitsCheckResult.planName} plan).
                        </div>
                        <div className="mt-1 font-medium">
                          Please select a different subcategory or upgrade your
                          plan.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Regular price
              </label>
              <Input
                placeholder="Enter price"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: formatNumberInput(e.target.value),
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Price{" "}
                <span className="pl-1 font-extralight text-gray-400">
                  (optional)
                </span>
              </label>
              <Input
                placeholder="NGN ₦"
                type="text"
                inputMode="numeric"
                value={formData.discountPrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    discountPrice: formatNumberInput(e.target.value),
                  }))
                }
                onBlur={() => {
                  const priceVal = parseFormattedNumber(formData.price);
                  const discVal = parseFormattedNumber(formData.discountPrice);
                  if (discVal && priceVal && discVal >= priceVal) {
                    toast.error("Discount price must be less than the price");
                    setFormData((prev) => ({ ...prev, discountPrice: "" }));
                  }
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              placeholder="Enter description"
              className="min-h-[120px]"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (optional)
            </label>
            <div className="flex flex-wrap items-center gap-2 border rounded-md p-2">
              {selectedFeatures.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  <span className="text-xs">{f}</span>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-red-600 leading-none"
                    onClick={() => removeFeature(f)}
                    aria-label={`Remove ${f}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                className="flex-1 min-w-[150px] outline-none border-none bg-transparent text-sm px-1 py-1"
                placeholder={
                  selectedFeatures.length
                    ? "Type and press Enter"
                    : "Type a feature and press Enter"
                }
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addFeatures(featureInput);
                  } else if (
                    e.key === "Backspace" &&
                    !featureInput &&
                    selectedFeatures.length
                  ) {
                    removeFeature(
                      selectedFeatures[selectedFeatures.length - 1]
                    );
                  }
                }}
                onBlur={() => addFeatures(featureInput)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Press Enter or comma to add. Features will be sent as an array.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

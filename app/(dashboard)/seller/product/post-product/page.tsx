/* eslint-disable */
"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { apiClientUser } from "@/lib/interceptor";
import { useGetSubscription } from "@/lib/useGetSubscription";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

// Import modular components and hooks
import { CategorySelectionStep } from "./components/CategorySelectionStep";
import { ProductDetailsStep } from "./components/ProductDetailsStep";
import { ProductFormStepper } from "./components/ProductFormStepper";
import { FacilitiesStep } from "./components/FacilitiesStep";
import { useCategories } from "./hooks/useCategories";
import { useImageUpload } from "./hooks/useImageUpload";
import { useFacilities } from "./hooks/useFacilities";
import { useSubscriptionLimits } from "./hooks/useSubscriptionLimits";

// Import utilities
import { formatFacilityValueForApi, getFacilityKey } from "./utils/helpers";

export default function ProductPostFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setIsSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    images: [] as string[],
    price: "",
    discountPrice: "",
    description: "",
    overview: "",
    contactInfo: {
      fullName: "",
      phoneNumber: "",
    },
  });

  // Edit mode support
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const [originalCatId, setOriginalCatId] = useState<string | null>(null);
  const [originalSubId, setOriginalSubId] = useState<string | null>(null);

  // Confirmation modals state
  const [submitConfirm, setSubmitConfirm] = useState(false);
  const [submitCancel, setSubmitCancel] = useState(false);

  // Product name state
  const [productName, setProductName] = useState("");

  // Listing location state
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Features (seller-defined tags)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  // Selected category and subcategory
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );

  // Facilities state for object-type field options
  const [objectFieldOptions, setObjectFieldOptions] = useState<
    Record<string, string[]>
  >({});
  const [loadingObjectFields, setLoadingObjectFields] = useState<
    Record<string, boolean>
  >({});

  // Facility interface
  interface Facility {
    _id?: string;
    label: string;
    description: string;
    mandatory: boolean;
    filterable: boolean;
    isActive: boolean;
    dataType: "string" | "number" | "boolean" | "array" | "object";
    selectType?: "single" | "multiple";
    value?: string;
  }

  // Use custom hooks
  const { subscriptionData, isLoading: isLoadingSubscription } =
    useGetSubscription();
  console.log("selectedCategory in page.tsx:", selectedCategory);
  const { categories, subcategories, loading } =
    useCategories(selectedCategory);
  console.log("subcategories from hook:", subcategories);
  const {
    uploadedImages,
    uploadingImage,
    handleFilesSelected,
    setPrimaryImage,
    removeImage,
    updateAltText,
    uploadAllImages,
  } = useImageUpload();
  const {
    facilityValues,
    handleFacilityChange,
    mapProductFacilities,
    clearFacilitiesOnSubcategoryChange,
    loadObjectFieldOptions,
  } = useFacilities();
  const { limitsCheckResult, checkingLimits, checkLimitsBeforeSubmit } =
    useSubscriptionLimits(
      selectedSubcategory,
      selectedCategory,
      subscriptionData as any,
      isLoadingSubscription
    );

  // Effects for edit mode

  useEffect(() => {
    if (editId) {
      const prefill = async () => {
        try {
          const res = await apiClientUser.get(`/products/one/${editId}`);
          const p = res?.data?.product || res;
          setProductName(p?.name || "");
          setFormData((prev) => ({
            ...prev,
            description: p?.description || "",
            price:
              p?.price?.currentPrice != null
                ? Number(p.price.currentPrice).toLocaleString()
                : "",
            discountPrice:
              p?.price?.discountedPrice != null
                ? Number(p.price.discountedPrice).toLocaleString()
                : "",
          }));

          // Category/Subcategory
          if (p?.category) {
            const catId =
              typeof p.category === "string"
                ? p.category
                : p.category?._id || p.category?.id;
            if (catId) {
              setOriginalCatId(catId);
              setSelectedCategory(catId);
            }
          }
          if (p?.subCategory) {
            const subId =
              typeof p.subCategory === "string"
                ? p.subCategory
                : p.subCategory?._id || p.subCategory?.id;
            if (subId) {
              setOriginalSubId(subId);
              setSelectedSubcategory(subId);
            }
          }

          // Location and features
          if (p?.listingLocation?.country)
            setSelectedCountry(p.listingLocation.country);
          if (p?.listingLocation?.city) setSelectedCity(p.listingLocation.city);
          if (Array.isArray(p?.features))
            setSelectedFeatures(p.features.filter(Boolean));

          setEditProduct(p);
          toast.success("Loaded product for editing");
        } catch (e: any) {
          toast.error(e?.message || "Failed to load product for editing");
        }
      };
      prefill();
    }
  }, [editId]);

  // Move to step 2 in edit mode after categories load
  useEffect(() => {
    if (!editProduct || !editId) return;
    const catId =
      typeof editProduct.category === "string"
        ? editProduct.category
        : editProduct.category?._id || editProduct.category?.id;
    const subId =
      typeof editProduct.subCategory === "string"
        ? editProduct.subCategory
        : editProduct.subCategory?._id || editProduct.subCategory?.id;
    if (catId && selectedCategory !== catId) setSelectedCategory(catId);
    if (subId && selectedSubcategory !== subId) setSelectedSubcategory(subId);
    setStep((s) => (s < 2 ? 2 : s));

    // Prefill facility values for edit mode once we know the subcategory
    try {
      mapProductFacilities(
        editProduct,
        subId || selectedSubcategory,
        originalSubId,
        subcategories,
        editId
      );
    } catch (err) {
      console.error("Failed to map product facilities:", err);
    }
  }, [categories, subcategories, editProduct, editId]);

  // Fetch options for object-type facilities
  useEffect(() => {
    const currentSub = subcategories.find(
      (sub) => sub._id === selectedSubcategory
    );
    if (!currentSub) return;

    const objectFacilities = currentSub.facilities.filter(
      (f) => f.dataType === "object" && f.value
    );

    objectFacilities.forEach(async (facility) => {
      const facilityKey = getFacilityKey(facility);
      if (objectFieldOptions[facilityKey]) return;

      try {
        setLoadingObjectFields((prev) => ({
          ...prev,
          [facilityKey]: true,
        }));
        const endpoint = facility.value as string;
        const res = await apiClientUser.get(endpoint);
        const data = res?.data?.data || res?.data;
        const options = Array.isArray(data?.value) ? data.value : [];
        setObjectFieldOptions((prev) => ({
          ...prev,
          [facilityKey]: options,
        }));
      } catch (e: any) {
        console.error(`Failed to load options for ${facility.label}:`, e);
        toast.error(`Failed to load options for ${facility.label}`);
      } finally {
        setLoadingObjectFields((prev) => ({
          ...prev,
          [facilityKey]: false,
        }));
      }
    });
  }, [selectedSubcategory, subcategories]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const handleModal = () => {
    setSubmitConfirm(true);
  };

  const handleCancel = () => {
    router.push("/seller/product");
  };

  // Features management
  const addFeatures = (raw: string) => {
    if (!raw) return;
    const tokens = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!tokens.length) return;
    setSelectedFeatures((prev) => {
      const set = new Set(prev);
      tokens.forEach((t) => set.add(t));
      return Array.from(set);
    });
    setFeatureInput("");
  };

  const removeFeature = (feature: string) => {
    setSelectedFeatures((prev) => prev.filter((f) => f !== feature));
  };

  // =============================
  // Facility Array Helpers
  // =============================
  const getArrayOptions = (facility: Facility): string[] => {
    const raw = facility.value as any;
    if (raw == null) return [];
    // Try JSON array first
    try {
      const parsed = JSON.parse(String(raw));
      if (Array.isArray(parsed))
        return parsed.map((x) => String(x)).filter(Boolean);
    } catch {}
    // Fallback: comma-separated string
    return String(raw)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const getFacilityArrayValue = (facilityId: string): string[] => {
    const v = facilityValues[facilityId];
    return Array.isArray(v) ? (v as string[]) : [];
  };

  const toggleMultiOption = (
    facilityId: string,
    option: string,
    checked: boolean
  ) => {
    handleFacilityChange(
      facilityId,
      checked
        ? [...getFacilityArrayValue(facilityId), option]
        : getFacilityArrayValue(facilityId).filter((x) => x !== option)
    );
  };

  const handleContinue = () => {
    // Validation based on step
    if (step === 1 && !selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    if (step === 2 && !selectedSubcategory) {
      toast.error("Please select a subcategory");
      return;
    }
    if (step === 3) {
      // Submit on step 3
      handleSubmit();
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Check subscription limits
      if (selectedSubcategory && subscriptionData?.data?.subscription) {
        try {
          const limitsResult = await checkLimitsBeforeSubmit(
            selectedSubcategory
          );
          if (limitsResult) {
            const { currentProductCount, listingLimit } = limitsResult;
            if (listingLimit && currentProductCount >= listingLimit.limit) {
              toast.error(
                `You've reached the limit of ${listingLimit.limit} products for this subcategory (${limitsResult.subscriptionPlanId.name} plan). Upgrade your plan to post more products.`
              );
              return;
            }
          }
        } catch (limitError) {
          console.error("Error checking limits:", limitError);
        }
      }

      // Prevent submit while uploading images
      if (uploadingImage) {
        toast.error("Please wait for images to finish uploading");
        return;
      }

      // Require at least one image
      if (!uploadedImages.length) {
        toast.error("Please upload at least one image before submitting");
        return;
      }

      // Validate required fields
      if (!selectedCategory) {
        toast.error("Category is required");
        return;
      }
      if (!selectedSubcategory) {
        toast.error("Subcategory is required");
        return;
      }
      if (!formData.description || !formData.description.trim()) {
        toast.error("Description is required");
        return;
      }
      if (formData.description.length < 10) {
        toast.error("Description must be at least 10 characters long.");
        return;
      }
      if (!productName || !productName.trim()) {
        toast.error("Product name is required");
        return;
      }
      if (!selectedCountry) {
        toast.error("Country is required");
        return;
      }
      if (!selectedCity) {
        toast.error("City is required");
        return;
      }
      if (!formData.price) {
        toast.error("Please provide a price");
        return;
      }

      const priceNum = Number(String(formData.price).replace(/,/g, ""));
      const discountNum = formData.discountPrice
        ? Number(String(formData.discountPrice).replace(/,/g, ""))
        : undefined;

      if (!isFinite(priceNum) || priceNum <= 0) {
        toast.error("Please enter a valid price");
        return;
      }
      if (discountNum !== undefined) {
        if (!isFinite(discountNum) || discountNum <= 0) {
          toast.error("Please enter a valid discount price");
          return;
        }
        if (discountNum >= priceNum) {
          toast.error("Discount price must be less than the price");
          return;
        }
      }

      // Upload images
      const finalImages = await uploadAllImages();
      if (!finalImages || !finalImages.length) {
        toast.error("Image upload failed. Please try again");
        return;
      }

      // Ensure one primary is set
      if (!finalImages.some((i) => i.isPrimary)) {
        finalImages[0].isPrimary = true;
      }

      // Map facilities
      const currentSub = subcategories.find(
        (sub) => sub._id === selectedSubcategory
      );
      const facilitiesArr: Array<{ label: string; value: any }> = [];
      if (currentSub) {
        for (const f of currentSub.facilities || []) {
          const raw = facilityValues[getFacilityKey(f)];
          if (raw === undefined) continue;
          let value: any = raw;
          if (f.dataType === "number") value = Number(raw);
          if (f.dataType === "array")
            value = Array.isArray(raw) ? raw : raw ? [raw] : [];
          if (f.dataType === "boolean") value = Boolean(raw);
          if (f.dataType === "string") value = String(raw);
          if (f.dataType === "object") value = String(raw);
          facilitiesArr.push({ label: f.label, value });
        }
      }

      // Validate mandatory facilities
      const mandatoryInSchema =
        currentSub?.facilities.filter((f) => f.mandatory) || [];
      if (mandatoryInSchema.length) {
        const missingMandatory: string[] = [];
        for (const m of mandatoryInSchema) {
          const has = facilitiesArr.some(
            (x) =>
              x.label === m.label &&
              (m.dataType !== "array"
                ? x.value !== undefined && x.value !== ""
                : Array.isArray(x.value) && x.value.length)
          );
          if (!has) missingMandatory.push(m.label);
        }
        if (missingMandatory.length) {
          toast.error(
            `Please fill required fields: ${missingMandatory.join(", ")}`
          );
          return;
        }
      }

      const priceObj: Record<string, number> = { currentPrice: priceNum };
      if (discountNum !== undefined) priceObj.discountedPrice = discountNum;

      const payload = {
        name: productName.trim(),
        description: formData.description,
        images: finalImages,
        category: selectedCategory,
        subCategory: selectedSubcategory,
        facilities: facilitiesArr.map((f) => ({
          label: f.label,
          value: formatFacilityValueForApi(f.value),
        })),
        price: priceObj,
        listingLocation: { country: selectedCountry, city: selectedCity },
        features: selectedFeatures,
        status: "reviewing",
      };

      // Create vs Update
      console.log("Submitting product payload:", payload);
      if (editId) {
        await apiClientUser.patch(`/products/update/${editId}`, payload);
        toast.success("Product updated successfully");
      } else {
        await apiClientUser.post("/products/create", payload);
        toast.success("Product submitted successfully");
      }
      router.replace("/seller/product");
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || String(e);
      toast.error(`Submission failed: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (editId) {
      // In edit mode, do not allow going back to step 1
      if (step <= 2) return;
      setStep(step - 1);
      return;
    }
    step > 1 && setStep(step - 1);
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col-reverse md:flex-row gap-10 flex-1">
            <CategorySelectionStep
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              loading={loading.categories}
            />
            <ProductFormStepper currentStep={step} />
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col-reverse md:flex-row gap-10 flex-1">
            <ProductDetailsStep
              productName={productName}
              setProductName={setProductName}
              formData={formData}
              setFormData={setFormData}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedCategory={selectedCategory}
              categories={categories}
              selectedSubcategory={selectedSubcategory}
              subcategories={subcategories}
              onSubcategoryChange={setSelectedSubcategory}
              loadingSubcategories={loading.subcategories}
              selectedFeatures={selectedFeatures}
              featureInput={featureInput}
              setFeatureInput={setFeatureInput}
              addFeatures={addFeatures}
              removeFeature={removeFeature}
              uploadedImages={uploadedImages}
              uploadingImage={uploadingImage}
              onFilesSelected={handleFilesSelected}
              setPrimaryImage={setPrimaryImage}
              removeImage={removeImage}
              updateAltText={updateAltText}
              limitsCheckResult={limitsCheckResult}
              checkingLimits={checkingLimits}
            />
            <ProductFormStepper currentStep={step} />
          </div>
        );

      case 3:
        return (
          <FacilitiesStep
            subcategories={subcategories}
            selectedSubcategory={selectedSubcategory}
            facilityValues={facilityValues}
            objectFieldOptions={objectFieldOptions}
            loadingObjectFields={loadingObjectFields}
            handleFacilityChange={handleFacilityChange}
            getFacilityKey={getFacilityKey}
            getArrayOptions={getArrayOptions}
            getFacilityArrayValue={getFacilityArrayValue}
            toggleMultiOption={toggleMultiOption}
            currentStep={step}
          />
        );

      case 5:
        return (
          <div className="flex flex-col min-h-[80dvh] w-full h-full justify-center items-center align-middle">
            <div className="mb-4 flex justify-center">
              <Image src="/hourglass.png" width={80} height={80} alt="box" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Post is under review</h2>
            <p className="text-gray-500 mb-8">
              Your post is under review will be live upon approval. If there's
              any issue we will communicate it with you
            </p>
            <div className="flex flex-row gap-10">
              <Link href="/seller/product">
                <Button className="bg-[#1F058F] hover:bg-[#2e0a94] text-white px-8 py-2 rounded-full">
                  See Post
                </Button>
              </Link>
              <Link href="/seller/dashboard">
                <Button className="border border-[#1F058F] hover:bg-[#2e0a94] hover:text-white text-black px-8 py-2 bg-white rounded-full">
                  Go Back Home
                </Button>
              </Link>
            </div>
            <div className="mt-16 text-center text-gray-600 text-sm">
              <p>For further assistance reach out via our 24/7</p>
              <p>
                via email at{" "}
                <a
                  href="mailto:support@crownlist.com"
                  className="text-[#1F058F]"
                >
                  support@crownlist.com
                </a>
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1">
      <div
        className="flex flex-col w-full mx-auto bg-white p-6"
        style={{ minHeight: "calc(var(--vh, 1vh) * 100)" }}
      >
        <div className="flex flex-col h-full mx-auto w-full  overflow-hidden md:pt-3">
          {renderCurrentStep()}

          {/* Action Buttons */}
          <div
            className={`flex flex-col gap-2 mt-10 ${
              step === 5 ? "hidden" : ""
            }`}
          >
            <div className="flex gap-3 items-center max-w-dvh">
              {step > 1 && (
                <Button
                  variant="outline"
                  className="border-[#1F058F] grow bg-transparent text-[#1F058F] hover:bg-[#1F058F]/10 px-8"
                  onClick={handleBack}
                  disabled={submitting}
                >
                  Back
                </Button>
              )}
              <Button
                variant="default"
                className="bg-[#1F058F]  grow hover:bg-[#1F058F]/90 px-8"
                onClick={step === 3 ? handleModal : handleContinue}
                disabled={
                  submitting ||
                  (step >= 2 &&
                    (limitsCheckResult?.isAtLimit ||
                      limitsCheckResult?.isSubcategoryNotInPlan))
                }
              >
                {step === 3 ? "Submit" : "Continue"}
              </Button>
            </div>
            <Button
              variant="outline"
              className="border-[#1F058F] text-[#1F058F] max-w-dvh hover:bg-[#1F058F]/10 px-8"
              onClick={() => setSubmitCancel(true)}
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={submitConfirm}
        onClose={() => setSubmitConfirm(false)}
        onConfirm={handleContinue}
        title="Submit Product"
        description="Are you sure you want to create this product?"
        confirmText={submitting ? "Submitting..." : "Submit"}
        isPending={submitting}
      />

      <ConfirmationModal
        isOpen={submitCancel}
        onClose={() => setSubmitCancel(false)}
        onConfirm={handleCancel}
        title="Cancel Product"
        description="Are you sure you want to cancel this product?"
        confirmText={submitting ? "Submitting..." : "Cancel"}
        isPending={submitting}
        colour
      />
    </div>
  );
}

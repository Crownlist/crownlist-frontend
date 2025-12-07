/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { PlanForm } from "./PlanForm";
import { useSubscriptionPlans } from "../hooks/useSubscriptionPlans";
import { useAdminCategories } from "../hooks/useAdminCategories";
import { CreatePlanForm, ValidationErrors } from "../types";

interface CreatePlanDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreatePlanDialog = ({
  isOpen,
  onOpenChange,
}: CreatePlanDialogProps) => {
  const { createPlan, validateForm } = useSubscriptionPlans();
  const [isCreating, setIsCreating] = useState(false);
  const {
    categories,
    subcategoriesByCat,
    loadingCats,
    loadingSubs,
    fetchSubcategories,
    fetchSubcategory,
  } = useAdminCategories();

  const [formData, setFormData] = useState<CreatePlanForm>({
    name: "",
    description: "",
    features: [],
    listingLimit: [],
    amount: "",
    billing_cycle: "monthly",
    status: "active",
  });
  const [featuresInput, setFeaturesInput] = useState<string>("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [apiError, setApiError] = useState<string>("");

  // Listing limit helpers
  const [selectedCatForLimit, setSelectedCatForLimit] = useState<string>("");
  const [selectedSubForLimit, setSelectedSubForLimit] = useState<string>("");
  const [limitValue, setLimitValue] = useState<number | "">("");
  const [subcategoryNames, setSubcategoryNames] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const loadSubcategoryNames = async () => {
      const names: Record<string, string> = {};
      for (const item of formData.listingLimit) {
        const subId =
          typeof item.subCategory === "string"
            ? item.subCategory
            : item.subCategory?._id;
        if (subId && !subcategoryNames[subId]) {
          const sub = await fetchSubcategory(subId);
          if (sub?.name) {
            names[subId] = sub.name;
          }
        }
      }
      if (Object.keys(names).length > 0) {
        setSubcategoryNames((prev) => ({ ...prev, ...names }));
      }
    };

    loadSubcategoryNames();
  }, [formData.listingLimit, fetchSubcategory, subcategoryNames]);

  const addListingLimitItem = () => {
    if (!selectedSubForLimit) {
      toast.error("Select a subcategory");
      return;
    }
    const lim =
      typeof limitValue === "number" ? limitValue : Number(limitValue);
    if (!lim || lim <= 0) {
      toast.error("Enter a valid limit");
      return;
    }
    setFormData((prev) => {
      const existsIdx = prev.listingLimit.findIndex(
        (it) =>
          (typeof it.subCategory === "string"
            ? it.subCategory
            : it.subCategory?._id) === selectedSubForLimit
      );
      const next = [...prev.listingLimit];
      if (existsIdx >= 0)
        next[existsIdx] = {
          ...next[existsIdx],
          subCategory: selectedSubForLimit,
          limit: lim,
        };
      else next.push({ subCategory: selectedSubForLimit, limit: lim });
      return { ...prev, listingLimit: next };
    });
    setLimitValue("");
    setSelectedCatForLimit("");
    setSelectedSubForLimit("");
  };

  const removeListingLimitItem = (subId: string) => {
    setFormData((prev) => ({
      ...prev,
      listingLimit: prev.listingLimit.filter(
        (it) =>
          (typeof it.subCategory === "string"
            ? it.subCategory
            : it.subCategory?._id) !== subId
      ),
    }));
  };

  const handleCreate = async () => {
    if (!validateForm(formData, featuresInput)) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    try {
      setIsCreating(true);
      setApiError(""); // Clear any previous errors
      await createPlan(formData, featuresInput);
      // reset
      setFormData({
        name: "",
        description: "",
        features: [],
        listingLimit: [],
        amount: "",
        billing_cycle: "monthly",
        status: "active",
      });
      setFeaturesInput("");
      setSelectedCatForLimit("");
      setSelectedSubForLimit("");
      setLimitValue("");
      onOpenChange(false);
    } catch (error: unknown) {
      // Handle API errors
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error as any)?.message ||
        "An error occurred while creating the plan";
      setApiError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setFormData({
        name: "",
        description: "",
        features: [],
        listingLimit: [],
        amount: "",
        billing_cycle: "monthly",
        status: "active",
      });
      setFeaturesInput("");
      setErrors({});
      setApiError("");
      setSelectedCatForLimit("");
      setSelectedSubForLimit("");
      setLimitValue("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-[#1F058F] hover:bg-[#1F058F]/90">
          <Plus className="mr-2 h-4 w-4" />
          Create Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-[1190px]">
        <DialogHeader>
          <DialogTitle>Create Subscription Plan</DialogTitle>
        </DialogHeader>
        <PlanForm
          formData={formData}
          setFormData={setFormData}
          featuresInput={featuresInput}
          setFeaturesInput={setFeaturesInput}
          errors={errors}
          setErrors={setErrors}
          categories={categories}
          subcategoriesByCat={subcategoriesByCat}
          loadingCats={loadingCats}
          loadingSubs={loadingSubs}
          selectedCatForLimit={selectedCatForLimit}
          setSelectedCatForLimit={setSelectedCatForLimit}
          selectedSubForLimit={selectedSubForLimit}
          setSelectedSubForLimit={setSelectedSubForLimit}
          limitValue={limitValue}
          setLimitValue={setLimitValue}
          onAddLimitItem={addListingLimitItem}
          onRemoveLimitItem={removeListingLimitItem}
          fetchSubcategories={fetchSubcategories}
          subcategoryNames={subcategoryNames}
        />
        {apiError && (
          <div className="px-6 py-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{apiError}</p>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-[#1F058F] hover:bg-[#1F058F]/90"
            onClick={handleCreate}
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

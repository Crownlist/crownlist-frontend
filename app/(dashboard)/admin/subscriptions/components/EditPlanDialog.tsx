/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { PlanForm } from "./PlanForm";
import { useSubscriptionPlans } from "../hooks/useSubscriptionPlans";
import { useAdminCategories } from "../hooks/useAdminCategories";
import { SubscriptionPlan, CreatePlanForm, ValidationErrors } from "../types";

interface EditPlanDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SubscriptionPlan | null;
}

export const EditPlanDialog = ({
  isOpen,
  onOpenChange,
  plan,
}: EditPlanDialogProps) => {
  const { updatePlan, validateForm } = useSubscriptionPlans();
  const [isUpdating, setIsUpdating] = useState(false);
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

  // Initialize form when plan changes
  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        description: plan.description,
        features: [...plan.features],
        listingLimit: [...plan.listingLimit],
        amount: plan.amount,
        billing_cycle: plan.billing_cycle,
        status: plan.status,
      });
      setFeaturesInput(plan.features.join(", "));
    }
  }, [plan]);

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

  const handleUpdate = async () => {
    if (!plan?._id) return;

    if (!validateForm(formData, featuresInput)) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    try {
      setIsUpdating(true);
      setApiError(""); // Clear any previous errors
      await updatePlan(plan._id, formData, featuresInput);
      onOpenChange(false);
    } catch (error: unknown) {
      // Handle API errors
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error as any)?.message ||
        "An error occurred while updating the plan";
      setApiError(errorMessage);
    } finally {
      setIsUpdating(false);
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
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-[1190px]">
        <DialogHeader>
          <DialogTitle>Edit Subscription Plan</DialogTitle>
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
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

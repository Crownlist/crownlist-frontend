import { useState, useEffect } from "react";
import { toast } from "sonner";
import { apiClientAdmin } from "@/lib/interceptor";
import { SubscriptionPlan, CreatePlanForm, ValidationErrors } from "../types";

export const useSubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await apiClientAdmin.get("/subscriptionplans/admin");
      const data = res?.data?.data;
      if (Array.isArray(data)) setPlans(data as SubscriptionPlan[]);
      else setPlans([]);
    } catch (e: unknown) {
      toast.error(
        `Failed to load plans: ${String((e as Error)?.message || e)}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const createPlan = async (
    formData: CreatePlanForm,
    featuresInput: string
  ) => {
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      features: featuresInput
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      listingLimit: formData.listingLimit.map((item) => ({
        subCategory:
          typeof item.subCategory === "object"
            ? item.subCategory._id
            : item.subCategory,
        limit: item.limit,
      })),
      amount: Number(formData.amount),
      billing_cycle: formData.billing_cycle,
      status: formData.status,
    };

    const res = await apiClientAdmin.post("/subscriptionplans", payload);
    toast.success(res?.data?.message ?? "Plan created");
    await fetchPlans();
  };

  const updatePlan = async (
    planId: string,
    formData: CreatePlanForm,
    featuresInput: string
  ) => {
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      features: featuresInput
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      listingLimit: formData.listingLimit.map((item) => ({
        subCategory:
          typeof item.subCategory === "object"
            ? item.subCategory._id
            : item.subCategory,
        limit: item.limit,
      })),
      amount: Number(formData.amount),
      billing_cycle: formData.billing_cycle,
      status: formData.status,
    };

    const res = await apiClientAdmin.put(
      `/subscriptionplans/${planId}`,
      payload
    );
    toast.success(res?.data?.message ?? "Plan updated successfully");
    await fetchPlans();
  };

  const deletePlan = async (planId: string) => {
    await apiClientAdmin.delete(`/subscriptionplans/${planId}`);
    toast.success("Plan deleted successfully");
    setPlans(plans.filter((p) => p._id !== planId));
  };

  const validateForm = (
    formData: CreatePlanForm,
    featuresInput: string
  ): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!formData.name.trim()) errors.name = "Name is required";

    const descriptionWords = formData.description
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    if (!formData.description.trim())
      errors.description = "Description is required";
    else if (descriptionWords.length < 10)
      errors.description = "Description must be at least 10 words";

    if (!featuresInput.trim())
      errors.featuresInput = "Enter at least one feature";
    if (!formData.amount) errors.amount = "Amount is required";

    return errors;
  };

  return {
    plans,
    loading,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
    validateForm,
  };
};

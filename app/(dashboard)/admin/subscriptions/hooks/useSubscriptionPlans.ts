import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClientAdmin } from "@/lib/interceptor";
import { SubscriptionPlan, CreatePlanForm, ValidationErrors } from "../types";

const fetchSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const res = await apiClientAdmin.get("/subscriptionplans/admin");
  const data = res?.data?.data;
  return Array.isArray(data) ? (data as SubscriptionPlan[]) : [];
};

export const useSubscriptionPlans = () => {
  const queryClient = useQueryClient();

  const { data: plans = [], isLoading: loading } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: fetchSubscriptionPlans,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const createPlanMutation = useMutation({
    mutationFn: async ({
      formData,
      featuresInput,
    }: {
      formData: CreatePlanForm;
      featuresInput: string;
    }) => {
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
      return apiClientAdmin.post("/subscriptionplans", payload);
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message ?? "Plan created");
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to create plan"
      );
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: async ({
      planId,
      formData,
      featuresInput,
    }: {
      planId: string;
      formData: CreatePlanForm;
      featuresInput: string;
    }) => {
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
      return apiClientAdmin.put(`/subscriptionplans/${planId}`, payload);
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message ?? "Plan updated successfully");
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to update plan"
      );
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      return apiClientAdmin.delete(`/subscriptionplans/${planId}`);
    },
    onSuccess: () => {
      toast.success("Plan deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to delete plan"
      );
    },
  });

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
    createPlan: createPlanMutation.mutate,
    updatePlan: updatePlanMutation.mutate,
    deletePlan: deletePlanMutation.mutate,
    isCreating: createPlanMutation.isPending,
    isUpdating: updatePlanMutation.isPending,
    isDeleting: deletePlanMutation.isPending,
    validateForm,
  };
};

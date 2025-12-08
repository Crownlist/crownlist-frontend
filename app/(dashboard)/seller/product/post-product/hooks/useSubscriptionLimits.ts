/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { apiClientUser } from "@/lib/interceptor";
import { LimitsCheckResult } from "../types";

export const useSubscriptionLimits = (
  selectedSubcategory: string | null,
  subscriptionData: Record<string, unknown> | null,
  isLoadingSubscription: boolean
) => {
  const [limitsCheckResult, setLimitsCheckResult] =
    useState<LimitsCheckResult | null>(null);
  const [checkingLimits, setCheckingLimits] = useState(false);

  useEffect(() => {
    const checkLimitsOnSubcategoryChange = async () => {
      if (
        !selectedSubcategory ||
        !subscriptionData ||
        !(subscriptionData as any).data?.subscription ||
        isLoadingSubscription
      ) {
        setLimitsCheckResult(null);
        return;
      }

      setCheckingLimits(true);
      try {
        // Count current products for this subcategory
        const productResponse = await apiClientUser.get(
          `/products/sub-category/${selectedSubcategory}?status=approved&status=reviewing&status=live&limit=1000`
        );
        console.log("productResponse", productResponse);
        const currentProductCount = productResponse.data?.products?.length || 0;

        // Get the limit for this subcategory from subscription
        const data = subscriptionData as any;
        const subscriptionPlanId = data.data.subscription.subscriptionPlanId;
        const listingLimit = subscriptionPlanId?.listingLimit?.find(
          (limit: { subCategory: string; limit: number }) =>
            limit.subCategory === selectedSubcategory
        );
        console.log("subscriptionData", subscriptionData);
        console.log("selectedSubcategory", selectedSubcategory);
        console.log("subscriptionPlanId", subscriptionPlanId);
        console.log("listingLimit", listingLimit);

        // Check if subcategory is part of user's plan
        const isSubcategoryInPlan =
          subscriptionPlanId?.listingLimit?.some(
            (limit: { subCategory: string; limit: number }) =>
              limit.subCategory === selectedSubcategory
          ) || false;

        console.log("isSubcategoryInPlan", isSubcategoryInPlan);

        if (!isSubcategoryInPlan) {
          setLimitsCheckResult({
            isAtLimit: false,
            currentCount: currentProductCount,
            limit: 0,
            planName: subscriptionPlanId.name,
            isSubcategoryNotInPlan: true,
          });
        } else if (listingLimit && currentProductCount >= listingLimit.limit) {
          setLimitsCheckResult({
            isAtLimit: true,
            currentCount: currentProductCount,
            limit: listingLimit.limit,
            planName: subscriptionPlanId.name,
          });
        } else {
          setLimitsCheckResult(null);
        }
      } catch (limitError) {
        console.error(
          "Error checking limits on subcategory change:",
          limitError
        );
        setLimitsCheckResult(null);
      } finally {
        setCheckingLimits(false);
      }
    };

    checkLimitsOnSubcategoryChange();
  }, [selectedSubcategory, subscriptionData, isLoadingSubscription]);

  const checkLimitsBeforeSubmit = async (
    selectedSubcategory: string | null
  ) => {
    if (
      !selectedSubcategory ||
      !subscriptionData ||
      !(subscriptionData as any).data?.subscription
    ) {
      return null;
    }

    try {
      // Count current products for this subcategory
      const productResponse = await apiClientUser.get(
        `/products?seller=true&subCategory=${selectedSubcategory}&status=approved&status=reviewing&status=live&limit=1000`
      );
      const currentProductCount = productResponse.data?.products?.length || 0;

      // Get the limit for this subcategory from subscription
      const data = subscriptionData as any;
      const subscriptionPlanId = data.data.subscription.subscriptionPlanId;
      const listingLimit = subscriptionPlanId?.listingLimit?.find(
        (limit: { subCategory: string; limit: number }) =>
          limit.subCategory === selectedSubcategory
      );

      return {
        currentProductCount,
        listingLimit,
        subscriptionPlanId,
      };
    } catch (limitError) {
      console.error("Error checking limits:", limitError);
      return null;
    }
  };

  return {
    limitsCheckResult,
    checkingLimits,
    checkLimitsBeforeSubmit,
  };
};

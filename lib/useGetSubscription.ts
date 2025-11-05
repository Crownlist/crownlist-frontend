/* eslint-disable */
"use client";
import { useQuery } from "react-query";
import { apiClientUser } from "./interceptor";
import { GetSubscriptionRes } from "@/types/general";

export const getSubscriptionDetails = (): Promise<GetSubscriptionRes> => {
  return apiClientUser("/subscriptions");
};

export const useGetSubscription = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["subscription"],
    queryFn: () => getSubscriptionDetails(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  return {
    refetch,
    isLoading,
    isError,
    subscriptionData: data,
  };
};

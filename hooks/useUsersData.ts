import { useQuery } from "@tanstack/react-query";
import { apiClientAdmin } from "@/lib/interceptor";
import { UsersResponse } from "@/types/user/user";

interface UseUsersDataParams {
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;
  accountTypeFilter: string;
  verificationFilter: string;
  subscriptionFilter: string;
  authMethodFilter: string;
  suspendedFilter: string;
}

export function useUsersData({
  currentPage,
  itemsPerPage,
  searchTerm,
  accountTypeFilter,
  verificationFilter,
  subscriptionFilter,
  authMethodFilter,
  suspendedFilter,
}: UseUsersDataParams) {
  return useQuery<UsersResponse>({
    queryKey: [
      "users",
      currentPage,
      itemsPerPage,
      searchTerm,
      accountTypeFilter,
      verificationFilter,
      subscriptionFilter,
      authMethodFilter,
      suspendedFilter,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      // Add search parameter
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      // Account type filter
      if (accountTypeFilter !== "all") {
        params.append("accountType", accountTypeFilter);
      }

      // Verification filter
      if (verificationFilter !== "all") {
        params.append("isVerified", verificationFilter);
      }

      // Subscription filter
      if (subscriptionFilter !== "all") {
        params.append("subscriptionStatus", subscriptionFilter);
      }

      // Auth method filter
      if (authMethodFilter !== "all") {
        params.append("authMethod", authMethodFilter);
      }

      // Suspended filter
      if (suspendedFilter !== "all") {
        params.append("isSuspended", suspendedFilter);
      }

      const response = await apiClientAdmin.get(`/users?${params.toString()}`);
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
}

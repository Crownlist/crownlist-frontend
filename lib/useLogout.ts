/* eslint-disable */

import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { userTypeProps } from "./useGetAuthUser";
import { apiClientPublic } from "./interceptor";
import { useMgtKeys } from "./useMgtKeys";
import { updateAdminData } from "@/store/slices/admin/adminDataSlice";
import { obfuscateToken } from "@/constants/encryptData";
import { toast } from "sonner";

type LogoutProps = {
  refreshToken: string;
  accountType: userTypeProps;
};

export const logout = (logoutData: LogoutProps): Promise<any> => {
  return apiClientPublic.patch(`/auth/logout`, logoutData);
};

/**
 * Performs local logout cleanup - clears all local storage, cache, and redirects
 * This should always be called regardless of API success/failure
 */
const performLocalLogout = (
  userType: userTypeProps,
  removeOrionKeys: () => void,
  removeLeoKeys: () => void,
  dispatch: ReturnType<typeof useDispatch>,
  queryClient: ReturnType<typeof useQueryClient>
) => {
  // Clear React Query cache
  queryClient.clear();

  if (userType === "Admin") {
    removeOrionKeys();
    dispatch(updateAdminData(null));
    // Use location.replace to prevent back navigation to authenticated pages
    window.location.replace(window.location.origin + "/auth/admin/sign-in");
  } else {
    removeLeoKeys();
    // Use location.replace to prevent back navigation to authenticated pages
    window.location.replace(window.location.origin + "/auth/login");
  }
};

export const useLogout = (userType: userTypeProps) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { removeOrionKeys, removeLeoKeys } = useMgtKeys();

  const { mutateAsync: mutateLogout, isLoading } = useMutation({
    mutationFn: () => {
      const refreshToken =
        userType === "Admin"
          ? localStorage.getItem("orionLoop") ?? ""
          : localStorage.getItem("leoLoop") ?? "";

      // If no refresh token exists, resolve immediately
      // (user might already be partially logged out)
      if (!refreshToken) {
        return Promise.resolve({ skipApi: true });
      }

      return logout({
        refreshToken: obfuscateToken(false, refreshToken),
        accountType: userType,
      });
    },
    onSuccess: () => {
      toast.success("Logout successful. Redirecting...");
      performLocalLogout(
        userType,
        removeOrionKeys,
        removeLeoKeys,
        dispatch,
        queryClient
      );
    },
    onError: (error: unknown) => {
      // Log the error for debugging but still perform local logout
      console.error("Logout API error:", error);

      // Even if server logout fails, we should still clear local state
      // This ensures users can always log out from their device
      toast.info("Logging out locally...");
      performLocalLogout(
        userType,
        removeOrionKeys,
        removeLeoKeys,
        dispatch,
        queryClient
      );
    },
  });

  return {
    mutateLogout,
    isLoading,
  };
};

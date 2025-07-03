/* eslint-disable */

import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { userTypeProps } from "./useGetAuthUser";
import { apiClientPublic } from "./interceptor";
import { useMgtKeys } from "./useMgtKeys";
import { updateAdminData } from "@/store/slices/admin/adminDataSlice";
import { obfuscateToken } from "@/constants/encryptData";
import { useToast } from "./useToastMessage";

type LogoutProps = {
  refreshToken: string;
  accountType: userTypeProps;
};

export const logout = (logoutData: LogoutProps): Promise<any> => {
  return apiClientPublic.patch(`/auth/logout`, logoutData);
};

export const useLogout = (userType: userTypeProps) => {
  const { handleMessage, handleSnack, snackBarOpen, setSnackBarOpen } =
    useToast();

  const dispatch = useDispatch();

  const { removeOrionKeys, removeLeoKeys } = useMgtKeys();

  const {
    mutateAsync: mutateLogout,
    isLoading,
    isError,
    data,
  } = useMutation({
    mutationFn: () => {
      if (userType === "Admin") {
        return logout({
          refreshToken: obfuscateToken(
            false,
            localStorage.getItem("orionLoop") ?? ""
          ),
          accountType: userType,
        });
      } else {
        return logout({
          refreshToken: obfuscateToken(
            false,
            localStorage.getItem("leoLoop") ?? ""
          ),
          accountType: userType,
        });
      }
    },
    onSuccess: () => {
      handleMessage("success", "Logout Successfully. Redirecting...");

      if (userType === "Admin") {
        removeOrionKeys();
        dispatch(updateAdminData(null));
        location.replace(location.origin + "/admin/signin");
      } else {
        // dispatch(updateAdminData(null));
        removeLeoKeys();
        location.replace(location.origin + "/auth/sign-in");
      }
    },
  });

  return {
    mutateLogout,
    isLoading,
    isError,
    handleSnack,
    snackBarOpen,
    setSnackBarOpen,
  };
};

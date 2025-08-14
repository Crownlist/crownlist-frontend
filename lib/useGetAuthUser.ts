/* eslint-disable */
"use client";
import { useQuery } from "react-query";
import { apiClientAdmin, apiClientUser } from "./interceptor";
import { GetUserRes } from "@/types/general";
import { useDispatch } from "react-redux";
import { updateAdminData } from "@/store/slices/admin/adminDataSlice";
import { updateUserData } from "@/store/slices/user/userDataSlice";
import { useToast } from "./useToastMessage";

export type userTypeProps = "Admin" | "User";

export const getUserAuthDetails = (
  userType: userTypeProps
): Promise<GetUserRes> => {
  if (userType === "Admin") {
    return apiClientAdmin("/auth/me");
  } else {
    return apiClientUser("/auth/me");
  }
};

export const useGetAuthUser = (userType: userTypeProps) => {
  const dispatch = useDispatch();

 

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["auth-me"],
    queryFn: () => getUserAuthDetails(userType),
    onSuccess: (data) => {
      
      if (userType === "Admin") {
        dispatch(updateAdminData(data.data.data.loggedInAccount));
      }
      if (userType === "User") {
        dispatch(updateUserData(data.data.loggedInAccount));
      }
    },
  });

  return {
    refetch,
    isLoading,
    isError,
    data,

  };
};

/* eslint-disable */
import { useMutation } from "react-query";
import { apiClientPublic } from "./interceptor";
import { obfuscateToken } from "@/constants/encryptData";

interface UserVerificationResponseStrict {
    status: "success" | "error";
    data: {
      updatedUser: {
        _id: string;
        email: string;
        userCustomId: string;
        profilePicture: string;
        authMethod: "Form" | "OAuth" | "Social"; // adjust based on your auth methods
        accountType: "User" | "Admin"; // adjust based on your account types
        isVerified: boolean;
        finishTourGuide: boolean;
        isAdmin: boolean;
        createdAt: string; // or Date if you want to parse it
      };
      accessToken: string;
      refreshToken: string;
      message: string;
    };
  }

export const verifyOtp = async (otp: string): Promise<UserVerificationResponseStrict> => {
  const res = await apiClientPublic.post(`/auth/user/verify-token?otp=${otp}`);
    console.log('apire', res)
  return res.data;
};

export const useVerifyOtp = () => {
  const {
    mutateAsync: submit,
    // isLoading,
    isError,
    error,
    data: res,
  } = useMutation({
    mutationFn: verifyOtp, // <-- just the function, not called yet
    onSuccess: (data : any) => {
      console.log(`${data} from ufp`);
      if (data) {
        console.log('verified', data)
        if (typeof window !== "undefined") {
            localStorage.setItem("leo", data?.updatedUser._id);
            localStorage.setItem(
              "leoKey",
              obfuscateToken(true, data?.accessToken)
            );
            localStorage.setItem(
              "leoLoop",
              obfuscateToken(true, data?.refreshToken)
            );
      
            if (sessionStorage.getItem("returnUserTo")) {
              location.replace(
                location.origin + sessionStorage.getItem("returnUserTo")
              );
              if(data?.data.accountType == 'User'){
                location.origin + sessionStorage.getItem(location.origin + "/buyer/profile")
              } else if (data?.data.accountType == 'Seller'){
                location.origin + sessionStorage.getItem(location.origin + "/seller/dashboard")
              }
            } else {
              location.replace(location.origin + "/buyer/profile");
              // location.replace(location.origin + "/auth/sign-in");
            }
        }
      } else {
        console.log("error");
      }
    },
  });
  return { submit, isError, error, res };
};
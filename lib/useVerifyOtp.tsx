/* eslint-disable */
import { useMutation } from "react-query";
import { apiClientPublic } from "./interceptor";
import { obfuscateToken } from "@/constants/encryptData";


interface UserVerificationResponseStrict {
  status: "success" | "error";
    updatedAccount: {
      _id: string;
      email: string;
      fullName: string;
      userCustomId: string;
      profilePicture: string;
      authMethod: "Form" | "OAuth" | "Social"; // adjust based on your auth methods
      accountType: "User" | "Seller"; // Corrected based on your previous code ('User' or 'Seller')
      isVerified: boolean;
      finishTourGuide: boolean;
      isAdmin: boolean;
      createdAt: string; // or Date if you want to parse it
  };
  accessToken: string;
  refreshToken: string;
  message: string;
}

export const verifyOtp = async (otp: string): Promise<UserVerificationResponseStrict> => {
  const res = await apiClientPublic.post(`/auth/user/verify-token?otp=${otp}`);
  console.log('API Response (verifyOtp):', res); // Log the full response for debugging
  return res.data; // Ensure you return res.data, as your mutationFn expects this structure
};

export const useVerifyOtp = () => {
  // const dispatch = useDispatch(); // Get the dispatch function

  const {
    mutateAsync: submit,
    // isLoading, // You might want to export isLoading if you use it for UI states
    isError,
    error,
    data: res,
  } = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data: UserVerificationResponseStrict) => { // Type data for better safety
      console.log('OTP verification successful, data:', data);
      const accountData = data?.updatedAccount
      if (data && data.updatedAccount) { // Ensure data and data.data exist before proceeding
        const { updatedAccount, accessToken, refreshToken } = data;

        // 1. Store tokens and ID in localStorage (as you're already doing)
        if (typeof window !== "undefined") {
          localStorage.setItem("leo", updatedAccount._id);
          localStorage.setItem(
            "leoKey",
            obfuscateToken(true, accessToken)
          );
          localStorage.setItem(
            "leoLoop",
            obfuscateToken(true, refreshToken)
          );

         
          // 3. Handle redirection (as you're already doing)
          if (sessionStorage.getItem("returnUserTo")) {
            location.replace(
              location.origin + sessionStorage.getItem("returnUserTo")
            );
          } else {
            if (updatedAccount.accountType === 'User') {
              location.replace(location.origin + "/buyer/profile");
            } else if (updatedAccount.accountType === 'Seller') {
              location.replace(location.origin + "/seller/dashboard");
            } else {
              location.replace(location.origin + "/buyer/profile"); // Default fallback
            }
          }
        }
      } else {
        console.error("OTP verification: Data or data.data is null/undefined.", data);
        // You might want to show an error message here to the user
      }
    },
    onError: (error: any) => {
      console.error('OTP verification failed:', error);
      // You can add toast messages or other error handling here
    },
  });
  return { submit, isError, error, res };
};
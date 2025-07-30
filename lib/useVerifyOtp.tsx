/* eslint-disable */
import { useMutation } from "react-query";
import { apiClientPublic } from "./interceptor";
import { obfuscateToken } from "@/constants/encryptData";


interface UserVerificationResponseStrict {
  status: "success" | "error";
  data: {
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
  };
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
      const accountData = data?.data.updatedAccount
      if (data && data.data) { // Ensure data and data.data exist before proceeding
        const { updatedAccount, accessToken, refreshToken } = data.data;

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

          // 2. Dispatch data to Redux store based on account type
          // const accountType = updatedAccount.accountType;
          // if (accountType) {
          //   const userDataPayload: UserSignin = { // Cast data to your UserSignin type
          //     token: data?.data?.accessToken,
          //     id: accountData._id,
          //     email: accountData.email,
          //     fullName: accountData.fullName,
          //     authMethod: accountData.authMethod,
          //     createdAt: accountData.createdAt,
          //     userCustomId: accountData.userCustomId,
          //     profilePicture: accountData.profilePicture,
          //     isVerified: accountData.isVerified,
          //     finishTourGuide: accountData.finishTourGuide,
          //   };
          //   dispatch(updateUserData(userDataPayload));
          //   console.log("Dispatched user data to Redux (OTP):", userDataPayload);
          // } else {
          //   console.warn("Unknown account type or missing account data after OTP verification:", updatedAccount);
          // }

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
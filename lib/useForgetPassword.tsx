/* eslint-disable */

import { useMutation } from "react-query";
import { apiClientPublic } from "./interceptor";
import { ResetPasswordData } from "@/app/auth/verify/verifyForm";
import { newPass } from "@/app/auth/reset-password/resetForm";


interface forgetPasswordResponse {
 data:{
     message: string;
 }   
  status: string;
}

export const sendForgetPwdLink = (credentials: {}): Promise<
  forgetPasswordResponse
> => {
  return apiClientPublic.post(`/auth/forgotPassword/send-token`, credentials);
};

// `/auth/recover-password/resetpassword/send-token`
export const useSendForgetPwdLink = () => {
    const {
      mutateAsync: submit,
      isLoading,
      isError,
      error,
      data: res,
    } = useMutation({
      mutationFn: sendForgetPwdLink,
      onSuccess: (data) => {
        console.log(`${data} from ufp`);
        if (data.status === "success") {
          if (typeof window !== "undefined") {
            sessionStorage.setItem("forgot-pwd", "2");
          }
        } else {
          console.log("error");
        }
      },
    });
    // console.log({submit})
    return { submit, isLoading, isError, error, res };
  };

  // Reset password after token is being sent
  export const sendForgetPwdOtp = (
    credentials: ResetPasswordData
  ): Promise<any> => {
    return apiClientPublic.post(
      `/auth/forgotpassword/verify-token?otp=${credentials.pin}`
      // `/auth/recover-password/resetpassword/verify-token?otp=${credentials.otp}`
    );
  };

  export const useSendForgetPwdOtp: any = () => {
    const {
      mutateAsync: submit,
      isLoading,
      isError,
      error,
      data: res,
    } = useMutation({
      mutationFn: sendForgetPwdOtp,
    });
    // if (res?.status === "success") {
    //   // console.log(res)
    //   // const token = res?.otp;
    //   // const expirationTime = new Date().getTime() + 60 * 1000; // 1 hour from now
    //   // sessionStorage.setItem("forgot-pwd-token", token);
    //   // sessionStorage.setItem("forgot-pwd-token-expiration", expirationTime.toString());
    //   // sessionStorage.setItem("forgot-pwd", "2");
    //   // sessionStorage.setItem("forgot-pwd", "2");
    // }
    return { submit, isLoading, isError, error, res };
  };

//   Reset Password
export const resetPasswordftn = (credentials: {}): Promise<newPass> => {
    console.log(credentials);
    return apiClientPublic.post(
      `/auth/forgotpassword/change-password`,
      credentials
    );
  };
  
  export const useResetPassword = () => {
    const {
      mutateAsync: submit,
      isLoading,
      isError,
      error,
      data: res,
    } = useMutation({
      mutationFn: resetPasswordftn,
      onSuccess: (data) => {
        console.log(`${data} from ufp`);
      },
    });
  
    return { submit, isLoading, isError, error, res };
  };






//   deleteing otp
export const getForgotPwdToken = (): string | null | undefined => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("forgot-pwd-token");
      const expirationTimeStr = sessionStorage.getItem(
        "forgot-pwd-token-expiration"
      );
  
      if (!token || !expirationTimeStr) {
        return null;
      }
  
      const expirationTime = parseInt(expirationTimeStr, 10); // Convert to number
      const now = new Date().getTime();
      if (now > expirationTime) {
        // Token has expired
        sessionStorage.removeItem("forgot-pwd-token");
        sessionStorage.removeItem("forgot-pwd-token-expiration");
        return null;
      }
  
      return token;
    }
  };
  
  const tokenOtp = getForgotPwdToken();
  if (tokenOtp) {
    console.log("Retrieved token:", tokenOtp);
  }
/* eslint-disable */
import { useMutation } from "react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { apiClientPublic } from "@/lib/interceptor";
// import { useToast } from "@/components/Toast";
import { UserSignupForm, UserSignupRes } from "@/types/admin/auth";
import { obfuscateToken } from "@/constants/encryptData";
import { useState } from "react";
import { useToast } from "./useToastMessage";
import { toast } from "sonner";

export const signup = (credentials: UserSignupForm): Promise<UserSignupRes> => {
  return apiClientPublic.post(`/auth/user/register`, credentials);
};

export const useUserSignupHook = () => {
  const { handleMessage, snackBarOpen, setSnackBarOpen } =
    useToast();
  const [googleLoading, setGoogleLoading] = useState(false);

  const { mutateAsync: submit, isLoading } = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      console.log(data)
      localStorage.setItem("leo", data?.data.account._id);
      localStorage.setItem(
        "leoKey",
        obfuscateToken(true, data?.data.account.accessToken)
      );
      localStorage.setItem(
        "leoLoop",
        obfuscateToken(true, data?.data.account.refreshToken)
      );

      if (sessionStorage.getItem("returnUserTo")) {
        location.replace(
          location.origin + "/auth/signup/verify"
          // location.origin + sessionStorage.getItem("returnUserTo")
        );
      } else {
        location.replace(location.origin + "/auth/signup/verify");
        // location.replace(location.origin + "/auth/sign-in");
      }
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UserSignupForm>();

  const onSubmit: SubmitHandler<UserSignupForm> = async (data) => {
    try {
      await submit(data);
      handleMessage(
        "success",
        "check your mail for email verification. Redirecting..."
      );
      toast.success('check your mail for email verification. Redirecting...')
    } catch (error) {
      handleMessage("error", String(error));
      toast.error(`Invalid Credential,  ${error}`)
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      const res: any = await apiClientPublic.get("/auth/google/getauthurl");
      if (res.status === "success") {
        location.replace(res.data.urlAuth);

        setGoogleLoading(false);
      }
    } catch (error: any) {
      handleMessage("error", String(error));
      setGoogleLoading(false);
    }
  };
  return {
    snackBarOpen,
    setSnackBarOpen,
    register,
    errors,
    isLoading,
    handleSubmit,
    onSubmit,
    googleLoading,
    handleGoogleSignup,
  };
};

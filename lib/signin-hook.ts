/* eslint-disable */
import { useMutation } from "react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { apiClientPublic, apiClientUser } from "@/lib/interceptor";
// import { useToast } from "@/components/Toast";
import { UserSigninForm, UserSigninRes } from "@/types/admin/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { obfuscateToken } from "@/constants/encryptData";
import { useToast } from "./useToastMessage";
import { toast } from "sonner";

export const signin = (credentials: UserSigninForm): Promise<UserSigninRes> => {
  return apiClientPublic.post(`/auth/user/login`, credentials);
};
const resendVerificationEmail = (email: string): Promise<any> => {
  return apiClientPublic.post(`auth/user/resend-token?email=${email}`);
};
export const useAdminSigninHook = () => {
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = useState(false);
  const { handleMessage, handleSnack, snackBarOpen, setSnackBarOpen } =
    useToast();

  const { mutateAsync: submit, isLoading } = useMutation({
    mutationFn: signin,
    onSuccess: (data: any) => {
      localStorage.setItem("leo", data?.data.user._id);
      localStorage.setItem(
        "leoKey",
        obfuscateToken(true, data?.data.accessToken)
      );
      localStorage.setItem(
        "leoLoop",
        obfuscateToken(true, data?.data.refreshToken)
      );

      if (sessionStorage.getItem("returnUserTo")) {
        location.replace(
          location.origin + sessionStorage.getItem("returnUserTo")
        );
      } else {
        location.replace(location.origin + "/buyer/profile");
      }
    },
    onError: async (error: any, variables: { email: any; }) => {
      const email = variables?.email;
      console.log(email);
      console.log(error);
      const condition = String(error);
      // console.log(error.response?.data?.message)
      if (
        condition ===
        "Your account is not verified. Kindly request for Email verification link"
      ) {
        console.log("handle resend token init ");
        handleMessage(
          "error",
          "Email not verified. Sending verification email..."
        );
        toast('Error, Email not verified. Sending verification email...')
        try {
          await resendVerificationEmail(email);
          handleMessage(
            "success",
            "Verification email sent. Please check your inbox."
          );
          toast("success, Verification email sent. Please check your inbox.")
          console.log("sent");
        } catch (error) {
          // handleMessage('error', `Failed to resend verification email: ${resendError}`);
          handleMessage("error", String(error));
        }
      } else {
        handleMessage("error", `Login failed: ${condition}`);
        toast(`Login failed: ${condition}`)
      }
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UserSigninForm>();

  const onSubmit: SubmitHandler<UserSigninForm> = async (data) => {
    try {
      await submit(data);
      handleMessage("success", "Login Successfully. Redirecting...");
      toast("success, Login Successfully. Redirecting...")
    } catch (error) {
      // handleMessage("error", String(error));
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
    handleSnack,
    snackBarOpen,
    setSnackBarOpen,
    register,
    errors,
    isLoading,
    handleSubmit,
    onSubmit,
    handleGoogleSignup,
    googleLoading,
  };
};

// verification hook

export const fetchData = async (params: any) => {
  return apiClientPublic.post(`auth/user/verify-token?uniqueString=${params}`);
};

const resendToken = async (email: string) => {
  return apiClientPublic.post(`auth/user/verify-token?email=${email}`);
};

export const useFetchData = () => {
  const { handleMessage, handleSnack, snackBarOpen, setSnackBarOpen } =
    useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: fetchDataMutation } = useMutation({
    mutationFn: fetchData,
    onSuccess: () => {
      handleMessage("success", "Email authentication is succesful");
      setIsLoading(false);
    },
    onError: (error: any, variables: any, context: any) => {
      console.log(`here is the error : ${error}`);
      handleMessage("error", `Error posting data: ${error.message}`);
      setIsLoading(false);
      if (error.response?.data?.message === "Link expired") {
        handleLinkExpiration(context.email);
      }
    },
  });

  const { mutateAsync: resendTokenMutation } = useMutation({
    mutationFn: resendToken,
    onSuccess: () => {
      handleMessage("success", "New link has been sent to your email");
    },
    onError: (error: any) => {
      handleMessage("error", `Error resending link: ${error.message}`);
    },
  });

  const submit = async ({ token, email } :any) => {
    setIsLoading(true);
    try {
      await fetchDataMutation(token, {
        onError: async (error: { message: any; response: { status: number; data: { message: string; }; }; }) => {
          handleMessage("error", `Error posting data: ${error.message}`);
          setIsLoading(false);

          if (
            error.response?.status === 401 ||
            error.response?.data?.message === "Link expired"
          ) {
            await handleLinkExpiration(email);
          }
        },
      });
    } catch (error) {
      handleMessage("error", String(error));
      setIsLoading(false);
    }
  };

  const handleLinkExpiration = async (email: string) => {
    setIsLoading(true);
    try {
      await resendTokenMutation(email);
    } catch (error) {
      handleMessage("error", `Failed to resend link: ${error}`);
      setIsLoading(false);
    }
  };

  return {
    submit,
    isLoading,
    handleSnack,
    snackBarOpen,
    setSnackBarOpen,
  };
};

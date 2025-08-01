import { useMutation } from "react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { apiClientPublic } from "@/lib/interceptor";
import { AdminSigninForm, AdminSigninRes } from "@/types/admin/auth";
import { obfuscateToken } from "@/constants/encryptData";
import { toast } from "sonner";

export const signin = (
  credentials: AdminSigninForm
): Promise<AdminSigninRes> => {
  return apiClientPublic.post(`/auth/admin/login`, credentials);
};

export const useAdminSigninHook = () => {

  const { mutateAsync: submit, isLoading } = useMutation({
    mutationFn: signin,
    onSuccess: (data) => {
      console.log('orion', data)
      localStorage.setItem("orion", data?.data.admin._id);
      localStorage.setItem(
        "orionKey",
        obfuscateToken(true, data?.data.accessToken)
      );
      localStorage.setItem(
        "orionLoop",
        obfuscateToken(true, data?.data.refreshToken)
      );

      if (sessionStorage.getItem("returnTo")) {
        location.replace(location.origin + sessionStorage.getItem("returnTo"));
      } else {
        location.replace(location.origin + "/admin/dashboard");
      }
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<AdminSigninForm>();

  const onSubmit: SubmitHandler<AdminSigninForm> = async (data) => {
    try {
      await submit(data);
      toast.success("success, Login Successfully. Redirecting...");
    } catch (error) {
      toast.error(`error, ${String(error)}`);
    }
  };

  return {
    register,
    errors,
    isLoading,
    handleSubmit,
    onSubmit,
  };
};

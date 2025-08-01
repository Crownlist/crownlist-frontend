"use client"
import Image from "next/image";
import login from "../../../public/assets/images/authbg.jpg";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { getForgotPwdToken, useResetPassword } from "@/lib/useForgetPassword";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface newPass {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface newPass2 {
  otp: string;
  newPassword: string;
}

export function ResetForm({
  className,
  imageUrl,
  ...props
}: React.ComponentProps<"div"> & {
  imageUrl?: string;
}) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const { register, formState: { errors }, handleSubmit } = useForm<newPass>();
  console.log(errors)
  const { submit, isLoading } = useResetPassword();

  const onSubmit: SubmitHandler<newPass2> = async (data) => {
    if (typeof window !== "undefined") {
      const otp = getForgotPwdToken();

      if (!otp) {
        toast.error("Error, Token is missing or expired.");
        return;
      }

      try {
        await submit({ ...data, otp });
        toast.success("Password reset successful.");
        // You may want to redirect or perform another action here
        router.push("/auth/login")
      } catch (error) {
        toast.error(String(error));
      }

    }
  }

  // // Watch the newPassword and confirmPassword fields
  // const newPassword = watch("newPassword");


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-5">
          <div className=" h-screen relative hidden md:block md:col-span-2 lg:col-span-3">
            {imageUrl && (
              <Image
                fill
                src={login}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover"
                priority={true}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent "></div>
          </div>
          <form className="min-h-screen flex max-md:px-7 justify-center w-full items-center md:mt-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center md:items-start text-center mb-[10px]">
                <h1 className="text-2xl">Reset Password</h1>
                <p className="text-sm text-balance mt-1">
                  Please reset password with details below
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                <Input id="password"  type={showPassword ? "text" : "password"} required
                 {...register("newPassword", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                disabled={isLoading}
                   className="pr-10"
                />
                  <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <div className="relative">
                <Input id="confirmPassword"  type={showPassword ? "text" : "password"} required 
                 {...register("confirmPassword", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                   className="pr-10"
                />
                  <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                </div>
              </div>
                <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Continue'}
                </Button>

              <p className="text-center text-sm mt-10">
                Remember password?{" "}
                <a href="/auth/login" className="underline underline-offset-4">
                  Login
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/* eslint-disable */
"use client"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Input2 } from "@/components/ui/custom-input";
import { Label } from "@/components/ui/label";
import { useAdminSigninHook } from "../signin-hook";
import { Loader2 } from "lucide-react";
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"


export function LoginForm({
  className,
}: React.ComponentProps<"div"> ) {
  
  const {
    register,
    errors,
    isLoading,
    handleSubmit,
    onSubmit,
  } = useAdminSigninHook();

  const [showPassword, setShowPassword] = useState(false)


  return (
    <div className={cn("flex justify-center  h-full font-inter", className)}>
      <div className="w-full h-full flex flex-row justify-center relative ">
        <form className="min-h-screen flex max-md:px-7 justify-center w-full items-center md:mt-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6 justify-center w-full  max-w-3xl md:px-20">
            <div className="flex flex-col items-start md:items-center text-start mb-[10px]">
              <h1 className="text-2xl text-crown-black font-semibold">Login to Crownlist</h1>
              <p className="text-sm text-balance mt-3 text-crown-paragraph">
                Enter your details below
              </p>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder=""
                {...register("email", {
                  required: "Email is required",
                })}
                disabled={isLoading} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder=""
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
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
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}

              <p className="">
                <a
                  href="/auth/forgot-password"
                  className="mr-auto text-sm text-crown-black underline-offset-3 underline"
                >
                  Forgot password?
                </a>
              </p>
            </div>
            <Button type="submit" className="w-full h-full mt-3"
            >
              <div className="flex flex-row gap-3 py-1 items-center ">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Login"
              )}</div>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

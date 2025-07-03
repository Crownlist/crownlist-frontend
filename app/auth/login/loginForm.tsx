/* eslint-disable */
"use client"
import Image from "next/image";
import login from "../../../public/assets/images/authbg.jpg";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input, Input2 } from "@/components/ui/custom-input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdminSigninHook, useFetchData } from "@/lib/signin-hook";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";


export function LoginForm({
  className,
  imageUrl,
  ...props
}: React.ComponentProps<"div"> & {
  imageUrl?: string;
}) {

  const {
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
  } = useAdminSigninHook();



  return (
    <div className={cn("flex w-full h-full font-inter", className)} {...props}>
      <div className="w-full h-full flex flex-row justify-between relative ">
        <div className="h-screen relative hidden md:flex  w-[100%] ">
          {imageUrl && (
            <Image
              fill
              src={login}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
              priority={true}
            />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent "></div>
        </div>
        <form className="min-h-screen flex max-md:px-7 justify-center w-full items-center md:mt-2"
          onSubmit={handleSubmit(onSubmit)} >
          <div className="flex flex-col gap-6 justify-center w-full md:px-20">
            <div className="flex flex-col items-start md:items-start text-start mb-[10px]">
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
                disabled={isLoading || googleLoading} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder=""
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                disabled={isLoading || googleLoading}
              />
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
               disabled={isLoading || googleLoading}
            >
              <div className="flex flex-row gap-3 py-1 items-center ">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Login"
              )}</div>
            </Button>

            <div className="flex flex-col w-full h-full gap-1 justify-center  items-center">
              <div className="flex flex-row w-full h-full gap-1 justify-center  items-center">
                <div className="flex border border-[#525252] h-[1px] w-[100%] justify-center" />
                <div className="text-[#525252] flex align-middle justify-center h-full ">OR</div>
                <div className="border border-[#525252] h-[1px] w-[100%]" />
              </div>
              <Button className="w-full h-full bg-white text-black  border border-[#D6D6D6] hover:text-white mt-2">
                <div className="flex flex-row gap-3 py-1 items-center ">
                  <div className="flex">
                    <Image
                      src='/google.svg'
                      width={20}
                      height={20}
                      alt="icon"
                    />
                  </div>
                  <div className="flex ">Continue with Google</div>
                </div>
              </Button>
            </div>

            <p className="text-center text-sm mt-3 text-crown-black">
              Don&apos;t have an account?{" "}
              <a href="/auth/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

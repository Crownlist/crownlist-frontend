/* eslint-disable */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserSignupHook } from "@/lib/signup-hook";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AccountTypeModal } from "@/components/AccountTypeModal";

export default function SignupForm({
  className,
  imageUrl,
  ...props
}: React.ComponentProps<"div"> & {
  imageUrl?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    register,
    errors,
    isLoading,
    googleLoading,
    handleSubmit,
    onSubmit,
    handleGoogleSignup,
    control,
    showAccountTypeModal,
    onSelectAccountType,
  } = useUserSignupHook();

  const handleFormSubmit = (data: any) => {
    console.log("reg", data);
    if (data.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    // Store email in sessionStorage for verification page
    sessionStorage.setItem("signup-email", data.email);
    // Combine firstname and lastname into fullname
    const requestData = {
      fullName: `${data.fullName} ${data.lastName}`,
      phoneNumber: data.phoneNumber,
      accountType: data.accountType,
      email: data.email,
      password: data.password,
    };
    onSubmit(requestData);
  };

  return (
    <div className={cn("flex w-full h-full font-inter", className)} {...props}>
      <div className="w-full h-full flex flex-row justify-between relative">
        <div className="h-screen relative hidden md:flex w-full">
          {imageUrl && (
            <Image
              fill
              src={"/assets/images/authbg.jpg"}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
              priority={true}
            />
          )}
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-transparent"></div>
        </div>

        <form
          className="min-h-screen flex max-md:px-7 justify-center w-full items-center md:mt-1 mt-5"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div className="flex flex-col gap-6 md:gap-3 justify-center w-full max-w-md">
            <div className="flex flex-col items-start text-start mb-2.5">
              <h1 className="text-2xl font-semibold">Sign up to Crownlist</h1>
              <p className="text-sm text-balance mt-1">
                Enter your details below to create an account
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="firstname">Firstname</Label>
                <Input
                  id="firstname"
                  type="text"
                  placeholder=""
                  inputMode="text"
                  autoComplete="given-name"
                  {...register("fullName", {
                    required: "Firstname is required",
                    minLength: {
                      value: 2,
                      message: "First name must be at least 2 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "First name must be less than 50 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: "Only letters and spaces are allowed",
                    },
                    validate: {
                      noLeadingTrailingSpaces: (value) => {
                        if (value && value.trim() !== value) {
                          return "First name cannot have leading or trailing spaces";
                        }
                        return true;
                      },
                    },
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(
                        /[^a-zA-Z\s]/g,
                        ""
                      );
                    },
                  })}
                  disabled={isLoading || googleLoading}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="lastname">Lastname</Label>
                <Input
                  id="lastname"
                  type="text"
                  placeholder=""
                  inputMode="text"
                  autoComplete="family-name"
                  {...register("lastName", {
                    required: "Lastname is required",
                    minLength: {
                      value: 2,
                      message: "Last name must be at least 2 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "Last name must be less than 50 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: "Only letters and spaces are allowed",
                    },
                    validate: {
                      noLeadingTrailingSpaces: (value) => {
                        if (value && value.trim() !== value) {
                          return "Last name cannot have leading or trailing spaces";
                        }
                        return true;
                      },
                    },
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(
                        /[^a-zA-Z\s]/g,
                        ""
                      );
                    },
                  })}
                  disabled={isLoading || googleLoading}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder=""
                {...register("email", {
                  required: "Email is required",
                })}
                disabled={isLoading || googleLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter a phone number (e.g., 08012345678)"
                onKeyDown={(e) => {
                  // Allow backspace, delete, tab, escape, enter, arrow keys
                  if (
                    e.key === "Backspace" ||
                    e.key === "Delete" ||
                    e.key === "Tab" ||
                    e.key === "Escape" ||
                    e.key === "Enter" ||
                    e.key === "ArrowLeft" ||
                    e.key === "ArrowRight" ||
                    e.key === "ArrowUp" ||
                    e.key === "ArrowDown"
                  ) {
                    return;
                  }
                  // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
                  if (e.ctrlKey || e.metaKey) {
                    return;
                  }
                  // Allow only digits and plus sign
                  if (!/^[0-9+]$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^(\+234|0)[789][01]\d{8}$/,
                    message:
                      "Please enter a valid Nigerian phone number (e.g., 08012345678, +2348012345678)",
                  },
                  validate: {
                    notEmail: (value) => {
                      if (!value) return true;
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      return (
                        !emailRegex.test(value) ||
                        "Please enter a phone number, not an email"
                      );
                    },
                  },
                })}
                disabled={isLoading || googleLoading}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="accountType">Account Type</Label>
              <Controller
                name="accountType"
                control={control}
                rules={{ required: "Account type is required" }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading || googleLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="User">Buyer</SelectItem>
                      <SelectItem value="Seller">Seller</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.accountType && (
                <p className="text-sm text-red-500">
                  {errors.accountType.message}
                </p>
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
                  disabled={isLoading || googleLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  disabled={isLoading || googleLoading}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder=""
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading || googleLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  disabled={isLoading || googleLoading}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-[12px] text-center text-balance">
              By clicking &quot;continue&quot;, you agree to Crownlist`&apos;s{" "}
              <Link
                href="/terms-and-conditions"
                className="underline underline-offset-3 font-medium"
              >
                Terms of use
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"  
                className="underline underline-offset-3 font-medium"
              >
                Privacy Policy
              </Link>
            </p>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={isLoading || googleLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Continue"
              )}
            </Button>

            <div className="flex flex-col w-full h-full gap-1 justify-center items-center">
              <div className="flex flex-row w-full h-full gap-1 justify-center items-center">
                <div className="flex border border-crown-paragraph h-px w-full justify-center" />
                <div className="text-crown-paragraph flex align-middle justify-center h-full">
                  OR
                </div>
                <div className="border border-crown-paragraph h-px w-full" />
              </div>
              <Button
                type="button"
                className="w-full h-full bg-white text-black border border-[#D6D6D6] hover:bg-primary hover:text-white"
                onClick={handleGoogleSignup}
                disabled={isLoading || googleLoading}
              >
                <div className="flex flex-row gap-3 py-1 items-center">
                  <Image
                    src="/google.svg"
                    width={20}
                    height={20}
                    alt="Google icon"
                  />
                  <div className="flex">
                    {googleLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Continue with Google"
                    )}
                  </div>
                </div>
              </Button>
            </div>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-3">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
      <AccountTypeModal
        open={showAccountTypeModal}
        onOpenChange={(open) => {
          if (!open) {
            // Allow closing modal by clicking outside
          }
        }}
        onSelectAccountType={onSelectAccountType}
        isLoading={googleLoading}
      />
      {/* {isLoading && <LoadingPage />} */}
      {/* <SnackbarComp
            snackBarOpen={snackBarOpen}
            setSnackBarOpen={setSnackBarOpen}
            alert={handleSnack.alert}
            message={handleSnack.message}
          /> */}
    </div>
  );
}

/* eslint-disable */
"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { apiClientPublic } from "./interceptor";
import { obfuscateToken } from "@/constants/encryptData";
import { UserProfileProps } from "@/types/general";
import { useToast } from "./useToastMessage";

const useGoogleAuth = () => {
  const searchParams = useSearchParams();
  const { handleMessage, handleSnack, snackBarOpen, setSnackBarOpen } =
    useToast();
  const handleGoogleSignup = async (code: string) => {
    if (code) {
      try {
        const res: any = await apiClientPublic.post("/auth/google/callback", {
          code: decodeURIComponent(code),
        });
        if (res.status === "success") {
          const userInfo = res.data.account;
          localStorage.setItem("leo", userInfo._id);
          localStorage.setItem("leoKey", obfuscateToken(true, res?.data.token));
          localStorage.setItem(
            "leoLoop",
            obfuscateToken(true, res?.data.refreshToken)
          );
          handleMessage("success", "Login Successfully. Redirecting...");
          if (!userInfo.phoneNumber) {
            handleMessage("info", "Update your information");
            location.replace("/auth/complete-information");
          } else {
            handleMessage("success", "Account authenticated successfully");
            if (sessionStorage.getItem("returnUserTo")) {
              location.replace(
                location.origin + sessionStorage.getItem("returnUserTo")
              );
            } else {
              location.replace(location.origin + "/dashboard/home");
            }
          }
        }
      } catch (error) {
        handleMessage("error", String(error));
        location.replace("/auth/sign-in");
      }
    }
  };

  useEffect(() => {
    const initialCode: any = searchParams.get("code");
    handleGoogleSignup(initialCode);
    //eslint-disable-next-line
  }, []);

  return {
    handleSnack,
    snackBarOpen,
    setSnackBarOpen,
  };
};

export default useGoogleAuth;

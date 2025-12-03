/*eslint-disable*/
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { obfuscateToken } from "@/constants/encryptData";
import { apiClientPublic } from "@/lib/interceptor";

function GoogleAuthPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing your Google authentication...");

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (!code || !state) {
          setStatus("error");
          setMessage("Missing authentication parameters");
          return;
        }

        // Decode the state parameter
        const decodedState = decodeURIComponent(state);
        const stateData = JSON.parse(decodedState);
        const accountType = stateData.accountType;

        // Call the callback API
        const response = await apiClientPublic.get(
          `/auth/google/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(decodedState)}`
        );

        console.log('responseeee', response.data, response.status)

        if (response.data && response.status.toString() === "success") {
          const { account, token, refreshToken } = response.data;

          // Store tokens and user data (similar to signup/login hooks)
          localStorage.setItem("leo", account._id);
          localStorage.setItem("leoName", account.fullName);
          localStorage.setItem(
            "leoKey",
            obfuscateToken(true, token)
          );
          localStorage.setItem(
            "leoLoop",
            obfuscateToken(true, refreshToken)
          );

          setStatus("success");
          setMessage("Authentication successful! Redirecting...");

          // Redirect based on account type
          setTimeout(() => {
            if (account.accountType === "User") {
              router.replace("/buyer/profile");
            } else if (account.accountType === "Seller") {
              router.replace("/seller/dashboard");
            } else {
              router.replace("/buyer/profile");
            }
          }, 2000);
        } else {
          throw new Error("Authentication failed");
        }
      } catch (error: any) {
        console.error("Google auth error:", error);
        setStatus("error");
        setMessage(error.message || "Authentication failed. Please try again.");
      }
    };

    handleGoogleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-[#1F058F]" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Signing you in with Google
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-[#1F058F]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Success!
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => router.push("/auth/signup")}
              className="bg-[#1F058F] text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const GoogleAuthPage = dynamic(() => Promise.resolve(GoogleAuthPageComponent), {
  ssr: false,
});

export default GoogleAuthPage;

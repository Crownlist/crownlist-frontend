"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClientUser } from "@/lib/interceptor";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header1";
import { LoginForm } from "./loginForm";

export default function LoginPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    console.log("🔍 Login page: Checking authentication...");

    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        // Check for user data stored in localStorage
        const userDataString = localStorage.getItem("leo");
        const userName = localStorage.getItem("leoName");

        // Check for admin tokens
        const orionKey = localStorage.getItem("orionKey");
        const orionLoop = localStorage.getItem("orionLoop");

        console.log("🔑 Login page storage check:", {
          userData: !!userDataString,
          userName: !!userName,
          orionKey: !!orionKey,
          orionLoop: !!orionLoop,
        });

        let redirectUrl = "";

        // Check user data
        if (userDataString && userName) {
          console.log("👤 Login page: Found user data, parsing...");

          // Check if we have tokens to validate
          const leoKey = localStorage.getItem("leoKey");
          const leoLoop = localStorage.getItem("leoLoop");

          if (leoKey && leoLoop) {
            console.log("🔓 Login page: Validating tokens...");

            // Check account type from localStorage first
            let accountType = localStorage.getItem("leoAccountType");
            console.log(
              "📋 Login page: Account type from storage:",
              accountType
            );

            // If account type is not in localStorage, fetch it from API
            if (!accountType) {
              console.log(
                "🔄 Login page: Account type missing, fetching from API..."
              );
              try {
                const response = await apiClientUser.get("/auth/me");
                accountType = response.data.loggedInAccount.accountType;
                console.log(
                  "📋 Login page: Account type from API:",
                  accountType
                );

                // Store it for future use
                if (accountType) {
                  localStorage.setItem("leoAccountType", accountType);
                }
              } catch (apiError) {
                console.error(
                  "❌ Login page: Failed to fetch user data from API:",
                  apiError
                );
                // If API call fails, clear tokens and stay on login page
                localStorage.removeItem("leo");
                localStorage.removeItem("leoName");
                localStorage.removeItem("leoKey");
                localStorage.removeItem("leoLoop");
                localStorage.removeItem("leoAccountType");
                setIsCheckingAuth(false);
                return;
              }
            }

            if (accountType === "Seller") {
              redirectUrl = "/seller/dashboard";
              console.log(
                "🏪 Login page: Seller authenticated, redirecting to dashboard"
              );
            } else {
              // Default to buyer for "User" or unknown types
              redirectUrl = "/buyer/profile";
              console.log(
                "🏠 Login page: User authenticated, redirecting to profile"
              );
            }
          } else {
            console.log("❌ Login page: Tokens missing, clearing user data");
            localStorage.removeItem("leo");
            localStorage.removeItem("leoName");
          }
        }

        // Check admin tokens (admins are allowed to access login page)
        if (!redirectUrl && orionKey && orionLoop) {
          console.log(
            "👑 Login page: Found admin tokens, allowing access to login page"
          );
          // Don't set redirectUrl for admins - let them access the login page
        }

        console.log("🔀 Login page: Final redirect URL:", redirectUrl);

        // Redirect if authenticated
        if (redirectUrl) {
          console.log("� Login page: Redirecting to:", redirectUrl);
          router.replace(redirectUrl);
        } else {
          console.log(
            "✅ Login page: No authentication found, staying on login page"
          );
          setIsCheckingAuth(false);
        }
      } catch (error) {
        console.error("❌ Login page: Error during auth check:", error);
        // Clear invalid data on any error
        localStorage.removeItem("leo");
        localStorage.removeItem("leoName");
        localStorage.removeItem("leoKey");
        localStorage.removeItem("leoLoop");
        localStorage.removeItem("leoAccountType");
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="font-inter">
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#1F058F]" />
            <p className="text-sm text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-inter">
      <div className="w-full min-h-screen">
        {/* Header */}
        <Header hidden={true} />
        <LoginForm
          className="max-md:max-w-md mx-auto"
          imageUrl="../../../public/assets/images/authbg.jpg"
        />
      </div>
    </div>
  );
}

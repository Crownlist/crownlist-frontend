"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClientUser } from "@/lib/interceptor";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header1";
import SignupForm from "./signupForm";

export default function SignupPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    console.log("🔍 Signup page: Checking authentication...");

    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        // Check for user data stored in localStorage
        const userDataString = localStorage.getItem("leo");
        const userName = localStorage.getItem("leoName");

        // Check for admin tokens
        const orionKey = localStorage.getItem("orionKey");
        const orionLoop = localStorage.getItem("orionLoop");

        console.log("🔑 Signup page storage check:", {
          userData: !!userDataString,
          userName: !!userName,
          orionKey: !!orionKey,
          orionLoop: !!orionLoop,
        });

        let redirectUrl = "";

        // Check user data
        if (userDataString && userName) {
          console.log("👤 Signup page: Found user data, validating...");

          // Check if we have tokens to validate
          const leoKey = localStorage.getItem("leoKey");
          const leoLoop = localStorage.getItem("leoLoop");

          if (leoKey && leoLoop) {
            console.log("🔓 Signup page: Validating tokens...");

            // Check account type from localStorage first
            let accountType = localStorage.getItem("leoAccountType");
            console.log(
              "📋 Signup page: Account type from storage:",
              accountType
            );

            // If account type is not in localStorage, fetch it from API
            if (!accountType) {
              console.log(
                "🔄 Signup page: Account type missing, fetching from API..."
              );
              try {
                const response = await apiClientUser.get("/auth/me");
                accountType = response.data.loggedInAccount.accountType;
                console.log(
                  "📋 Signup page: Account type from API:",
                  accountType
                );

                // Store it for future use
                if (accountType) {
                  localStorage.setItem("leoAccountType", accountType);
                }
              } catch (apiError) {
                console.error(
                  "❌ Signup page: Failed to fetch user data from API:",
                  apiError
                );
                // If API call fails, clear tokens and stay on signup page
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
                "🏪 Signup page: Seller authenticated, redirecting to dashboard"
              );
            } else {
              // Default to buyer for "User" or unknown types
              redirectUrl = "/buyer/profile";
              console.log(
                "🏠 Signup page: User authenticated, redirecting to profile"
              );
            }
          } else {
            console.log("❌ Signup page: Tokens missing, clearing user data");
            localStorage.removeItem("leo");
            localStorage.removeItem("leoName");
          }
        }

        // Check admin tokens (admins are allowed to access signup page)
        if (!redirectUrl && orionKey && orionLoop) {
          console.log(
            "👑 Signup page: Found admin tokens, allowing access to signup page"
          );
          // Don't set redirectUrl for admins - let them access the signup page
        }

        console.log("🔀 Signup page: Final redirect URL:", redirectUrl);

        // Redirect if authenticated
        if (redirectUrl) {
          console.log("🚀 Signup page: Redirecting to:", redirectUrl);
          router.replace(redirectUrl);
        } else {
          console.log(
            "✅ Signup page: No authentication found, staying on signup page"
          );
          setIsCheckingAuth(false);
        }
      } catch (error) {
        console.error("❌ Signup page: Error during auth check:", error);
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
        <SignupForm
          className="max-md:max-w-md mx-auto"
          imageUrl="../../../public/assets/images/authbg.jpg"
        />
      </div>
    </div>
  );
}

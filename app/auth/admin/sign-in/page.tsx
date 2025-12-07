"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { LoginForm } from "./_components/loginform";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    console.log("🔍 Admin login page: Checking authentication...");

    // Check if admin is already authenticated
    const checkAuth = async () => {
      try {
        // Check for admin tokens
        const orionKey = localStorage.getItem("orionKey");
        const orionLoop = localStorage.getItem("orionLoop");

        console.log("🔑 Admin login page storage check:", {
          orionKey: !!orionKey,
          orionLoop: !!orionLoop,
        });

        // If admin tokens exist, redirect to admin dashboard
        if (orionKey && orionLoop) {
          console.log(
            "👑 Admin login page: Admin already logged in, redirecting to dashboard"
          );
          router.replace("/admin");
          return;
        }

        console.log(
          "✅ Admin login page: No admin authentication found, staying on login page"
        );
        setIsCheckingAuth(false);
      } catch (error) {
        console.error("❌ Admin login page: Error during auth check:", error);
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
        <LoginForm className="max-md:max-w-md mx-auto" />
      </div>
    </div>
  );
}

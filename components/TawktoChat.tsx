/*eslint-disable*/
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Extend Window interface for Tawk.to
declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

export default function TawktoChat() {
  const pathname = usePathname();
  const isInitialized = useRef(false);

  // Define routes where chat should NOT be shown (dashboard routes)
  const excludedRoutes = ["/admin", "/buyer", "/seller", "/auth"];

  const shouldShowChat = !excludedRoutes.some((route) =>
    pathname?.startsWith(route)
  );

  useEffect(() => {
    const initializeTawk = () => {
      if (isInitialized.current) return;

      // Initialize Tawk.to
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      const script = document.createElement("script");
      script.async = true;
      script.src = "https://embed.tawk.to/5f43a3c01e7ade5df4436619/default";
      script.setAttribute("crossorigin", "*");

      document.head.appendChild(script);
      isInitialized.current = true;

      // Set visibility after Tawk loads
      window.Tawk_API.onLoad = function () {
        if (shouldShowChat) {
          window.Tawk_API.showWidget();
        } else {
          window.Tawk_API.hideWidget();
        }
      };
    };

    // Initialize Tawk.to only once
    if (!document.querySelector('script[src*="embed.tawk.to"]')) {
      initializeTawk();
    } else {
      // Tawk is already loaded, just control visibility
      if (window.Tawk_API && typeof window.Tawk_API.showWidget === "function") {
        if (shouldShowChat) {
          window.Tawk_API.showWidget();
        } else {
          window.Tawk_API.hideWidget();
        }
      }
    }
  }, [shouldShowChat, pathname]);

  return null;
}

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

      // Apply custom CSS globally before widget loads
      const globalStyle = document.createElement('style');
      globalStyle.textContent = `
        /* Tawk.to widget color overrides */
        .tawk-button,
        .tawk-button:hover,
        .tawk-minimized-button,
        .tawk-minimized-button:hover,
        .tawk-button-circle,
        .tawk-button-circle:hover,
        .widget-button,
        .widget-button:hover,
        [class*="tawk-"] button,
        [class*="tawk-"] .button,
        iframe[src*="tawk.to"] ~ div button,
        iframe[src*="tawk.to"] ~ div .button {
          background-color: #1F058F !important;
          background: #1F058F !important;
          border-color: #1F058F !important;
        }

        /* Additional selectors for different widget states */
        .tawk-branding,
        .tawk-branding *,
        .widget-visible .tawk-button,
        .widget-minimized .tawk-button {
          background-color: #1F058F !important;
        }

        /* Override any inline styles */
        [style*="background-color"] {
          background-color: #1F058F !important;
        }
      `;
      document.head.appendChild(globalStyle);

      // Initialize Tawk.to
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      const script = document.createElement("script");
      script.async = true;
      script.src = "https://embed.tawk.to/68a20642b25b86192ad78266/1j2segtok";
      script.setAttribute("crossorigin", "*");

      document.head.appendChild(script);
      isInitialized.current = true;

      // Set visibility and additional customization after Tawk loads
      window.Tawk_API.onLoad = function () {
        // Additional CSS injection for dynamically created elements
        const dynamicStyle = document.createElement('style');
        dynamicStyle.textContent = `
          /* Force color override on all Tawk.to elements */
          div[class*="tawk"] button,
          div[class*="tawk"] .button,
          .tawk-button,
          .tawk-minimized-button,
          .widget-button {
            background-color: #1F058F !important;
            background: #1F058F !important;
            border-color: #1F058F !important;
          }
        `;
        document.head.appendChild(dynamicStyle);

        // Use mutation observer to catch dynamically added elements
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  const element = node as Element;
                  if (element.className && (
                    element.className.includes('tawk') ||
                    element.className.includes('widget') ||
                    element.tagName === 'BUTTON'
                  )) {
                    (element as HTMLElement).style.backgroundColor = '#1F058F';
                    (element as HTMLElement).style.borderColor = '#1F058F';
                  }
                }
              });
            }
          });
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });

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

"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  MessageSquare,
  Bookmark,
  ShoppingBag,
  User,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { useGetAuthUser } from "@/lib/useGetAuthUser";

// Bottom nav is hidden on any /buyer/* or /seller/* route

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Get logged in user data
  const { data } = useGetAuthUser("User");
  const userData = data?.data.loggedInAccount;
  const isLoggedIn = !!userData;

  // Define nav items based on user type
  const getNavItems = () => {
    if (!isLoggedIn) return [];

    const accountType = userData?.accountType;

    if (accountType === "Seller") {
      return [
        { name: "Home", path: "/seller/dashboard", icon: Home },
        { name: "Request", path: "/seller/request", icon: Inbox },
        {
          name: "Sell",
          path: "/seller/product/post-product",
          icon: ShoppingBag,
        },
        { name: "Messages", path: "/seller/messages", icon: MessageSquare },
        { name: "Profile", path: "/seller/settings/profile", icon: User },
      ];
    } else if (accountType === "User") {
      return [
        { name: "Home", path: "/buyer/dashboard", icon: Home },
        { name: "Saved", path: "/buyer/saved", icon: Bookmark },
        { name: "Messages", path: "/buyer/messages", icon: MessageSquare },
        { name: "Request", path: "/buyer/request", icon: Inbox },
        { name: "Profile", path: "/buyer/profile", icon: User },
      ];
    }

    return [];
  };

  const navItems = getNavItems();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Hide bottom nav if user is not logged in or on seller/buyer routes
  if (
    !isLoggedIn ||
    pathname.startsWith("/seller/") ||
    pathname.startsWith("/buyer/")
  ) {
    return null;
  }

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white shadow-lg md:hidden z-40 transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={cn(
              "flex flex-col items-center gap-1 h-full",
              pathname === item.path ? "text-blue-600" : "text-gray-600"
            )}
            onClick={() => router.push(item.path)}
            aria-label={`Navigate to ${item.name}`}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs">{item.name}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}

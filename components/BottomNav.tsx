"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, MessageSquare, Bookmark, ShoppingBag, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect, useRef } from "react"


const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Saved", path: "/buyer/saved", icon: Bookmark },
  { name: "Sell", path: "/seller/dashboard", icon: ShoppingBag },
  { name: "Messages", path: "/buyer/messages", icon: MessageSquare },
  { name: "Profile", path: "/buyer/profile", icon: User },
]
const visiblePaths = [
  "/", 
  "/buyer/saved", 
  "/buyer/messages", 
  "/buyer/profile"
]

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)



  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        setIsVisible(false)
      } else {
        // Scrolling up
        setIsVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

    // Hide bottom nav on seller dashboard pages and specific buyer pages
    if (pathname.startsWith('/seller/') || !visiblePaths.includes(pathname)) {
      return null
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
  )
}
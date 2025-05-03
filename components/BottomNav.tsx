"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, MessageSquare, Bell, Search, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect, useRef } from "react"

const navItems = [
  { name: "Category", path: "/category", icon: Home },
  { name: "Contact", path: "/contact", icon: MessageSquare },
  { name: "Notification", path: "/notification", icon: Bell },
  { name: "Product", path: "/product", icon: ShoppingBag },
  { name: "Search", path: "/search", icon: Search },
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

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white shadow-lg md:hidden z-40 transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Button
            key={item.path}
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
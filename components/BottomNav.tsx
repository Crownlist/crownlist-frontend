"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, MessageSquare, Bookmark, ShoppingBag, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect, useRef } from "react"

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Saved", path: "/", icon: Bookmark },
  { name: "Sell", path: "/", icon: ShoppingBag },
  { name: "Messages", path: "/", icon: MessageSquare },
  { name: "Profile", path: "/", icon: User },
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
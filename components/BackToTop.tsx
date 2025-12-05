"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      // Show button when scrolled down more than 300px
      setIsVisible(scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <Button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-20 right-4 z-50 h-12 w-12 rounded-full bg-[#1F058F] hover:bg-[#2a0bc0] shadow-lg transition-all duration-300 md:bottom-6 md:right-6",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
      )}
      size="icon"
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-6 w-6 text-white" />
    </Button>
  )
}

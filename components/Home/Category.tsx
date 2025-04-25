"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import Image from "next/image"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// ... (keep your categories array the same)
const categories = [
  {
    name: "Phones & Tablets",
    icon: "/video.png",
    hot: true,
    subcategories: [
      { name: "Mobile phone", href: "/category/phone-tablets?subcategory=mobile" },
      { name: "Accessories", href: "/category/phone-tablets?subcategory=accessories" },
      { name: "Tablets", href: "/category/phone-tablets?subcategory=tablets" },
      { name: "Smart watches", href: "/category/phone-tablets?subcategory=watches" },
    ],
  },
  {
    name: "Electronics",
    icon: "/lab-scale.png",
    hot: true,
    subcategories: [
      { name: "Hardware", href: "/category/electronics?subcategory=hardware" },
      { name: "Monitors", href: "/category/electronics?subcategory=monitors" },
      { name: "Laptops", href: "/category/electronics?subcategory=laptops" },
      { name: "Headphones", href: "/category/electronics?subcategory=headphones" },
      { name: "Music equipment", href: "/category/electronics?subcategory=music" },
      { name: "Cameras", href: "/category/electronics?subcategory=cameras" },
    ],
  },
  {
    name: "Properties",
    icon: "/protection.png",
    hot: true,
    subcategories: [
      { name: "Student", href: "/category/property?subcategory=student" },
      { name: "Personal", href: "/category/property?subcategory=personal" },
      { name: "Office", href: "/category/property?subcategory=office" },
    ],
  },
  {
    name: "Fashion",
    icon: "/dress.png",
    hot: true,
    subcategories: [
      { name: "Bags", href: "/category/fashion?subcategory=bags" },
      { name: "Clothes", href: "/category/fashion?subcategory=clothes" },
      { name: "Jewelry", href: "/category/fashion?subcategory=jewelry" },
      { name: "Shoes", href: "/category/fashion?subcategory=shoes" },
    ],
  },
  {
    name: "Cars",
    icon: "/car.png",
    isComingSoon: true,
    subcategories: [],
  },
  {
    name: "Jobs",
    icon: "/new-job.png",
    isComingSoon: true,
    subcategories: [],
  },
  {
    name: "Services",
    icon: "/service.png",
    isComingSoon: true,
    subcategories: [],
  },
  {
    name: "Sneakers",
    icon: "/car.png",
    isComingSoon: true,
    subcategories: [],
  },
]

export default function CategoryGrid() {
  const pathname = usePathname()
  // const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[0] | null>(null)

  const handleCategoryClick = (category: typeof categories[0]) => {
    if (category.isComingSoon) return

    if (category.subcategories && category.subcategories.length > 0) {
      setSelectedCategory(category)
      setDialogOpen(true)
    }
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setSelectedCategory(null)
  }

  return (
    <div className="py-5 mx-auto justify-center sticky inset-18 z-[9]">
      <div className="text-black font-semibold text-lg mb-5">Category Picks</div>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 justify-center items-start">
        {categories.map((cat) => {
          const isActive = pathname === "/product" 

          return (
            <div key={cat.name} className="">
              <div
                className={clsx(
                  "w-20 flex flex-col items-center text-center group transition-all hover:scale-105 cursor-pointer",
                  isActive && cat.name === "Health & Beauty" && "bg-blue-100 rounded-xl py-1",
                )}
                onClick={() => handleCategoryClick(cat)}
              >
                <div className="relative w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shadow-sm">
                  <Image src={cat.icon || "/placeholder.svg"} alt={cat.name} width={38} height={38} />
                  {cat.isComingSoon && (
                    <span className="absolute -top-2 -right-0 bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold shadow">
                      soon.
                    </span>
                  )}
                </div>
                <p className="text-xs mt-2">{cat.name}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ShadCN Dialog for Subcategories */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>{selectedCategory?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedCategory?.subcategories?.map((subcat) => (
              <Link 
                key={subcat.name} 
                href={subcat.href}
                onClick={closeDialog}
              >
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left"
                >
                  {subcat.name}
                </Button>
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
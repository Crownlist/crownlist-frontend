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
import { useCategories } from "@/hooks/useCategories"
import { Category } from "@/types/category/category"



export default function CategoryGrid() {
  const pathname = usePathname()
  const { categories, loading } = useCategories()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const handleCategoryClick = (category: Category) => {
    const subcategories = category.subCategories || []
    if (subcategories.length > 0) {
      setSelectedCategory(category)
      setDialogOpen(true)
    } else {
      // Navigate directly to category if no subcategories
      window.location.href = `/category/${category.slug}`
    }
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setSelectedCategory(null)
  }

  if (loading) {
    return (
      <div className="py-5 mx-auto justify-center sticky inset-18 z-[9]">
        <div className="text-black font-semibold text-lg mb-5">Category Picks</div>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 justify-center items-start">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="w-20 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-12 h-3 bg-gray-200 rounded animate-pulse mt-2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="py-5 mx-auto justify-center sticky inset-18 z-[9]">
      <div className="text-black font-semibold text-lg mb-5">Category Picks</div>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 justify-center items-start">
        {categories.map((cat) => {
          const isActive = pathname === "/product" 
          const subcategories = cat.subCategories || []
          const hasSubcategories = subcategories.length > 0

          return (
            <div key={cat._id} className="">
              <div
                className={clsx(
                  "w-20 flex flex-col items-center text-center group transition-all hover:scale-105 cursor-pointer",
                  isActive && cat.name === "Health & Beauty" && "bg-blue-100 rounded-xl py-1",
                )}
                onClick={() => handleCategoryClick(cat)}
              >
                <div className="relative w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shadow-sm">
                  <Image src={cat.imageUrl || "/placeholder.svg"} alt={cat.name} width={38} height={38} />
                  {!hasSubcategories && (
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
            {(selectedCategory?.subCategories || []).map((subcat) => (
              <Link 
                key={subcat._id} 
                href={`/category/${selectedCategory!.slug}?subcategory=${subcat.name.toLowerCase().replace(/\s+/g, '-')}`}
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
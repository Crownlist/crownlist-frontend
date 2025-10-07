"use client"

import { useState, useEffect } from "react"
import { ChevronRight, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCategories } from "@/hooks/useCategories"
import { Subcategory } from "@/types/category/category"

// Display category type for both real and dummy categories
interface DisplayCategory {
  _id: string
  name: string
  slug: string
  imageUrl?: string
  status: string
  description?: string
  subCategories?: Subcategory[] | never[]
}

// Dummy categories to fill up remaining space
const dummyCategories: DisplayCategory[] = [
  {
    _id: "dummy-cars",
    name: "Cars",
    slug: "cars",
    imageUrl: "/assets/images/cars.png",
    status: "undefined",
    description: "",
    subCategories: []
  },
  {
    _id: "dummy-jobs",
    name: "Jobs",
    slug: "jobs",
    imageUrl: "/assets/images/jobs.png",
    status: "undefined",
    description: "",
    subCategories: []
  },
  {
    _id: "dummy-services",
    name: "Services",
     slug: "Services",
    imageUrl: "/assets/images/services.png",
    status: "undefined",
    description: "",
    subCategories: []
  },
  {
    _id: "dummy-home-appliances",
    name: "Home Appliances and Furniture",
    slug: "home-appliances",
    imageUrl: "/assets/images/cars.png",
    status: "undefined",
    description: "",
    subCategories: []
  }
]

export default function CategoryScroll() {
  const { categories, loading } = useCategories()
  const [showModal, setShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<DisplayCategory | null>(null)

  // Combine API categories with dummy categories
  const allCategories: DisplayCategory[] = [...categories, ...dummyCategories]

  const handleCategoryClick = (category: DisplayCategory) => {
    // Check if it's a dummy category
    if (category.status === 'undefined') {
      return // Don't do anything for dummy categories
    }
    
    // Check if category has subcategories
    const subcategories = category.subCategories || []
    if (subcategories.length === 0) {
      // If no subcategories, navigate directly to category
      window.location.href = `/${category.slug}`
      return
    }
    
    // If has subcategories, open modal
    setSelectedCategory(category)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedCategory(null)
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [])

  if (loading) {
    return (
      <div className="space-y-2 relative">
        <h2 className="text-lg font-semibold">Category</h2>
        <div className="flex overflow-x-auto no-scrollbar gap-4 py-1">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="min-w-[140px] h-[160px] rounded-xl bg-gray-200 animate-pulse flex-shrink-0" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2 relative">
      <h2 className="text-lg font-semibold">Category</h2>

      <div className="flex overflow-x-auto no-scrollbar gap-4 py-1">
         {allCategories.map((category) => {
           const isDummy = category.status === 'undefined'
          
          return (
            <div 
              key={category._id} 
              className={`relative min-w-[140px] h-[160px] rounded-xl overflow-hidden flex-shrink-0 ${isDummy ? '' : 'cursor-pointer'}`}
              onClick={() => handleCategoryClick(category)}
            >
              <Image
                src={category.imageUrl || "/placeholder.svg?height=160&width=140"}
                alt={category.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-3 py-4 flex flex-col justify-end">
                <h3 className="text-white text-sm font-medium">{category.name}</h3>
                                 {isDummy ? (
                   <span className="bg-white text-xs text-black rounded-full px-3 py-1 w-fit mt-1">Coming soon</span>
                 ) : (
                   <button
                     className="category-button flex text-white text-xs mt-1 justify-start items-center"
                     onClick={() => handleCategoryClick(category)}
                   >
                     Explore <ChevronRight size={16} />
                   </button>
                 )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {showModal && selectedCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal}
        >
          <div
            className="modal-content bg-white rounded-lg w-full max-w-md shadow-xl p-5 relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-4">{selectedCategory.name}</h3>
            <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {(selectedCategory.subCategories || []).map((subcategory) => (
                <li key={subcategory._id}>
                  <Link
                    href={`/${selectedCategory.slug}/${subcategory.slug}`}
                    className="block py-2 px-2 rounded hover:bg-gray-100 transition"
                    onClick={closeModal}
                  >
                    {subcategory.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

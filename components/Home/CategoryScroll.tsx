"use client"

import { useState, useEffect } from "react"
import { ChevronRight, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
// import clsx from "clsx"

const categories = [
  {
    title: "House",
    cta: "Explore",
    img: "/assets/images/house.png",
    comingSoon: false,
    subcategories: [
      { name: "Student", href: "/category/property?subcategory=student" },
      { name: "Personal", href: "/category/property?subcategory=personal" },
      { name: "Office", href: "/category/property?subcategory=office" },
    ],
  },
  {
    title: "Phone & tablets",
    cta: "Explore",
    img: "/assets/images/pandt.png",
    comingSoon: false,
    subcategories: [
      { name: "Mobile phone", href: "/category/phone-tablets?subcategory=mobile" },
      { name: "Accessories", href: "/category/phone-tablets?subcategory=accessories" },
      { name: "Tablets", href: "/category/phone-tablets?subcategory=tablets" },
      { name: "Smart watches", href: "/category/phone-tablets?subcategory=watches" },
    ],
  },
  {
    title: "Fashion",
    cta: "Explore",
    img: "/assets/images/fashion.png",
    comingSoon: false,
    subcategories: [
      { name: "Bags", href: "/category/fashion?subcategory=bags" },
      { name: "Clothes", href: "/category/fashion?subcategory=clothes" },
      { name: "Jewelry", href: "/category/fashion?subcategory=jewelry" },
      { name: "Shoes", href: "/category/fashion?subcategory=shoes" },
    ],
  },
  {
    title: "Electronics",
    cta: "Explore",
    img: "/assets/images/elect.png",
    comingSoon: false,
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
    title: "Cars",
    cta: "Coming soon",
    img: "/assets/images/cars.png",
    comingSoon: true,
    subcategories: [],
  },
  {
    title: "Jobs",
    cta: "Coming soon",
    img: "/assets/images/jobs.png",
    comingSoon: true,
    subcategories: [],
  },
  {
    title: "Services",
    cta: "Coming soon",
    img: "/assets/images/services.png",
    comingSoon: true,
    subcategories: [],
  },
  {
    title: "Sneakers",
    cta: "Coming soon",
    img: "/assets/images/cars.png",
    comingSoon: true,
    subcategories: [],
  },
]

export default function CategoryScroll() {
  const [showModal, setShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const handleCategoryClick = (index: number, comingSoon: boolean) => {
    if (comingSoon) return
    setSelectedCategory(index)
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

  return (
    <div className="space-y-2 relative">
      <h2 className="text-lg font-semibold">Category</h2>

      <div className="flex overflow-x-auto no-scrollbar gap-4 py-1">
        {categories.map((cat, idx) => (
          <div key={idx} className="relative min-w-[140px] h-[160px] rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={cat.img || "/placeholder.svg?height=160&width=140"}
              alt={cat.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-3 py-4 flex flex-col justify-end">
              <h3 className="text-white text-sm font-medium">{cat.title}</h3>
              {cat.comingSoon ? (
                <span className="bg-white text-xs text-black rounded-full px-3 py-1 w-fit mt-1">Coming soon</span>
              ) : (
                <button
                  className="category-button flex text-white text-xs mt-1 justify-start items-center"
                  onClick={() => handleCategoryClick(idx, cat.comingSoon)}
                >
                  {cat.cta} <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedCategory !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal} // ← Close modal when clicking the backdrop
        >
          <div
            className="modal-content bg-white rounded-lg w-full max-w-md shadow-xl p-5 relative animate-fade-in"
            onClick={(e) => e.stopPropagation()} // ← Prevent closing when clicking inside the modal
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-4">{categories[selectedCategory].title}</h3>
            <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {categories[selectedCategory].subcategories.map((subcat) => (
                <li key={subcat.name}>
                  <Link
                    href={subcat.href}
                    className="block py-2 px-2 rounded hover:bg-gray-100 transition"
                    onClick={closeModal}
                  >
                    {subcat.name}
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

"use client"

import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showModal) {
        const target = e.target as HTMLElement
        if (!target.closest(".modal-content") && !target.closest(".category-button")) {
          setShowModal(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showModal])

  const handleCategoryClick = (index: number, comingSoon: boolean) => {
    if (comingSoon) return

    setSelectedCategory(index)
    setShowModal(true)

    // Debug
    console.log(`Clicked category: ${categories[index].title}`)
    console.log(`Show modal: true`)
  }

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

      {/* Modal for subcategories - Mobile */}
      {showModal && selectedCategory !== null && (
        <div className="inset-0  z-50 flex items-end justify-center">
          <div className="modal-content bg-white w-full rounded-t-xl p-4 animate-slide-up">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h3 className="font-medium mb-3">{categories[selectedCategory].title}</h3>
            <ul className="space-y-3">
              {categories[selectedCategory].subcategories.map((subcat) => (
                <li key={subcat.name}>
                  <Link
                    href={subcat.href}
                    className="block py-2 hover:text-blue-600 transition-colors"
                    onClick={() => setShowModal(false)}
                  >
                    {subcat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Modal for subcategories - Desktop */}
      {/* {showModal && selectedCategory !== null && (
        <div className=" fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div
            className="modal-content bg-white rounded-lg shadow-xl p-4 w-64 pointer-events-auto animate-fade-in"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <h3 className="font-medium mb-3 pb-2 border-b">{categories[selectedCategory].title}</h3>
            <ul className="space-y-2">
              {categories[selectedCategory].subcategories.map((subcat) => (
                <li key={subcat.name}>
                  <Link
                    href={subcat.href}
                    className="block py-1 hover:text-blue-600 transition-colors"
                    onClick={() => setShowModal(false)}
                  >
                    {subcat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )} */}

      {/* Debug info */}
      {/* <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
        <p>Selected category: {selectedCategory !== null ? categories[selectedCategory].title : "none"}</p>
        <p>Show modal: {showModal ? "true" : "false"}</p>
      </div> */}
    </div>
  )
}

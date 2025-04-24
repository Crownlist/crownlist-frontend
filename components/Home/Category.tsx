"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"

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
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setActiveCategory(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleCategoryClick = (categoryName: string, hasSubcategories: boolean, isComingSoon: boolean) => {
    if (isComingSoon) return

    if (hasSubcategories) {
      // Toggle the active category
      setActiveCategory(activeCategory === categoryName ? null : categoryName)
    } else {
      // If no subcategories, navigate directly (handled by Link component)
      setActiveCategory(null)
    }
  }

  return (
    <div className="py-5 mx-auto justify-center sticky inset-18 z-[9]">
      <div className="text-black font-semibold text-lg mb-5">Category Picks</div>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 justify-center items-start relative">
        {categories.map((cat) => {
          const isActive = pathname === "/product" // Change logic if needed
          const hasSubcategories = cat.subcategories && cat.subcategories.length > 0

          return (
            <div key={cat.name} className="" ref={(el) => { (categoryRefs.current[cat.name] = el) }}>
              <div
                className={clsx(
                  "w-20 flex flex-col items-center text-center  group transition-all hover:scale-105 cursor-pointer",
                  isActive && cat.name === "Health & Beauty" && "bg-blue-100 rounded-xl py-1",
                )}
                onClick={() => handleCategoryClick(cat.name, hasSubcategories, !!cat.isComingSoon)}
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

              {/* Subcategories Popup */}
              {/* {activeCategory === cat.name && hasSubcategories && (
                <div
                  ref={popupRef}
                  className="absolute z-20 bg-white rounded-lg shadow-lg p-3 mt-2 w-48 left-0 transform border border-gray-200"
                >
                  <div className="absolute -top-2 left-1/5 transform  w-4 h-4 bg-white rotate-45 border-t border-l border-gray-200"></div>
                  <h3 className="font-medium text-sm mb-2 pb-2 border-b">{cat.name}</h3>
                  <ul className="space-y-2">
                    {cat.subcategories.map((subcat) => (
                      <li key={subcat.name}>
                        <Link
                          href={subcat.href}
                          className="block text-sm hover:text-blue-600 transition-colors"
                          onClick={() => setActiveCategory(null)}
                        >
                          {subcat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}
              {activeCategory === cat.name && hasSubcategories && (
                <div
                  ref={popupRef}
                  className={clsx(
                    "absolute z-30 rounded-xl shadow-2xl border bg-white transition-all duration-300 ease-in-out",
                    "w-64 sm:w-72 md:w-80 p-5 mt-3 left-[20vw] ",
                    "md:left-auto md:translate-x-0 md:mt-2 md:w-60 md:absolute"
                  )}
                >
                  {/* Arrow Tip */}
                  <div className="hidden md:block absolute -top-2 left-10 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200"></div>

                  <h3 className="font-semibold text-sm text-gray-800 mb-3">{cat.name}</h3>
                  <ul className="space-y-2">
                    {cat.subcategories.map((subcat) => (
                      <li key={subcat.name}>
                        <Link
                          href={subcat.href}
                          onClick={() => setActiveCategory(null)}
                          className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          {subcat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          )
        })}
      </div>
    </div>
  )
}

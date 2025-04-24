"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import clsx from "clsx"

interface Category {
  name: string
  subcategories: { name: string; href: string }[]
}

interface Props {
  category: Category
  isOpen: boolean
  onClose: () => void
}

export default function CategoryModal({ category, isOpen, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      className={clsx(
        "absolute top-full left-[50vw]  mt-3 z-50 w-64 sm:w-72 md:w-80 p-5 rounded-xl bg-black/50 border shadow-xl",
        "transition-all duration-300"
      )}
    >
      <div className="hidden md:block absolute -top-2 left-[50vw] w-4 h-4 bg-white rotate-45 border-t border-l border-gray-200" />
      <h3 className="font-semibold text-sm text-gray-800 mb-3">{category.name}</h3>
      <ul className="space-y-2">
        {category.subcategories.map((subcat) => (
          <li key={subcat.name}>
            <Link
              href={subcat.href}
              onClick={onClose}
              className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              {subcat.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

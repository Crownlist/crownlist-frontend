"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { Grid, List } from "lucide-react"

interface HeaderSectionProps {
  categoryTitle: string
  subcategoryTitle?: string
  viewMode: "grid" | "list"
  setViewMode: (mode: "grid" | "list") => void
  resultsCount?: number
}

export default function HeaderSection({
  categoryTitle,
  subcategoryTitle,
  viewMode,
  setViewMode,
  resultsCount
}: HeaderSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <ChevronRight size={16} />
        <span className="text-gray-700">{categoryTitle}</span>
        {subcategoryTitle && (
          <>
            <ChevronRight size={16} />
            <span className="text-gray-700">{subcategoryTitle}</span>
          </>
        )}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[13px] sm:text-lg font-medium">
          {categoryTitle}
          {subcategoryTitle && ` - ${subcategoryTitle}`}
          <span className="text-gray-500"> ({resultsCount} results found)</span>
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              className={`p-1 rounded ${viewMode === "grid" ? "bg-gray-100" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={18} />
            </button>
            <button
              className={`p-1 rounded ${viewMode === "list" ? "bg-gray-100" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
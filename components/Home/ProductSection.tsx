"use client"

import { useState } from "react"
import ProductCard from "./Product-card"
import SectionHeader from "./Section-header"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface Product {
  id: string | number
  image: string
  title: string
  price: string
  description: string
  location?: string
  time?: string
  distance?: string
  condition: string
  isSponsored?: boolean
  labels?: string[]
  breadcrumbCat?: string
  breadcrumbSub?: string
  breadcrumbLabel?: string
}

interface ProductSectionProps {
  title: string
  products: Product[]
  showViewToggle?: boolean
  initialView?: "grid" | "list"
  showSeeMore?: boolean
  onSeeMoreClick?: () => void
  useBreadcrumbRouting?: boolean
}

export default function ProductSection({
  title,
  products,
  showViewToggle = true,
  initialView = "grid",
  showSeeMore = false,
  onSeeMoreClick,
  useBreadcrumbRouting = false,
}: ProductSectionProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">(initialView)

  return (
    <div className="mb-8">
      <SectionHeader title={title} showViewToggle={showViewToggle} onViewChange={setViewMode} currentView={viewMode} />
  <div className="mx-auto ">
      <div className={cn(
        // viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-4 gap-4" : "flex flex-col space-y-4"
        viewMode === "grid"
      ? "grid grid-cols-2  sm:grid-cols-2 lg:grid-cols-4 gap-0.5 md:gap-4" // Grid mode: Two per row
      : "flex flex-col space-y-4" // List mode remains unchanged'
      
        )}>
        {products.map((product, index) => (
          <ProductCard
           key={index}
           id={product.id}
            image={product.image}
            title={product.title}
            price={product.price}
            description={product.description}
            location={product.location}
            time={product.time}
            distance={product.distance}
            isSponsored={product.isSponsored}
            condition={product.condition}
            viewMode={viewMode}
            labels={product.labels}
            breadcrumbCat={product.breadcrumbCat}
            breadcrumbSub={product.breadcrumbSub}
            breadcrumbLabel={product.breadcrumbLabel}
            useBreadcrumbRouting={useBreadcrumbRouting}
          />
        ))}
      </div>

      {showSeeMore && (
        <div className="flex justify-center mt-6">
          <button
            className="text-xs font-medium text-gray-600 border border-gray-300 rounded-full px-6 py-1.5 hover:bg-gray-50 transition-colors flex flex-row  items-center gap-2 align-middle"
            onClick={onSeeMoreClick}
          >
            <div className="flex items-center">
            See more
            </div> 
            <div className="flex items-center">
              <Image
                src={'/seemore.svg'}
                height={15}
                width={15}
                alt="arrow"
              />
            </div>
          </button>
        </div>
      )}
    </div>
    </div>
  )
}

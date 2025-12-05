/* eslint-disable */
"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { ProductRequest } from "@/types/product/request"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { Phone } from "lucide-react"

dayjs.extend(relativeTime)

interface ProductRequestCardProps {
  request: ProductRequest
  viewMode?: "grid" | "list"
  onClick?: (request: ProductRequest) => void
  onContact?: (request: ProductRequest) => void
}

export default function ProductRequestCard({
  request,
  viewMode = "grid",
  onClick,
  onContact,
}: ProductRequestCardProps) {
  console.log("req", request)
  console.log("onContact function present:", typeof onContact)
  const primaryImage = request.images.find(img => img.isPrimary) || request.images[0]
  console.log("primaryImage", primaryImage)
  const handleClick = () => {
    onClick?.(request)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group relative rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer bg-white",
        viewMode === "list" && "flex",
      )}
    >
      <div
        className={cn(
          "relative",
          viewMode === "grid" ? "aspect-square w-full" :
          "aspect-4/3 w-[140px] sm:w-[200px]",
        )}
      >
        <Image
          src={primaryImage?.url || "/placeholder.svg"}
          alt={primaryImage?.altText || request.name}
          fill
          className="object-cover"
        />

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span className={cn(
            "text-xs px-2 py-1 rounded-full font-medium",
            getStatusColor(request.status)
          )}>
            {request.status}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {request.category.name}
        </div>
      </div>

      <div className={cn("p-3", viewMode === "list" && "flex-1 flex flex-col justify-between")}>
        <div>
          <h3 className="font-medium text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
            {request.name}
          </h3>

          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {request.description}
          </p>
        </div>

        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            {/* <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>📞 {request.phone}</span>
            </div> */}
            <button
              onClick={(e) => {
                console.log('Contact button clicked for:', request.name)
                e.stopPropagation()
                onContact?.(request)
              }}
              className="text-[#1F058F] hover:text-blue-600  text-sm rounded  transition-colors flex items-center gap-1"
            >
              📞 Contact Buyer
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Category: {request.subCategory.name}</span>
            <span>{dayjs(request.createdAt).fromNow()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

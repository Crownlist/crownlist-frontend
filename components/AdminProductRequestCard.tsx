/* eslint-disable */
"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { ProductRequest } from "@/types/product/request"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { CheckCircle, Eye } from "lucide-react"

dayjs.extend(relativeTime)

interface AdminProductRequestCardProps {
  request: ProductRequest
  viewMode?: "grid" | "list"
  onApprove: (request: ProductRequest) => void
  onViewDetails: (request: ProductRequest) => void
  isLoading?: boolean
}

export default function AdminProductRequestCard({
  request,
  viewMode = "grid",
  onApprove,
  onViewDetails,
  isLoading = false,
}: AdminProductRequestCardProps) {
  console.log("admin request", request)

  const primaryImage = request.images.find(img => img.isPrimary) || request.images[0]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800'
      case 'live':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const canApprove = request.status.toLowerCase() === 'reviewing'
  const canReject = request.status.toLowerCase() === 'reviewing'

  const getActionButtonClass = (isDisabled: boolean) =>
    isDisabled || isLoading
      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"

  return (
    <div
      className={cn(
        "group relative rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow bg-white",
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
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span>By: {request?.user?.fullName}</span>
            <span>📞 {request?.phone}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>Subcategory: {request?.subCategory?.name}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onApprove(request)}
              disabled={!canApprove || isLoading}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors",
                getActionButtonClass(!canApprove)
              )}
              title={canApprove ? "Approve request" : "Cannot approve this status"}
            >
              <CheckCircle size={12} />
              Approve
            </button>

            {/* <button
              onClick={() => onReject(request)}
              disabled={!canReject || isLoading}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors",
                getActionButtonClass(!canReject)
              )}
              title={canReject ? "Reject request" : "Cannot reject this status"}
            >
              <XCircle size={12} />
              Reject
            </button> */}

            <button
              onClick={() => onViewDetails(request)}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              title="View details"
            >
              <Eye size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

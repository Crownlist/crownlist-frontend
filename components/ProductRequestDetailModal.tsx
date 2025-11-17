/* eslint-disable */
"use client"
import { X, User, Phone, Tag, Clock, Wrench } from "lucide-react"
import Image from "next/image"
import { ProductRequest } from "@/types/product/request"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

interface ProductRequestDetailModalProps {
  request: ProductRequest
  onClose: () => void
}

export default function ProductRequestDetailModal({
  request,
  onClose,
}: ProductRequestDetailModalProps) {
  const primaryImage = request.images.find(img => img.isPrimary) || request.images[0]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-500000 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Request Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images and Basic Info */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={primaryImage?.url || "/placeholder.svg"}
                  alt={primaryImage?.altText || request.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Additional Images */}
              {request.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {request.images.slice(1, 4).map((image) => (
                    <div key={image._id} className="relative w-24 h-24 shrink-0 rounded-md overflow-hidden border border-gray-200">
                      <Image
                        src={image.url}
                        alt={image.altText}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {request.images.length > 4 && (
                    <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-md text-gray-500 text-sm font-medium">
                      +{request.images.length - 4}
                    </div>
                  )}
                </div>
              )}

              {/* Status */}
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-700">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-xl font-semibold mb-2">{request.name}</h3>
                <p className="text-gray-600">{request.description}</p>
              </div>

              {/* User Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User size={16} />
                  Requester Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{request.user.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{request.user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Type:</span>
                    <span className="font-medium">{request.user.accountType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium flex items-center gap-1">
                      <Phone size={14} />
                      {request.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag size={16} />
                  Categories
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {request.category.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subcategory:</span>
                    <span className="font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded">
                      {request.subCategory.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock size={16} />
                  Timeline
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{dayjs(request.createdAt).format('MMM D, YYYY HH:mm')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">{dayjs(request.updatedAt).format('MMM D, YYYY HH:mm')}</span>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                <p className="flex items-center gap-2 mb-1">
                  <Wrench size={14} />
                  ID: <span className="font-mono">{request._id}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={14} />
                  Created {dayjs(request.createdAt).fromNow()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

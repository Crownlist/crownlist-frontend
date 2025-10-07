"use client"

import { useState, useEffect } from "react"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { apiClientAdmin } from "@/lib/interceptor"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Types
type Product = {
  _id: string
  name: string
  slug: string
  description: string
  images: Array<{
    url: string
    altText?: string
    isPrimary: boolean
    _id: string
  }>
  price: {
    currentPrice: number
    discountedPrice?: number
  }
  seller: string
  category: string
  subCategory: string
  features: string[]
  isFeatured: boolean
  status: string
  listingLocation: {
    country: string
    city: string
  }
  likes: {
    totalLikes: number
    likedBy: string[]
  }
  ratings: {
    averageRating: number
    totalRatings: number
  }
  facility: string
  createdAt: string
  updatedAt: string
}

type ListingsData = {
  products: Product[]
  totalProducts: number
  totalPages: number
  currentPage: number
  limit: number
}

interface StatusModalState {
  isOpen: boolean
  listingId: string | null
  status: 'live' | 'declined' | ''
  reasonForDecline: string
}

export default function AdminListings() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [listingsData, setListingsData] = useState<ListingsData | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const router = useRouter()

  const [statusModal, setStatusModal] = useState<StatusModalState>({
    isOpen: false,
    listingId: null,
    status: '',
    reasonForDecline: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<'live' | 'declined' | null>(null)

  const handleStatusUpdate = async () => {
    if (!statusModal.listingId || !pendingStatus) return

    setIsSubmitting(true)

    const payload = pendingStatus === 'declined' ? {
      status: pendingStatus,
      reasonForDecline: statusModal.reasonForDecline
    } : {
      status: pendingStatus
    }

    try {
      await apiClientAdmin.patch(`/products/status/${statusModal.listingId}`, payload)

      // Close the modal and reset states
      setStatusModal({
        isOpen: false,
        listingId: null,
        status: '',
        reasonForDecline: ''
      })
      setShowConfirmation(false)
      setPendingStatus(null)

      // Refresh the listings data
      fetchListings()

      toast.success('Status updated successfully')
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openStatusModal = (listingId: string, currentStatus: string) => {
    setStatusModal({
      isOpen: true,
      listingId,
      status: currentStatus as 'live' | 'declined',
      reasonForDecline: ''
    })
  }

  // Status Update Modal Component
  const StatusUpdateModal = () => (
    <div className={`fixed inset-0 bg-black/85 bg-opacity-50 flex items-center justify-center z-50 ${!statusModal.isOpen ? 'hidden' : ''}`}>
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl min-h-[100px] relative">
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a0066]"></div>
          </div>
        )}
        <h3 className="text-lg font-semibold mb-4">Update Listing Status</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              value={statusModal.status}
              onValueChange={(value) => setStatusModal(prev => ({ ...prev, status: value as 'live' | 'declined' }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {statusModal.status === 'declined' && (
            <div>
              <label className="block text-sm font-medium mb-1">Reason for Decline</label>
              <textarea
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Please provide a reason for declining this listing"
                value={statusModal.reasonForDecline}
                onChange={(e) => setStatusModal(prev => ({ ...prev, reasonForDecline: e.target.value }))}
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setPendingStatus(statusModal.status as 'live' | 'declined')
                setShowConfirmation(true)
              }}
              disabled={!statusModal.status || (statusModal.status === 'declined' && !statusModal.reasonForDecline.trim()) || isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${!statusModal.status || (statusModal.status === 'declined' && !statusModal.reasonForDecline.trim()) || isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#1a0066] hover:bg-[#160052]'
                }`}
            >
              Update Status
            </button>
          </div>

          {/* Confirmation Dialog */}
          {showConfirmation && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h3 className="text-lg font-semibold mb-4">Confirm Status Update</h3>
                <p className="mb-6">Are you sure you want to update this listing&apos;s status to <span className="font-medium">{pendingStatus}</span>?</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md ${isSubmitting ? 'bg-gray-400' : 'bg-[#1a0066] hover:bg-[#160052]'
                      }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Updating...' : 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // Fetch listings data
  const fetchListings = async () => {
    try {
      setIsLoading(true)
      const response = await apiClientAdmin.get(`/products/all?page=${currentPage}&limit=${limit}`)
      setListingsData(response.data.data)
    } catch (error) {
      console.error('Error fetching listings:', error)
      toast.error('Failed to load listings')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [currentPage, limit])

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  const getPrimaryImage = (images: Product['images']) => {
    const primary = images.find(img => img.isPrimary)
    return primary?.url || images[0]?.url || '/placeholder.svg'
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'live':
        return 'default'
      case 'reviewing':
        return 'secondary'
      case 'declined':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">All Listings</h1>
        <div className="flex justify-center items-center h-64">
          <p>Loading listings...</p>
        </div>
        <StatusUpdateModal />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Listings</h1>
        <div className="text-sm text-gray-600">
          Total: {listingsData?.totalProducts || 0} listings
        </div>
      </div>

      {!listingsData?.products?.length ? (
        <div className="bg-white p-12 rounded-lg text-center border">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4">
              <Image
                src={'/box.png'}
                width={80}
                height={80}
                alt="No listings"
              />
            </div>
            <h3 className="text-xl font-medium mb-2">No listings found</h3>
            <p className="text-gray-500">There are currently no product listings to display</p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium bg-gray-50 border-b">
                  <div className="col-span-4">Product Details</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">Location</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1">Featured</div>
                  <div className="col-span-1">Actions</div>
                </div>

                <div className="divide-y">
                  {listingsData.products.map((product) => {
                    return (
                      <div key={product._id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                        <div className="col-span-4 flex items-center space-x-3">
                          <Link href={`/admin/dashboard/${product._id}`}>
                            <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={getPrimaryImage(product.images)}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </Link>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{product.name}</p>
                            <p className="text-xs text-gray-500 truncate">{product.slug}</p>
                          </div>
                        </div>

                        <div className="col-span-2">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">
                              ₦{product.price.currentPrice.toLocaleString()}
                            </span>
                            {product.price.discountedPrice && (
                              <span className="text-xs text-gray-500 line-through">
                                ₦{product.price.discountedPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="col-span-2">
                          <div className="text-sm">
                            <p className="truncate">{product.listingLocation.city}</p>
                            <p className="text-xs text-gray-500 truncate">{product.listingLocation.country}</p>
                          </div>
                        </div>

                        <div className="col-span-2">
                          <Badge
                            variant={getStatusBadgeVariant(product.status)}
                            className="text-xs"
                          >
                            {getStatusLabel(product.status)}
                          </Badge>
                        </div>

                        <div className="col-span-1">
                          <Badge
                            variant={product.isFeatured ? 'default' : 'outline'}
                            className="text-xs"
                          >
                            {product.isFeatured ? 'Yes' : 'No'}
                          </Badge>
                        </div>

                        <div className="col-span-1 flex justify-end">
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => toggleDropdown(product._id)}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            {activeDropdown === product._id && (
                              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border">
                                <div className="py-1">
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => {
                                      router.push(`/admin/dashboard/${product._id}`)
                                      setActiveDropdown(null)
                                    }}
                                  >
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => {
                                      openStatusModal(product._id, product.status.toLowerCase())
                                      setActiveDropdown(null)
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Update Status
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          {listingsData && listingsData.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Items per page:</span>
                <Select
                  value={limit.toString()}
                  onValueChange={(value) => {
                    setLimit(Number(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {listingsData.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(listingsData.totalPages, prev + 1))}
                  disabled={currentPage === listingsData.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Status Update Modal */}
      <StatusUpdateModal />
    </div>
  )
}

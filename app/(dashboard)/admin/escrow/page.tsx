"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { apiClientAdmin, apiClientUser } from "@/lib/interceptor"
import { ConfirmationModal } from "@/components/ConfirmationModal"

interface EscrowItem {
    _id: string
    detailsType: string
    details: {
        price: {
            currentPrice: number
            discountedPrice: number
        }
        name: string
        slug: string
        description: string
        images: Array<{
            url: string
            altText: string
            isPrimary: boolean
            _id: string
        }>
    }
    seller: {
        _id: string
        fullName: string
        email: string
        accountType: string
        profilePicture: string
    }
    buyer: {
        _id: string
        fullName: string
        email: string
        accountType: string
        profilePicture: string
    }
    amount: number
    status: string
    createdAt: string
    updatedAt: string
}

interface Pagination {
    total: number
    page: number
    limit: number
    pages: number
}

export default function AdminEscrowPage() {
    const [escrows, setEscrows] = useState<EscrowItem[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        page: 1,
        limit: 10,
        pages: 1
    })
    const [escrowDetails, setEscrowDetails] = useState<EscrowItem | null>(null)
    const [showEscrowDetails, setShowEscrowDetails] = useState(false)
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState("")
    const [selectedEscrow, setSelectedEscrow] = useState<EscrowItem | null>(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [statusFilter, setStatusFilter] = useState("")
    const [reasonForDecline, setReasonForDecline] = useState("")

    // const router = useRouter() // Not needed for admin escrow

    const getStatusColor = (status: string) => {
        const statusMap = {
            waiting: "bg-[#FEF3C7] text-[#D97706]", // yellow - waiting
            reviewing: "bg-[#FED7AA] text-[#EA580C]", // orange - reviewing
            awaiting_payment: "bg-[#FED7AA] text-[#EA580C]", // orange - awaiting payment
            paid: "bg-[#D1FAE5] text-[#059669]", // green - paid
            in_progress: "bg-[#DBEAFE] text-[#2563EB]", // blue - in progress
            delivered: "bg-[#DBEAFE] text-[#2563EB]", // blue - delivered
            released: "bg-[#D1FAE5] text-[#059669]", // green - released
            declined: "bg-[#FEE2E2] text-[#DC2626]", // red - declined
            refunded: "bg-[#E0E7FF] text-[#1E40AF]" // indigo - refunded
        }
        return statusMap[status.toLowerCase() as keyof typeof statusMap] || "bg-gray-200 text-gray-700"
    }

    const fetchEscrowDetails = async (escrowId: string) => {
        try {
            const response = await apiClientUser.get(`/escrows/${escrowId}`)
            setEscrowDetails(response.data.escrow)
            setShowEscrowDetails(true)
        } catch {
            toast.error("Failed to fetch escrow details")
        }
    }

    const confirmUpdateStatus = () => {
        setShowStatusModal(false)
        setShowConfirmModal(true)
    }

    const handleUpdateStatus = async () => {
        if (!selectedEscrow || !selectedStatus) return

        // Validate reason for decline
        if (selectedStatus === "declined" && !reasonForDecline.trim()) {
            toast.error("Please provide a reason for declining this escrow")
            return
        }

        setActionLoading(true)
        try {
            const payload: any = {
                status: selectedStatus
            }

            // Include reason for decline if status is declined
            if (selectedStatus === "declined") {
                payload.reasonForDecline = reasonForDecline.trim()
            }

            await apiClientAdmin.patch(`/escrows/status/${selectedEscrow._id}`, payload)
            // toast("Loading...")
            toast.success(`Escrow status updated to ${selectedStatus} successfully!`)
            setShowConfirmModal(false)
            setSelectedEscrow(null)
            setSelectedStatus("")
            setReasonForDecline("") // Reset reason
            fetchEscrows(currentPage) // Refresh the list
        } catch (error) {
            toast.error("Failed to update escrow status")
            console.error("Update status error:", error)
        } finally {
            setActionLoading(false)
        }
    }

    const fetchEscrows = async (page: number = 1, status: string = "") => {
        setLoading(true)
        setError(null)
        try {
            let url = `/escrows?limit=10&page=${page}`
            if (status) {
                url += `&status=${status}`
            }
            const response = await apiClientUser.get(url)
            setEscrows(response.data.escrows)
            setPagination(response.data.pagination)
        } catch {
            setError("Failed to load escrow data")
        } finally {
            setLoading(false)
        }
    }

    const handleStatusFilterChange = (status: string) => {
        setStatusFilter(status)
        setCurrentPage(1) // Reset to first page when filtering
        fetchEscrows(1, status)
    }

    const clearStatusFilter = () => {
        setStatusFilter("")
        setCurrentPage(1)
        fetchEscrows(1)
    }

    useEffect(() => {
        fetchEscrows(currentPage, statusFilter)
    }, [currentPage, statusFilter])

    // Always show header and filter
    const renderHeaderAndFilter = () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col mb-1">
                <h1 className="text-2xl font-bold mb-1 justify-start flex">Escrow Management</h1>
                <p className="text-gray-600">Manage all escrow transactions across the platform</p>
            </div>

            {/* Status Filter - Always visible */}
            <div className="bg-white rounded-lg p-4 mt-4 sm:mt-8 shadow-sm border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h3 className="text-lg font-medium text-gray-900">Filter by Status</h3>
                        {statusFilter && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Current filter:</span>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(statusFilter)}`}>
                                    {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusFilterChange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F058F] focus:border-transparent text-sm"
                        >
                            <option value="">All Statuses</option>
                            <option value="waiting">Waiting</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="awaiting_payment">Awaiting Payment</option>
                            <option value="paid">Paid</option>
                            <option value="in_progress">In Progress</option>
                            <option value="delivered">Delivered</option>
                            <option value="released">Released</option>
                            <option value="declined">Declined</option>
                            <option value="refunded">Refunded</option>
                        </select>
                        {statusFilter && (
                            <button
                                onClick={clearStatusFilter}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Clear Filter
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

    // Loading state
    if (loading) {
        return (
            <div className="p-4 md:p-6 h-full flex flex-col gap-3">
                {renderHeaderAndFilter()}
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F058F]"></div>
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="p-4 md:p-6 h-full flex flex-col gap-3">
                {renderHeaderAndFilter()}
                <div className="flex items-center justify-center h-64">
                    <p className="text-red-500">Error: {error}</p>
                </div>
            </div>
        )
    }

    // Empty state
    if (!escrows || escrows.length === 0) {
        return (
            <div className="p-4 md:p-6 h-full flex flex-col gap-3">
                {renderHeaderAndFilter()}
                <div className="flex flex-col items-center justify-center w-full flex-1 mt-8">
                    <div className="p-8 flex flex-col w-full items-center justify-center text-center max-w-3xl">
                        <div className="mb-4">
                            <Image
                                src={'/box.png'}
                                width={80}
                                height={80}
                                alt="box"
                            />
                        </div>
                        <h3 className="text-xl font-medium mb-2">No escrow transactions</h3>
                        <p className="text-gray-500 mb-6">
                            {statusFilter
                                ? `No escrow transactions found for status "${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}"`
                                : "There are currently no escrow transactions to display"
                            }
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // Table view with data
    return (
        <div className="p-4 md:p-6 h-full flex flex-col gap-3">
            <div className="flex flex-col mb-1">
                <h1 className="text-2xl font-bold mb-1">Escrow Management</h1>
                <p className="text-gray-600">Manage all escrow transactions across the platform</p>
            </div>

            {/* Status Filter - Always visible */}
            <div className="bg-white rounded-lg p-4 mt-4 sm:mt-8 shadow-sm border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h3 className="text-lg font-medium text-gray-900">Filter by Status</h3>
                        {statusFilter && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Current filter:</span>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(statusFilter)}`}>
                                    {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusFilterChange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F058F] focus:border-transparent text-sm"
                        >
                            <option value="">All Statuses</option>
                            <option value="waiting">Waiting</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="awaiting_payment">Awaiting Payment</option>
                            <option value="paid">Paid</option>
                            <option value="in_progress">In Progress</option>
                            <option value="delivered">Delivered</option>
                            <option value="released">Released</option>
                            <option value="declined">Declined</option>
                            <option value="refunded">Refunded</option>
                        </select>
                        {statusFilter && (
                            <button
                                onClick={clearStatusFilter}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Clear Filter
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Table or Empty State */}
            <div className="bg-white rounded-lg mt-6 sm:mt-8">
                {/* Table Header - Desktop */}
                <div className="hidden md:grid grid-cols-14 gap-3 px-6 py-3 bg-[#EDE9FF] rounded-full text-sm font-medium text-gray-700">
                    <div className="col-span-3">Details</div>
                    <div className="col-span-2">Seller</div>
                    <div className="col-span-2">Buyer</div>
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Timestamp</div>
                    <div className="col-span-1">Action</div>
                </div>

                {/* Mobile Card Layout */}
                <div className="md:hidden px-4 pb-4">
                    {escrows.map((item: EscrowItem) => (
                        <div key={item._id} className="bg-white border rounded-lg mb-4 p-4 space-y-3">
                            {/* Product Details */}
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                                    <Image
                                        src={item.details.images?.find(img => img.isPrimary)?.url || item.details.images?.[0]?.url || "/box.png"}
                                        width={48}
                                        height={48}
                                        alt={item.details.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm text-gray-900">{item.details.name}</h4>
                                    <p className="text-lg font-semibold text-[#1F058F]">₦{item.amount.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Seller and Buyer */}
                            <div className="flex justify-between text-sm">
                                <div className="flex items-center gap-2 flex-1">
                                    <div className="w-6 h-6 bg-gray-300 rounded-full overflow-hidden">
                                        <Image
                                            src={item.seller.profilePicture || "/profile.png"}
                                            width={24}
                                            height={24}
                                            alt={item.seller.fullName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-600 text-xs">Seller</span>
                                        <span className="text-gray-900">{item.seller.fullName}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-1">
                                    <div className="w-6 h-6 bg-gray-300 rounded-full overflow-hidden">
                                        <Image
                                            src={item.buyer.profilePicture || "/profile.png"}
                                            width={24}
                                            height={24}
                                            alt={item.buyer.fullName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-600 text-xs">Buyer</span>
                                        <span className="text-gray-900">{item.buyer.fullName}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status and Timestamp */}
                            <div className="flex items-center justify-between text-sm">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </span>
                                <span className="text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2 border-t">
                                <button
                                    className="flex-1 px-1 py-2 text-xs font-medium rounded text-[#1F058F]"
                                    onClick={() => {
                                        setSelectedEscrow(item)
                                        setShowStatusModal(true)
                                    }}
                                    disabled={actionLoading}
                                >
                                    Update Status
                                </button>
                                <button
                                    className="flex-1 px-3 py-2 text-xs font-medium rounded text-[#1F058F] border border-[#1F058F]"
                                    onClick={() => fetchEscrowDetails(item._id)}
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table Body - Desktop */}
                <div className="hidden md:block divide-y divide-gray-200">
                    {escrows.map((item: EscrowItem) => (
                        <div key={item._id} className="grid grid-cols-14 gap-3 px-6 py-4 items-center hover:bg-gray-50 border-b border-gray-200">
                            {/* Details */}
                            <div className="col-span-3 flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                                    <Image
                                        src={item.details.images?.find(img => img.isPrimary)?.url || item.details.images?.[0]?.url || "/box.png"}
                                        width={48}
                                        height={48}
                                        alt={item.details.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-sm text-gray-900">{item.details.name}</span>
                            </div>

                            {/* Seller */}
                            <div className="col-span-2 flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
                                    <Image
                                        src={item.seller.profilePicture || "/profile.png"}
                                        width={32}
                                        height={32}
                                        alt={item.seller.fullName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-sm text-gray-900">{item.seller.fullName}</span>
                            </div>

                            {/* Buyer */}
                            <div className="col-span-2 flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
                                    <Image
                                        src={item.buyer.profilePicture || "/profile.png"}
                                        width={32}
                                        height={32}
                                        alt={item.buyer.fullName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-sm text-gray-900">{item.buyer.fullName}</span>
                            </div>

                            {/* Amount */}
                            <div className="col-span-2">
                                <span className="text-sm text-gray-900">₦{item.amount.toLocaleString()}</span>
                            </div>

                            {/* Status */}
                            <div className="col-span-2">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </span>
                            </div>

                            {/* Timestamp */}
                            <div className="col-span-2">
                                <span className="text-sm text-gray-600">{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>

                            {/* Actions */}
                            <div className="col-span-1 flex gap-2">
                                <button
                                    className="px-1 py-1 text-xs font-medium rounded text-[#1F058F]"
                                    onClick={() => {
                                        setSelectedEscrow(item)
                                        setShowStatusModal(true)
                                    }}
                                    disabled={actionLoading}
                                >
                                    Update Status
                                </button>
                                <button
                                    className="px-3 py-1 text-xs font-medium rounded text-[#1F058F]"
                                    onClick={() => fetchEscrowDetails(item._id)}
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button
                                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                ← Previous
                            </button>
                            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    className={`px-3 py-1 text-sm rounded ${page === currentPage
                                            ? "bg-[#1F058F] text-white"
                                            : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === pagination.pages}
                            >
                                Next →
                            </button>
                        </div>
                        <div className="text-sm text-gray-600">
                            Showing <span className="font-medium">{(currentPage - 1) * pagination.limit + 1}-{Math.min(currentPage * pagination.limit, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Escrow Details Modal */}
            {showEscrowDetails && escrowDetails && (
                <div className="fixed inset-0 bg-black/55 bg-opacity-90 flex items-center justify-center z-50000 p-4"
                     onClick={() => {
                         setShowEscrowDetails(false)
                         setEscrowDetails(null)
                     }}>
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-full overflow-y-auto"
                         onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Escrow Details</h2>
                                <button
                                    onClick={() => {
                                        setShowEscrowDetails(false)
                                        setEscrowDetails(null)
                                    }}
                                    className="text-gray-500 hover:text-gray-700 text-xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold text-sm text-gray-700">Product</h3>
                                        <p className="text-sm">{escrowDetails.details.name}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm text-gray-700">Amount</h3>
                                        <p className="text-sm">₦{escrowDetails.amount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm text-gray-700">Seller</h3>
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src={escrowDetails.seller.profilePicture || "/profile.png"}
                                                width={24}
                                                height={24}
                                                alt={escrowDetails.seller.fullName}
                                                className="rounded-full"
                                            />
                                            <span className="text-sm">{escrowDetails.seller.fullName}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm text-gray-700">Buyer</h3>
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src={escrowDetails.buyer.profilePicture || "/profile.png"}
                                                width={24}
                                                height={24}
                                                alt={escrowDetails.buyer.fullName}
                                                className="rounded-full"
                                            />
                                            <span className="text-sm">{escrowDetails.buyer.fullName}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm text-gray-700">Status</h3>
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(escrowDetails.status)}`}>
                                                {escrowDetails.status.charAt(0).toUpperCase() + escrowDetails.status.slice(1)}
                                            </span>
                                            <button
                                                className="px-3 py-1 text-xs font-medium rounded bg-[#1F058F] text-white hover:bg-[#2a0d9c]"
                                                onClick={() => {
                                                    setSelectedEscrow(escrowDetails)
                                                    setShowEscrowDetails(false)
                                                    setShowStatusModal(true)
                                                }}
                                                disabled={actionLoading}
                                            >
                                                Update Status
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm text-gray-700">Created</h3>
                                        <p className="text-sm">{new Date(escrowDetails.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-sm text-gray-700 mb-2">Product Description</h3>
                                    <p className="text-sm text-gray-600">{escrowDetails.details.description || "No description available"}</p>
                                </div>

                                {escrowDetails.details.images && escrowDetails.details.images.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-sm text-gray-700 mb-2">Product Images</h3>
                                        <Carousel className="w-full max-w-xs mx-auto">
                                            <CarouselContent>
                                                {escrowDetails.details.images.map((image, index) => (
                                                    <CarouselItem key={image._id}>
                                                        <div className="p-1">
                                                            <div className="w-full aspect-square overflow-hidden rounded-lg">
                                                                <Image
                                                                    src={image.url}
                                                                    alt={image.altText || `${escrowDetails.details.name} - Image ${index + 1}`}
                                                                    width={300}
                                                                    height={300}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        </div>
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            {escrowDetails.details.images.length > 1 && (
                                                <>
                                                    <CarouselPrevious className="left-1" />
                                                    <CarouselNext className="right-1" />
                                                </>
                                            )}
                                        </Carousel>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Status Modal */}
            {showStatusModal && selectedEscrow && (
                <div className="fixed inset-0 bg-black/55 bg-opacity-90 flex items-center justify-center z-50000 p-4"
                     onClick={() => {
                         setShowStatusModal(false)
                         setSelectedEscrow(null)
                         setSelectedStatus("")
                         setReasonForDecline("")
                     }}>
                    <div className="bg-white rounded-lg max-w-md w-full"
                         onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Update Escrow Status</h2>
                                <button
                                    onClick={() => {
                                        setShowStatusModal(false)
                                        setSelectedEscrow(null)
                                        setSelectedStatus("")
                                        setReasonForDecline("")
                                    }}
                                    className="text-gray-500 hover:text-gray-700 text-xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-700 mb-2">Current Status</h3>
                                    <p className="text-sm text-gray-600">
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedEscrow.status)}`}>
                                            {selectedEscrow.status.charAt(0).toUpperCase() + selectedEscrow.status.slice(1)}
                                        </span>
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-sm text-gray-700 mb-2">New Status</h3>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F058F] focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select new status...</option>
                                        <option value="reviewing">Reviewing</option>
                                        <option value="awaiting_payment">Awaiting Payment</option>
                                        <option value="paid">Paid</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="released">Released</option>
                                        <option value="declined">Declined</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                </div>

                                {selectedStatus === "declined" && (
                                    <div>
                                        <h3 className="font-semibold text-sm text-gray-700 mb-2">Reason for Decline <span className="text-red-500">*</span></h3>
                                        <textarea
                                            value={reasonForDecline}
                                            onChange={(e) => setReasonForDecline(e.target.value)}
                                            placeholder="Please provide a detailed reason for declining this escrow..."
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F058F] focus:border-transparent resize-none"
                                            rows={3}
                                            required
                                        />
                                    </div>
                                )}

                                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                    <p><strong>Product:</strong> {selectedEscrow.details.name}</p>
                                    <p><strong>Seller:</strong> {selectedEscrow.seller.fullName}</p>
                                    <p><strong>Buyer:</strong> {selectedEscrow.buyer.fullName}</p>
                                    <p><strong>Amount:</strong> ₦{selectedEscrow.amount.toLocaleString()}</p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowStatusModal(false)
                                            setSelectedEscrow(null)
                                            setSelectedStatus("")
                                            setReasonForDecline("")
                                        }}
                                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                                        disabled={actionLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmUpdateStatus}
                                        disabled={actionLoading || !selectedStatus}
                                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#1F058F] rounded-lg hover:bg-[#2a0d9c] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {actionLoading ? "Updating..." : "Update Status"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && selectedEscrow && selectedStatus && (
                <ConfirmationModal
                    open={showConfirmModal}
                    onOpenChange={(open) => {
                        setShowConfirmModal(open)
                        if (!open) {
                            setSelectedEscrow(null)
                            setSelectedStatus("")
                        }
                    }}
                    onConfirm={handleUpdateStatus}
                    title="Confirm Status Update"
                    description={`Are you sure you want to change the escrow status from "${selectedEscrow.status.charAt(0).toUpperCase() + selectedEscrow.status.slice(1)}" to "${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}"?`}
                    confirmText={actionLoading ? "Updating..." : "Confirm Update"}
                    cancelText="Cancel"
                />
            )}
        </div>
    )
}

"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { apiClientAdmin } from "@/lib/interceptor";
import { toast } from "sonner";
import StatusUpdateModal, {
  StatusModalState,
} from "@/components/admin/StatusUpdateModal";
import ListingsTable from "@/components/admin/ListingsTable";
import ListingsCards from "@/components/admin/ListingsCards";
import Pagination from "@/components/admin/Pagination";
import { Product, ListingsData } from "@/types/listings";

export default function AdminListings() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listingsData, setListingsData] = useState<ListingsData | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const [statusModal, setStatusModal] = useState<StatusModalState>({
    isOpen: false,
    listingId: null,
    status: "",
    reasonForDecline: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<
    "live" | "declined" | null
  >(null);

  const handleStatusUpdate = async () => {
    if (!statusModal.listingId || !pendingStatus) return;

    setIsSubmitting(true);

    const payload =
      pendingStatus === "declined"
        ? {
            status: pendingStatus,
            reasonForDecline: statusModal.reasonForDecline,
          }
        : {
            status: pendingStatus,
          };

    try {
      await apiClientAdmin.patch(
        `/products/status/${statusModal.listingId}`,
        payload
      );

      // Close the modal and reset states
      setStatusModal({
        isOpen: false,
        listingId: null,
        status: "",
        reasonForDecline: "",
      });
      setShowConfirmation(false);
      setPendingStatus(null);

      // Refresh the listings data
      fetchListings();

      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openStatusModal = (listingId: string, currentStatus: string) => {
    setStatusModal({
      isOpen: true,
      listingId,
      status: currentStatus as "live" | "declined",
      reasonForDecline: "",
    });
  };

  // Fetch listings data
  const fetchListings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClientAdmin.get(
        `/products/all?page=${currentPage}&limit=${limit}`
      );
      setListingsData(response.data.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to load listings");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const toggleCardExpansion = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const getPrimaryImage = (images: Product["images"]) => {
    const primary = images.find((img) => img.isPrimary);
    return primary?.url || images[0]?.url || "/placeholder.svg";
  };

  const getStatusBadgeVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case "live":
        return "default";
      case "reviewing":
        return "secondary";
      case "declined":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">All Listings</h1>
        <div className="flex justify-center items-center h-64">
          <p>Loading listings...</p>
        </div>
      </div>
    );
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
                src={"/box.png"}
                width={80}
                height={80}
                alt="No listings"
              />
            </div>
            <h3 className="text-xl font-medium mb-2">No listings found</h3>
            <p className="text-gray-500">
              There are currently no product listings to display
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <ListingsTable
            products={listingsData.products}
            activeDropdown={activeDropdown}
            toggleDropdown={toggleDropdown}
            openStatusModal={openStatusModal}
            getPrimaryImage={getPrimaryImage}
            getStatusBadgeVariant={getStatusBadgeVariant}
            getStatusLabel={getStatusLabel}
          />

          {/* Mobile Card View */}
          <ListingsCards
            products={listingsData.products}
            expandedCards={expandedCards}
            toggleCardExpansion={toggleCardExpansion}
            activeDropdown={activeDropdown}
            toggleDropdown={toggleDropdown}
            openStatusModal={openStatusModal}
            getPrimaryImage={getPrimaryImage}
            getStatusBadgeVariant={getStatusBadgeVariant}
            getStatusLabel={getStatusLabel}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={listingsData.totalPages}
            limit={limit}
            setLimit={setLimit}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}

      {/* Status Update Modal */}
      <StatusUpdateModal
        statusModal={statusModal}
        setStatusModal={setStatusModal}
        isSubmitting={isSubmitting}
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        pendingStatus={pendingStatus}
        setPendingStatus={setPendingStatus}
        handleStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}

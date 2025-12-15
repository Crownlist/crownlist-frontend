"use client";

import Image from "next/image";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { EscrowItem } from "@/types/escrow";

interface Props {
  open: boolean;
  escrow?: EscrowItem | null;
  onClose: () => void;
  onOpenStatus: (escrow: EscrowItem) => void;
}

const getStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    waiting: "bg-[#FEF3C7] text-[#D97706]",
    reviewing: "bg-[#FED7AA] text-[#EA580C]",
    awaiting_payment: "bg-[#FED7AA] text-[#EA580C]",
    paid: "bg-[#D1FAE5] text-[#059669]",
    in_progress: "bg-[#DBEAFE] text-[#2563EB]",
    delivered: "bg-[#DBEAFE] text-[#2563EB]",
    released: "bg-[#D1FAE5] text-[#059669]",
    declined: "bg-[#FEE2E2] text-[#DC2626]",
    refunded: "bg-[#E0E7FF] text-[#1E40AF]",
  };
  return statusMap[status.toLowerCase()] || "bg-gray-200 text-gray-700";
};

export default function EscrowDetailsModal({
  open,
  escrow,
  onClose,
  onOpenStatus,
}: Props) {
  if (!open || !escrow) return null;

  return (
    <div
      className="fixed inset-0 bg-black/55 bg-opacity-90 flex items-center justify-center z-50000 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Escrow Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm text-gray-700">Product</h3>
                <p className="text-sm">{escrow.details.name}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-700">Amount</h3>
                <p className="text-sm">₦{escrow.amount.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-700">Seller</h3>
                <div className="flex items-center gap-2">
                  <Image
                    src={escrow.seller.profilePicture || "/profile.png"}
                    width={24}
                    height={24}
                    alt={escrow.seller.fullName}
                    className="rounded-full"
                  />
                  <span className="text-sm">{escrow.seller.fullName}</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-700">Buyer</h3>
                <div className="flex items-center gap-2">
                  <Image
                    src={escrow.buyer.profilePicture || "/profile.png"}
                    width={24}
                    height={24}
                    alt={escrow.buyer.fullName}
                    className="rounded-full"
                  />
                  <span className="text-sm">{escrow.buyer.fullName}</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-700">Status</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                      escrow.status
                    )}`}
                  >
                    {escrow.status.charAt(0).toUpperCase() +
                      escrow.status.slice(1)}
                  </span>
                  <button
                    className="px-3 py-1 text-xs font-medium rounded bg-[#1F058F] text-white hover:bg-[#2a0d9c]"
                    onClick={() => {
                      onOpenStatus(escrow);
                      onClose();
                    }}
                  >
                    Update Status
                  </button>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-700">Created</h3>
                <p className="text-sm">
                  {new Date(escrow.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-2">
                Product Description
              </h3>
              <p className="text-sm text-gray-600">
                {escrow.details.description || "No description available"}
              </p>
            </div>

            {escrow.details.images && escrow.details.images.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-2">
                  Product Images
                </h3>
                <Carousel className="w-full max-w-xs mx-auto">
                  <CarouselContent>
                    {escrow.details.images.map((image, index) => (
                      <CarouselItem key={image._id}>
                        <div className="p-1">
                          <div className="w-full aspect-square overflow-hidden rounded-lg">
                            <Image
                              src={image.url}
                              alt={
                                image.altText ||
                                `${escrow.details.name} - Image ${index + 1}`
                              }
                              width={300}
                              height={300}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {escrow.details.images.length > 1 && (
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
  );
}

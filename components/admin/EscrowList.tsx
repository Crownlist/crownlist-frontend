"use client";

import Image from "next/image";
import React from "react";
import { EscrowItem, Pagination } from "@/types/escrow";

interface Props {
  escrows: EscrowItem[];
  pagination: Pagination;
  currentPage: number;
  onChangePage: (page: number) => void;
  onView: (id: string) => void;
  onUpdateStatus: (item: EscrowItem) => void;
  onContact?: (item: EscrowItem) => void;
  getStatusColor: (status?: string) => string;
}

export default function EscrowList({
  escrows,
  pagination,
  currentPage,
  onChangePage,
  onView,
  onUpdateStatus,
  onContact,
  getStatusColor,
}: Props) {
  return (
    <>
      <div className="md:hidden px-2 pb-4 space-y-3">
        {escrows.map((item) => (
          <div
            key={item._id}
            className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Product info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden ring-2 ring-gray-100">
                <Image
                  src={
                    item.details.images?.find((img) => img.isPrimary)?.url ||
                    item.details.images?.[0]?.url ||
                    "/box.png"
                  }
                  width={64}
                  height={64}
                  alt={item.details.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900 truncate">
                  {item.details.name}
                </h4>
                <p className="text-lg font-bold text-[#1F058F]">
                  ₦{item.amount.toLocaleString()}
                </p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Seller and Buyer */}
            <div className="space-y-3 mb-4 pb-4 border-b-2 border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={item.seller.profilePicture || "/profile.png"}
                    width={32}
                    height={32}
                    alt={item.seller.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 font-semibold">SELLER</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.seller.fullName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={item.buyer.profilePicture || "/profile.png"}
                    width={32}
                    height={32}
                    alt={item.buyer.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 font-semibold">BUYER</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.buyer.fullName}
                  </p>
                </div>
              </div>
            </div>

            {/* Date */}
            <p className="text-xs text-gray-500 mb-4 font-medium">
              {new Date(item.createdAt).toLocaleDateString()} at{" "}
              {new Date(item.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-2">
              <button
                className="px-2 py-2 text-xs font-semibold rounded-lg text-[#1F058F] border-2 border-[#1F058F] hover:bg-[#1F058F]/5 transition-colors"
                onClick={() => onUpdateStatus(item)}
              >
                Status
              </button>
              <button
                className="px-2 py-2 text-xs font-semibold rounded-lg text-gray-700 border-2 border-gray-300 hover:bg-gray-50 transition-colors"
                onClick={() => onView(item._id)}
              >
                View
              </button>
              {onContact && (
                <button
                  className="px-2 py-2 text-xs font-semibold rounded-lg text-white bg-[#1F058F] hover:bg-[#16044a] transition-colors"
                  onClick={() => onContact(item)}
                >
                  Contact
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block space-y-3">
        {escrows.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl border border-gray-200 hover:border-[#1F058F]/30 hover:shadow-lg transition-all duration-200 overflow-hidden"
          >
            <div className="px-6 py-5">
              <div className="flex items-center gap-6">
                {/* Product Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex-shrink-0 overflow-hidden shadow-sm">
                    <Image
                      src={
                        item.details.images?.find((img) => img.isPrimary)
                          ?.url ||
                        item.details.images?.[0]?.url ||
                        "/box.png"
                      }
                      width={56}
                      height={56}
                      alt={item.details.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base truncate mb-1">
                      {item.details.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        ₦{item.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Seller */}
                <div className="flex items-center gap-3 min-w-[140px]">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ring-2 ring-white shadow-sm">
                    <Image
                      src={item.seller.profilePicture || "/profile.png"}
                      width={40}
                      height={40}
                      alt={item.seller.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Seller
                    </p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.seller.fullName.split(" ")[0]}...
                    </p>
                  </div>
                </div>

                {/* Buyer */}
                <div className="flex items-center gap-3 min-w-[140px]">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ring-2 ring-white shadow-sm">
                    <Image
                      src={item.buyer.profilePicture || "/profile.png"}
                      width={40}
                      height={40}
                      alt={item.buyer.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Buyer
                    </p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.buyer.fullName.split(" ")[0]}...
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div className="min-w-[100px]">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                    Amount
                  </p>
                  <p className="text-base font-bold text-[#1F058F]">
                    ₦{item.amount.toLocaleString()}
                  </p>
                </div>

                {/* Status */}
                <div className="min-w-[130px]">
                  <span
                    className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status.charAt(0).toUpperCase() +
                      item.status.slice(1).replace(/_/g, " ")}
                  </span>
                </div>

                {/* Date */}
                <div className="min-w-[110px]">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                    Date
                  </p>
                  <p className="text-sm text-gray-700 font-medium">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "numeric",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-auto">
                  <button
                    className="px-4 py-2 text-xs font-semibold rounded-lg text-[#1F058F] bg-[#1F058F]/5 hover:bg-[#1F058F]/10 border border-[#1F058F]/20 hover:border-[#1F058F]/40 transition-all"
                    onClick={() => onUpdateStatus(item)}
                  >
                    Status
                  </button>
                  <button
                    className="px-4 py-2 text-xs font-semibold rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all"
                    onClick={() => onView(item._id)}
                  >
                    View
                  </button>
                  {onContact && (
                    <button
                      className="px-4 py-2 text-xs font-semibold rounded-lg text-white bg-[#1F058F] hover:bg-[#16044a] shadow-sm hover:shadow-md transition-all"
                      onClick={() => onContact(item)}
                    >
                      Contact
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-6 flex items-center justify-between bg-white rounded-xl border border-gray-200 px-6 py-4">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {(currentPage - 1) * pagination.limit + 1}-
              {Math.min(currentPage * pagination.limit, pagination.total)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {pagination.total}
            </span>{" "}
            escrows
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => onChangePage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      page === currentPage
                        ? "bg-[#1F058F] text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => onChangePage(page)}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => onChangePage(currentPage + 1)}
              disabled={currentPage === pagination.pages}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </>
  );
}

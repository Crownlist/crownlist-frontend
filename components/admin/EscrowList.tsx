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
  getStatusColor: (status?: string) => string;
}

export default function EscrowList({
  escrows,
  pagination,
  currentPage,
  onChangePage,
  onView,
  onUpdateStatus,
  getStatusColor,
}: Props) {
  return (
    <>
      <div className="md:hidden px-4 pb-4">
        {escrows.map((item) => (
          <div
            key={item._id}
            className="bg-white border rounded-lg mb-4 p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                <Image
                  src={
                    item.details.images?.find((img) => img.isPrimary)?.url ||
                    item.details.images?.[0]?.url ||
                    "/box.png"
                  }
                  width={48}
                  height={48}
                  alt={item.details.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm text-gray-900">
                  {item.details.name}
                </h4>
                <p className="text-lg font-semibold text-[#1F058F]">
                  ₦{item.amount.toLocaleString()}
                </p>
              </div>
            </div>

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

            <div className="flex items-center justify-between text-sm">
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  item.status
                )}`}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
              <span className="text-gray-500">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <button
                className="flex-1 px-1 py-2 text-xs font-medium rounded text-[#1F058F]"
                onClick={() => onUpdateStatus(item)}
              >
                Update Status
              </button>
              <button
                className="flex-1 px-3 py-2 text-xs font-medium rounded text-[#1F058F] border border-[#1F058F]"
                onClick={() => onView(item._id)}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block divide-y divide-gray-200">
        {escrows.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-14 gap-3 px-6 py-4 items-center hover:bg-gray-50 border-b border-gray-200"
          >
            <div className="col-span-3 flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                <Image
                  src={
                    item.details.images?.find((img) => img.isPrimary)?.url ||
                    item.details.images?.[0]?.url ||
                    "/box.png"
                  }
                  width={48}
                  height={48}
                  alt={item.details.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm text-gray-900">{item.details.name}</span>
            </div>

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
              <span className="text-sm text-gray-900">
                {item.seller.fullName}
              </span>
            </div>

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
              <span className="text-sm text-gray-900">
                {item.buyer.fullName}
              </span>
            </div>

            <div className="col-span-2">
              <span className="text-sm text-gray-900">
                ₦{item.amount.toLocaleString()}
              </span>
            </div>
            <div className="col-span-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  item.status
                )}`}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-sm text-gray-600">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="col-span-1 flex gap-2">
              <button
                className="px-1 py-1 text-xs font-medium rounded text-[#1F058F]"
                onClick={() => onUpdateStatus(item)}
              >
                Update Status
              </button>
              <button
                className="px-3 py-1 text-xs font-medium rounded text-[#1F058F]"
                onClick={() => onView(item._id)}
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
              onClick={() => onChangePage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  className={`px-3 py-1 text-sm rounded ${
                    page === currentPage
                      ? "bg-[#1F058F] text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => onChangePage(page)}
                >
                  {page}
                </button>
              )
            )}
            <button
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
              onClick={() => onChangePage(currentPage + 1)}
              disabled={currentPage === pagination.pages}
            >
              Next →
            </button>
          </div>
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * pagination.limit + 1}-
              {Math.min(currentPage * pagination.limit, pagination.total)}
            </span>{" "}
            of <span className="font-medium">{pagination.total}</span>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import React from "react";
import { EscrowItem } from "@/types/escrow";

interface Props {
  open: boolean;
  selectedEscrow?: EscrowItem | null;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  reasonForDecline: string;
  setReasonForDecline: (s: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  actionLoading?: boolean;
}

export default function EscrowStatusModal({
  open,
  selectedEscrow,
  selectedStatus,
  setSelectedStatus,
  reasonForDecline,
  setReasonForDecline,
  onClose,
  onConfirm,
  actionLoading,
}: Props) {
  if (!open || !selectedEscrow) return null;

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

  return (
    <div
      className="fixed inset-0 bg-black/55 bg-opacity-90 flex items-center justify-center z-50000 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Update Escrow Status</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-2">
                Current Status
              </h3>
              <p className="text-sm text-gray-600">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                    selectedEscrow.status
                  )}`}
                >
                  {selectedEscrow.status.charAt(0).toUpperCase() +
                    selectedEscrow.status.slice(1)}
                </span>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-2">
                New Status
              </h3>
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
                <h3 className="font-semibold text-sm text-gray-700 mb-2">
                  Reason for Decline <span className="text-red-500">*</span>
                </h3>
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
              <p>
                <strong>Product:</strong> {selectedEscrow.details.name}
              </p>
              <p>
                <strong>Seller:</strong> {selectedEscrow.seller.fullName}
              </p>
              <p>
                <strong>Buyer:</strong> {selectedEscrow.buyer.fullName}
              </p>
              <p>
                <strong>Amount:</strong> ₦
                {selectedEscrow.amount.toLocaleString()}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
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
  );
}

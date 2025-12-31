"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface StatusModalState {
  isOpen: boolean;
  listingId: string | null;
  status: "live" | "declined" | "";
  reasonForDecline: string;
}

export interface StatusUpdateModalProps {
  statusModal: StatusModalState;
  setStatusModal: React.Dispatch<React.SetStateAction<StatusModalState>>;
  isSubmitting: boolean;
  showConfirmation: boolean;
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  pendingStatus: "live" | "declined" | null;
  setPendingStatus: React.Dispatch<
    React.SetStateAction<"live" | "declined" | null>
  >;
  handleStatusUpdate: () => void;
}

const StatusUpdateModal = React.memo(function StatusUpdateModalComponent({
  statusModal,
  setStatusModal,
  isSubmitting,
  showConfirmation,
  setShowConfirmation,
  pendingStatus,
  setPendingStatus,
  handleStatusUpdate,
}: StatusUpdateModalProps) {
  return (
    <div
      className={`fixed inset-0 bg-black/85 bg-opacity-50 flex items-center justify-center z-50 ${
        !statusModal.isOpen ? "hidden" : ""
      }`}
    >
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
              onValueChange={(value) =>
                setStatusModal((prev) => ({
                  ...prev,
                  status: value as "live" | "declined",
                }))
              }
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

          {statusModal.status === "declined" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Reason for Decline
              </label>
              <textarea
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Please provide a reason for declining this listing"
                value={statusModal.reasonForDecline}
                onChange={(e) =>
                  setStatusModal((prev) => ({
                    ...prev,
                    reasonForDecline: e.target.value,
                  }))
                }
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() =>
                setStatusModal((prev) => ({ ...prev, isOpen: false }))
              }
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setPendingStatus(statusModal.status as "live" | "declined");
                setShowConfirmation(true);
              }}
              disabled={
                !statusModal.status ||
                (statusModal.status === "declined" &&
                  !statusModal.reasonForDecline.trim()) ||
                isSubmitting
              }
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                !statusModal.status ||
                (statusModal.status === "declined" &&
                  !statusModal.reasonForDecline.trim()) ||
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#1a0066] hover:bg-[#160052]"
              }`}
            >
              Update Status
            </button>
          </div>

          {/* Confirmation Dialog */}
          {showConfirmation && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h3 className="text-lg font-semibold mb-4">
                  Confirm Status Update
                </h3>
                <p className="mb-6">
                  Are you sure you want to update this listing&apos;s status to{" "}
                  <span className="font-medium">{pendingStatus}</span>?
                </p>
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
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                      isSubmitting
                        ? "bg-gray-400"
                        : "bg-[#1a0066] hover:bg-[#160052]"
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

StatusUpdateModal.displayName = "StatusUpdateModal";

export default StatusUpdateModal;

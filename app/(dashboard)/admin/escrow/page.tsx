/*eslint-disable*/
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiClientAdmin } from "@/lib/interceptor";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import EscrowList from "@/components/admin/EscrowList";
import EscrowDetailsModal from "@/components/admin/EscrowDetailsModal";
import EscrowStatusModal from "@/components/admin/EscrowStatusModal";
import { EscrowItem, Pagination } from "@/types/escrow";

export default function AdminEscrowPage() {
  const [escrows, setEscrows] = useState<EscrowItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });

  // Detail & status modals
  const [showEscrowDetails, setShowEscrowDetails] = useState(false);
  const [escrowDetails, setEscrowDetails] = useState<EscrowItem | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedEscrow, setSelectedEscrow] = useState<EscrowItem | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [reasonForDecline, setReasonForDecline] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchEscrows(currentPage);
  }, [currentPage]);

  async function fetchEscrows(page = 1) {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClientAdmin.get("/escrows", { params: { page } });
      const payload = res.data?.data || res.data || {};
      const items: EscrowItem[] = payload.items || payload.escrows || [];
      const pag: Pagination = payload.pagination ||
        payload.paginationData || {
          total: items.length,
          page,
          limit: 10,
          pages: 1,
        };
      setEscrows(items);
      setPagination(pag);
    } catch (err: any) {
      setError(err?.message || "Failed to load escrows");
    } finally {
      setLoading(false);
    }
  }

  async function fetchEscrowDetails(id: string) {
    setLoading(true);
    try {
      const res = await apiClientAdmin.get(`/escrows/${id}`);
      const payload = res.data?.data || res.data || {};
      const escrow: EscrowItem = payload.escrow || payload || null;
      if (!escrow) {
        toast.error("Escrow details not found");
        return;
      }
      setEscrowDetails(escrow);
      setShowEscrowDetails(true);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load escrow details");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus() {
    if (!selectedEscrow) return;
    if (selectedStatus === "declined" && !reasonForDecline.trim()) {
      toast.error("Please provide a reason for decline");
      return;
    }
    setActionLoading(true);
    try {
      console.log(selectedEscrow);
      await apiClientAdmin.patch(`/escrows/status/${selectedEscrow._id}`, {
        status: selectedStatus,
        reason: reasonForDecline,
      });
      toast.success("Escrow status updated");
      // refresh list and close modals
      fetchEscrows(currentPage);
      setShowStatusModal(false);
      setSelectedEscrow(null);
      setSelectedStatus("");
      setReasonForDecline("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update escrow status");
    } finally {
      setActionLoading(false);
    }
  }

  function getStatusColor(status?: string) {
    switch (status) {
      case "paid":
      case "released":
        return "bg-green-100 text-green-800";
      case "declined":
      case "refunded":
        return "bg-red-100 text-red-800";
      case "awaiting_payment":
      case "reviewing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Admin Escrows</h1>
      </div>

      <EscrowList
        escrows={escrows}
        pagination={pagination}
        currentPage={currentPage}
        onChangePage={(p) => setCurrentPage(p)}
        onView={(id) => fetchEscrowDetails(id)}
        onUpdateStatus={(item) => {
          setSelectedEscrow(item);
          setSelectedStatus(item.status);
          setShowStatusModal(true);
        }}
        getStatusColor={getStatusColor}
      />

      {/* Details modal */}
      <EscrowDetailsModal
        open={showEscrowDetails}
        escrow={escrowDetails}
        onClose={() => {
          setShowEscrowDetails(false);
          setEscrowDetails(null);
        }}
        onOpenStatus={(e: EscrowItem) => {
          setSelectedEscrow(e);
          setSelectedStatus(e.status);
          setShowEscrowDetails(false);
          setShowStatusModal(true);
        }}
      />

      {/* Status modal */}
      <EscrowStatusModal
        open={showStatusModal}
        selectedEscrow={selectedEscrow}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        reasonForDecline={reasonForDecline}
        setReasonForDecline={setReasonForDecline}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedEscrow(null);
          setSelectedStatus("");
          setReasonForDecline("");
        }}
        onConfirm={() => setShowConfirmModal(true)}
        actionLoading={actionLoading}
      />

      {/* Confirmation modal for finalizing status change */}
      {showConfirmModal && selectedEscrow && (
        <ConfirmationModal
          open={showConfirmModal}
          onOpenChange={(open) => {
            setShowConfirmModal(open);
            if (!open) {
              setSelectedEscrow(null);
              setSelectedStatus("");
            }
          }}
          onConfirm={handleUpdateStatus}
          title="Confirm Status Update"
          description={`Are you sure you want to change the escrow status to "${
            selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)
          }"?`}
          confirmText={actionLoading ? "Updating..." : "Confirm Update"}
          cancelText="Cancel"
        />
      )}
    </div>
  );
}

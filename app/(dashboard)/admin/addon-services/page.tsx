/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { AddonServiceForm } from "@/components/admin/AddonServiceForm";
import { AddonServicesTable } from "@/components/admin/AddonServicesTable";
import { useAddonServices } from "@/hooks/useAddonServices";
import { AddOnService, AddOnServiceFormData } from "@/types/addon-services";

export default function AdminAddOnServicesPage() {
  const {
    services,
    loading,
    categories,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useAddonServices();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<AddOnService | null>(
    null
  );
  const [editingService, setEditingService] = useState<AddOnService | null>(
    null
  );
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null);

  const handleCreateSubmit = async (formData: AddOnServiceFormData) => {
    try {
      const newId = await handleCreate(formData);
      setIsCreateOpen(false);
      if (newId) {
        setLastCreatedId(newId);
      }
    } catch (error) {
      // Error is already handled in the hook
      console.error("Create failed:", error);
    }
  };

  const handleUpdateSubmit = async (formData: AddOnServiceFormData) => {
    if (!editingService?._id) return;

    try {
      await handleUpdate(editingService._id, formData);
      setIsEditDialogOpen(false);
      setEditingService(null);
    } catch (error) {
      // Error is already handled in the hook
      console.error("Update failed:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete?._id) return;

    try {
      await handleDelete(serviceToDelete._id);
      setServiceToDelete(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      // Error is already handled in the hook
      console.error("Delete failed:", error);
    }
  };

  const handleEditClick = (service: AddOnService) => {
    setEditingService(service);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (service: AddOnService) => {
    setServiceToDelete(service);
    setIsDeleteDialogOpen(true);
  };

  useEffect(() => {
    if (!lastCreatedId) return;
    // After list refresh, scroll and highlight
    const t = setTimeout(() => {
      const row = document.getElementById(`addon-row-${lastCreatedId}`);
      if (row) {
        row.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightId(lastCreatedId);
        setTimeout(() => setHighlightId(null), 2500);
      }
      setLastCreatedId(null);
    }, 300);
    return () => clearTimeout(t);
  }, [services, lastCreatedId]);

  return (
    <div className="p-6 flex ">
      <div className="w-full">
        <div className="flex  justify-between items-center my-6">
          <h1 className="text-2xl font-bold">Add-on Services</h1>
          <div className="flex gap-2">
            <Dialog
              open={isCreateOpen}
              onOpenChange={(o) => {
                setIsCreateOpen(o);
                if (!o) {
                  // Reset form when dialog closes
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-[#1F058F] hover:bg-[#1F058F]/90">
                  <Plus className="mr-2 h-4 w-4" />
                  New Add-on
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[720px]">
                <DialogHeader>
                  <DialogTitle>Create Add-on Service</DialogTitle>
                </DialogHeader>
                <AddonServiceForm
                  categories={categories}
                  onSubmit={handleCreateSubmit}
                  onCancel={() => setIsCreateOpen(false)}
                  isLoading={loading}
                  submitButtonText="Create"
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <AddonServicesTable
          services={services}
          loading={loading}
          highlightId={highlightId}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

        {/* Edit Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(o) => {
            setIsEditDialogOpen(o);
            if (!o) {
              setEditingService(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-[720px]">
            <DialogHeader>
              <DialogTitle>Edit Add-on Service</DialogTitle>
            </DialogHeader>
            <AddonServiceForm
              initialData={editingService || undefined}
              categories={categories}
              onSubmit={handleUpdateSubmit}
              onCancel={() => setIsEditDialogOpen(false)}
              isLoading={loading}
              submitButtonText="Update Add-on"
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Add-on Service</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>
                Are you sure you want to delete the add-on "
                {serviceToDelete?.name}"? This action cannot be undone.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="text-white"
                onClick={handleDeleteConfirm}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Add-on"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSubcategoryManagement } from "@/hooks/useSubcategoryManagement";
import { SubcategoryTable } from "@/components/admin/SubcategoryTable";
import { CreateSubcategoryModal } from "@/components/admin/CreateSubcategoryModal";
import { EditSubcategoryModal } from "@/components/admin/EditSubcategoryModal";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import { SubcategoryDetailsModal } from "@/components/SubcategoryModal";
import { Subcategory } from "@/types/subcategory";

export default function SubcategoryManagementPage() {
  const { slug } = useParams();
  const router = useRouter();
  const {
    category,
    subcategories,
    loading,
    actionLoading,
    uploadingImage,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
  } = useSubcategoryManagement(slug as string);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] =
    useState<Subcategory | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<string | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleEdit = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setSubcategoryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDetails = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setIsDetailsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (subcategoryToDelete) {
      await deleteSubcategory(subcategoryToDelete);
      setIsDeleteDialogOpen(false);
      setSubcategoryToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Category not found</p>
          <Button onClick={() => router.push("/admin/categories")}>
            Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-2 items-center mb-6">
        <Button
          variant="outline"
          className="mr-4"
          onClick={() => router.push("/admin/categories")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          Managing Subcategories for: {category.name}
        </h1>
      </div>

      <CreateSubcategoryModal
        onCreate={createSubcategory}
        actionLoading={actionLoading}
        uploadingImage={false} // This can be tracked in the hook if needed
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      {subcategories?.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500">
            No subcategories found for this category
          </p>
          <Button
            className="mt-4 bg-[#1F058F] hover:bg-[#1F058F]/90"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add First Subcategory
          </Button>
        </div>
      ) : (
        <SubcategoryTable
          subcategories={subcategories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDetails={handleDetails}
          actionLoading={actionLoading}
        />
      )}

      <EditSubcategoryModal
        subcategory={editingSubcategory}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingSubcategory(null);
        }}
        onUpdate={updateSubcategory}
        actionLoading={actionLoading}
        uploadingImage={uploadingImage}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSubcategoryToDelete(null);
        }}
        onConfirm={confirmDelete}
        actionLoading={actionLoading}
      />

      <SubcategoryDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedSubcategory(null);
        }}
        subcategory={selectedSubcategory}
        onEdit={(id) => {
          const sub = subcategories.find((s) => s._id === id);
          if (sub) {
            handleEdit(sub);
            setIsDetailsModalOpen(false);
          }
        }}
        onDelete={(id) => {
          handleDelete(id);
          setIsDetailsModalOpen(false);
        }}
      />
    </div>
  );
}

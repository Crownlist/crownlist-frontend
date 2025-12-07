"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SubscriptionPlansTable } from "./components/SubscriptionPlansTable";
import { CreatePlanDialog } from "./components/CreatePlanDialog";
import { EditPlanDialog } from "./components/EditPlanDialog";
import { DeletePlanDialog } from "./components/DeletePlanDialog";
import { SubscriptionPlan } from "./types";
import { useSubscriptionPlans } from "./hooks/useSubscriptionPlans";

export default function AdminSubscriptionsPage() {
  const { plans, loading } = useSubscriptionPlans();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(
    null
  );

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsEditOpen(true);
  };

  const handleDelete = (plan: SubscriptionPlan) => {
    setPlanToDelete(plan);
    setIsDeleteOpen(true);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold">Subscription Plans</h1>
        <CreatePlanDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading plans...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500">No subscription plans found</p>
          <Button
            className="mt-4 bg-[#1F058F] hover:bg-[#1F058F]/90"
            onClick={() => setIsCreateOpen(true)}
          >
            Create First Plan
          </Button>
        </div>
      ) : (
        <SubscriptionPlansTable
          plans={plans}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <EditPlanDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        plan={editingPlan}
      />

      <DeletePlanDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        plan={planToDelete}
      />
    </div>
  );
}

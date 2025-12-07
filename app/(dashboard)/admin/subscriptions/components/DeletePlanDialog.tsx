import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useSubscriptionPlans } from "../hooks/useSubscriptionPlans";
import { SubscriptionPlan } from "../types";

interface DeletePlanDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SubscriptionPlan | null;
}

export const DeletePlanDialog = ({
  isOpen,
  onOpenChange,
  plan,
}: DeletePlanDialogProps) => {
  const { deletePlan, loading } = useSubscriptionPlans();

  const handleDelete = async () => {
    if (!plan?._id) return;

    try {
      await deletePlan(plan._id);
      onOpenChange(false);
    } catch {
      // Error is handled in the hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Subscription Plan</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Are you sure you want to delete the plan &ldquo;{plan?.name}&rdquo;?
            This action cannot be undone.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="text-white"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface OnlyBuyerCanLikeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnlyBuyerCanLikeModal({
  open,
  onOpenChange,
}: OnlyBuyerCanLikeModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Like Feature Restricted</AlertDialogTitle>
          <AlertDialogDescription>
            Only buyers can like products. Sellers cannot use the heart icon to like items.
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

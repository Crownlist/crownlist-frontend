import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface AccountTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectAccountType: (accountType: "User" | "Seller") => void;
  isLoading?: boolean;
}

export function AccountTypeModal({
  open,
  onOpenChange,
  onSelectAccountType,
  isLoading = false,
}: AccountTypeModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Choose Account Type</AlertDialogTitle>
          <AlertDialogDescription>
            Please select your account type to continue with Google sign-in.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Button
            onClick={() => onSelectAccountType("User")}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Processing..." : "Continue as Buyer"}
          </Button>
          <Button
            onClick={() => onSelectAccountType("Seller")}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? "Processing..." : "Continue as Seller"}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

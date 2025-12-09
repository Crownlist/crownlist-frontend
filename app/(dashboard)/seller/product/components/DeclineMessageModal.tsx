import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DeclineMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  declineProductId: string | null;
  declineMessage: string | null;
}

export function DeclineMessageModal({
  isOpen,
  onClose,
  declineProductId,
  declineMessage,
}: DeclineMessageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Decline Message</DialogTitle>
          <DialogDescription>Product ID: {declineProductId}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              {declineMessage || "Loading decline message..."}
            </p>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={onClose}
              className="bg-[#1F058F] hover:bg-[#2e0a94] text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

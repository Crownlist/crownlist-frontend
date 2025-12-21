import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ListingLimitItem } from "../types";

interface ListingLimitsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  listingLimits: ListingLimitItem[];
  planName: string;
}

export const ListingLimitsModal = ({
  isOpen,
  onOpenChange,
  listingLimits,
  planName,
}: ListingLimitsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Listing Limits - {planName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {listingLimits.map((it) => (
            <div
              key={
                it._id ??
                `${
                  typeof it.subCategory === "string"
                    ? it.subCategory
                    : it.subCategory?._id
                }-${it.limit}`
              }
              className="flex justify-between items-center p-2 bg-gray-50 rounded"
            >
              <span className="font-medium">
                {typeof it.subCategory === "string"
                  ? it.subCategory
                  : it.subCategory?.name}
              </span>
              <span className="text-gray-600">{it.limit}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

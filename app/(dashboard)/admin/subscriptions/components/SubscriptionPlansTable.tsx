import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { SubscriptionPlan, ListingLimitItem } from "../types";
import { ListingLimitsModal } from "./ListingLimitsModal";

interface SubscriptionPlansTableProps {
  plans: SubscriptionPlan[];
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (plan: SubscriptionPlan) => void;
}

export const SubscriptionPlansTable = ({
  plans,
  onEdit,
  onDelete,
}: SubscriptionPlansTableProps) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );

  const handleViewMore = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const renderListingLimits = (
    listingLimit: ListingLimitItem[],
    plan: SubscriptionPlan,
    isMobile = false
  ) => {
    if (!Array.isArray(listingLimit) || listingLimit.length === 0) {
      return <span className="text-gray-500 text-sm">-</span>;
    }

    const visibleLimits = listingLimit.slice(0, 2);
    const hasMore = listingLimit.length > 2;

    return (
      <div className="space-y-1">
        {visibleLimits.map((it) => (
          <div
            key={
              it._id ??
              `${
                typeof it.subCategory === "string"
                  ? it.subCategory
                  : it.subCategory?._id
              }-${it.limit}`
            }
            className={
              isMobile
                ? "text-sm text-gray-600 w-fit bg-gray-50 px-2 py-1 rounded"
                : "text-sm"
            }
          >
            <span className="font-medium">
              {typeof it.subCategory === "string"
                ? it.subCategory
                : it.subCategory?.name}
            </span>
            : {it.limit}
          </div>
        ))}
        {hasMore && (
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto text-[#1F058F] hover:text-[#1F058F]/80"
            onClick={(e) => {
              e.stopPropagation();
              handleViewMore(plan);
            }}
          >
            View More ({listingLimit.length - 2} more)
          </Button>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <Table className="border rounded-lg min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Billing</TableHead>
              <TableHead>Listing Limit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((p) => (
              <TableRow key={p._id}>
                <TableCell
                  className="font-medium cursor-pointer text-[#1F058F]"
                  onClick={() =>
                    p._id && router.push(`/admin/subscriptions/${p._id}`)
                  }
                >
                  {p.name}
                </TableCell>
                <TableCell>₦{Number(p.amount).toLocaleString()}</TableCell>
                <TableCell className="capitalize">{p.billing_cycle}</TableCell>
                <TableCell>{renderListingLimits(p.listingLimit, p)}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      p.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {p.status}
                  </span>
                </TableCell>
                <TableCell>
                  {p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(p);
                      }}
                    >
                      <Pencil className="h-4 w-4 text-[#1F058F]" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(p);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {plans.map((p) => (
          <div
            key={p._id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header with Name and Status */}
            <div className="flex items-start justify-between mb-3">
              <h3
                className="font-medium text-[#1F058F] cursor-pointer hover:underline"
                onClick={() =>
                  p._id && router.push(`/admin/subscriptions/${p._id}`)
                }
              >
                {p.name}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  p.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {p.status}
              </span>
            </div>

            {/* Amount and Billing */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-semibold text-gray-900">
                ₦{Number(p.amount).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 capitalize">
                {p.billing_cycle}
              </div>
            </div>

            {/* Listing Limits */}
            <div className="mb-3">
              <div className="text-sm font-medium text-gray-700 mb-1">
                Listing Limits:
              </div>
              {renderListingLimits(p.listingLimit, p, true)}
            </div>

            {/* Created Date */}
            <div className="text-xs text-gray-500 mb-3">
              Created:{" "}
              {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-"}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(p);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(p);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ListingLimitsModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        listingLimits={selectedPlan?.listingLimit || []}
        planName={selectedPlan?.name || ""}
      />
    </>
  );
};

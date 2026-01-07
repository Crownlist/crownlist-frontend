import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyUsersStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function EmptyUsersState({
  hasActiveFilters,
  onClearFilters,
}: EmptyUsersStateProps) {
  return (
    <div className="p-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No users found
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        {hasActiveFilters
          ? "Try adjusting your filters or search criteria."
          : "There are no users in the system yet."}
      </p>
      {hasActiveFilters && (
        <Button variant="outline" onClick={onClearFilters}>
          Clear all filters
        </Button>
      )}
    </div>
  );
}

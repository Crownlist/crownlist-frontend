import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  limit: number;
  filteredLength: number;
  totalProducts: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  page,
  totalPages,
  limit,
  filteredLength,
  totalProducts,
  onPageChange,
}: PaginationControlsProps) {
  return (
    <div className="flex justify-between max-md:flex-col max-md:items-start max-md:gap-2 py-4 items-center text-sm text-gray-600">
      <p>
        Showing {(page - 1) * limit + Math.min(filteredLength, 1)}-
        {(page - 1) * limit + filteredLength} of {totalProducts}
      </p>
      <div className="flex gap-2 w-fit">
        <Button
          variant="outline"
          className="max-sm:text-[10px] px-2 py-1"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }).map((_, idx) => (
          <Button
            key={idx}
            variant={page === idx + 1 ? undefined : "outline"}
            onClick={() => onPageChange(idx + 1)}
          >
            {idx + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          className="max-sm:text-[10px] px-2 py-1"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

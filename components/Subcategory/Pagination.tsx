import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 text-sm disabled:opacity-50"
      >
        <ArrowLeft size={14} /> Previous
      </button>

      <div className="flex gap-1">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`w-8 h-8 rounded-md text-sm ${
              currentPage === i + 1
                ? "bg-gray-100 font-medium"
                : "hover:bg-gray-50"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 text-sm disabled:opacity-50"
      >
        Next <ArrowRight size={14} />
      </button>
    </div>
  );
}

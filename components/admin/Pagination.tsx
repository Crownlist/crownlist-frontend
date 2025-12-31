"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  limit: number;
  setLimit: (value: number) => void;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  limit,
  setLimit,
  setCurrentPage,
}) => {
  return (
    <div className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 whitespace-nowrap">
          Items per page:
        </span>
        <Select
          value={limit.toString()}
          onValueChange={(value) => {
            setLimit(Number(value));
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between lg:justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex-1 lg:flex-none"
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600 whitespace-nowrap px-2">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex-1 lg:flex-none"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;

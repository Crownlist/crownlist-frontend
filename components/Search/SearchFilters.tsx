import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFiltersProps {
  isFeatured: boolean;
  sortBy: string;
  onFilterChange: (
    filterType: "featured" | "sort",
    value: boolean | string
  ) => void;
  isMobile?: boolean;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  isFeatured,
  sortBy,
  onFilterChange,
  isMobile = false,
}) => {
  if (isMobile) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {/* Featured Filter */}
        <Button
          variant={isFeatured ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("featured", !isFeatured)}
          className={`whitespace-nowrap ${
            isFeatured ? "bg-[#1f058f] hover:bg-[#2a0bc0]" : ""
          }`}
        >
          ⭐ Featured
        </Button>

        {/* Sort Filter */}
        <Select
          value={sortBy}
          onValueChange={(value) => onFilterChange("sort", value)}
        >
          <SelectTrigger className="w-auto min-w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant={isFeatured ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("featured", !isFeatured)}
        className={`whitespace-nowrap ${
          isFeatured ? "bg-[#1f058f] hover:bg-[#2a0bc0]" : ""
        }`}
      >
        ⭐ Featured Only
      </Button>

      <Select
        value={sortBy}
        onValueChange={(value) => onFilterChange("sort", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

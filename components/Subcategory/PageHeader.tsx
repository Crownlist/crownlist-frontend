import { ChevronDown, LayoutGrid, List, Search } from "lucide-react";

interface PageHeaderProps {
  subcategoryTitle: string;
  totalProducts: number;
  showMobileFilters: boolean;
  setShowMobileFilters: (show: boolean) => void;
  isFeatured: boolean;
  setIsFeatured: (featured: boolean) => void;
  sortOption: string;
  sortDropdownOpen: boolean;
  setSortDropdownOpen: (open: boolean) => void;
  sortOptionsDisplay: string[];
  getSortDisplayText: (sortValue: string) => string;
  handleSortOptionSelect: (option: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export function PageHeader({
  subcategoryTitle,
  totalProducts,
  showMobileFilters,
  setShowMobileFilters,
  isFeatured,
  setIsFeatured,
  sortOption,
  sortDropdownOpen,
  setSortDropdownOpen,
  sortOptionsDisplay,
  getSortDisplayText,
  handleSortOptionSelect,
  viewMode,
  setViewMode,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 className="text-[13px] sm:text-lg font-medium">
        {subcategoryTitle}
        <span className="text-gray-500"> ({totalProducts} results found)</span>
      </h1>
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        {/* Mobile Filter Toggle */}
        <button
          className="md:hidden flex items-center gap-1 text-sm border rounded px-3 py-1"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <Search size={16} />
          Filters
        </button>

        {/* Featured Filter */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="featured" className="text-sm">
            Featured only
          </label>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 text-[13px] max-sm:text-sm relative">
          <span className="text-gray-500 hidden sm:inline">Sort by:</span>
          <button
            className="font-medium flex items-center gap-1"
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
          >
            {getSortDisplayText(sortOption)}
            <ChevronDown size={14} className="ml-1" />
          </button>

          {sortDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 bg-white shadow-md rounded-md z-10 w-36 py-1">
              {sortOptionsDisplay.map((option) => (
                <button
                  key={option}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    option === sortOption ? "bg-gray-50" : ""
                  }`}
                  onClick={() => handleSortOptionSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1">
          <button
            className={`p-1 rounded ${
              viewMode === "grid" ? "bg-gray-100" : ""
            }`}
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            className={`p-1 rounded ${
              viewMode === "list" ? "bg-gray-100" : ""
            }`}
            onClick={() => setViewMode("list")}
            aria-label="List view"
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

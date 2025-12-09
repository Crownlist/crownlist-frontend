import { Button } from "@/components/ui/button";

interface StatusFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function StatusFilters({
  activeFilter,
  onFilterChange,
}: StatusFiltersProps) {
  const statuses = ["all", "live", "reviewing", "draft", "declined"];

  return (
    <div className="flex gap-1 sm:gap-2 mb-6 border-[1.5px] border-[#1F058F] p-2 rounded-md overflow-x-auto">
      {statuses.map((status) => (
        <Button
          key={status}
          className={`px-3 sm:px-4 md:px-5 rounded-md whitespace-nowrap ${
            activeFilter === status
              ? "bg-[#1F058F] hover:bg-[#2f0a94dc]"
              : " text-black shadow-none bg-transparent hover:bg-transparent hover:text-[#1F058F]"
          } `}
          onClick={() => onFilterChange(status)}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Button>
      ))}
    </div>
  );
}

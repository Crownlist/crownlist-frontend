import { Search } from "lucide-react";
import * as Slider from "@radix-ui/react-slider";
import { Facility } from "@/types/subcategory";
import { useResourceOptions } from "@/hooks/useResourceOptions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FacilityFilterProps {
  facility: Facility;
  selectedValue: unknown;
  onChange: (value: string | number | boolean | null | undefined) => void;
}

function FacilityFilter({
  facility,
  selectedValue,
  onChange,
}: FacilityFilterProps) {
  const { data: options, isLoading } = useResourceOptions(facility.value || "");

  const renderInput = () => {
    switch (facility.dataType) {
      case "string":
        return (
          <input
            type="text"
            placeholder={`Enter ${facility.label}`}
            className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1F058F] focus:border-transparent"
            value={(selectedValue as string) || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case "number":
        return (
          <input
            type="number"
            placeholder={`Enter ${facility.label}`}
            className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1F058F] focus:border-transparent"
            value={(selectedValue as string) || ""}
            onChange={(e) =>
              onChange(e.target.value ? Number(e.target.value) : "")
            }
          />
        );
      case "boolean":
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`facility-${facility._id}`}
              checked={(selectedValue as boolean) || false}
              onChange={(e) => onChange(e.target.checked)}
              className="w-4 h-4 text-[#1F058F] focus:ring-[#1F058F] border-gray-300 rounded"
            />
            <label htmlFor={`facility-${facility._id}`} className="text-sm">
              {facility.label}
            </label>
          </div>
        );
      case "object":
        if (isLoading) {
          return (
            <div className="text-sm text-gray-500">Loading options...</div>
          );
        }
        return (
          <Select
            value={(selectedValue as string) || ""}
            onValueChange={onChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select ${facility.label}`} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "array":
        // For array types, we'll use a multi-select approach
        // Since the API expects facilities as key-value, we'll store as comma-separated string
        if (facility.selectType === "multiple") {
          if (isLoading) {
            return (
              <div className="text-sm text-gray-500">Loading options...</div>
            );
          }
          const selectedValues = selectedValue
            ? String(selectedValue).split(",").filter(Boolean)
            : [];
          return (
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                Select multiple {facility.label}:
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {options?.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option.value)}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...selectedValues, option.value]
                          : selectedValues.filter((v) => v !== option.value);
                        onChange(newValues.join(","));
                      }}
                      className="w-3 h-3 text-[#1F058F] focus:ring-[#1F058F] border-gray-300 rounded"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          );
        } else {
          // Single select for array type
          return (
            <input
              type="text"
              placeholder={`Enter ${facility.label} (comma-separated)`}
              className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1F058F] focus:border-transparent"
              value={(selectedValue as string) || ""}
              onChange={(e) => onChange(e.target.value)}
            />
          );
        }
      default:
        return (
          <div className="text-sm text-gray-500">Unsupported data type</div>
        );
    }
  };

  return (
    <div className="border-b pb-4">
      <div className="font-medium mb-3">{facility.label}</div>
      <div className="space-y-3">{renderInput()}</div>
    </div>
  );
}

interface MobileFiltersProps {
  showMobileFilters: boolean;
  setShowMobileFilters: (show: boolean) => void;
  locationSearch: string;
  setLocationSearch: (search: string) => void;
  filteredLocations: string[];
  selectedLocation: string;
  toggleLocation: (location: string) => void;
  sliderValues: number[];
  handleSliderChange: (values: number[]) => void;
  priceRange: { min: string; max: string };
  handlePriceInputChange: (type: "min" | "max", value: string) => void;
  facilities: Facility[];
  selectedFacilities: Record<string, unknown>;
  handleFacilityChange: (
    label: string,
    value: string | number | boolean | null | undefined
  ) => void;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export function MobileFilters({
  showMobileFilters,
  setShowMobileFilters,
  locationSearch,
  setLocationSearch,
  filteredLocations,
  selectedLocation,
  toggleLocation,
  sliderValues,
  handleSliderChange,
  priceRange,
  handlePriceInputChange,
  facilities,
  selectedFacilities,
  handleFacilityChange,
}: MobileFiltersProps) {
  const PRICE_MIN = 0;
  const PRICE_MAX = 10_000_000;

  if (!showMobileFilters) return null;

  return (
    <div className="md:hidden bg-gray-50 p-4 rounded-lg mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Filters</h3>
        <button
          onClick={() => setShowMobileFilters(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <div className="space-y-4">
        {/* Location Filter */}
        <div className="border-b pb-4">
          <div className="font-medium mb-3">Location</div>
          <div className="space-y-3">
            <div className="flex rounded-full overflow-hidden border border-gray-300">
              <div className="flex-1 flex items-center pl-3">
                <Search size={14} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full py-1.5 text-sm focus:outline-none"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Price Filter */}
        <div className="border-b pb-4">
          <div className="font-medium mb-3">Price</div>
          <div className="space-y-4">
            <div className="px-2">
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                value={sliderValues}
                onValueChange={handleSliderChange}
                max={PRICE_MAX}
                min={PRICE_MIN}
                step={1000}
              >
                <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
                  <Slider.Range className="absolute bg-[#1F058F] rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb
                  className="block w-4 h-4 bg-[#1F058F] rounded-full shadow-md hover:bg-[#2a0bc0] focus:outline-none focus:ring-2 focus:ring-[#1F058F] focus:ring-opacity-50"
                  aria-label="Min price"
                />
                <Slider.Thumb
                  className="block w-4 h-4 bg-[#1F058F] rounded-full shadow-md hover:bg-[#2a0bc0] focus:outline-none focus:ring-2 focus:ring-[#1F058F] focus:ring-opacity-50"
                  aria-label="Max price"
                />
              </Slider.Root>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>₦{sliderValues[0].toLocaleString()}</span>
              <span>₦{sliderValues[1].toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Min</label>
                <div className="flex items-center gap-2 rounded-md border border-gray-300 px-2 py-1.5">
                  <span className="text-gray-500">₦</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    placeholder="0"
                    className="w-full bg-transparent text-sm focus:outline-none"
                    value={priceRange.min}
                    onChange={(e) =>
                      handlePriceInputChange("min", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Max</label>
                <div className="flex items-center gap-2 rounded-md border border-gray-300 px-2 py-1.5">
                  <span className="text-gray-500">₦</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    placeholder="10,000,000"
                    className="w-full bg-transparent text-sm focus:outline-none"
                    value={priceRange.max}
                    onChange={(e) =>
                      handlePriceInputChange("max", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Facilities Filters */}
        {facilities.map((facility) => (
          <FacilityFilter
            key={facility._id}
            facility={facility}
            selectedValue={selectedFacilities[facility.label]}
            onChange={(value) => handleFacilityChange(facility.label, value)}
          />
        ))}
      </div>
    </div>
  );
}

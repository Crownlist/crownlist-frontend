import { ChevronDown, ChevronUp, Search, Check } from "lucide-react";
import * as Slider from "@radix-ui/react-slider";

interface MobileFiltersProps {
  showMobileFilters: boolean;
  setShowMobileFilters: (show: boolean) => void;
  expandedFilters: { [key: string]: boolean };
  toggleFilter: (filter: string) => void;
  locationSearch: string;
  setLocationSearch: (search: string) => void;
  filteredLocations: string[];
  selectedLocation: string;
  toggleLocation: (location: string) => void;
  sliderValues: number[];
  handleSliderChange: (values: number[]) => void;
  priceRange: { min: string; max: string };
  handlePriceInputChange: (type: "min" | "max", value: string) => void;
}

export function MobileFilters({
  showMobileFilters,
  setShowMobileFilters,
  expandedFilters,
  toggleFilter,
  locationSearch,
  setLocationSearch,
  filteredLocations,
  selectedLocation,
  toggleLocation,
  sliderValues,
  handleSliderChange,
  priceRange,
  handlePriceInputChange,
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
          <button
            className="flex items-center justify-between w-full text-left mb-4"
            onClick={() => toggleFilter("location")}
          >
            <span className="font-medium">Location</span>
            {expandedFilters.location ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {expandedFilters.location && (
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

              <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2">
                {filteredLocations.map((location) => (
                  <div key={location} className="flex items-center gap-2">
                    <div
                      className={`h-4 w-4 rounded flex items-center justify-center ${
                        selectedLocation === location
                          ? "bg-green-500 text-white"
                          : "border border-gray-300"
                      }`}
                      onClick={() => toggleLocation(location)}
                    >
                      {selectedLocation === location && <Check size={12} />}
                    </div>
                    <label
                      className="text-sm cursor-pointer"
                      onClick={() => toggleLocation(location)}
                    >
                      {location}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div className="border-b pb-4">
          <button
            className="flex items-center justify-between w-full text-left mb-4"
            onClick={() => toggleFilter("price")}
          >
            <span className="font-medium">Price</span>
            {expandedFilters.price ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {expandedFilters.price && (
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
                  <label className="block text-xs text-gray-500 mb-1">
                    Min
                  </label>
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
                  <label className="block text-xs text-gray-500 mb-1">
                    Max
                  </label>
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
          )}
        </div>
      </div>
    </div>
  );
}

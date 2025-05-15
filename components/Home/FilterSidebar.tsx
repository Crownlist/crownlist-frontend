"use client"

import { ChevronDown, ChevronUp, Check, Search } from "lucide-react"
import { useState } from "react"

interface FilterSidebarProps {
  filters: {
    label: string
    options: string[]
  }[]
  onFilterChange: (filterType: string, value: string) => void
  selectedFilters: Record<string, string[]>
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  selectedFilters
}: FilterSidebarProps) {
  const [expandedFilters, setExpandedFilters] = useState<{ [key: string]: boolean }>({
    category: true,
    location: true,
    price: true
  })
  const [locationSearch, setLocationSearch] = useState("")

  const toggleFilter = (filter: string) => {
    setExpandedFilters(prev => ({ ...prev, [filter]: !prev[filter] }))
  }

  return (
    <div className="w-full md:w-[220px] shrink-0">

      
      <div className="space-y-4">

        
        {filters.map((filter) => (
          <div key={filter.label} className="border-b pb-4">
            <button
              className="flex items-center justify-between w-full text-left mb-4"
              onClick={() => toggleFilter(filter.label.toLowerCase())}
            >
              <span className="font-medium">{filter.label}</span>
              {expandedFilters[filter.label.toLowerCase()] ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            {expandedFilters[filter.label.toLowerCase()] && (
              <div className="space-y-2">

                {filter.label === "Location" && (
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
                )}
                {filter.options
                  .filter(option =>
                    filter.label === "Location"
                      ? option.toLowerCase().includes(locationSearch.toLowerCase())
                      : true
                  )
                  .map((option) => (
                    <div key={option} className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded flex items-center justify-center ${
                          selectedFilters[filter.label]?.includes(option)
                            ? "bg-green-500 text-white"
                            : "border border-gray-300"
                        }`}
                        onClick={() => onFilterChange(filter.label, option)}
                      >
                        {selectedFilters[filter.label]?.includes(option) && <Check size={12} />}
                      </div>
                      <label
                        className="text-sm cursor-pointer"
                        onClick={() => onFilterChange(filter.label, option)}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
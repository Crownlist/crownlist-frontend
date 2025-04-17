/* eslint-disable */
"use client"

import { useState, useEffect, useMemo } from "react";
import { ChevronRight,  ArrowLeft, ArrowRight, Search, Check, ChevronDown, ChevronUp, Loader2, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import PropertyGrid from "./PropertyGrid";
import PropertyList from "./PropertyList";
import { mockData } from "@/lib/mockData";
import NoSearchCat from "./NoSearchCat";

interface SearchCategoryProps {
  category: string;
  subcategory?: string;
  categoryTitle: string;
  subcategoryTitle?: string;
  filters: {
    label: string;
    options: string[];
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function SearchCategory({
  category,
  subcategory: propSubcategory,
  categoryTitle,
  subcategoryTitle,
  filters,
  searchParams: propSearchParams,
}: SearchCategoryProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState("All");
  const [expandedFilters, setExpandedFilters] = useState({ property: true, location: true, price: true });
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const itemsPerPage = 9;

  const activeSubcategory = propSubcategory || (typeof propSearchParams?.subcategory === 'string' ? propSearchParams.subcategory : undefined);

  const filteredResults = useMemo(() => {
    let results = [...mockData].filter(item => item.category === category);
    if (activeSubcategory) {
      results = results.filter(item => item.type?.toLowerCase() === activeSubcategory.toLowerCase());
    }
    if (selectedPropertyTypes.length > 0) {
      results = results.filter(item => item.type?.toLowerCase().includes(selectedPropertyTypes[0].toLowerCase()));
    }
    if (selectedLocations.length > 0) {
      results = results.filter(item =>
        selectedLocations.some(location => item.location?.toLowerCase().includes(location.toLowerCase()))
      );
    }
    if (priceRange.min !== undefined || priceRange.max !== undefined) {
      results = results.filter(item => {
        const price = Number(item.price.replace(/[₦,]/g, ""));
        return (
          (priceRange.min === undefined || price >= priceRange.min) &&
          (priceRange.max === undefined || price <= priceRange.max)
        );
      });
    }
    switch (sortOption) {
      case "Lowest price":
        results.sort((a, b) => Number(a.price.replace(/[₦,]/g, "")) - Number(b.price.replace(/[₦,]/g, "")));
        break;
      case "Highest price":
        results.sort((a, b) => Number(b.price.replace(/[₦,]/g, "")) - Number(a.price.replace(/[₦,]/g, "")));
        break;
    }
    return results;
  }, [category, activeSubcategory, selectedPropertyTypes, selectedLocations, priceRange, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / itemsPerPage));
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredResults.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredResults, currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredResults]);

  useEffect(() => {
    if (activeSubcategory && filters.options.some(opt => opt.toLowerCase() === activeSubcategory.toLowerCase())) {
      setSelectedPropertyTypes([activeSubcategory]);
    }
  }, [activeSubcategory, filters.options]);

  const toggleFilter = (filter: string) => {
    setExpandedFilters(prev => ({ ...prev, [filter]: !prev[filter as keyof typeof prev] }));
  };

  const togglePropertyType = (type: string) => {
    setSelectedPropertyTypes(prev => prev.includes(type) ? [] : [type]);
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations(prev => prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]);
  };

  const handleSortOptionSelect = (option: string) => {
    setSortOption(option);
    setSortDropdownOpen(false);
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? Number(value) : undefined;
    setPriceRange(prev => ({ ...prev, [type]: numValue }));
  };

  const locationOptions = ["Lagos", "Abuja", "Ibadan", "Port Harcourt"].filter(location => location.toLowerCase().includes(locationSearch.toLowerCase()));

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-gray-500" /></div>;
  }

  if (filteredResults.length === 0) {
    return <NoSearchCat cat={category} subcat={activeSubcategory} />;
  }

  return (
    <div className="mx-auto px-4 py-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <ChevronRight size={16} />
        <span className="text-gray-700">{categoryTitle}</span>
        {subcategoryTitle && (<><ChevronRight size={16} /><span className="text-gray-700">{subcategoryTitle}</span></>)}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[13px] sm:text-lg font-medium">
          {categoryTitle}{subcategoryTitle && ` - ${subcategoryTitle}`}<span className="text-gray-500"> ({filteredResults.length} results found)</span>
        </h1>

        <div className="flex items-center gap-4">
          <button className="md:hidden flex items-center gap-1 text-sm border rounded px-2 py-1" onClick={() => setShowMobileFilters(prev => !prev)}>
            <SlidersHorizontal size={16} /> Filter
          </button>

          <div className="relative text-sm hidden md:flex items-center gap-2">
            <span className="text-gray-500">Sort by:</span>
            <button onClick={() => setSortDropdownOpen(!sortDropdownOpen)} className="font-medium flex items-center gap-1">
              {sortOption} <ChevronDown size={14} />
            </button>
            {sortDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white shadow-md rounded-md z-10 w-36 py-1">
                {["All", "Lowest price", "Highest price"].map(option => (
                  <button key={option} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${option === sortOption ? "bg-gray-50" : ""}`} onClick={() => handleSortOptionSelect(option)}>{option}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {(showMobileFilters || typeof window === 'undefined' || window.innerWidth >= 768) && (
          <div className="w-full md:w-[220px] shrink-0">
            <div className="space-y-4">
              <div className="border-b pb-4">
                <button onClick={() => toggleFilter("property")} className="flex items-center justify-between w-full text-left mb-4">
                  <span className="font-medium">{filters.label}{selectedPropertyTypes.length > 0 && (<span className="text-gray-400 pl-1">(1)</span>)}</span>
                  {expandedFilters.property ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedFilters.property && (
                  <div className="space-y-2">
                    {filters.options.map(type => {
                      const isActive = selectedPropertyTypes.includes(type) || (activeSubcategory && type.toLowerCase() === activeSubcategory.toLowerCase());
                      return (
                        <div key={type} className="flex items-center gap-2">
                          <div className={`h-4 w-4 rounded flex items-center justify-center ${isActive ? "bg-green-500 text-white" : "border border-gray-300"}`} onClick={() => togglePropertyType(type)}>{isActive && <Check size={12} />}</div>
                          <label className="text-sm cursor-pointer" onClick={() => togglePropertyType(type)}>{type}</label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="border-b pb-4">
                <button onClick={() => toggleFilter("location")} className="flex items-center justify-between w-full text-left mb-4">
                  <span className="font-medium">Location</span>
                  {expandedFilters.location ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedFilters.location && (
                  <div className="space-y-3">
                    <div className="flex rounded-full overflow-hidden border border-gray-300">
                      <div className="flex-1 flex items-center pl-3">
                        <Search size={14} className="text-gray-400 mr-2" />
                        <input type="text" placeholder="Search locations" className="w-full py-1.5 text-sm focus:outline-none" value={locationSearch} onChange={(e) => setLocationSearch(e.target.value)} />
                      </div>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2">
                      {locationOptions.map(location => (
                        <div key={location} className="flex items-center gap-2">
                          <div className={`h-4 w-4 rounded flex items-center justify-center ${selectedLocations.includes(location) ? "bg-green-500 text-white" : "border border-gray-300"}`} onClick={() => toggleLocation(location)}>{selectedLocations.includes(location) && <Check size={12} />}</div>
                          <label className="text-sm cursor-pointer" onClick={() => toggleLocation(location)}>{location}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="border-b pb-4">
                <button onClick={() => toggleFilter("price")} className="flex items-center justify-between w-full text-left mb-4">
                  <span className="font-medium">Price</span>
                  {expandedFilters.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedFilters.price && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-sm text-gray-500 mb-1 block">Min</label>
                        <input type="number" placeholder="₦0" className="w-full border border-gray-300 rounded p-2 text-sm" value={priceRange.min || ""} onChange={(e) => handlePriceRangeChange('min', e.target.value)} />
                      </div>
                      <div className="pt-6">→</div>
                      <div className="flex-1">
                        <label className="text-sm text-gray-500 mb-1 block">Max</label>
                        <input type="number" placeholder="₦100,000" className="w-full border border-gray-300 rounded p-2 text-sm" value={priceRange.max || ""} onChange={(e) => handlePriceRangeChange('max', e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1">
          {viewMode === "grid" ? <PropertyGrid properties={paginatedResults} /> : <PropertyList properties={paginatedResults} />}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-8">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="flex items-center gap-1 text-sm disabled:opacity-50"><ArrowLeft size={14} />Previous</button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-md text-sm ${currentPage === i + 1 ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}>{i + 1}</button>
                ))}
              </div>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="flex items-center gap-1 text-sm disabled:opacity-50">Next<ArrowRight size={14} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

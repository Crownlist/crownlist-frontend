"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Grid,
  List,
  Heart,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Search,
  Check,
} from "lucide-react"
import { Select } from "../ui/select"

export default function PropertyPage() {
  // State to track the current view mode (grid or list)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  // State to track sort dropdown
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  // State to track selected sort option
  const [sortOption, setSortOption] = useState("All")
  // State to track which filters are expanded
  const [expandedFilters, setExpandedFilters] = useState<{ [key: string]: boolean }>({
    property: false, // Property type is expanded by default
    location: false, // Location is expanded by default
    seller: false, // Seller type is expanded by default
    price: false, // Price is expanded by default
  })
  // State for location search
  const [locationSearch, setLocationSearch] = useState("")
  // State for selected property types
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(["Student"])

  // Toggle filter expansion
  const toggleFilter = (filter: string) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }))
  }

  // Toggle property type selection
  const togglePropertyType = (type: string) => {
    if (selectedPropertyTypes.includes(type)) {
      setSelectedPropertyTypes((prev) => prev.filter((t) => t !== type))
    } else {
      setSelectedPropertyTypes((prev) => [...prev, type])
    }
  }

  // Sort options
  const sortOptions = ["All", "Newest first", "Lowest price", "Highest price"]

  // Property type options
  const propertyTypes = ["Student", "Personal", "Office"]

  // Location options
  const locations = ["Abuja", "Oyo", "Kwara", "Jos", "Lagos", "Ibadan", "Port Harcourt", "Kano", "Enugu", "Kaduna"]

  // Toggle sort dropdown
  const toggleSortDropdown = () => {
    setSortDropdownOpen(!sortDropdownOpen)
  }

  // Handle sort option selection
  const handleSortOptionSelect = (option: string) => {
    setSortOption(option)
    setSortDropdownOpen(false)
  }

 // Sample property data
 const properties = [
  {
    id: 1,
    title: "The Green hostel",
    description: "This product is perfect for your balcony or other smaller spaces since it can be easily folded",
    location: "Eleko",
    features: ["One room", "Gate"],
    price: "₦95,232",
    image: "/cat1.png",
  },
  {
    id: 2,
    title: "St Andrews Glasgow Green",
    description: "A corner, a nook or even part of a passage can be a well-equipped, comfortable place for a few ...",
    location: "Poly gate",
    features: ["Room & parlor", "24hrs solar"],
    price: "₦595,232",
    image: "/cat2.png",
  },
  {
    id: 3,
    title: "The Green hostel",
    description: "This product is perfect for your balcony or other smaller spaces since it can be easily folded",
    location: "Eleko",
    features: ["One room", "Gate"],
    price: "₦95,232",
    image: "/cat3.png",
  },
  {
    id: 4,
    title: "St Andrews Glasgow Green",
    description: "A corner, a nook or even part of a passage can be a well-equipped, comfortable place for a few ...",
    location: "Poly gate",
    features: ["Room & parlor", "24hrs solar"],
    price: "₦595,232",
    image: "/cat4.png",
  },
  {
    id: 5,
    title: "The Green hostel",
    description: "This product is perfect for your balcony or other smaller spaces since it can be easily folded",
    location: "Eleko",
    features: ["One room", "Gate"],
    price: "₦95,232",
    image: "/cat1.png",
  },
  {
    id: 6,
    title: "St Andrews Glasgow Green",
    description: "A corner, a nook or even part of a passage can be a well-equipped, comfortable place for a few ...",
    location: "Poly gate",
    features: ["Room & parlor", "24hrs solar"],
    price: "₦595,232",
    image: "/cat3.png",
  },
  {
    id: 7,
    title: "The Green hostel",
    description: "This product is perfect for your balcony or other smaller spaces since it can be easily folded",
    location: "Eleko",
    features: ["One room", "Gate"],
    price: "₦95,232",
    image: "/cat2.png",
  },
  {
    id: 8,
    title: "St Andrews Glasgow Green",
    description: "A corner, a nook or even part of a passage can be a well-equipped, comfortable place for a few ...",
    location: "Poly gate",
    features: ["Room & parlor", "24hrs solar"],
    price: "₦595,232",
    image: "/cat4.png",
  },
]

  // Filter locations based on search
  const filteredLocations = locations.filter((location) =>
    location.toLowerCase().includes(locationSearch.toLowerCase()),
  )

  return (
    <div className=" mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <ChevronRight size={16} />
        <span className="text-gray-700">Property</span>
      </div>

      {/* Search Results Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-medium">
          Search results - Property<span className="text-gray-500">(318321 result found)</span>
        </h1>
        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-sm relative">
            <span className="text-gray-500">Sort by:</span>
            <button className="font-medium flex items-center gap-1" onClick={toggleSortDropdown}>
              {sortOption}
              <ChevronDown size={14} className="ml-1" />
            </button>

            {/* Sort Options Dropdown */}
            {sortDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white shadow-md rounded-md z-10 w-36 py-1">
                {sortOptions.map((option) => (
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
          <div className="flex items-center gap-2">
            <button
              className={`p-1 rounded ${viewMode === "grid" ? "bg-gray-100" : ""}`}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              className={`p-1 rounded ${viewMode === "list" ? "bg-gray-100" : ""}`}
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar */}
        <div className="w-full md:w-[220px] shrink-0">
          {/* Filter Sections */}
          <div className="space-y-4">
            {/* Property Type */}
            <div className="border-b pb-4">
              <button
                className="flex items-center justify-between w-full text-left mb-4"
                onClick={() => toggleFilter("property")}
              >
                <span className="font-medium">
                  Category
                  <span className="text-gray-400 pl-1">(1)</span>
                </span>
                {expandedFilters.property ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {/* Property Type Dropdown Content */}
              {expandedFilters.property && (
                <div className="space-y-2">
                  {propertyTypes.map((type) => (
                    <div key={type} className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded flex items-center justify-center ${
                          selectedPropertyTypes.includes(type) ? "bg-green-500 text-white" : "border border-gray-300"
                        }`}
                        onClick={() => togglePropertyType(type)}
                      >
                        {selectedPropertyTypes.includes(type) && <Check size={12} />}
                      </div>
                      <label className="text-sm cursor-pointer" onClick={() => togglePropertyType(type)}>
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location */}
            <div className="border-b pb-4">
              <button
                className="flex items-center justify-between w-full text-left mb-4"
                onClick={() => toggleFilter("location")}
              >
                <span className="font-medium">Location</span>
                {expandedFilters.location ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {/* Location Dropdown Content */}
              {expandedFilters.location && (
                <div className="space-y-3">
                  {/* Location Search */}
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
                    <button className="bg-[#1F058F] hover:bg-[#2a0bc0] text-white px-4 py-1.5 text-sm">Search</button>
                  </div>

                  {/* Location Checkboxes */}
                  <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2">
                    {filteredLocations.map((location) => (
                      <div key={location} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`location-${location}`}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor={`location-${location}`} className="text-sm">
                          {location}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Seller Type */}
            <div className="border-b pb-4">
              <button
                className="flex items-center justify-between w-full text-left mb-4"
                onClick={() => toggleFilter("seller")}
              >
                <span className="font-medium">Seller type</span>
                {expandedFilters.seller ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {/* Seller Type Dropdown Content */}
              {expandedFilters.seller && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="verified" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="verified" className="text-sm">
                      Verified <span className="text-gray-400">(1,293 post)</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="unverified" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="unverified" className="text-sm">
                      Unverified <span className="text-gray-400">(593 post)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="border-b pb-4">
              <button
                className="flex items-center justify-between w-full text-left mb-4"
                onClick={() => toggleFilter("price")}
              >
                <span className="font-medium">Price</span>
                {expandedFilters.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {/* Price Dropdown Content */}
              {expandedFilters.price && (
                <div className="space-y-4">
                  {/* Min-Max Inputs */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-sm text-gray-500 mb-1 block">Min</label>
                      <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm" />
                    </div>
                    <div className="pt-6">→</div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-500 mb-1 block">Max</label>
                      <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm" />
                    </div>
                  </div>

                  {/* Price Range Checkboxes */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="under20k" className="h-4 w-4 rounded border-gray-300" />
                      <label htmlFor="under20k" className="text-sm">
                        Under ₦20K <span className="text-gray-400">(1,293 post)</span>
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="n20-n110k" className="h-4 w-4 rounded border-gray-300" />
                      <label htmlFor="n20-n110k" className="text-sm">
                        ₦20 - ₦1,10K <span className="text-gray-400">(73,448 post)</span>
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="n110k-n11m" className="h-4 w-4 rounded border-gray-300" />
                      <label htmlFor="n110k-n11m" className="text-sm">
                        ₦1,10K - ₦11M <span className="text-gray-400">(22,414 post)</span>
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="n11m-n54m" className="h-4 w-4 rounded border-gray-300" />
                      <label htmlFor="n11m-n54m" className="text-sm">
                        ₦11M - ₦54M <span className="text-gray-400">(76,509 post)</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - Property Grid or List */}
        <div className="flex-1">
          {viewMode === "grid" ? (
            // Grid View (2 columns)
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="border rounded-lg overflow-hidden">
                   <Link href={'/product'}>
                  {/* Property Image */}
                  <div className="relative h-[200px]">
                    <Image
                      src={property.image || "/placeholder.svg"}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                    <button className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md">
                      <Heart size={18} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Property Details */}
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-1">{property.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{property.description}</p>

                    {/* Property Features */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <MapPin size={14} />
                        <span>{property.location}</span>
                      </div>

                      {property.features.map((feature, index) => (
                        <div key={index} className="text-gray-500 text-sm">
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="font-medium">{property.price}</div>
                  </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            // List View (1 property per row)
            <div className="space-y-6">
              {properties.map((property) => (
                <div key={property.id} className="border rounded-lg overflow-hidden flex flex-col md:flex-row">
                  {/* Property Image */}
                  <div className="relative h-[200px] md:h-auto md:w-[300px] flex-shrink-0">
                    <Image
                      src={property.image || "/placeholder.svg"}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                    <button className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md">
                      <Heart size={18} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Property Details */}
                  <div className="p-4 flex-1">
                    <h3 className="font-medium text-lg mb-1">{property.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{property.description}</p>

                    {/* Property Features */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <MapPin size={14} />
                        <span>{property.location}</span>
                      </div>

                      {property.features.map((feature, index) => (
                        <div key={index} className="text-gray-500 text-sm">
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="font-medium">{property.price}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-gray-500 text-sm">
                <ArrowLeft size={14} />
                Previous
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="h-8 w-8 flex items-center justify-center rounded-md bg-gray-100">1</button>
              <button className="h-8 w-8 flex items-center justify-center rounded-md">2</button>
              <button className="h-8 w-8 flex items-center justify-center rounded-md">3</button>
              <span>...</span>
              <button className="h-8 w-8 flex items-center justify-center rounded-md">8</button>
              <button className="h-8 w-8 flex items-center justify-center rounded-md">9</button>
              <button className="h-8 w-8 flex items-center justify-center rounded-md">10</button>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-gray-500 text-sm">
                Next
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex justify-end items-center mt-4 text-sm text-gray-500">
            <span>Showing</span>
            <Select 
            // className="mx-2 border rounded px-1"
            >
              <option>8</option>
              <option>16</option>
              <option>24</option>
            </Select>
            <span>of 50</span>
          </div>
        </div>
      </div>
    </div>
  )
}


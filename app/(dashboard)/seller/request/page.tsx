"use client"
import CategoryModal from "@/components/Home/CategoryModal" 
import { AlignJustify, ChevronDown, LayoutGrid, SlidersHorizontal } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function AnalyticsPage() {
    const[openCat, setOpenCat] = useState(false)

    const handleCat = () => {
        setOpenCat(true)
    }

    return (
        <div className="p-4 md:p-6 flex flex-col w-full h-full">
            <div className="w-full mx-auto">    
                {/* Header Section - Responsive */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
                    {/* Title Section */}
                    <div className="flex-1">
                        <h1 className="text-xl md:text-2xl font-bold mb-1">Request</h1>
                        <p className="text-gray-600 text-sm md:text-base">Keep track and manage your product request</p>
                    </div>

                    {/* Controls Section - Responsive */}
                    <div className="flex flex-row max-sm:justify-end sm:flex-row gap-3 sm:gap-4 lg:gap-7 items-center sm:items-center">
                        {/* Category Filter */}
                        <div className="flex items-center gap-2 border-r-2 pr-3 sm:pr-5 ">
                            <LayoutGrid size={16} className="md:w-[18px] md:h-[18px]" />
                            <button className="text-sm md:text-base font-medium"
                             onClick={handleCat}
                            >
                                Category
                            </button>
                        </div>

                        {/* Sort By */}
                        <div className="flex items-center gap-2 border-r-2 pr-3 sm:pr-5">
                            <SlidersHorizontal size={16} className="md:w-[18px] md:h-[18px]"/>
                            <span className="text-sm md:text-base">Sort by:</span>
                            <button className="flex">
                                <ChevronDown size={12} className="md:w-[14px] md:h-[14px]" />
                            </button>
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-2 sm:gap-6 ">
                            <button className="flex bg-[#EDE9FF] p-1 rounded">
                                <LayoutGrid size={18} className="md:w-[20px] md:h-[20px]" color="#1F058F" />
                            </button>
                            <button className="flex p-1 rounded hover:bg-gray-100">
                                <AlignJustify size={18} className="md:w-[20px] md:h-[20px]" />
                            </button>
                        </div>

                        {/* Add Request Button */}
                        {/* <button
                            onClick={() => setShowRequestForm(true)}
                            className="flex items-center gap-2 bg-[#1F058F] text-white px-4 py-2 rounded-lg hover:bg-[#1F058F]/90 transition-colors"
                        >
                            <Plus size={16} />
                            <span className="text-sm font-medium">Request Product</span>
                        </button> */}
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col h-full justify-center items-center">
                    <div className="mb-4 flex justify-center">
                        <Image
                            src={'/box.png'}
                            width={80}
                            height={80}
                            alt="box"
                        />
                    </div>

                    <h2 className="text-lg md:text-xl font-semibold mb-2 text-center">No product request</h2>
                    <p className="text-gray-500 mb-3 text-center text-sm md:text-base px-4">There&apos;s currently no product request to display</p>

                    <div className="mt-2 text-center text-gray-600 text-xs md:text-sm px-4">
                        <p>For further assistance reach out via our 24/7</p>
                        <p>
                            via email at{" "}
                            <a href="mailto:support@crownlist.com" className="text-[#1F058F]">
                                support@crownlist.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>

        {/* Modals */}
        <CategoryModal isOpen={openCat} onClose={() => setOpenCat(false)} />
        </div>
    )
}

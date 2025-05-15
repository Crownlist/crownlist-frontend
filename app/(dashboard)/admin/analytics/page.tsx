'use client'

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function AnalyticsPage() {
    const [activeTab, setActiveTab] = useState("details")
    console.log(setActiveTab)
    return (
        <div className="p-4 md:p-6 flex flex-col w-full  h-full">
            <div className=" w-full mx-auto">
                <h1 className="text-2xl font-bold mb-1 justify-start flex ">Analytics</h1>
                <p className="text-gray-600 mb-12">Keep track and manage your post</p>
                {/* Stats Cards */}
                <div className="mb-2 md:mb-3">
                    {/* Mobile - Horizontal Scroll */}
                    <div className="md:hidden flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                            <h3 className=" hover:text-white font-medium">Revenue</h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0.00</p>
                            <p className="text-[12px] font-extralight hover:text-white mt-1">0.0</p>
                        </div>

                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                            <h3 className=" hover:text-white font-medium">Listing</h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0.00</p>
                            <p className="text-[12px] font-extralight hover:text-white mt-1">0.0</p>
                        </div>

                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                            <h3 className=" hover:text-white font-medium">Users</h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0.00</p>
                            <p className="text-[12px] font-extralight hover:text-white mt-1">0.0</p>
                        </div>

                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                            <h3 className=" hover:text-white font-medium">Engagement</h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0.00</p>
                            <p className="text-[12px] font-extralight hover:text-white mt-1">0.0</p>
                        </div>

                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                            <h3 className=" hover:text-white font-medium">Paid plan</h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0.00</p>
                            <p className="text-[12px] font-extralight hover:text-white mt-1">0.0</p>
                        </div>
                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                            <h3 className=" hover:text-white font-medium">Free plan</h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0.00</p>
                            <p className="text-[12px] font-extralight hover:text-white mt-1">0.0</p>
                        </div>
                    </div>

                    {/* Desktop - Grid */}
                    <div className="hidden md:grid grid-cols-6 gap-6 md:gap-0">
                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg  rounded-r-none shadow-sm">
                            <h3 className="  font-medium">Revenue</h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0.00</p>
                            <p className="text-[12px] font-extralight hover:text-white mt-1">0.0</p>
                        </div>

                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-r-none rounded-l-none rounded-lg shadow-sm">
                            <h3 className=" hover:text-white font-medium">Listing</h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0.00</p>
                            <p className="text-[12px] font-extralight hover:text-white mt-1">0.0</p>
                        </div>

                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-r-none rounded-l-none rounded-lg shadow-sm">
                            <h3 className=" hover:text-white font-medium">Users</h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0%</p>
                        </div>

                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm rounded-r-none rounded-l-none">
                            <h3 className=" hover:text-white font-medium">Engagement</h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0.00</p>
                            <p className="text-[12px] font-extralight hover:text-white mt-1">0.0</p>
                        </div>

                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg  rounded-r-none rounded-l-none shadow-sm">
                            <h3 className=" hover:text-white font-medium">Paid plan</h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0.00</p>
                            <p className="text-[12px] font-extralight hover:text-white mt-1">0.0</p>
                        </div>

                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg  rounded-l-none shadow-sm">
                            <h3 className=" hover:text-white font-medium">Free plan</h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0.00</p>
                            <p className="text-[12px] font-extralight hover:text-white mt-1">0.0</p>
                        </div>
                    </div>
                </div>
                {/* Tabs */}
                <div className="bg-[#f0eeff] rounded-full p-1 inline-flex mt-8  ">
                    <Link
                        href={`#`}
                        className={`px-6 py-2 rounded-full ${activeTab === "details" ? "bg-white text-[#1a0066] font-medium shadow-sm" : "text-gray-700 font-medium"
                            }`}
                    >
                        Listing
                    </Link>
                    <Link
                        href={`#`}
                        className={`px-6 py-2 rounded-full ${activeTab === "products" ? "bg-white text-[#1a0066] font-medium shadow-sm" : "text-gray-700 font-medium"
                            }`}
                    >
                        Paid plan
                    </Link>
                    <Link
                        href={`#`}
                        className={`px-6 py-2 rounded-full ${activeTab === "rating" ? "bg-white text-[#1a0066] font-medium shadow-sm" : "text-gray-700 font-medium"
                            }`}
                    >
                        Users
                    </Link>
                </div>


                <div className=" flex flex-col h-full  justify-center items-center">
                    <div className="mb-4 flex justify-center">
                        <Image
                            src={'/analytics.png'}
                            width={80}
                            height={80}
                            alt="box"
                        />
                    </div>

                    <h2 className="text-xl font-semibold mb-2">No post analysis</h2>
                    <p className="text-gray-500 mb-8">You currently have no post analysis to display</p>

                </div>
            </div>
        </div>
    )
}

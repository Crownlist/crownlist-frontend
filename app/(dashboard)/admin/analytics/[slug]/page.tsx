"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"
import {
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Area,
    CartesianGrid,
} from "recharts"
import Link from "next/link"

const data = [
    { name: "Jan", value: 450 },
    { name: "Feb", value: 400 },
    { name: "Mar", value: 550 },
    { name: "Apr", value: 600 },
    { name: "May", value: 750 },
    { name: "Jun", value: 850 },
    { name: "Jul", value: 750 },
    { name: "Aug", value: 800 },
    { name: "Sep", value: 750 },
    { name: "Oct", value: 850 },
    { name: "Nov", value: 900 },
    { name: "Dec", value: 1000 },
]

export default function AnalyticsPage() {
    const [activeTab, setActiveTab] = useState("listing")
    console.log(setActiveTab)
    return (
        <div className="p-4 md:p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold mb-1">Analytics</h1>
                <p className="text-sm text-gray-500">Keep track and manage your post</p>
            </div>

            {/* Metric Cards */}
            <div className="mb-8 overflow-x-auto p-3">
                <div className="flex md:grid md:grid-cols-5 gap-4 min-w-[640px] md:min-w-0">
                    {[
                        {
                            title: "Post",
                            value: "1,374,433",
                            change: "+1.3%",
                            color: "green",
                            icon: <ArrowUp className="h-4 w-4 ml-1" />,
                        },
                        {
                            title: "Reach",
                            value: "374,433",
                            change: "-1.5%",
                            color: "red",
                            icon: <ArrowDown className="h-4 w-4 ml-1" />,
                        },
                        {
                            title: "Click",
                            value: "374,433",
                            change: "0.0",
                            color: "gray",
                        },
                        {
                            title: "Refunded",
                            value: "$2,433.00",
                            change: "-1.5%",
                            color: "red",
                            icon: <ArrowDown className="h-4 w-4 ml-1" />,
                        },
                        {
                            title: "Cancelled",
                            value: "$74,433.00",
                            change: "-1.5%",
                            color: "red",
                            icon: <ArrowDown className="h-4 w-4 ml-1" />,
                        },
                    ].map((item, i) => (
                        <Card
                            key={i}
                            className="min-w-[200px] bg-white shadow-md rounded-xl flex-shrink-0"
                            
                        >
                            <CardContent className="p-6">
                                <div className="text-sm text-gray-500 mb-1">{item.title}</div>
                                <div className="text-2xl font-bold mb-1">{item.value}</div>
                                {item.color === "gray" ? (
                                    <div className="text-sm text-gray-400">{item.change}</div>
                                ) : (
                                    <div
                                        className={`flex items-center text-${item.color}-500 text-sm font-medium`}
                                    >
                                        <span>{item.change}</span>
                                        {item.icon}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>


            {/* Tabs and Chart */}
            <div className="w-full">
                {/* <div className="border-b mb-6">
                    <div className="flex space-x-6">
                        {["earnings", "products"].map((tab) => (
                            <button
                                key={tab}
                                className={`relative pb-2 text-sm font-medium ${activeTab === tab ? "text-black" : "text-gray-500"
                                    }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div> */}
                 {/* Tabs */}
                 <div className="bg-[#f0eeff] rounded-full p-1 inline-flex mt-4 mb-4 ">
                    <Link
                        href={`#`}
                        className={`px-6 py-2 rounded-full ${activeTab === "listing" ? "bg-white text-[#1a0066] font-medium shadow-sm" : "text-gray-700 font-medium"
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


                {/* {activeTab === "earnings" && ( */}
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data}
                                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                            >
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#6B7280", fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#6B7280", fontSize: 12 }}
                                    tickFormatter={(value) => `$${value}`}
                                    domain={[0, 1000]}
                                    ticks={[0, 200, 400, 600, 800, 1000]}
                                />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EEF2FF" stopOpacity={1} />
                                        <stop offset="95%" stopColor="#EEF2FF" stopOpacity={1} />
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="value" fill="url(#colorValue)" />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#4338CA"
                                    strokeWidth={2.5}
                                    dot={false}
                                    activeDot={{ r: 6, fill: "#4338CA", stroke: "white", strokeWidth: 2 }}
                                />
                                <Tooltip
                                    formatter={(value: number) => [`$${value}`, "Earnings"]}
                                    contentStyle={{
                                        backgroundColor: "white",
                                        borderRadius: "8px",
                                        border: "none",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                {/* )} */}

                {/* {activeTab === "products" && (
                    <div className="flex items-center justify-center h-[300px] text-gray-500">
                        No product data available
                    </div>
                )} */}
            </div>
        </div>
    )
}

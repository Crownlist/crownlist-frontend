/* eslint-disable */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
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
import { apiClientUser } from "@/lib/interceptor"
import { toast } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface MonthlyProduct {
    month: number
    monthName: string
    year: number
    count: number
    totalValue: number
    totalLikes: number
}

interface MonthlyPerformance {
    month: number
    monthName: string
    year: number
    totalLikes: number
    totalRatings: number
    averageRating: number
}

interface DashboardData {
    metrics: {
        totalProducts: number
        activeListings: number
        totalViews: number
        potentialEarnings: string
        subscriptionStatus: string
        subscriptionPlan: {
            name: string
            _id: string
            features: string[]
            amount: number
        }
    }
    analytics: {
        year: number
        monthlyProducts: MonthlyProduct[]
        monthlyPerformance: MonthlyPerformance[]
    }
    statusBreakdown: {
        live: number
        reviewing: number
        declined: number
        draft: number
    }
}

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("products")
    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const res = await apiClientUser.get("/sellers/dashboard")
            console.log('res', res.data)
            const data = res?.data
            setDashboardData(data)
        } catch (error: any) {
            console.error("Failed to fetch dashboard data:", error)
            toast.error("Failed to load analytics data")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!dashboardData) {
        return (
            <div className="p-6 flex justify-center items-center min-h-screen">
                <p className="text-gray-500">No data available</p>
            </div>
        )
    }

    const { metrics, analytics, statusBreakdown } = dashboardData

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
                    <p className="text-sm text-gray-500">Keep track and manage your products</p>
                </div>
                <Link href='/seller/product/post-product'>
                    <Button className="text-white bg-[#1F058F] hover:bg-gray-100 justify-start ">Add product</Button>
                </Link>
            </div>

            {/* Metric Cards */}
            <div className="mb-8 overflow-x-auto p-3">
                <div className="flex md:grid md:grid-cols-5 gap-4 min-w-[640px] md:min-w-0">
                    <Card className="min-w-[200px] bg-white shadow-md rounded-xl flex-shrink-0">
                        <CardContent className="p-6">
                            <div className="text-sm text-gray-500 mb-1">Total Products</div>
                            <div className="text-2xl font-bold mb-1">{metrics.totalProducts.toLocaleString()}</div>
                            <div className="text-sm text-gray-400">All time</div>
                        </CardContent>
                    </Card>

                    <Card className="min-w-[200px] bg-white shadow-md rounded-xl flex-shrink-0">
                        <CardContent className="p-6">
                            <div className="text-sm text-gray-500 mb-1">Active Listings</div>
                            <div className="text-2xl font-bold mb-1">{metrics.activeListings.toLocaleString()}</div>
                            <div className="text-sm text-green-500 flex items-center">
                                <span>Live products</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="min-w-[200px] bg-white shadow-md rounded-xl flex-shrink-0">
                        <CardContent className="p-6">
                            <div className="text-sm text-gray-500 mb-1">Total Views</div>
                            <div className="text-2xl font-bold mb-1">{metrics.totalViews.toLocaleString()}</div>
                            <div className="text-sm text-gray-400">Product views</div>
                        </CardContent>
                    </Card>

                    <Card className="min-w-[200px] bg-white shadow-md rounded-xl flex-shrink-0">
                        <CardContent className="p-6">
                            <div className="text-sm text-gray-500 mb-1">Potential Earnings</div>
                            <div className="text-2xl font-bold mb-1">₦{parseFloat(metrics.potentialEarnings).toLocaleString()}</div>
                            <div className="text-sm text-gray-400">Estimated value</div>
                        </CardContent>
                    </Card>

                    <Card className="min-w-[200px] bg-white shadow-md rounded-xl flex-shrink-0">
                        <CardContent className="p-6">
                            <div className="text-sm text-gray-500 mb-1">Subscription</div>
                            <div className="text-2xl font-bold mb-1 capitalize">{metrics.subscriptionStatus}</div>
                            <div className="text-sm text-gray-400">{metrics.subscriptionPlan?.name || "No plan"}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Status Breakdown */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Product Status</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4">
                            <div className="text-sm text-green-600 mb-1">Live</div>
                            <div className="text-2xl font-bold text-green-700">{statusBreakdown.live}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-yellow-50 border-yellow-200">
                        <CardContent className="p-4">
                            <div className="text-sm text-yellow-600 mb-1">Reviewing</div>
                            <div className="text-2xl font-bold text-yellow-700">{statusBreakdown.reviewing}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-red-50 border-red-200">
                        <CardContent className="p-4">
                            <div className="text-sm text-red-600 mb-1">Declined</div>
                            <div className="text-2xl font-bold text-red-700">{statusBreakdown.declined}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-50 border-gray-200">
                        <CardContent className="p-4">
                            <div className="text-sm text-gray-600 mb-1">Draft</div>
                            <div className="text-2xl font-bold text-gray-700">{statusBreakdown.draft}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>


            {/* Tabs and Chart */}
            <div className="w-full">
                <div className="border-b mb-6">
                    <div className="flex space-x-6">
                        {["products", "performance"].map((tab) => (
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
                </div>

                {activeTab === "products" && (
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={analytics.monthlyProducts.map(item => ({
                                    name: item.monthName.substring(0, 3),
                                    value: item.totalValue,
                                    count: item.count
                                }))}
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
                                    tickFormatter={(value) => `₦${value}`}
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
                                    formatter={(value: number, name: string) => {
                                        if (name === "value") return [`₦${value}`, "Total Value"]
                                        if (name === "count") return [value, "Products"]
                                        return [value, name]
                                    }}
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
                )}

                {activeTab === "performance" && (
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={analytics.monthlyPerformance.map(item => ({
                                    name: item.monthName.substring(0, 3),
                                    likes: item.totalLikes,
                                    ratings: item.totalRatings,
                                    avgRating: item.averageRating
                                }))}
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
                                />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <defs>
                                    <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FEE2E2" stopOpacity={1} />
                                        <stop offset="95%" stopColor="#FEE2E2" stopOpacity={1} />
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="likes" fill="url(#colorLikes)" />
                                <Line
                                    type="monotone"
                                    dataKey="likes"
                                    stroke="#DC2626"
                                    strokeWidth={2.5}
                                    dot={false}
                                    activeDot={{ r: 6, fill: "#DC2626", stroke: "white", strokeWidth: 2 }}
                                />
                                <Tooltip
                                    formatter={(value: number, name: string) => {
                                        if (name === "likes") return [value, "Total Likes"]
                                        if (name === "ratings") return [value, "Total Ratings"]
                                        if (name === "avgRating") return [value.toFixed(1), "Avg Rating"]
                                        return [value, name]
                                    }}
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
                )}
            </div>
        </div>
    )
}

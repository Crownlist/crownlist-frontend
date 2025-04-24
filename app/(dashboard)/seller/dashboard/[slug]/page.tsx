import Link from "next/link"
import Image from "next/image"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock data for products
const products = [
    {
        id: "1",
        title: "St Andrews Glasgow Green",
        description: "A corner, a nook or even part of a passage can be a well-equipped, comfortable place for a few ...",
        image: "/product1.png",
        status: "Live",
        featured: true,
    },
    {
        id: "2",
        title: "The Green hostel",
        description: "This product is perfect for your balcony or other smaller spaces since it can be easily folded",
        image: "/product4.png",
        status: "Reviewing",
        featured: true,
    },
    {
        id: "3",
        title: "SamsungGalaxy Note20 5G",
        description: "The Samsung Galaxy Note20 5G is a powerful phone as beautiful as it is intelligent with a mighty...",
        image: "/product3.png",
        status: "Live",
        featured: true,
    },
    {
        id: "4",
        title: "AMOLED Touch Screen Laptop",
        description: 'Copilot+ PC - 16" - Intel Core Ultra 7 - 16GB Memory - 1TB SSD - Gray',
        image: "/product2.png",
        status: "Decline",
        featured: false,
    },
    {
        id: "5",
        title: "DAMMÄNG",
        description: "The stackable bins help you save space and allow waste sorting to be part of the home interior",
        image: "/product5.png",
        status: "Live",
        featured: false,
    },
]

// Mock data for dashboard stats
const dashboardStats = {
    totalProducts: "1,374,433",
    avgImpression: "4,433",
    freePlan: "433",
    promotedProduct: "974,436",
}
// { params }: { params: { slug: string } }
export default function DashboardPage() {
    return (
        <div className="p-4 md:p-6">
            {/* Total Product Banner */}
            <div className="bg-[#1F058F] text-white p-6 rounded-lg mb-6 flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-medium">Total product</h2>
                    <p className="text-2xl md:text-3xl font-bold mt-1">{dashboardStats.totalProducts}</p>
                </div>
                <Button className="bg-white text-[#1F058F] hover:bg-gray-100">Add product</Button>
            </div>

            {/* Stats Cards */}

                {/* Desktop - Grid */}
                <div className="hidden md:grid grid-cols-3 gap-6 md:gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-gray-600 font-medium">Avg impression</h3>
                        <p className="text-2xl font-bold mt-1">{dashboardStats.avgImpression}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-gray-600 font-medium">Free plan</h3>
                        <p className="text-2xl font-bold mt-1">{dashboardStats.freePlan}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-gray-600 font-medium">Promoted product</h3>
                        <p className="text-2xl font-bold mt-1">{dashboardStats.promotedProduct}</p>
                    </div>
                </div>
            {/* Mobile - Horizontal Scroll */}
            <div className="md:hidden flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
                <div className="bg-white p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                    <h3 className="text-gray-600 font-medium">Avg impression</h3>
                    <p className="text-2xl font-bold mt-1">{dashboardStats.avgImpression}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                    <h3 className="text-gray-600 font-medium">Free Plan</h3>
                    <p className="text-2xl font-bold mt-1">{dashboardStats.freePlan}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                    <h3 className="text-gray-600 font-medium">Promoted product</h3>
                    <p className="text-2xl font-bold mt-1">{dashboardStats.promotedProduct}</p>
                </div>
            </div>

            {/* Recent Products Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Recent product</h3>
                    <Link href="/dashboard/all-products" className="text-[#1F058F] text-sm hover:underline">
                        See all
                    </Link>
                </div>

                <div className="space-y-4">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                                <div className="relative md:w-84 h-48 md:h-auto">
                                    <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
                                    {product.featured && (
                                        <div className="absolute top-0 left-0 bg-[#1F058F] text-white text-xs font-medium px-2 py-1">
                                            Featured
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 p-4 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-base  font-semibold mb-1">{product.title}</h4>
                                        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span
                                                className={`inline-block px-3 py-1 text-xs rounded-full ${product.status === "Live"
                                                        ? "bg-green-100 text-green-800"
                                                        : product.status === "Reviewing"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {product.status}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-600">
                                                <Pencil className="h-4 w-4" />
                                                <span>Edit</span>
                                            </Button>
                                            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-600">
                                                <Trash2 className="h-4 w-4" />
                                                <span>Delete</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

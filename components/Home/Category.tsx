"use client"


import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"

// const categories1 = [
//     { name: 'Properties', posts: '2,392,915', icon: '🏠' },
//     { name: 'Phone and tablets', posts: '8,238', icon: '💻' },
//     { name: 'Fashion', posts: '8,238', icon: '👜' },
//     { name: 'Electronics', posts: '8,238', icon: '🔌' },
//     { name: 'Cars', posts: '0', icon: '🚗', status: 'Coming soon' },
//     { name: 'Jobs', posts: '0', icon: '💼', status: 'Coming soon' },
//     { name: 'Services', posts: '0', icon: '🔧', status: 'Coming soon' },
//   ];


const categories = [
    { name: "Phones & Tablets", icon: "💻", hot: true },
    { name: "Electronics", icon: "🔌", hot: true },
    { name: "Cars", icon: "🚗", hot: true },
    { name: "Properties", icon: "🏠", hot: true },
    { name: "Fashion", icon: "👜" },
    { name: "Jobs", icon: "💼" },
    { name: "Services", icon: "🔧" },
]

export default function CategoryGrid() {
    const pathname = usePathname()

    return (
        <div className="py-5   mx-auto justify-center  sticky inset-18 z-[9]">
            <div className="text-black font-semibold text-lg  mb-5">Category Picks</div>
            {/* <div className="flex flex-wrap justify-center md:justify-start gap-x-2 md:gap-x-4 gap-y-8"> */}
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 justify-center items-center">
                {categories.map((cat) => {
                    const isActive = pathname === "/product" // Change logic if needed
                    return (
                        <Link
                            key={cat.name}
                            href="/product"
                            className={clsx(
                                "w-20 flex flex-col items-center text-center relative group transition-all hover:scale-105",
                                isActive && cat.name === "Health & Beauty" && "bg-blue-100 rounded-xl py-1"
                            )}
                        >
                            <div className="relative w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shadow-sm">
                                {/* <Image src={cat.icon} alt={cat.name} width={36} height={36} /> */}
                                <span className="text-2xl">{cat.icon}</span>
                                {cat.hot && (
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold shadow">
                                        Hot
                                    </span>
                                )}
                            </div>
                            <p className="text-xs mt-2">{cat.name}</p>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

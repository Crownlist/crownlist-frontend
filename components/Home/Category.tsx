"use client"


import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import Image from "next/image"

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
    { name: "Phones & Tablets", icon: "/video.png", hot: true },
    { name: "Electronics", icon: "/lab-scale.png", hot: true },
    { name: "Properties", icon: "/protection.png", hot: true },
    { name: "Fashion", icon: "/dress.png" },
    { name: "Cars", icon: "/car.png", isComingSoon: true },
    { name: "Jobs", icon: "/new-job.png", isComingSoon: true },
    { name: "Services", icon: "/service.png", isComingSoon: true },
]

export default function CategoryGrid() {
    const pathname = usePathname()

    return (
        <div className="py-5   mx-auto justify-center  sticky inset-18 z-[9]">
            <div className="text-black font-semibold text-lg  mb-5">Category Picks</div>
            {/* <div className="flex flex-wrap justify-center md:justify-start gap-x-2 md:gap-x-4 gap-y-8"> */}
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 justify-center items-start">
                {categories.map((cat) => {
                    const isActive = pathname === "/product" // Change logic if needed
                    return (
                        <Link
                            key={cat.name}
                            href={`${cat.isComingSoon ? '#' : '/product'}`}
                            className={clsx(
                                "w-20 flex flex-col items-center text-center relative group transition-all hover:scale-105",
                                isActive && cat.name === "Health & Beauty" && "bg-blue-100 rounded-xl py-1"
                            )}
                        >
                            <div className="relative w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shadow-sm">
                                <Image src={cat.icon} alt={cat.name} width={38} height={38} />
                                {/* <span className="text-3xl">{cat.icon}</span> */}
                                {!cat.hot && (
                                    <span className="absolute -top-2 -right-5 bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold shadow">
                                        Coming soon.
                                    </span>
                                )}
                                {/* {cat.isComingSoon && (
                                    <div className="absolute z-10 w-max top-full mt-2 left-1/2 -translate-x-1/2 rounded bg-black text-white text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        Coming soon
                                    </div>
                                )} */}
                            </div>
                            <p className="text-xs mt-2">{cat.name}</p>
                        </Link>
                    )

                })}

            </div>
        </div>
    )
}

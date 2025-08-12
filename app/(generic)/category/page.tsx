
"use client"


import { useState } from "react"
import Footer from "@/components/Footer"
import Header from "@/components/Header1"
import Image from "next/image"
import Link from "next/link"


// type Category = {
//   name: string
//   icon: string
//   hot: boolean
//   href: string
//   subcategories: { name: string; href: string }[]
// }

export default function CategoryPage() {

  const [searchQuery, setSearchQuery] = useState("")
  const matchesSearch = (name: string) =>
  name.toLowerCase().includes(searchQuery.toLowerCase())




  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header hidden={false} />
      <div className="container mx-auto  py-6 max-md:px-5">

         <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />


        <div className=" bg-white">
          <div className="max-w-[1200px] mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Banner */}
              <div className="md:w-[40%]">
                <div className="relative w-full h-[320px] rounded-lg overflow-hidden">
                  <Image src="/cat2.png" alt="Safety guide" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-end">
                    <h2 className="text-white text-md font-medium p-6">Discover more from our safety guide</h2>
                  </div>
                </div>
              </div>

              {/* Right Categories */}
              <div className="md:w-[60%]">
                <div className="flex flex-col md:flex-row w-full justify-between gap-3">
                  {/* Property Column */}
                  <div className="flex flex-row  w-full justify-around gap-3 ">
                  <div className="space-y-5">
                    <h3 className="text-lg font-medium text-gray-800">Property</h3>
                    <div className="space-y-4">
                {[
                  { name: "Student", url: "/property?type=student" },
                  { name: "Personal", url: "/property?type=personal" },
                  { name: "Office", url: "/property?type=office" },
                ]
                  .filter(item => matchesSearch(item.name))
                  .map(item => (
                    <Link
                      key={item.name}
                      href={item.url}
                      className="block text-gray-600 hover:text-gray-900"
                    >
                      {item.name}
                          </Link>
                        ))}
                </div>
                  </div>

                  {/* Phone and tablets Column */}
                  <div className="space-y-5">
                    <h3 className="text-lg font-medium text-gray-800">Phone and tablets</h3>
                    <div className="space-y-4">
                       {[
                          { name: "Mobile phone", url: "/phone-tablets?type=mobile" },
                          { name: "Accessories", url: "/phone-tablets?type=accessories" },
                          { name: "Tablets", url: "/phone-tablets?type=tablets" },
                          { name: "Smart watches", url: "/phone-tablets?type=watches" },
                        ]
                          .filter(item => matchesSearch(item.name))
                          .map(item => (
                            <Link
                              key={item.name}
                              href={item.url}
                              className="block text-gray-600 hover:text-gray-900"
                            >
                              {item.name}
                            </Link>
                          ))}
                    </div>
                  </div>
                  </div>

                  <div className="flex flex-row  w-full justify-around gap-3">
                  {/* Fashion Column */}

                  <div className="space-y-5">
                    <h3 className="text-lg font-medium text-gray-800">Fashion</h3>
                    <div className="space-y-4">
                      {[
                          { name: "Bags", url: "/fashion?type=bags" },
                          { name: "Clothes", url: "/fashion?type=clothes" },
                          { name: "Jewelry", url: "/fashion?type=jewelry" },
                          { name: "Shoes", url: "/fashion?type=shoes" },
                        ]
                          .filter(item => matchesSearch(item.name))
                          .map(item => (
                            <Link
                              key={item.name}
                              href={item.url}
                              className="block text-gray-600 hover:text-gray-900"
                            >
                              {item.name}
                            </Link>
                          ))}
                    </div>
                  </div>

                  {/* Electronics Column */}
                  <div className="space-y-5">
                    <h3 className="text-lg font-medium text-gray-800">Electronics</h3>
                    <div className="space-y-4">
                     {[
                          { name: "Hardware", url: "/electronics?type=hardware" },
                          { name: "Monitors", url: "/electronics?type=monitors" },
                          { name: "Laptops", url: "/electronics?type=laptops" },
                          { name: "Headphones", url: "/electronics?type=headphones" },
                          { name: "Music equipment", url: "/electronics?type=music" },
                          { name: "Cameras", url: "/electronics?type=cameras" },
                        ]
                          .filter(item => matchesSearch(item.name))
                          .map(item => (
                            <Link
                              key={item.name}
                              href={item.url}
                              className="block text-gray-600 hover:text-gray-900"
                            >
                              {item.name}
                            </Link>
                          ))}
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}


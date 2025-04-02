import Footer from "@/components/Footer"
import Header from "@/components/Header"
import Image from "next/image"
import Link from "next/link"

export default function CategoryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header hidden={false} />
      <div className="container mx-auto  py-6 max-md:px-5">
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
                  <div className="flex flex-row  w-full justify-around ">
                  <div className="space-y-5">
                    <h3 className="text-lg font-medium text-gray-800">Property</h3>
                    <div className="space-y-4">
                      <Link href="/property?type=student" className="block text-gray-600 hover:text-gray-900">
                        Student
                      </Link>
                      <Link href="/property?type=personal" className="block text-gray-600 hover:text-gray-900">
                        Personal
                      </Link>
                      <Link href="/property?type=office" className="block text-gray-600 hover:text-gray-900">
                        Office
                      </Link>
                    </div>
                  </div>

                  {/* Phone and tablets Column */}
                  <div className="space-y-5">
                    <h3 className="text-lg font-medium text-gray-800">Phone and tablets</h3>
                    <div className="space-y-4">
                      <Link href="/phone-tablets?type=mobile" className="block text-gray-600 hover:text-gray-900">
                        Mobile phone
                      </Link>
                      <Link href="/phone-tablets?type=accessories" className="block text-gray-600 hover:text-gray-900">
                        Accessories
                      </Link>
                      <Link href="/phone-tablets?type=tablets" className="block text-gray-600 hover:text-gray-900">
                        Tablets
                      </Link>
                      <Link href="/phone-tablets?type=watches" className="block text-gray-600 hover:text-gray-900">
                        Smart watches
                      </Link>
                    </div>
                  </div>
                  </div>

                  <div className="flex flex-row  w-full justify-around">
                  {/* Fashion Column */}

                  <div className="space-y-5">
                    <h3 className="text-lg font-medium text-gray-800">Fashion</h3>
                    <div className="space-y-4">
                      <Link href="/fashion?type=bags" className="block text-gray-600 hover:text-gray-900">
                        Bags
                      </Link>
                      <Link href="/fashion?type=clothes" className="block text-gray-600 hover:text-gray-900">
                        Clothes
                      </Link>
                      <Link href="/fashion?type=jewelry" className="block text-gray-600 hover:text-gray-900">
                        Jewelry
                      </Link>
                      <Link href="/fashion?type=shoes" className="block text-gray-600 hover:text-gray-900">
                        Shoes
                      </Link>
                    </div>
                  </div>

                  {/* Electronics Column */}
                  <div className="space-y-5">
                    <h3 className="text-lg font-medium text-gray-800">Electronics</h3>
                    <div className="space-y-4">
                      <Link href="/electronics?type=hardware" className="block text-gray-600 hover:text-gray-900">
                        Hardware
                      </Link>
                      <Link href="/electronics?type=monitors" className="block text-gray-600 hover:text-gray-900">
                        Monitors
                      </Link>
                      <Link href="/electronics?type=laptops" className="block text-gray-600 hover:text-gray-900">
                        Laptops
                      </Link>
                      <Link href="/electronics?type=headphones" className="block text-gray-600 hover:text-gray-900">
                        Headphones
                      </Link>
                      <Link href="/electronics?type=music" className="block text-gray-600 hover:text-gray-900">
                        Music equipment
                      </Link>
                      <Link href="/electronics?type=cameras" className="block text-gray-600 hover:text-gray-900">
                        Cameras
                      </Link>
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


import { Button } from "@/components/ui/button"
import {
  AlignJustify,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  SlidersHorizontal,
  MessageCircle,
} from "lucide-react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AnalyticsPage() {
  const products = [
    {
      id: 1,
      image: "/product5.png",
      description: "This product is perfect for your balcony or other smaller spaces since it can be easily folded",
      seller: {
        name: "Jimoh Abubakri",
        phone: "081 0000 0000",
        avatar: "/profile.png",
      },
    },
    {
      id: 2,
      image: "/hanger.png",
      description: "A corner, a nook or even part of a passage can be a well-equipped, comfortable place for a few ...",
      seller: {
        name: "Abubakri Adesina",
        phone: "081 0000 0000",
        avatar: "/profile.png",
      },
    },
    {
      id: 3,
      image: "/product1.png",
      description: "This product is perfect for your balcony or other smaller spaces since it can be easily folded",
      seller: {
        name: "Abubakri Adesina",
        phone: "081 0000 0000",
        avatar: "/profile.png",
      },
    },
    {
      id: 4,
      image: "/product2.png",
      description: "A corner, a nook or even part of a passage can be a well-equipped, comfortable place for a few ...",
      seller: {
        name: "Jimoh Abubakri",
        phone: "081 0000 0000",
        avatar: "/profile.png",
      },
    },
  ]

  return (
    <div className="p-4 md:p-6 flex flex-col w-full h-full">
      <div className="w-full mx-auto">
        <div className="flex flex-row justify-between mx-auto items-center align-middle">
          <div>
            <h1 className="text-2xl font-bold mb-1 justify-start flex">Request</h1>
            <p className="text-gray-600 mb-12">Keep track and manage your product request</p>
          </div>
          <div className="flex flex-row gap-7 items-center align-middle pr-5 max-md:hidden">
            <div className="flex flex-row gap-2 items-center border-r-2 px-5">
              <LayoutGrid size={18} />
              <button className="flex">Category</button>
            </div>
            <div className="flex flex-row gap-2 items-center border-r-2 px-5">
              <SlidersHorizontal size={18} />
              <span>Sort by:</span>
              <button className="flex">
                <ChevronDown size={14} />
              </button>
            </div>
            <div className="flex flex-row gap-6 items-center">
              <button className="flex bg-[#EDE9FF] p-2 rounded">
                <LayoutGrid size={20} color="#1F058F" />
              </button>
              <button className="flex p-2">
                <AlignJustify size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {products.map((product) => (
            <Card key={product.id} className=" shadow-none">
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative ">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt="Product"
                    width={900}
                    height={900}
                    className="w-full h-70 object-cover rounded-t-lg bg-[#FAFAFA]"
                  />
                </div>

                {/* Product Description */}
                <div className="p-4">
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">{product.description}</p>

                  {/* Seller Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={product.seller.avatar || "/placeholder.svg"} alt={product.seller.name} />
                        <AvatarFallback className="text-xs">
                          {product.seller.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{product.seller.name}</p>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-gray-600">{product.seller.phone}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="lg" className="bg-whiter border-[#1F058F]  hover:bg-[#1F058F] text-[#1F058F] hover:text-white border-1 rounded-full">
                      Contact
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-500">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              <Button variant="default" size="sm" className="w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700">
                1
              </Button>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-600">
                2
              </Button>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-600">
                3
              </Button>
              <span className="text-gray-400 px-2">...</span>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-600">
                8
              </Button>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-600">
                9
              </Button>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-600">
                10
              </Button>
            </div>

            <Button variant="ghost" size="sm" className="text-gray-500">
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Showing</span>
            <Select defaultValue="5">
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
            <span>of 50</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// import { Button } from "@/components/ui/button"
// import { AlignJustify, Check, ChevronDown, ChevronLeft, ChevronRight, Grid, LayoutGrid, List, SlidersHorizontal } from "lucide-react"
// import Image from "next/image"
// import Link from "next/link"
// import { Card, CardContent, CardFooter } from '@/components/ui/card';

// export default function AnalyticsPage() {
//     return (
//         <div className="p-4 md:p-6 flex flex-col w-full  h-full">
//             <div className=" w-full mx-auto">
//                 <div className="flex  flex-row  justify-between mx-auto items-center align-middle">
//                     <div>
//                         <h1 className="text-2xl font-bold mb-1 justify-start flex ">Request</h1>
//                         <p className="text-gray-600 mb-12">Keep track and manage your product request</p>
//                     </div>
//                     <div className=" flex flex-row  gap-7  items-center align-middle pr-5 max-md:hidden">
//                         <div className="flex flex-row gap-2 items-center border-r-2 px-5 ">
//                             <LayoutGrid size={18} />
//                             <button className="flex ">
//                                 Category
//                             </button>
//                         </div>
//                         <div className="flex flex-row gap-2 items-center border-r-2 px-5">
//                             <SlidersHorizontal size={18} />
//                             <span>Sort by:</span>
//                             <button className="flex ">
//                                 <ChevronDown size={14} />
//                             </button>
//                         </div>
//                         <div className="flex flex-row gap-6 items-center ">
//                             <button className="flex bg-[#EDE9FF]">
//                                 <LayoutGrid size={20} color="#1F058F" />
//                             </button>
//                             <button className="flex ">
//                                 <AlignJustify size={20} />
//                             </button>
//                         </div>

//                     </div>
//                 </div>
//                 <div className="space-y-4 grid grid-cols-2 gap-3">
//                     {/* Card 1 */}
//                     <Card className="">
//                         <CardContent className="p-4">
//                             <p className="text-gray-700 mb-3">
//                                 This product is perfect for your balcony or other smaller spaces since it can be easily folded
//                             </p>
//                         </CardContent>
//                         <CardFooter className="flex justify-between items-center p-4 pt-0">
//                             <div>
//                                 <p className="font-semibold">Jimoh Abubakri</p>
//                                 <p className="text-gray-500 text-sm">081 0000 0000</p>
//                             </div>
//                             <Button size="sm">Contact</Button>
//                         </CardFooter>
//                     </Card>

//                     {/* Card 2 */}
//                     <Card className="">
//                         <CardContent className="p-4">
//                             <p className="text-gray-700 mb-3">
//                                 A corner, a nook or even part of a passage can be a well-equipped, comfortable place for a few ...
//                             </p>
//                         </CardContent>
//                         <CardFooter className="flex justify-between items-center p-4 pt-0">
//                             <div>
//                                 <p className="font-semibold">Abubakri Adesina</p>
//                                 <p className="text-gray-500 text-sm">081 0000 0000</p>
//                             </div>
//                             <Button size="sm">Contact</Button>
//                         </CardFooter>
//                     </Card>

//                     {/* Card 3 */}
//                     <Card className="">
//                         <CardContent className="p-4">
//                             <p className="text-gray-700 mb-3">
//                                 This product is perfect for your balcony or other smaller spaces since it can be easily folded
//                             </p>
//                         </CardContent>
//                         <CardFooter className="flex justify-between items-center p-4 pt-0">
//                             <div>
//                                 <p className="font-semibold">Abubakri Adesina</p>
//                                 <p className="text-gray-500 text-sm">081 0000 0000</p>
//                             </div>
//                             <Button size="sm">Contact</Button>
//                         </CardFooter>
//                     </Card>

//                     {/* Card 4 */}
//                     <Card className="">
//                         <CardContent className="p-4">
//                             <p className="text-gray-700 mb-3">
//                                 A corner, a nook or even part of a passage can be a well-equipped, comfortable place for a few ...
//                             </p>
//                         </CardContent>
//                         <CardFooter className="flex justify-between items-center p-4 pt-0">
//                             <div>
//                                 <p className="font-semibold">Jimoh Abubakri</p>
//                                 <p className="text-gray-500 text-sm">081 0000 0000</p>
//                             </div>
//                             <Button size="sm">Contact</Button>
//                         </CardFooter>
//                     </Card>
//                 </div>

//                 {/* Pagination */}
//                 <div className="flex flex-col items-center mt-8">
//                     <div className="flex items-center space-x-1">
//                         <Button variant="ghost" size="sm">
//                             <ChevronLeft className="h-4 w-4" />
//                             <span className="sr-only">Previous</span>
//                         </Button>

//                         <Button variant="ghost" size="sm">
//                             1
//                         </Button>
//                         <Button variant="ghost" size="sm">
//                             2
//                         </Button>
//                         <Button variant="ghost" size="sm">
//                             3
//                         </Button>

//                         <span className="px-2">...</span>

//                         <Button variant="ghost" size="sm">
//                             8
//                         </Button>
//                         <Button variant="ghost" size="sm">
//                             9
//                         </Button>
//                         <Button variant="ghost" size="sm">
//                             10
//                         </Button>

//                         <Button variant="ghost" size="sm">
//                             <ChevronRight className="h-4 w-4" />
//                             <span className="sr-only">Next</span>
//                         </Button>
//                     </div>

//                     <div className="mt-4 text-sm text-gray-500 flex items-center">
//                         Showing <span className="mx-1">5</span> <Check className="h-4 w-4 text-green-500" /> of 50
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }



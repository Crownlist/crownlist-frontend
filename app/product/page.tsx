/* eslint-disable */
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Heart, ChevronDown, ChevronUp, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header1"
import Footer from "@/components/Footer"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"; // Adjust import path
import ProductDetails from "@/components/Home/ProductDetails"

export default function ProductDetailPage() {
    const [currentImage, setCurrentImage] = useState(0)
    const [expandedSections, setExpandedSections] = useState({
        description: false,
        overview: false,
        delivery: true,
        reviews: false,
    })
    const [openSection, setOpenSection] = useState<string | null>(null);

    const tSection = (section: string) => {
        setOpenSection((prev) => (prev === section ? null : section)); // Close if same, else open new one
    };

    //overview
    const overviewData = [
        { facility: "Wifi", detail: "No" },
        { facility: "Water", detail: "Yes" },
        { facility: "Generator", detail: "You pay weekly for fuel" },
        { facility: "Neighbor", detail: "3 apartment" },
    ];

    //Reviews
    const reviews = [
        {
            id: 1,
            name: "Jimoh Adesina",
            avatar: "/profile.png",
            rating: 5,
            date: "12/1/2024",
            message:
                "10 days from the date of delivery. We ask you make sure the items have not been worn, washed, or damaged, and that you ship the item(s) back in their original packaging and box.",
            replies: [
                {
                    id: 101,
                    name: "Joe",
                    avatar: "/profile.png",
                    date: "12/1/2024",
                    message:
                        "10 days from the date of delivery. We ask you make sure the items have not been worn, washed, or damaged, and that you ship the item(s) back in their original packaging and box.",
                },
            ],
        },
        {
            id: 2,
            name: "Dominic",
            avatar: "/profile.png",
            rating: 4,
            date: "12/1/2024",
            message:
                "10 days from the date of delivery. We ask you make sure the items have not been worn, washed, or damaged, and that you ship the item(s) back in their original packaging and box.",
            replies: [],
        },
    ];


    // Product images
    const images = [
        "/product1.png",
        "/product2.png",
        "/product3.png",
        "/product4.png",
    ]

    // Similar products
    const similarProducts = [
        {
            id: 1,
            title: "The Green hostel",
            description: "This product is perfect for your balcony or other smaller spaces since it can be easily folded",
            location: "Eleko",
            features: ["One room", "Gate"],
            price: "₦95,232",
            image: "/product1.png",
        },
        {
            id: 2,
            title: "St Andrews Glasgow Green",
            description: "A corner, a nook or even part of a passage can be a well-equipped, comfortable place for a few ...",
            location: "Poly gate",
            features: ["Room & parlor", "24hrs solar"],
            price: "₦595,232",
            image: "/product2.png",
        },
        {
            id: 3,
            title: "St Andrews Glasgow Green",
            description: "A corner, a nook or even part of a passage can be a well-equipped, comfortable place for a few ...",
            location: "Poly gate",
            features: ["Room & parlor", "24hrs solar"],
            price: "₦595,232",
            image: "/product4.png",
        },
    ]

    // Toggle section expansion
    const toggleSection = (section: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev,
        }))
    }

    // Navigate to next/previous image
    const nextImage = () => {
        setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const prevImage = () => {
        setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Header */}
            <Header hidden={false} />
            <div className="container mx-auto px-2 py-6 max-md:px-5">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-gray-700">
                        Home
                    </Link>
                    <ChevronRight size={14} />
                    <Link href="/property" className="hover:text-gray-700">
                        Property
                    </Link>
                    <ChevronRight size={14} />
                    <Link href="/property?type=student" className="hover:text-gray-700">
                        Student
                    </Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-700 truncate">Furnished room and parlor in Eleko Junction, Poygate for rent</span>
                </div>

                <div className="flex flex-col md:flex-row gap-4 md:justify-between w-full">
                    {/* Left Column - Product Images */}
                    <div className=" w-full   ">
                        {/* Main Image */}
                        <div className="relative mb-2 md:mb-4">
                            <div className="relative h-[200px] md:h-[400px] w-full ">
                                <Image
                                    src={images[currentImage] || "/placeholder.svg"}
                                    alt="Product"
                                    fill
                                    className="object-contain bg-white rounded-md "
                                />
                                <button
                                    className="absolute top-2 right-2 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md"
                                    aria-label="Add to favorites"
                                >
                                    <Heart size={18} className="text-gray-500" />
                                </button>
                            </div>

                            {/* Navigation Arrows */}
                            <button
                                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md"
                                onClick={prevImage}
                                aria-label="Previous image"
                            >
                                <ChevronRight size={18} className="text-gray-500 rotate-180" />
                            </button>
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md"
                                onClick={nextImage}
                                aria-label="Next image"
                            >
                                <ChevronRight size={18} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Thumbnail Images */}
                        <div className="flex gap-2 mb-8">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    className={`h-16 w-16 relative border-2 rounded-md overflow-hidden ${index === currentImage ? "border-blue-500" : "border-transparent"
                                        }`}
                                    onClick={() => setCurrentImage(index)}
                                >
                                    <Image src={image || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Product Information Sections */}


                        {/* new product information sections */}
                        <div className="space-y-4">
                            <Accordion type="single" collapsible className="space-y-4">
                                {/* Description Section */}
                                <AccordionItem value="description" className="border-b pb-4">
                                    <AccordionTrigger className="flex items-center justify-between w-full text-left py-2">
                                        <span className="font-medium">
                                            Description
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="mt-2 text-gray-600">
                                        <p>Furnished room and parlor in Eleko Junction, Poygate for rent...</p>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Overview Section */}
                                <AccordionItem value="overview" className="border-b pb-4">
                                    <AccordionTrigger className="flex items-center justify-between w-full text-left py-2">
                                        <span className="font-medium">Overview</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="mt-2 space-y-4">
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse border border-white">
                                                <thead>
                                                    <tr className="bg-[#F5F5F5] text-[#525252]">
                                                        <th className="border border-[#F5F5F5] px-4 py-2 text-left">Facilities</th>
                                                        <th className="border border-[#F5F5F5] px-4 py-2 text-left">Details</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {overviewData.map((item, index) => (
                                                        <tr key={index} className="bg-white text-[#525252]">
                                                            <td className="border border-[#F5F5F5] px-4 py-2">{item.facility}</td>
                                                            <td className="border border-[#F5F5F5] px-4 py-2">{item.detail}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Property Description */}
                                        <p className="text-[#525252] text-sm mt-4">
                                            16 bed en suite property to let, 4 wheelchair access bedrooms, with communal kitchens and dining/lounge areas.
                                            Reception/office with a surveillance monitor. CCTV throughout inside and out.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Delivery Section */}
                                <AccordionItem value="delivery" className="border-b pb-4">
                                    <AccordionTrigger className="flex items-center justify-between w-full text-left py-2">
                                        <span className="font-medium">Delivery</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="">
                                        <div className="mt-2 space-y-4">
                                            {/* Home delivery */}
                                            <div className="flex items-start gap-3">
                                                <div className="h-6 w-6 bg-gray-100 rounded-md flex items-center justify-center mt-0.5">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                                                            stroke="#4B5563"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-sm">Home delivery</h4>
                                                    <p className="text-sm text-gray-500 mt-1">We ship world wide via DHL</p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Delivery within the next 3-4 days within Lagos, based on your address for delivery outside Lagos
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Pick-up */}
                                            <div className="flex items-start gap-3">
                                                <div className="h-6 w-6 bg-gray-100 rounded-md flex items-center justify-center mt-0.5">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M20 10C20 14.4183 12 22 12 22C12 22 4 14.4183 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10Z"
                                                            stroke="#4B5563"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                                                            stroke="#4B5563"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-sm">Pick-up</h4>
                                                    <p className="text-sm text-gray-500 mt-1">We ship world wide via DHL</p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Delivery within the next 3-4 days within Lagos, based on your address for delivery outside Lagos
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Property details */}
                                            <p className="text-sm text-gray-600 mt-4">
                                                16 bed en suite property to let, 4 wheel chair access bedrooms, with communal kitchens and
                                                arrival/lounge areas. Reception/office with a surveillance monitor. CCTV throughout inside and out.
                                            </p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Reviews Section */}
                                <AccordionItem value="reviews" className="border-b pb-4">
                                    <AccordionTrigger className="flex items-center justify-between w-full text-left py-2">
                                        <span className="font-medium">Reviews</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="mt-2 space-y-4 flex flex-col md:flex-row gap-12 justify-between">
                                        {/* Overall Rating */}
                                        <div className="flex w-full flex-col">
                                            <p className="text-2xl font-bold text-white">4</p>
                                            <div className="flex items-center">
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <span key={index} className={`text-yellow-400 text-xl ${index < 4 ? "" : "opacity-50"}`}>★</span>
                                                ))}
                                            </div>
                                            <p className="text-gray-400 text-sm mt-2">Overall rating</p>
                                            <div className="mt-2 space-y-1">
                                                {[5, 4, 3, 2, 1].map((rating) => (
                                                    <div key={rating} className="flex items-center gap-2">
                                                        <span className="text-sm">{rating}</span>
                                                        <div className="h-2 bg-white rounded-md flex-grow">
                                                            <div className={`h-full bg-gray-600 rounded-md`} style={{ width: `${rating * 20}%` }}></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Reviews List */}
                                        <div>
                                            {reviews.map((review) => (
                                                <div key={review.id} className="space-y-4">
                                                    {/* Main Review */}
                                                    <div className="flex gap-4">
                                                        <Image src={review.avatar} alt={review.name} width={55} height={55} className="rounded-full h-[46px] w-[64px]" />
                                                        <div>
                                                            <p className="font-semibold">{review.name}</p>
                                                            <div className="flex items-center">
                                                                {Array.from({ length: 5 }).map((_, index) => (
                                                                    <span key={index} className={`text-yellow-400 text-lg ${index < review.rating ? "" : "opacity-50"}`}>★</span>
                                                                ))}
                                                                <span className="text-sm text-gray-400 ml-2">{review.date}</span>
                                                            </div>
                                                            <p className="text-gray-400 text-sm mt-1">{review.message}</p>
                                                        </div>
                                                    </div>

                                                    {/* Replies */}
                                                    {review.replies.length > 0 && (
                                                        <div className="ml-12 space-y-4">
                                                            {review.replies.map((reply) => (
                                                                <div key={reply.id} className="flex gap-4">
                                                                    <Image src={reply.avatar} alt={reply.name} width={55} height={55} className="rounded-full h-[46px] w-[64px]" />
                                                                    <div>
                                                                        <p className="font-medium text-gray-300">{reply.name}</p>
                                                                        <p className="text-xs text-gray-500">{reply.date}</p>
                                                                        <p className="text-gray-400 text-sm mt-1">{reply.message}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                                                        <button className="flex items-center gap-1">
                                                            <span className="text-lg">💬</span> See messages
                                                        </button>
                                                        <span>|</span>
                                                        <button className="flex items-center gap-1">
                                                            <span className="text-lg">✉️</span> Reply messages
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <button className="text-green-400 font-semibold text-sm">More reviews</button>
                                        </div>
                                        {/* More Reviews */}

                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>


                        {/* You might also like these */}
                        <div className="mt-8">
                            <h3 className="font-medium text-lg mb-4">You might also like these</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {similarProducts.map((product) => (
                                    <div key={product.id} className="border rounded-lg overflow-hidden">
                                        <div className="relative h-[160px]">
                                            <Image
                                                src={product.image || "/placeholder.svg"}
                                                alt={product.title}
                                                fill
                                                className="object-cover"
                                            />
                                            <button className="absolute top-2 right-2 h-7 w-7 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                <Heart size={14} className="text-gray-500" />
                                            </button>
                                        </div>
                                        <div className="p-3">
                                            <h4 className="font-medium text-sm">{product.title}</h4>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                                            <div className="flex gap-2 md:gap-1 mt-2 w-full justify-start md:justify-center ">
                                                <div className="text-xs md:text-[10px] bg-gray-100 px-2 py-1 rounded">{product.location}</div>
                                                {product.features.map((feature, index) => (
                                                    <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                        {feature}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="font-medium text-sm mt-2">{product.price}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Product Details */}
                    <div className="w-full h-full mt-2">
                    <ProductDetails/>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}



// <div className="lg:w-[40%] ">
//                         <div className="bg-white p-6 rounded-lg border">
//                             <h1 className="text-xl font-medium mb-4">Furnished room and parlor in Eleko Junction, Poygate for rent</h1>

//                             {/* Seller Information */}
//                             <div className="flex items-center gap-3 mb-4">
//                                 <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden relative">
//                                     <Image src="/profile.png" alt="Seller" fill className="object-cover" />
//                                 </div>
//                                 <div>
//                                     <h3 className="font-medium text-sm">Oyekinps Properties</h3>
//                                     <p className="text-xs text-gray-500">6 years on crownlist</p>
//                                 </div>
//                             </div>

//                             {/* Price */}
//                             <div className="mb-6">
//                                 <div className="flex items-center gap-2">
//                                     <span className="text-xl font-bold">$90.15</span>
//                                     <span className="text-sm text-gray-500 line-through">$99.95</span>
//                                 </div>
//                             </div>

//                             {/* Features */}
//                             <div className="flex gap-4 mb-6">
//                                 <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
//                                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                         <rect x="3" y="3" width="18" height="18" rx="2" stroke="#4B5563" strokeWidth="2" />
//                                         <path d="M3 9H21" stroke="#4B5563" strokeWidth="2" />
//                                     </svg>
//                                     <span className="text-xs">One room</span>
//                                 </div>
//                                 <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
//                                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                         <path
//                                             d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15 8H9V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8Z"
//                                             fill="#4B5563"
//                                         />
//                                     </svg>
//                                     <span className="text-xs">Gate</span>
//                                 </div>
//                             </div>

//                             {/* Action Buttons */}
//                             <div className="space-y-3">
//                                 <Button className="w-full bg-black text-white hover:bg-gray-800">Request call</Button>
//                                 <Button variant="outline" className="w-full">
//                                     Send message
//                                 </Button>
//                                 <Button variant="outline" className="w-full">
//                                     Contact information
//                                 </Button>
//                             </div>

//                             {/* Share Product */}
//                             <div className="mt-6 w-full">
//                                 <p className="text-sm font-medium mb-3">Share product</p>
//                                 <div className="flex gap-1 md:gap-3">
//                                     <Button variant="outline" size="sm" className="flex items-center border-none gap-1 md:gap-2 text-xs">
//                                         <Copy size={14} />
//                                         Copy link
//                                     </Button>
//                                     <Button
//                                         variant="outline"
//                                         size="sm"
//                                         className="flex items-center gap-2 border-none text-xs "
//                                     >
//                                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                             <path
//                                                 d="M17.6 6.32C16.12 6.32 14.92 7.52 14.92 9C14.92 9.2 14.96 9.4 15 9.58L8.98 12.58C8.54 12.04 7.88 11.68 7.12 11.68C5.64 11.68 4.44 12.88 4.44 14.36C4.44 15.84 5.64 17.04 7.12 17.04C7.88 17.04 8.54 16.68 8.98 16.14L15 19.14C14.96 19.32 14.92 19.52 14.92 19.72C14.92 21.2 16.12 22.4 17.6 22.4C19.08 22.4 20.28 21.2 20.28 19.72C20.28 18.24 19.08 17.04 17.6 17.04C16.84 17.04 16.18 17.4 15.74 17.94L9.72 14.94C9.76 14.76 9.8 14.56 9.8 14.36C9.8 14.16 9.76 13.96 9.72 13.78L15.74 10.78C16.18 11.32 16.84 11.68 17.6 11.68C19.08 11.68 20.28 10.48 20.28 9C20.28 7.52 19.08 6.32 17.6 6.32Z"
//                                                 fill="#10B981"
//                                             />
//                                         </svg>
//                                         Whatsapp
//                                     </Button>
//                                     <Button
//                                         variant="outline"
//                                         size="sm"
//                                         className="flex border-none items-center gap-2 text-xs "
//                                     >
//                                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                             <path
//                                                 d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z"
//                                                 fill="#EC4899"
//                                             />
//                                         </svg>
//                                         Instagram
//                                     </Button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
/////////////
// <div className="space-y-4">
//                             {/* Description Section */}
//                             <div className="border-b pb-4">
//                                 <button
//                                     className="flex items-center justify-between w-full text-left py-2"
//                                     onClick={() => toggleSection("description")}
//                                 >
//                                     <span className="font-medium">Description</span>
//                                     {expandedSections.description ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                                 </button>
//                                 {expandedSections.description && (
//                                     <div className="mt-2 text-gray-600">
//                                         <p>
//                                             Furnished room and parlor in Eleko Junction, Poygate for rent. This is a comfortable space perfect
//                                             for students or young professionals.
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Overview Section */}
//                             <div className="border-b pb-4">
//                                 <button
//                                     className="flex items-center justify-between w-full text-left py-2"
//                                     onClick={() => toggleSection("overview")}
//                                 >
//                                     <span className="font-medium">Overview</span>
//                                     {expandedSections.overview ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                                 </button>
//                                 {expandedSections.overview && (
//                                     <div className="mt-2 text-gray-600">
//                                         <p>One bedroom apartment with modern amenities and convenient location.</p>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Delivery Section */}
//                             <div className="border-b pb-4">
//                                 <button
//                                     className="flex items-center justify-between w-full text-left py-2"
//                                     onClick={() => toggleSection("delivery")}
//                                 >
//                                     <span className="font-medium">Delivery</span>
//                                     {expandedSections.delivery ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                                 </button>
//                                 {expandedSections.delivery && (
//                                     <div className="mt-2 space-y-4">
//                                         {/* Home delivery */}
//                                         <div className="flex items-start gap-3">
//                                             <div className="h-6 w-6 bg-gray-100 rounded-md flex items-center justify-center mt-0.5">
//                                                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                                     <path
//                                                         d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
//                                                         stroke="#4B5563"
//                                                         strokeWidth="2"
//                                                         strokeLinecap="round"
//                                                         strokeLinejoin="round"
//                                                     />
//                                                 </svg>
//                                             </div>
//                                             <div>
//                                                 <h4 className="font-medium text-sm">Home delivery</h4>
//                                                 <p className="text-sm text-gray-500 mt-1">We ship world wide via DHL</p>
//                                                 <p className="text-sm text-gray-500 mt-1">
//                                                     Delivery within the next 3-4 days within Lagos, based on your address for delivery outside Lagos
//                                                 </p>
//                                             </div>
//                                         </div>

//                                         {/* Pick-up */}
//                                         <div className="flex items-start gap-3">
//                                             <div className="h-6 w-6 bg-gray-100 rounded-md flex items-center justify-center mt-0.5">
//                                                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                                     <path
//                                                         d="M20 10C20 14.4183 12 22 12 22C12 22 4 14.4183 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10Z"
//                                                         stroke="#4B5563"
//                                                         strokeWidth="2"
//                                                         strokeLinecap="round"
//                                                         strokeLinejoin="round"
//                                                     />
//                                                     <path
//                                                         d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
//                                                         stroke="#4B5563"
//                                                         strokeWidth="2"
//                                                         strokeLinecap="round"
//                                                         strokeLinejoin="round"
//                                                     />
//                                                 </svg>
//                                             </div>
//                                             <div>
//                                                 <h4 className="font-medium text-sm">Pick-up</h4>
//                                                 <p className="text-sm text-gray-500 mt-1">We ship world wide via DHL</p>
//                                                 <p className="text-sm text-gray-500 mt-1">
//                                                     Delivery within the next 3-4 days within Lagos, based on your address for delivery outside Lagos
//                                                 </p>
//                                             </div>
//                                         </div>

//                                         {/* Property details */}
//                                         <p className="text-sm text-gray-600 mt-4">
//                                             16 bed en suite property to let, 4 wheel chair access bedrooms, with communal kitchens and
//                                             arrival/lounge areas. Reception/office with a surveillance monitor. CCTV throughout inside and out.
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Reviews Section */}
//                             <div className="border-b pb-4">
//                                 <button
//                                     className="flex items-center justify-between w-full text-left py-2"
//                                     onClick={() => toggleSection("reviews")}
//                                 >
//                                     <span className="font-medium">Reviews</span>
//                                     {expandedSections.reviews ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                                 </button>
//                                 {expandedSections.reviews && (
//                                     <div className="mt-2 text-gray-600">
//                                         <p>No reviews yet.</p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>





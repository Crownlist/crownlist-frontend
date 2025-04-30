'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react'


const product = {
    title: 'Furnished room and parlor in Eleko Junction, Polygate for rent',
    price: 90.15,
    originalPrice: 99.05,
    location: 'Eleko',
    tags: ['Eleko', 'One room', 'Gate'],
    description: `
    <p>£148 per room per week</p>
    <p>Bills not included.</p>
    <p>16 bed en suite property to let, 4 wheel chair access bedrooms, with communal kitchens and dining/lounge areas. Reception/ office with a surveillance monitor. CCTV throughout inside and out.</p>
    <p>Large detached annex.</p>
    <p>Situated on the main bus route, a 5 minute walk to the supertram, easy walk to English Institute of Sport (EIS), university buildings and the Sheffield arena and Meadowhall.</p>
    <p><a href="#">Read more about product</a></p>
  `,
    images: [
        "/product1.png",
        "/product2.png",
        "/product3.png",
        "/product4.png",
        "/product1.png",
        "/product2.png",
        "/product3.png",
        "/product4.png",
        "/product1.png",
        "/product2.png",
        "/product3.png",
        "/product4.png",
        "/product1.png",
        "/product2.png",
        "/product3.png",
        "/product4.png",
    ],
}
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
//overview
const overviewData = [
    { facility: "Wifi", detail: "No" },
    { facility: "Water", detail: "Yes" },
    { facility: "Generator", detail: "You pay weekly for fuel" },
    { facility: "Neighbor", detail: "3 apartment" },
];

export default function ProductDetailPage() {
    const [currentImage, setCurrentImage] = useState(0)
    const visibleThumbnails = 5
    const overflowCount = product.images.length - visibleThumbnails

    const handleNext = () => {
        setCurrentImage((prev) => (prev + 1) % product.images.length)
    }

    const handlePrev = () => {
        setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length)
    }

    return (
        <div className=" mx-auto px-4 py-3 md:py-6 relative">
            {/* Breadcrumb */}
            <div className='flex max-md:flex-col w-full md:justify-between'>
            <nav className="text-sm text-muted-foreground p-3 md:mb-5">
                <span>Product</span> &gt; <span className='text-[#1F058F]'>... &gt;</span> <span className="text-[#1F058F]">{product.title}</span>
            </nav>

            {/* Edit/Delete Buttons */}
            <div className="flex gap-2 justify-end w-full">
                <Button variant="ghost" size="icon"><Edit size={18} /></Button>
                <Button variant="ghost" size="icon"><Trash2 size={18} /></Button>
            </div>
            </div>

            {/* Image Viewer */}
            <div className="p-3 container w-full relative h-[200px] md:h-[400px]  mt-5 rounded-md max-xl:shadow-sm  overflow-hidden mb-4">
                <Image
                    src={product.images[currentImage]}
                    alt={`Product image ${currentImage + 1}`}
                    fill
                    className="object-cover xl:object-contain rounded-md"
                />
                <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow">
                    <ChevronLeft />
                </button>
                <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow">
                    <ChevronRight />
                </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto mb-6">
                {product.images.slice(0, visibleThumbnails).map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden cursor-pointer border border-muted" onClick={() => setCurrentImage(idx)}>
                        <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                        {idx === visibleThumbnails - 1 && overflowCount > 0 && (
                            <div className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-sm font-medium">
                                +{overflowCount}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Title and Price */}
            <h1 className="text-2xl font-semibold mb-2">{product.title}</h1>
            <div className="flex items-center gap-4 mb-2">
                <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
                <span className="line-through text-muted-foreground">${product.originalPrice.toFixed(2)}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag) => (
                    <span key={tag} className="bg-muted px-3 py-1 rounded-full text-sm text-muted-foreground">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Accordion Sections */}
            <Accordion type="single" collapsible defaultValue="description">
                <AccordionItem value="description">
                    <AccordionTrigger>Description</AccordionTrigger>
                    <AccordionContent>
                        <div
                            className="space-y-3 text-muted-foreground text-sm"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
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
                            <div className="mt-2 space-y-1 max-w-xl">
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
                            <button className="text-gray-600 underline text-semibold text-sm">More reviews</button>
                        </div>
                        {/* More Reviews */}

                    </AccordionContent>
                </AccordionItem>
            </Accordion>

        </div>
    )
}

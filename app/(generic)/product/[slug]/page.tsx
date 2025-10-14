/* eslint-disable */
"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Heart} from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header1"
import Footer from "@/components/Footer"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"; // Adjust import path
import ProductDetails from "@/components/Home/ProductDetails"
// import { number } from "zod"
import { useParams, useSearchParams } from "next/navigation"
import { apiClientPublic, apiClientUser } from "@/lib/interceptor"
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton"



export default function ProductDetailPage() {
    const [currentImage, setCurrentImage] = useState(0)
    const [expandedSections, setExpandedSections] = useState({
        description: false,
        overview: false,
        delivery: true,
        reviews: false,
    })
    const [openSection, setOpenSection] = useState<string | null>(null);
    const [product, setProduct] = useState<any | null>(null)
    const [images, setImages] = useState<string[]>([
        "/product1.png",
        "/product2.png",
        "/product3.png",
        "/product4.png",
    ])

    const [currentProduct, setCurrentProduct] = useState<any>({
        id: "1",
        title: "Furnished room and parlor in Eleko Junction, Poygate for rent",
        postedDate: new Date("2024-01-12").toLocaleDateString(),
        condition: "Brand New"
    });

    const [apiProduct, setApiProduct] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const safetyTips = [
        "Do not send money or personal information until you’ve seen the product.",
        "Meet the seller in a safe and public location.",
        "Inspect the product thoroughly before payment.",
        "Avoid deals that seem too good to be true.",
        "Use secure payment methods; avoid cash for high-value items.",
    ];

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

    const similarProducts: any[] = [
        {
            id: "1",
            title: "The Green hostel",
            description: "This product is perfect for your balcony or other smaller spaces since it can be easily folded",
            location: "Eleko",
            features: ["One room", "Gate"],
            price: "₦95,232",
            image: "/product1.png",
            condition: "Used",
            postedDate: "12/1/2024",
        },
        {
            id: "2",
            title: "St Andrews Glasgow Green",
            description: "A corner, a nook or even part of a passage can be a well-equipped, comfortable place for a few ...",
            location: "Poly gate",
            features: ["Room & parlor", "24hrs solar"],
            price: "₦595,232",
            image: "/product2.png",
            postedDate: "12/2/2024",
            condition: "Brand New",
        },
    ];

    const {slug : id}= useParams()
    const search = useSearchParams()
    const bcCat = search.get('cat') || 'Category'
    const bcSub = search.get('sub') || 'Property'


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
    useEffect(() => {
        if (id) {
            fetchServices()
        }
    }, [id]);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const res = await apiClientPublic.get(`/products/slug/${id}`)
      const responseData = res.data as any;
      console.log("productaa", responseData.product)

      if (responseData.product) {
        const product = responseData.product;
        setApiProduct(product);

        // Update images from API
        const apiImages = product.images.map((img: any) => img.url);
        setImages(apiImages.length > 0 ? apiImages : ["/product1.png"]);

        // Update current product for ProductDetails component
        setCurrentProduct({
          id: product._id,
          title: product.name,
          postedDate: new Date(product.createdAt).toLocaleDateString(),
          condition: product.status === "live" ? "Brand New" : "Used"
        });

        // Update product state for accordion sections
        setProduct(product);
      }
      setIsLoading(false);
    } catch (e: any) {
      console.log(`Failed to load product: ${String(e?.message || e)}`)
      setIsLoading(false);
    }
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
                    {/* <ChevronRight size={14} />
                    <Link href={`/${product?.category?.slug}/${product?.subCategory?.slug}`} className="hover:text-gray-700">
                        {product?.category?.name || bcCat}
                    </Link> */}
                    <ChevronRight size={14} />
                    <Link href={`/${product?.category?.slug}/${product?.subCategory?.slug}`} className="hover:text-gray-700">
                        {product?.subCategory?.name || bcSub}
                    </Link>
                    <ChevronRight size={14} />

                    <span className="text-gray-700 truncate">{product?.name || String(id || '').toUpperCase()}</span>
                </div>


{isLoading ? (
                    // Loading skeleton
                    <div className="flex flex-col md:flex-row gap-4 md:justify-between w-full">
                        {/* Left Column - Product Images Skeleton */}
                        <div className="w-full">
                            <div className="space-y-6">
                                {/* Main Image Skeleton */}
                                <div className="relative h-[200px] md:h-[400px] w-full bg-gray-200 rounded-md"></div>

                                {/* Thumbnails Skeleton */}
                                <div className="flex gap-2">
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <div key={index} className="h-16 w-16 bg-gray-200 rounded-md"></div>
                                    ))}
                                </div>

                                {/* Accordion Sections Skeleton */}
                                <div className="space-y-4">
                                    <div className="border-b pb-4">
                                        <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    </div>

                                    <div className="border-b pb-4">
                                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>

                                    <div className="border-b pb-4">
                                        <div className="h-6 bg-gray-200 rounded w-1/5 mb-2"></div>
                                        <div className="space-y-2">
                                            {Array.from({ length: 3 }).map((_, index) => (
                                                <div key={index} className="h-4 bg-gray-200 rounded w-full"></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Product Details Skeleton for Mobile */}
                                <div className="flex md:hidden bg-white border rounded-lg p-6 shadow-md">
                                    <div className="space-y-4 w-full">
                                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                                        <div className="space-y-2">
                                            <div className="h-10 bg-gray-200 rounded"></div>
                                            <div className="h-10 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Similar Products Skeleton */}
                                <div className="mt-8">
                                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {Array.from({ length: 4 }).map((_, index) => (
                                            <div key={index} className="border rounded-lg overflow-hidden">
                                                <div className="h-[160px] bg-gray-200"></div>
                                                <div className="p-3 space-y-3">
                                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Product Details Skeleton */}
                        <div className="hidden md:flex w-full max-w-md">
                            <div className="bg-white border rounded-lg p-6 shadow-md w-full">
                                <div className="space-y-4">
                                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                                    <div className="space-y-2">
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-4 md:justify-between w-full">
                        {/* Left Column - Product Images */}
                        <div className=" w-full">
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
                                            <p>{product?.description || product?.name}</p>
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
                                                        {(product?.facility?.facilities || overviewData).map((item: any, index: number) => (
                                                            <tr key={index} className="bg-white text-[#525252]">
                                                                <td className="border border-[#F5F5F5] px-4 py-2">{item.label || item.facility}</td>
                                                                <td className="border border-[#F5F5F5] px-4 py-2">{item.value || item.detail}</td>
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
                                                {reviews.map((review: any) => (
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
                                                                {review.replies.map((reply: any) => (
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


                                    {/* Safety Tips Section */}
                                <AccordionItem value="safety-tips" className="border-b pb-4">
                                <AccordionTrigger className="flex items-center justify-between w-full text-left py-2">
                                    <span className="font-medium">Safety Tips</span>
                                </AccordionTrigger>
                                <AccordionContent className="mt-2 text-gray-600">
                                    <ul className="list-disc pl-5 space-y-2">
                                    {safetyTips.map((tip, index) => (
                                        <li key={index} className="text-sm">{tip}</li>
                                    ))}
                                    </ul>
                                </AccordionContent>
                                </AccordionItem>
                                </Accordion>
                            </div>

                            <div className="flex md:hidden w-full h-full mt-2 md:justify-end">
                                <ProductDetails
                                    postedDate={currentProduct.postedDate}
                                    condition={currentProduct.condition}
                                    product={product}/>
                            </div>
                            {/* You might also like these */}
                            <div className="mt-8">
                                <h3 className="font-medium text-lg mb-4">You might also like these</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {similarProducts.map((product) => (
                                        <Link href={`/product/${product.id}`} className="w-full" key={product.id}>
                                            <div className="border rounded-lg overflow-hidden">
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
                                                        {(product.features ?? []).map((feature: any, index: number) => (
                                                            <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                                {feature}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="font-medium text-sm mt-2">{product.price}</div>
                                                </div>
                                            </div>

                                            </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Product Details */}
                        <div className="hidden md:flex w-full h-full mt-2 md:justify-end">
                            <ProductDetails
                             postedDate={currentProduct.postedDate}
                             condition={currentProduct.condition}
                             product={product}
                             />
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

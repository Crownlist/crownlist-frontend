/* eslint-disable */
"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Heart, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/Header1"
import Footer from "@/components/Footer"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import ProductDetails from "@/components/Home/ProductDetails"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { apiClientPublic, apiClientUser } from "@/lib/interceptor"
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton"
import { useProducts } from "@/hooks/useProducts"
import { cn } from "@/lib/utils"
import { useLikedProducts } from "@/hooks/useLikedProducts"
import { toast } from "sonner"
import { useCategories } from "@/hooks/useCategories"
import { Subcategory } from "@/types/category/category"

export default function SearchPage() {
  const [currentImage, setCurrentImage] = useState(0)
  const [expandedSections, setExpandedSections] = useState({
    description: false,
    overview: false,
    delivery: true,
    reviews: false,
  })

  const [product, setProduct] = useState<any | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [currentProduct, setCurrentProduct] = useState<any>()
  const [liked, setLiked] = useState<boolean>(false)
  const [toggling, setToggling] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const { toggleLike } = useLikedProducts()
  const { products: apiProducts, loading } = useProducts()

  // Request form states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    description: "",
    category: "",
    subCategory: "",
  })
  const { categories } = useCategories()
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingImages, setIsUploadingImages] = useState(false)

  const { slug: id } = useParams()
  const search = useSearchParams()
  const router = useRouter()
  const bcSub = search.get('sub') || 'Property'

  const safetyTips = [
    "Do not send money or personal information until you've seen the product.",
    "Meet the seller in a safe and public location.",
    "Inspect the product thoroughly before payment.",
    "Avoid deals that seem too good to be true.",
    "Use secure payment methods; avoid cash for high-value items.",
  ]

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

  useEffect(() => {
    if (id) {
      performSearch()
    }
  }, [id])

  const performSearch = async () => {
    try {
      setIsLoading(true)
      const res = await apiClientPublic.get(`/products/search?q=${encodeURIComponent(id as string)}&limit=10&page=1`)
      const responseData = res.data as any
      console.log("response", responseData)

      if (responseData.products && responseData.products.length > 0) {
        // Products found - show first product in detail view
        const firstProduct = responseData.products[0]
        setSearchResults(responseData.products)
        setApiProduct(firstProduct)

        // Update images from API
        const apiImages = firstProduct.images.map((img: any) => img.url)
        setImages(apiImages.length > 0 ? apiImages : ["/product1.png"])

        // Update current product for ProductDetails component
        setCurrentProduct({
          id: firstProduct._id,
          title: firstProduct.name,
          postedDate: new Date(firstProduct.createdAt).toLocaleDateString(),
          condition: firstProduct.status === "live" ? "Brand New" : "Used"
        })

        // Update product state for accordion sections
        setProduct(firstProduct)
      } else {
        // No products found - show request form
        setSearchResults([])
      }

      setHasSearched(true)
      setIsLoading(false)
    } catch (e: any) {
      console.log(`Failed to search products: ${String(e?.message || e)}`)
      setSearchResults([])
      setHasSearched(true)
      setIsLoading(false)
    }
  }

  const [apiProduct, setApiProduct] = useState<any | null>(null)

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (toggling) return

    // Check authentication
    const isAuthenticated = typeof window !== "undefined" && !!localStorage.getItem("leoKey")
    if (!isAuthenticated) {
      setShowLoginPrompt(true)
      return
    }

    setToggling(true)
    const newLiked = !liked
    setLiked(newLiked)

    try {
      await toggleLike(String(currentProduct?.id))
    } catch (err: any) {
      setLiked(!newLiked) // revert
      toast("error", err.message || "Failed to toggle like")
    } finally {
      setToggling(false)
    }
  }

  // Request form functions
  useEffect(() => {
    if (formData.category) {
      const cat = categories.find(c => c._id === formData.category)
      setSubcategories(cat?.subCategories || [])
      setFormData(prev => ({ ...prev, subCategory: "" }))
    } else {
      setSubcategories([])
    }
  }, [formData.category, categories])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : []
    const validFiles = selectedFiles.filter((file) =>
      ["image/svg+xml", "image/png", "image/jpeg", "image/gif"].includes(file.type)
    )
    setFiles(validFiles)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    const validFiles = droppedFiles.filter((file) =>
      ["image/svg+xml", "image/png", "image/jpeg", "image/gif"].includes(file.type)
    )
    setFiles((prev) => [...prev, ...validFiles])
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('fileType', 'Product-request')

      const res = await apiClientUser.post('/users/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      console.log("Upload response:", res?.data)
      return res?.data?.fileUrl
    } catch (error) {
      console.error('Image upload error:', error)
      throw new Error('Failed to upload image')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!/^[0-9]+$/.test(formData.phone)) {
      toast.error("Phone number must be numeric.")
      return
    }

    if (formData.description.length < 10) {
      toast.error("Description must be at least 10 characters long.")
      return
    }

    setIsSubmitting(true)
    setIsUploadingImages(true)

    try {
      const uploadedImages: any[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const imageUrl = await uploadImage(file)
        uploadedImages.push({
          url: imageUrl,
          altText: `Image ${i + 1}`,
          isPrimary: i === 0
        })
      }

      setIsUploadingImages(false)

      const body = {
        name: formData.name,
        phone: formData.phone,
        description: formData.description,
        category: formData.category,
        subCategory: formData.subCategory,
        images: uploadedImages
      }

      const response = await apiClientUser.post("/product-requests/create", body)
      console.log("search", response)
      if (response.data) {
        toast.success(`${response.data.message}`)
        setFormData({
          name: "",
          phone: "",
          description: "",
          category: "",
          subCategory: "",
        })
        setFiles([])
      } else {
        const errorData = response.data
        toast.error(errorData.error || "Error submitting request.")
      }
    } catch (error) {
      console.error("Submission error:", error)
      if (isUploadingImages) {
        toast.error("Failed to upload images. Please try again.")
      } else {
        toast.error("An error occurred.")
      }
    } finally {
      setIsSubmitting(false)
      setIsUploadingImages(false)
    }
  }

  // Show loading skeleton while searching
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header hidden={false} />
        <div className="container mx-auto px-2 py-6 max-md:px-5">
          <div className="flex flex-col md:flex-row gap-4 md:justify-between w-full">
            <div className="w-full">
              <div className="space-y-6">
                <div className="relative h-[200px] md:h-[400px] w-full bg-gray-200 rounded-md"></div>
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-16 w-16 bg-gray-200 rounded-md"></div>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
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
        </div>
        <Footer />
      </div>
    )
  }

  // If products found, show product detail view
  if (searchResults.length > 0) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header hidden={false} />
        <div className= "container mx-auto py-6 max-md:px-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {searchResults.map((product) => {
            return (
              <Link href={`/product/${product.slug}`} key={product._id}>
                <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <div className="relative h-[160px]">
                    <Image
                      src={product.images?.[0]?.url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    {/* <button
                                onClick={(e) => handleLike(e, displayProduct.id)}
                                disabled={toggling}
                                aria-label={liked ? "Unlike" : "Like"}
                                className="absolute top-2 right-2 h-7 w-7 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
                                <Heart className={cn("h-5 w-5 transition-colors", liked ? "fill-red-500 text-red-500" : "text-gray-500")} />
                              </button>  */}
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {product.location && (
                        <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {product.location}
                        </div>
                      )}
                      {product?.features?.slice(0, 2).map((feature: string, index: number) => (
                        <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {feature}
                        </div>
                      ))}
                    </div>
                    {product.price.discountedPrice && (
                        <div className="font-medium text-sm mt-2">₦{product.price.discountedPrice}</div>
                    )}
                    {!product.price.discountedPrice && (
                        <div className="font-medium text-sm mt-2">₦{product.price.currentPrice}</div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        </div>
        <Footer />
      </div>
    )
  }

  // No products found - show request form
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header hidden={false} />
      <div className="container mx-auto py-6 max-md:px-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700">
              Home
            </Link>
            <ChevronRight size={16} />
            <span className="text-gray-700">Search</span>
          </div>
          <div className="flex flex-row gap-0">
            <p className="font-semibold">Search results -{id}</p>
            <p className="font-light">(0 result found)</p>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-col relative w-full">
            <div className="flex flex-col items-center justify-center text-center py-1">
              <div className="mb-2 text-purple-600">
                <Image
                  src={"/binocular.png"}
                  width={45}
                  height={45}
                  alt="binocular"
                />
              </div>
              <h2 className="text-xl font-medium mb-2">
                No search results for "{id}"
              </h2>
              <div className="text-gray-500 max-w-md space-y-2">
                <p>Ensure all words are spelled correctly</p>
                <p>Try using different or more general keywords</p>
                <p>Remove filters or search for a broader category</p>
              </div>
            </div>

            <div className="mt-5 bg-white shadow rounded-lg overflow-hidden w-full">
              <div className="flex flex-col md:flex-row w-full justify-between">
                <div className="p-6 md:w-1/2">
                  <h2 className="text-xl font-medium mb-2">
                    Request product/services
                  </h2>
                  <p className="text-gray-500 mb-6">
                    If you can't find the product you're looking for, please
                    enter the product or service details below.
                  </p>

                  <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                    <div>
                      <label className="block mb-1 text-sm">Product name</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[0-9]/g, "")
                          setFormData((prev) => ({ ...prev, name: value }))
                        }}
                        className="w-full"
                        pattern="[A-Za-z\s]+"
                        title="Only letters and spaces are allowed"
                        onKeyPress={(e) => {
                          if (!/[A-Za-z\s]/.test(e.key)) {
                            e.preventDefault()
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Phone number</label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "")
                          setFormData((prev) => ({ ...prev, phone: value }))
                        }}
                        pattern="[0-9]+"
                        title="Contact number must be numeric"
                        className="w-full"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault()
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Category</label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Sub Category</label>
                      <Select
                        value={formData.subCategory}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, subCategory: value }))}
                        required
                        disabled={!subcategories.length}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a sub category" />
                        </SelectTrigger>
                        <SelectContent>
                          {subcategories.map((sub) => (
                            <SelectItem key={sub._id} value={sub._id}>
                              {sub.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Description</label>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        className="w-full min-h-[100px]"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Image(s)</label>
                      <div
                        className="border border-dashed rounded-md p-4 text-center"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                      >
                        <input
                          type="file"
                          accept="image/svg+xml,image/png,image/jpeg,image/gif"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Upload size={20} className="text-gray-400" />
                            <div className="text-sm">
                              <span className="text-blue-600 font-medium">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </div>
                            <div className="text-xs text-gray-400">
                              SVG, PNG, JPG or GIF (max. 800×400px)
                            </div>
                          </div>
                        </label>
                        {files.length > 0 && (
                          <div className="mt-2 text-sm text-gray-600">
                            <p>Selected files:</p>
                            <ul className="list-disc list-inside">
                              {files.map((file, index) => (
                                <li key={index}>{file.name}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex w-full justify-center">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full justify-center max-w-xl md:p-6 items-center bg-[#1F058F] hover:bg-[#2a0bc0] text-white mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUploadingImages
                          ? 'Uploading Images...'
                          : isSubmitting
                            ? 'Submitting...'
                            : 'Request product'}
                      </Button>
                    </div>
                  </form>
                </div>
                <div className="w-full h-auto relative md:w-1/2 p-6 max-sm:hidden">
                  <Image
                    src="/hanger.png"
                    alt="Clothing on hangers"
                    width={600}
                    height={600}
                    className="object-cover h-full w-full rounded-r-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-8 px-4 md:px-0 max-w-7xl mx-auto">
        <h3 className="font-medium text-lg mb-4">You might also like these</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
            : apiProducts.slice(0, 4).map((product) => (
              <Link href={`/product/${product.slug}`} key={product._id}>
                <div key={product._id} className="border rounded-lg overflow-hidden">
                  <div className="relative h-[160px] cursor-pointer">
                    <Image
                      src={product.images?.[0]?.url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3 cursor-pointer">
                    <h4 className="font-medium text-sm">{product.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex gap-2 md:gap-1 mt-2 w-full justify-start md:justify-center">
                      <div className="text-xs md:text-[10px] bg-gray-100 px-2 py-1 rounded">
                        {product.listingLocation?.city}
                      </div>
                      {product.features?.map((feature, index) => (
                        <div
                          key={index}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="font-medium text-sm mt-2">Current Price: ₦{product.price?.currentPrice?.toLocaleString()}</div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

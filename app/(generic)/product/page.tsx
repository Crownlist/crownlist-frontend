/* eslint-disable */
"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Heart } from "lucide-react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/Header1"
import Footer from "@/components/Footer"
import { useProducts, ApiProduct } from "@/hooks/useProducts"
import { useLikedProducts } from "@/hooks/useLikedProducts"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

function ProductContent() {
  const searchParams = useSearchParams()
  const { products: apiProducts, loading } = useProducts()
  const [liked, setLiked] = useState<boolean>(false)
  const [toggling, setToggling] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  // const [isLoading, setIsLoading] = useState(true);
  const { toggleLike } = useLikedProducts()


  const searchTerm = searchParams?.get('search') || ''
  const locationFilter = searchParams?.get('location') || ''

  // Filter products based on search parameters
  const filteredProducts = useMemo(() => {
    if (!apiProducts.length) return []

    let filtered = [...apiProducts]

    // Filter by search term (in name or description)
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase()
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.keywords?.some(keyword => keyword.toLowerCase().includes(term))
      )
    }

    // Filter by location
    if (locationFilter.trim()) {
      const location = locationFilter.trim().toLowerCase()
      filtered = filtered.filter(product =>
        product.listingLocation?.city?.toLowerCase().includes(location) ||
        product.listingLocation?.country?.toLowerCase().includes(location)
      )
    }

    return filtered
  }, [apiProducts, searchTerm, locationFilter])

  const convertApiProductToProduct = (p: ApiProduct) => ({
    id: p._id,
    slug: p.slug,
    image: p.images?.[0]?.url || "/placeholder.svg",
    title: p.name,
    description: p.description || "",
    price: p.price?.currentPrice ? `₦${p.price.currentPrice.toLocaleString()}` : "",
    time: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "",
    location: p.listingLocation ? `${p.listingLocation.city || ''}${p.listingLocation.city ? ', ' : ''}${p.listingLocation.country || ''}` : "",
    distance: "",
    condition: "New",
    features: p.features || [],
    category: p.category,
    subCategory: p.subCategory,
  })

  const handleLike = async (e: React.MouseEvent, id: string) => {
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
      await toggleLike(id)
    } catch (err: any) {
      setLiked(!newLiked) // revert
      toast("error", err.message || "Failed to toggle like")
    } finally {
      setToggling(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header hidden={false} />
      <div className="container mx-auto py-6 max-md:px-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-700">
            {searchTerm ? `Search results for "${searchTerm}"` : 'All Products'}
            {locationFilter && ` in ${locationFilter}`}
          </span>
        </div>

        {/* Results Header */}
        <div className="flex flex-row gap-0 mb-6">
          <p className="font-semibold">
            {searchTerm ? `Search results for "${searchTerm}"` : 'All Products'}
            {locationFilter && ` in ${locationFilter}`}
          </p>
          <p className="font-light">({filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} found)</p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <div className="h-[160px] bg-gray-200 animate-pulse" />
                <div className="p-3 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-full animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                  <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4 text-purple-600">
              <Image
                src="/binocular.png"
                width={60}
                height={60}
                alt="No results"
                className="mx-auto"
              />
            </div>
            <h2 className="text-xl font-medium mb-2">No search results found</h2>
            <div className="text-gray-500 max-w-md mx-auto space-y-2">
              <p>Try using different or more general keywords</p>
              <p>Remove filters or search for a broader category</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const displayProduct = convertApiProductToProduct(product)
              return (
                <Link href={`/product/${product.slug}`} key={product._id}>
                  <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    <div className="relative h-[160px]">
                      <Image
                        src={displayProduct.image}
                        alt={displayProduct.title}
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
                      <h4 className="font-medium text-sm line-clamp-2">{displayProduct.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{displayProduct.description}</p>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {displayProduct.location && (
                          <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {displayProduct.location}
                          </div>
                        )}
                        {displayProduct.features.slice(0, 2).map((feature, index) => (
                          <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {feature}
                          </div>
                        ))}
                      </div>
                      <div className="font-medium text-sm mt-2">{displayProduct.price}</div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex flex-col min-h-screen bg-white justify-center items-center"><div>Loading...</div></div>}>
      <ProductContent />
    </Suspense>
  )
}

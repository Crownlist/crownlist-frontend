/*eslint-disable*/
"use client"

import { HeartIcon, MapPinIcon, List, Grid3X3 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { ApiProduct } from "@/hooks/useProducts"
import { useLikedProducts } from "@/hooks/useLikedProducts"
import { useToast } from "@/lib/useToastMessage"
import { useState } from "react"
import ProductCard from "./Product-card"

interface SavedProps {
}

export default function Saved({}: SavedProps) {
  const { products, meta, toggleLike } = useLikedProducts()
  const { handleMessage } = useToast()
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')

  const savedItems = products.map((product) => ({
    id: product._id,
    image: product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url || "/product1.png",
    title: product.name,
    description: product.description || "",
    location: product.listingLocation ? `${product.listingLocation.city || ""}, ${product.listingLocation.country || ""}`.replace(/^, |, $/, "") : "",
    tags: product.keywords?.slice(0, 2) || [],
    price: product.price?.currentPrice ? `₦${product.price.currentPrice.toLocaleString()}` : "N/A",
    slug: product.slug
  }))

  const handleToggle = async (productId: string) => {
    try {
      await toggleLike(productId)
    } catch (err: any) {
      handleMessage("error", err.message || "Failed to toggle like")
    }
  }

  if (savedItems.length === 0) {
    return null
  }
  return (
    <div className="flex flex-col md:flex-row">
      {/* Main Content */}
      <main className="flex-1 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Saved</h2>
          {/* <button
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            className="p-2 hover:bg-gray-100 rounded-md"
            aria-label={`Switch to ${viewMode === 'list' ? 'grid' : 'list'} view`}
          >
            {viewMode === 'list' ? <Grid3X3 size={20} /> : <List size={20} />}
          </button> */}
        </div>

        {viewMode === 'list' ? (
          <div className="space-y-6">
            {savedItems.map((item) => (
              <Link href={`/product/${item.slug || item.id}`} key={item.id}>
              <div  className="flex flex-col sm:flex-row gap-4 border p-4 rounded-xl bg-white mb-2 hover:shadow-md transition-shadow">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={280}
                  height={180}
                  className="rounded-xl object-cover w-full sm:w-[280px] h-auto"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggle(item.id);
                      }}
                      className="hover:bg-gray-100 rounded-full p-1 transition-colors"
                      aria-label="Unlike"
                    >
                      <HeartIcon className="text-red-500" fill="red" size={20} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-gray-700 mt-2">
                    <span className="inline-flex items-center gap-1">
                      <MapPinIcon size={14} />
                      {item.location}
                    </span>
                    {item.tags.map((tag, i) => (
                      <span key={i} className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-2 text-black font-semibold">{item.price}</div>
                </div>
              </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedItems.map((item) => (
              <ProductCard
                key={item.id}
                viewMode="grid"
                isLiked={true}
                id={item.id}
                slug={item.slug}
                image={item.image}
                title={item.title}
                description={item.description}
                location={item.location}
                price={item.price}
              />
            ))}
          </div>
        )}

        {meta?.totalPages > 1 && (
          <div className="mt-10 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 gap-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              <button className="hover:underline whitespace-nowrap">&larr; Previous</button>
              <div className="flex gap-1">
                {[1, 2, 3, "...", 8, 9, 10].map((pg, i) => (
                  <button
                    key={i}
                    className={cn(
                      "px-2 py-1 rounded",
                      pg === 1 ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
                    )}
                  >
                    {pg}
                  </button>
                ))}
              </div>
              <button className="hover:underline whitespace-nowrap">Next &rarr;</button>
            </div>

            <div className="flex items-center gap-1">
              Showing
              <Select defaultValue="8">
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                  <SelectItem value="32">32</SelectItem>
                </SelectContent>
              </Select>
              of 50
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

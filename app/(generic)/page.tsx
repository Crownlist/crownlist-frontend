"use client"

import SectionHeader from "@/components/Home/Section-header"
import Header from "@/components/Header1"
import Hero from "@/components/Home/Hero"
import SponsoredPost from "@/components/Home/SponsoredPost"
import Footer from "@/components/Footer"
import ProductSection from "@/components/Home/ProductSection"
import CategoryGrid from "@/components/Home/Category"
import { useRouter } from "next/navigation"
import CategoryScroll from "@/components/Home/CategoryScroll"
import { useProducts, ApiProduct } from "@/hooks/useProducts"
import { useCategories } from "@/hooks/useCategories"
import { useState, useEffect, useRef } from "react"
import { Product } from "@/types/product/product"
import { Subcategory } from "@/types/category/category"
import { apiClientPublic } from "@/lib/interceptor"

export default function Home() {
  const { products: apiProducts, loading: loadingProducts } = useProducts()
  const { categories, loading: loadingCategories } = useCategories()

  // Debug categories and trending products
  console.log('Categories in Home component:', categories)
  console.log('Categories loading:', loadingCategories)
  console.log('Trending Now products (apiProducts):', apiProducts)
  console.log('Trending Now loading state:', loadingProducts)
  const [allFeaturedProducts, setAllFeaturedProducts] = useState<Product[]>([])
  const heroRef = useRef<HTMLDivElement | null>(null);
  const hasFetchedProductsRef = useRef(false)
  const router = useRouter()

  // Fetch ALL featured products and group by subcategory
  useEffect(() => {
    const fetchAllFeaturedProducts = async () => {
      if (!hasFetchedProductsRef.current) {
        hasFetchedProductsRef.current = true

        try {
          console.log('Fetching all featured products...')
        const response = await apiClientPublic.get('/products?isFeatured=true&limit=100')
        const data = response.data
        const featuredProducts = data.data?.products || []
        console.log('Fetched all featured products:', featuredProducts.length, featuredProducts)
        setAllFeaturedProducts(featuredProducts)
        } catch (error) {
          console.log('Error fetching featured products:', error)
        }
      }
    }

    fetchAllFeaturedProducts()
  }, [])

  const handleSeeMore = (url: string) => {
    router.push(url)
  }

  // Helper function to convert API Product to ProductSection Product
  const convertApiProductToSectionProduct = (p: Product) => ({
    id: p._id,
    image: p.images?.[0]?.url || "/placeholder.svg",
    title: p.name,
    description: p.description || "",
    price: p.price?.currentPrice ? `₦${p.price.currentPrice.toLocaleString()}` : "",
    time: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "",
    location: p.listingLocation ? `${p.listingLocation.city || ''}${p.listingLocation.city ? ', ' : ''}${p.listingLocation.country || ''}` : "",
    distance: "",
    condition: "New",
    breadcrumbCat: "Category",
    breadcrumbSub: "Subcategory",
    breadcrumbLabel: p.name,
  })

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header hidden={true} />
      

      {/* Hero Section */}
      <div className="flex flex-col relative">
        <div ref={heroRef}>
        <Hero />
        </div>

        {/* Main Content */}
        <main className="flex flex-col-reverse gap-3 md:gap-12  justify-between py-6  mx-auto w-full container max-md:px-4">
          <div className=" py-4 flex flex-col  md:w-full">
            {/* Trending Now - only fetched items */}
            {loadingProducts ? (
              <div className="mb-8">
                <SectionHeader title="Trending Now" showViewToggle={false} />
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 md:gap-4">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="rounded-lg overflow-hidden border border-gray-200">
                      <div className="aspect-square w-full bg-gray-200 animate-pulse" />
                      <div className="p-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                        <div className="h-3 bg-gray-100 rounded w-full mt-2 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-1/3 mt-3 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <ProductSection
                title="Trending Now"
                products={apiProducts.slice(0, 4).map((p: ApiProduct) => ({
                  id: p._id,
                  image: p.images?.[0]?.url || "/placeholder.svg",
                  title: p.name,
                  description: p.description || "",
                  price: p.price?.currentPrice ? `₦${p.price.currentPrice.toLocaleString()}` : "",
                  time: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "",
                  location: p.listingLocation ? `${p.listingLocation.city || ''}${p.listingLocation.city ? ', ' : ''}${p.listingLocation.country || ''}` : "",
                  distance: "",
                  labels: [],
                  condition: "New",
                  breadcrumbCat: "Category",
                  breadcrumbSub: "Subcategory",
                  breadcrumbLabel: p.name,
                }))}
                initialView="grid"
                showSeeMore
                onSeeMoreClick={() => handleSeeMore("/sponsored")}
              />
            )}

            {/* Sponsored Post - only fetched items */}
            <div className="mb-8">
              <SectionHeader title="Sponsored post" showViewToggle={false} />
              {loadingProducts ? (
                <div className="grid grid-cols-2 gap-4">
                  {[1,2].map((i) => (
                    <div key={i} className="rounded-lg overflow-hidden border border-gray-200">
                      <div className="aspect-[4/3] w-full bg-gray-200 animate-pulse" />
                      <div className="p-3">
                        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                        <div className="h-3 bg-gray-100 rounded w-full mt-2 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <SponsoredPost items={apiProducts.slice(0, 4).map((p: ApiProduct) => ({
                  id: p._id,
                  image: p.images?.[0]?.url || "/placeholder.svg",
                  title: p.name,
                  description: p.description || "",
                  location: p.listingLocation ? `${p.listingLocation.city || ''}${p.listingLocation.city ? ', ' : ''}${p.listingLocation.country || ''}` : "",
                  category: 'Featured',
                  price: p.price?.currentPrice ? `₦${p.price.currentPrice.toLocaleString()}` : "",
                }))} />
              )}
            </div>

            {/* Featured Products by Subcategory */}
            {(() => {
              console.log('All featured products:', allFeaturedProducts)

              // Group featured products by subcategory
              const subcategoryMap = new Map<string, { subcategory: Subcategory | null; products: Product[] }>()

              allFeaturedProducts.forEach(product => {
                if (product.subCategory) {
                  const subId = typeof product.subCategory === 'string' ? product.subCategory : (product.subCategory as Subcategory)._id
                  if (!subcategoryMap.has(subId)) {
                    const subcategory = typeof product.subCategory === 'object' ? (product.subCategory as Subcategory) : null
                    subcategoryMap.set(subId, { subcategory, products: [] })
                  }
                  subcategoryMap.get(subId)!.products.push(product)
                }
              })

              console.log('Grouped featured products by subcategory:', Array.from(subcategoryMap.entries()))

              if (allFeaturedProducts.length === 0) {
                return null // Don't display anything if no featured products
              }

              const renderedSections = Array.from(subcategoryMap.values())
                .sort((a, b) => b.products.length - a.products.length) // Sort by most products first
                .slice(0, 6) // Show up to 6 sections
                .map((group, index) => {
                  if (group.products.length === 0 || !group.subcategory) return null

                  const subcategory = group.subcategory as Subcategory

                  return (
                    <ProductSection
                      key={`featured-${subcategory.slug || subcategory._id}-${index}`}
                      title={`Featured ${subcategory.name}`}
                      products={group.products.slice(0, 4).map(convertApiProductToSectionProduct)}
                      initialView="grid"
                      showSeeMore
                      onSeeMoreClick={() => handleSeeMore(`/category/${subcategory.slug || subcategory._id}`)}
                    />
                  )
                })
                .filter(Boolean)

              return renderedSections.length > 0 ? renderedSections : null
            })()}
          </div>
          
          <div className="relative sm:hidden">
            <CategoryGrid/>
          </div>
          <div className="relative max-sm:hidden">
            <CategoryScroll />
          </div>
          
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

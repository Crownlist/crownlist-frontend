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
import { useFeaturedSubcategories } from "@/hooks/useFeaturedSubcategories"
import { useSubcategoryProducts } from "@/hooks/useSubcategoryProducts"
import { useState, useEffect, useRef } from "react"
import { Product } from "@/types/product/product"

export default function Home() {
  const { products: apiProducts, loading: loadingProducts } = useProducts()
  const { categories, loading: loadingCategories } = useCategories()
  const { featuredSubcategories, loading: loadingSubcategories } = useFeaturedSubcategories()

  // Debug categories
  console.log('Categories in Home component:', categories)
  console.log('Categories loading:', loadingCategories)
  const { fetchProductsBySubcategory } = useSubcategoryProducts()
  const [subcategoryProducts, setSubcategoryProducts] = useState<{ [subcategoryId: string]: Product[] }>({})
  const heroRef = useRef<HTMLDivElement | null>(null);
  const hasFetchedProductsRef = useRef(false)
  const router = useRouter()

  // Fetch products for featured subcategories
  useEffect(() => {
    const fetchAllSubcategoryProducts = async () => {
      if (featuredSubcategories.length > 0 && !hasFetchedProductsRef.current) {
        hasFetchedProductsRef.current = true
        const productsMap: { [subcategoryId: string]: Product[] } = {}

        // Fetch products for each featured subcategory (limit to first 6 for performance)
        const subcategoriesToFetch = featuredSubcategories.slice(0, 6)

        for (const featuredSubcat of subcategoriesToFetch) {
          // Try featured products first
          let products = await fetchProductsBySubcategory(featuredSubcat.subcategory._id, true)
          if (products.length === 0) {
            // If no featured products, get regular products
            products = await fetchProductsBySubcategory(featuredSubcat.subcategory._id, false)
          }
          if (products.length > 0) {
            productsMap[featuredSubcat.subcategory._id] = products
          }
        }

        setSubcategoryProducts(productsMap)
      }
    }

    fetchAllSubcategoryProducts()
  }, [featuredSubcategories, fetchProductsBySubcategory])

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
                products={apiProducts.slice(0, 2).map((p: ApiProduct) => ({
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
                <SponsoredPost items={apiProducts.slice(0, 2).map((p: ApiProduct) => ({
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

            {/* Dynamic Featured Subcategories */}
            {(() => {
              console.log('Featured subcategories:', featuredSubcategories)
              console.log('Subcategory products:', subcategoryProducts)
              console.log('Loading subcategories:', loadingSubcategories)

              if (loadingSubcategories) {
                return (
                  <div className="mb-8">
                    <SectionHeader title="Loading Featured Categories..." showViewToggle={false} />
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
                )
              }

              if (featuredSubcategories.length === 0) {
                return null
              }

              const renderedSections = featuredSubcategories
                .slice(0, 4)
                .map((featuredSubcat) => {
                  const products = subcategoryProducts[featuredSubcat.subcategory._id] || []

                  console.log(`Subcategory ${featuredSubcat.subcategory.name}:`, products.length, 'products')

                  // Only show subcategories that have products
                  if (products.length === 0) {
                    return null
                  }

                  return (
                    <ProductSection
                      key={featuredSubcat.subcategory._id}
                      title={`Featured ${featuredSubcat.subcategory.name}`}
                      products={products.slice(0, 4).map(convertApiProductToSectionProduct)}
                      initialView="grid"
                      showSeeMore
                      onSeeMoreClick={() => handleSeeMore(`/category/${featuredSubcat.subcategory.slug}`)}
                    />
                  )
                })
                .filter(Boolean)

              if (renderedSections.length === 0) {
                return null
                
                // (
                //   <div className="mb-8">
                //     <SectionHeader title="No Products Available" showViewToggle={false} />
                //     <p className="text-gray-500 text-center py-8">Featured categories found but no products available.</p>
                //   </div>
                // )
              }

              return renderedSections
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

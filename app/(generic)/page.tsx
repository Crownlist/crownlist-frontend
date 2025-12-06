"use client";

import SectionHeader from "@/components/Home/Section-header";
import Header from "@/components/Header1";
import Hero from "@/components/Home/Hero";
import SponsoredPost from "@/components/Home/SponsoredPost";
import Footer from "@/components/Footer";
import ProductSection from "@/components/Home/ProductSection";
import CategoryGrid from "@/components/Home/Category";
import { useRouter } from "next/navigation";
import CategoryScroll from "@/components/Home/CategoryScroll";
import { useProducts, ApiProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useState, useEffect, useRef } from "react";
import { Product } from "@/types/product/product";
import { Subcategory, Category } from "@/types/category/category";
import { apiClientPublic } from "@/lib/interceptor";

interface SubcategoryWithProducts {
  category: Category;
  subcategory: Subcategory;
  products: Product[];
  loading: boolean;
}

export default function Home() {
  const { products: apiProducts, loading: loadingProducts } = useProducts();
  const { categories } = useCategories();

  const [subcategoryProducts, setSubcategoryProducts] = useState<
    SubcategoryWithProducts[]
  >([]);
  const [isFetchingSubcategories, setIsFetchingSubcategories] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const hasFetchedProductsRef = useRef(false);
  const router = useRouter();

  // Fetch products for all subcategories
  useEffect(() => {
    const fetchProductsForSubcategories = async () => {
      // Only fetch once when categories are available
      if (hasFetchedProductsRef.current || categories.length === 0) {
        return;
      }
      hasFetchedProductsRef.current = true;

      setIsFetchingSubcategories(true);

      try {
        const allSubcategoriesWithProducts: SubcategoryWithProducts[] = [];

        // Loop through all categories
        for (const category of categories) {
          if (!category.subCategories || category.subCategories.length === 0) {
            continue;
          }

          // Fetch products for each subcategory using Promise.all for parallel requests
          const subcategoryPromises = category.subCategories.map(
            async (subcategory: Subcategory) => {
              try {
                const response = await apiClientPublic.get(
                  `/products?subcategory_slug=${subcategory.slug}&limit=4`
                );
                const products = response.data?.products || [];

                return {
                  category,
                  subcategory,
                  products: products as Product[],
                  loading: false,
                };
              } catch {
                return {
                  category,
                  subcategory,
                  products: [] as Product[],
                  loading: false,
                };
              }
            }
          );

          const results = await Promise.all(subcategoryPromises);
          allSubcategoriesWithProducts.push(...results);
        }

        // Filter to only show subcategories with products and limit to 10 sections
        const filteredResults = allSubcategoriesWithProducts
          .filter((item) => item.products.length > 0)
          .slice(0, 10);

        setSubcategoryProducts(filteredResults);
      } catch {
        setSubcategoryProducts([]);
      } finally {
        setIsFetchingSubcategories(false);
      }
    };

    fetchProductsForSubcategories();
  }, [categories]);

  const handleSeeMore = (url: string) => {
    router.push(url);
  };

  // Helper function to safely extract breadcrumb values
  const getBreadcrumbValue = (
    value: string | { slug?: string } | null | undefined
  ): string => {
    if (typeof value === "object" && value?.slug) return value.slug;
    if (typeof value === "string" && value) return value;
    return "";
  };

  // Helper function to convert API Product to ProductSection Product
  const convertApiProductToSectionProduct = (p: Product) => ({
    id: p._id,
    slug: p.slug,
    image: p.images?.[0]?.url || "/placeholder.svg",
    title: p.name,
    description: p.description || "",
    price: p.price?.currentPrice
      ? `₦${p.price.currentPrice.toLocaleString()}`
      : "",
    time: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "",
    location: p.listingLocation
      ? `${p.listingLocation.city || ""}${p.listingLocation.city ? ", " : ""}${
          p.listingLocation.country || ""
        }`
      : "",
    distance: "",
    condition: "New",
    breadcrumbCat:
      typeof p.category === "object"
        ? (p.category as Category).slug
        : (p.category as string),
    breadcrumbSub:
      typeof p.subCategory === "object"
        ? (p.subCategory as Subcategory).slug
        : (p.subCategory as string),
    breadcrumbLabel: p.name,
  });

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
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="rounded-lg overflow-hidden border border-gray-200"
                    >
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
                  slug: p.slug,
                  image: p.images?.[0]?.url || "/placeholder.svg",
                  title: p.name,
                  description: p.description || "",
                  price: p.price?.currentPrice
                    ? `₦${p.price.currentPrice.toLocaleString()}`
                    : "",
                  time: p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString()
                    : "",
                  location: p.listingLocation
                    ? `${p.listingLocation.city || ""}${
                        p.listingLocation.city ? ", " : ""
                      }${p.listingLocation.country || ""}`
                    : "",
                  distance: "",
                  labels: [],
                  condition: "New",
                  breadcrumbCat: getBreadcrumbValue(p.category) || "category",
                  breadcrumbSub:
                    getBreadcrumbValue(p.subCategory) || "subcategory",
                  breadcrumbLabel: p.name,
                }))}
                initialView="grid"
                showSeeMore
                onSeeMoreClick={() => handleSeeMore("/product")}
                useBreadcrumbRouting={false}
              />
            )}

            {/* Sponsored Post - only fetched items */}
            <div className="mb-8">
              <SectionHeader title="Sponsored post" showViewToggle={false} />
              {loadingProducts ? (
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="rounded-lg overflow-hidden border border-gray-200"
                    >
                      <div className="aspect-4/3 w-full bg-gray-200 animate-pulse" />
                      <div className="p-3">
                        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                        <div className="h-3 bg-gray-100 rounded w-full mt-2 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <SponsoredPost
                  items={apiProducts.slice(0, 4).map((p: ApiProduct) => ({
                    id: p._id,
                    slug: p.slug,
                    image: p.images?.[0]?.url || "/placeholder.svg",
                    title: p.name,
                    description: p.description || "",
                    location: p.listingLocation
                      ? `${p.listingLocation.city || ""}${
                          p.listingLocation.city ? ", " : ""
                        }${p.listingLocation.country || ""}`
                      : "",
                    category: "Featured",
                    price: p.price?.currentPrice
                      ? `₦${p.price.currentPrice.toLocaleString()}`
                      : "",
                  }))}
                />
              )}
            </div>

            {/* Featured Products by Subcategory */}
            {isFetchingSubcategories ? (
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="mb-8">
                    <SectionHeader title="Loading..." showViewToggle={false} />
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 md:gap-4">
                      {[1, 2, 3, 4].map((j) => (
                        <div
                          key={j}
                          className="rounded-lg overflow-hidden border border-gray-200"
                        >
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
                ))}
              </div>
            ) : subcategoryProducts.length > 0 ? (
              subcategoryProducts.map((item, index) => (
                <ProductSection
                  key={`subcategory-products-${item.subcategory._id}-${index}`}
                  title={`Featured ${item.subcategory.name}`}
                  products={item.products.map(
                    convertApiProductToSectionProduct
                  )}
                  initialView="grid"
                  showSeeMore
                  onSeeMoreClick={() =>
                    handleSeeMore(
                      `/${item.category.slug}/${item.subcategory.slug}`
                    )
                  }
                />
              ))
            ) : null}
          </div>

          <div className="relative sm:hidden">
            <CategoryGrid />
          </div>
          <div className="relative max-sm:hidden">
            <CategoryScroll />
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

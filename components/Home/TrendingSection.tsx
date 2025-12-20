"use client";

import ProductSection from "@/components/Home/ProductSection";
import { useProducts, ApiProduct } from "@/hooks/useProducts";

interface TrendingSectionProps {
  onSeeMoreClick: () => void;
}

export default function TrendingSection({
  onSeeMoreClick,
}: TrendingSectionProps) {
  const { products: apiProducts, loading: loadingProducts } = useProducts();

  // Helper function to safely extract breadcrumb values
  const getBreadcrumbValue = (
    value: string | { slug?: string } | null | undefined
  ): string => {
    if (typeof value === "object" && value?.slug) return value.slug;
    if (typeof value === "string" && value) return value;
    return "";
  };

  return (
    <div className="mb-8">
      {loadingProducts ? (
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
            time: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "",
            location: p.listingLocation
              ? `${p.listingLocation.city || ""}${
                  p.listingLocation.city ? ", " : ""
                }${p.listingLocation.country || ""}`
              : "",
            distance: "",
            labels: [],
            condition: "New",
            breadcrumbCat: getBreadcrumbValue(p.category) || "category",
            breadcrumbSub: getBreadcrumbValue(p.subCategory) || "subcategory",
            breadcrumbLabel: p.name,
          }))}
          initialView="grid"
          showSeeMore
          onSeeMoreClick={onSeeMoreClick}
          useBreadcrumbRouting={false}
        />
      )}
    </div>
  );
}

"use client";

import SectionHeader from "@/components/Home/Section-header";
import SponsoredPost from "@/components/Home/SponsoredPost";
import { useProducts, ApiProduct } from "@/hooks/useProducts";

export default function SponsoredSection() {
  const { products: apiProducts, loading: loadingProducts } = useProducts();

  return (
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
            price: "",
            originalPrice: p.price?.currentPrice || undefined,
            discountedPrice: p.price?.discountedPrice || undefined,
          }))}
        />
      )}
    </div>
  );
}

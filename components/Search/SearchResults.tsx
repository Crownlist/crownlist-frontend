import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { SearchResult } from "@/hooks/useSearchState";

interface SearchResultsProps {
  searchResults: SearchResult[];
  isSearchLoading: boolean;
  onClearFilters?: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  searchResults,
  isSearchLoading,
  onClearFilters,
}) => {
  if (isSearchLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (searchResults.length > 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {searchResults.map((product) => (
          <Link href={`/product/${product.slug}`} key={product._id}>
            <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <div className="relative h-[160px]">
                <Image
                  src={product.images?.[0]?.url || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.isFeatured && (
                  <div className="absolute top-2 left-2 bg-[#1f058f] text-white text-xs px-2 py-1 rounded">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-3">
                <h4 className="font-medium text-sm line-clamp-2">
                  {product.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {product.listingLocation?.city && (
                    <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {product.listingLocation.city}
                    </div>
                  )}
                  {product?.features
                    ?.slice(0, 2)
                    .map((feature: string, index: number) => (
                      <div
                        key={index}
                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                      >
                        {feature}
                      </div>
                    ))}
                </div>
                {product.price.discountedPrice && (
                  <div className="font-medium text-sm mt-2">
                    ₦{product.price.discountedPrice.toLocaleString()}
                  </div>
                )}
                {!product.price.discountedPrice && (
                  <div className="font-medium text-sm mt-2">
                    ₦{product.price.currentPrice.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <p className="text-gray-500">No products found matching your search.</p>
      <Button
        onClick={onClearFilters}
        className="mt-4 bg-[#1f058f] hover:bg-[#2a0bc0]"
      >
        Clear Filters
      </Button>
    </div>
  );
};

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";

interface Product {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  images?: Array<{
    url: string;
    altText?: string;
    isPrimary?: boolean;
    _id: string;
  }>;
  listingLocation?: { city?: string; country?: string };
  features?: string[];
  price?: { currentPrice?: number; discountedPrice?: number };
}

interface SimilarProductsProps {
  products: Product[];
  loading: boolean;
  maxItems?: number;
}

export const SimilarProducts: React.FC<SimilarProductsProps> = ({
  products,
  loading,
  maxItems = 4,
}) => {
  return (
    <div className="mt-8 mb-8 px-4 md:px-0 max-w-7xl mx-auto">
      <h3 className="font-medium text-lg mb-4">You might also like these</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: maxItems }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          : products.slice(0, maxItems).map((product) => (
              <Link href={`/product/${product.slug}`} key={product._id}>
                <div className="border rounded-lg overflow-hidden">
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
                    <div className="font-medium text-sm mt-2">
                      Current Price: ₦
                      {product.price?.currentPrice?.toLocaleString()}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ServerProductData } from "@/lib/server/product-service";

interface SimilarProductsProps {
  products: ServerProductData[];
  loading?: boolean;
  maxItems?: number;
}

export const SimilarProducts: React.FC<SimilarProductsProps> = ({
  products,
  loading = false,
  maxItems = 4,
}) => {
  if (loading || !products.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        You might also like
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.slice(0, maxItems).map((product) => (
          <Link
            key={product._id}
            href={`/product/${product.slug}`}
            className="group"
          >
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col bg-white">
              {/* Image Container */}
              <div className="relative h-32 sm:h-40 w-full bg-gray-100 overflow-hidden">
                <Image
                  src={product.images?.[0]?.url || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {product.price?.discountedPrice && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Discount
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-2 sm:p-3 flex flex-col grow">
                <h4 className="font-medium text-xs sm:text-sm text-gray-900 line-clamp-2 group-hover:text-blue-600">
                  {product.name}
                </h4>

                {product.listingLocation?.city && (
                  <p className="text-xs text-gray-600 mt-1">
                    {product.listingLocation.city}
                  </p>
                )}

                <div className="mt-auto pt-2 flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold text-gray-900">
                    ₦
                    {(product.price?.currentPrice || 0).toLocaleString("en-NG")}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

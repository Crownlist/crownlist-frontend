import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ServerProductData } from "@/lib/server/product-service";

interface SimilarProductsProps {
  products: ServerProductData[];
  loading?: boolean;
  maxItems?: number;
  currentId?: string;
  currentSlug?: string;
}

export const SimilarProducts: React.FC<SimilarProductsProps> = ({
  products,
  loading = false,
  maxItems = 4,
  currentId,
  currentSlug,
}) => {
  if (loading || !products.length) {
    return null;
  }
  // filter out the currently viewed product by id or slug
  const filtered = products.filter(
    (p) => p._id !== currentId && p.slug !== currentSlug
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        You might also like
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filtered.slice(0, maxItems).map((product) => (
          <Link
            key={product._id}
            href={`/product/${product.slug}`}
            className="group"
          >
            <div className="group relative rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer bg-white">
              <div className={"relative " + "aspect-3/2 w-full"}>
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

              <div className="p-3">
                <h4 className="font-medium text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h4>

                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {product.description || ""}
                </p>

                <div className="mt-1.5">
                  {product.price?.discountedPrice ? (
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-red-600">
                        ₦{product.price.discountedPrice.toLocaleString("en-NG")}
                      </p>
                      <p className="text-xs text-gray-500 line-through">
                        ₦
                        {(product.price?.currentPrice || 0).toLocaleString(
                          "en-NG"
                        )}
                      </p>
                    </div>
                  ) : (
                    <p className="font-semibold text-sm">
                      ₦
                      {(product.price?.currentPrice || 0).toLocaleString(
                        "en-NG"
                      )}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                  {product.listingLocation?.city && (
                    <span className="text-gray-500 text-xs">
                      {product.listingLocation.city}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

import Image from "next/image";
import { Heart, MapPin } from "lucide-react";
import { FacilitiesRenderer } from "./FacilitiesRenderer";
import Link from "next/link";

interface Facility {
  label: string;
  value: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  images: { url: string }[];
  isFeatured: boolean;
  listingLocation: {
    city: string;
    country: string;
  };
  facility: {
    facilities: Facility[];
  };
  price: {
    currentPrice: number;
    discountedPrice?: number;
  };
}

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  return (
    <div className="space-y-6">
      {products.map((product) => (
        <Link
          href={`/product/${product.slug}`}
          key={product._id}
          className="border rounded-lg overflow-hidden flex flex-row w-full"
        >
          <div className="relative w-[140px] md:w-[350px] md:h-auto shrink-0">
            <Image
              src={product.images?.[0]?.url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover flex justify-center items-center align-middle"
            />
            <button className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md">
              <Heart size={18} className="text-gray-600" />
            </button>
            {product.isFeatured && (
              <div className="absolute top-3 left-3 bg-yellow-400 text-black px-2 py-1 text-xs font-medium rounded">
                Featured
              </div>
            )}
          </div>

          <div className="p-4 flex-1">
            <h3 className="font-medium text-lg mb-1">{product.name}</h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-3">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm">
                <MapPin size={14} />
                <span>
                  {product.listingLocation?.city},{" "}
                  {product.listingLocation?.country}
                </span>
              </div>
            </div>

            <div className="mb-3">
              <FacilitiesRenderer
                facilities={product.facility?.facilities || []}
                maxDisplay={2}
              />
            </div>

            <div className="font-medium">
              {product.price?.discountedPrice &&
              product.price?.discountedPrice !== product.price?.currentPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-green-600">
                    ₦{product.price.discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-sm line-through">
                    ₦{product.price.currentPrice.toLocaleString()}
                  </span>
                </div>
              ) : (
                <span>₦{product.price?.currentPrice?.toLocaleString()}</span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

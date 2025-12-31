"use client";

import React from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types/listings";

interface ListingsTableProps {
  products: Product[];
  activeDropdown: string | null;
  toggleDropdown: (id: string) => void;
  openStatusModal: (listingId: string, currentStatus: string) => void;
  getPrimaryImage: (images: Product["images"]) => string;
  getStatusBadgeVariant: (
    status: string
  ) => "default" | "secondary" | "destructive" | "outline";
  getStatusLabel: (status: string) => string;
}

const ListingsTable: React.FC<ListingsTableProps> = ({
  products,
  activeDropdown,
  toggleDropdown,
  openStatusModal,
  getPrimaryImage,
  getStatusBadgeVariant,
  getStatusLabel,
}) => {
  const router = useRouter();

  return (
    <div className="hidden lg:block bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium bg-gray-50 border-b">
            <div className="col-span-4">Product Details</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Location</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Featured</div>
            <div className="col-span-1">Actions</div>
          </div>

          <div className="divide-y">
            {products.map((product) => (
              <div
                key={product._id}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50"
              >
                <div className="col-span-4 flex items-center space-x-3">
                  <Link href={`/admin/dashboard/${product._id}`}>
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={getPrimaryImage(product.images)}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {product.slug}
                    </p>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex flex-col">
                    {product.price.discountedPrice ? (
                      <>
                        <span className="text-sm font-bold text-gray-900">
                          ₦{product.price.discountedPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500 line-through">
                          ₦{product.price.currentPrice.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-semibold">
                        ₦{product.price.currentPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="text-sm">
                    <p className="truncate">{product.listingLocation.city}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {product.listingLocation.country}
                    </p>
                  </div>
                </div>

                <div className="col-span-2">
                  <Badge
                    variant={getStatusBadgeVariant(product.status)}
                    className="text-xs"
                  >
                    {getStatusLabel(product.status)}
                  </Badge>
                </div>

                <div className="col-span-1">
                  <Badge
                    variant={product.isFeatured ? "default" : "outline"}
                    className="text-xs"
                  >
                    {product.isFeatured ? "Yes" : "No"}
                  </Badge>
                </div>

                <div className="col-span-1 flex justify-end">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleDropdown(product._id)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    {activeDropdown === product._id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border">
                        <div className="py-1">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              router.push(`/admin/dashboard/${product._id}`);
                              toggleDropdown("");
                            }}
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              openStatusModal(
                                product._id,
                                product.status.toLowerCase()
                              );
                              toggleDropdown("");
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Update Status
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingsTable;

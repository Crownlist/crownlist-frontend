"use client";

import React from "react";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types/listings";

interface ListingsCardsProps {
  products: Product[];
  expandedCards: Set<string>;
  toggleCardExpansion: (id: string) => void;
  activeDropdown: string | null;
  toggleDropdown: (id: string) => void;
  openStatusModal: (listingId: string, currentStatus: string) => void;
  getPrimaryImage: (images: Product["images"]) => string;
  getStatusBadgeVariant: (
    status: string
  ) => "default" | "secondary" | "destructive" | "outline";
  getStatusLabel: (status: string) => string;
}

const ListingsCards: React.FC<ListingsCardsProps> = ({
  products,
  expandedCards,
  toggleCardExpansion,
  activeDropdown,
  toggleDropdown,
  openStatusModal,
  getPrimaryImage,
  getStatusBadgeVariant,
  getStatusLabel,
}) => {
  const router = useRouter();

  return (
    <div className="lg:hidden space-y-4">
      {products.map((product) => {
        const isExpanded = expandedCards.has(product._id);
        return (
          <div
            key={product._id}
            className="bg-white rounded-lg border shadow-sm relative"
          >
            {/* Card Header */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <Link href={`/admin/dashboard/${product._id}`}>
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={getPrimaryImage(product.images)}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/admin/dashboard/${product._id}`}>
                      <h3 className="font-medium text-base text-gray-900 truncate">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 truncate mb-2">
                      {product.slug}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {product.price.discountedPrice ? (
                          <>
                            <span className="text-lg font-bold text-gray-900">
                              ₦{product.price.discountedPrice.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₦{product.price.currentPrice.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-semibold text-gray-900">
                            ₦{product.price.currentPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={getStatusBadgeVariant(product.status)}
                          className="text-xs"
                        >
                          {getStatusLabel(product.status)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCardExpansion(product._id)}
                          className="p-1 h-8 w-8"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Card Content */}
            {isExpanded && (
              <div className="px-4 pb-4 border-t bg-gray-50">
                <div className="pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">
                        Location:
                      </span>
                      <p className="mt-1">
                        {product.listingLocation.city},{" "}
                        {product.listingLocation.country}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Featured:
                      </span>
                      <p className="mt-1">
                        <Badge
                          variant={product.isFeatured ? "default" : "outline"}
                          className="text-xs"
                        >
                          {product.isFeatured ? "Yes" : "No"}
                        </Badge>
                      </p>
                    </div>
                    {product.price.discountedPrice && (
                      <div className="col-span-2 space-y-2">
                        <div>
                          <span className="font-medium text-gray-600">
                            Discounted Price:
                          </span>
                          <p className="mt-1 font-bold text-gray-900">
                            ₦{product.price.discountedPrice.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Original Price:
                          </span>
                          <p className="mt-1 text-gray-500 line-through">
                            ₦{product.price.currentPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleDropdown(product._id)}
                      className="h-8"
                    >
                      <MoreHorizontal className="h-4 w-4 mr-1" />
                      Actions
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Actions Dropdown - positioned outside card to avoid clipping */}
            {activeDropdown === product._id && (
              <div className="absolute top-full right-4 mt-1 w-40 bg-white rounded-md shadow-lg z-50 border">
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
        );
      })}
    </div>
  );
};

export default ListingsCards;

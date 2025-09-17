/* eslint-disable */

"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClientAdmin } from "@/lib/interceptor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Loader2, MapPin, Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  _id: string;
  name: string;
  description?: string;
  images?: Array<{ url: string; altText?: string; isPrimary?: boolean }> | string[];
  price?: {
    currentPrice?: number;
    discountedPrice?: number
  };
  listingLocation?: {
    country?: string;
    city?: string
  };
  features?: string[];
  facility?: {
    _id?: string;
    facilities?: Array<{ label: string; value: any; _id?: string }>
  };
  likes?: {
    totalLikes?: number;
    likedBy?: string[]
  };
  ratings?: {
    averageRating?: number;
    totalRatings?: number
  };
  slug?: string;
  seller?: string;
  category?: string;
  subCategory?: string;
  isFeatured?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'sold', label: 'Sold' },
  { value: 'archived', label: 'Archived' },
];

export function SellerProducts() {
  const { slug: sellerId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [updatingProducts, setUpdatingProducts] = useState<Record<string, boolean>>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ['sellerProducts', sellerId],
    queryFn: async () => {
      const response = await apiClientAdmin.get(`/products?seller=${sellerId}`);
      console.log("resssr1", response)
      return response.data.data.products as Product[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ productId, status }: { productId: string; status: string }) => {
      setUpdatingProducts(prev => ({ ...prev, [productId]: true }));
      try {
        await apiClientAdmin.patch(`/products/${productId}/status`, { status });
        return { productId, status };
      } finally {
        setUpdatingProducts(prev => ({ ...prev, [productId]: false }));
      }
    },
    onSuccess: ({ productId, status }) => {
      queryClient.setQueryData(['sellerProducts', sellerId], (oldData: Product[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(product =>
          product._id === productId ? { ...product, status } : product
        );
      });
      toast.success('Product status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update product status');
    },
  });

  const handleStatusChange = (productId: string, newStatus: string) => {
    updateStatusMutation.mutate({ productId, status: newStatus });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'sold':
        return 'default';
      case 'archived':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading products. Please try again later.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">No products found for this seller.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to User Details
        </Button>
        <div className="text-sm text-muted-foreground">
          {data.length} {data.length === 1 ? 'product' : 'products'} found
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((product:any) => {
          const primaryImage = product?.images?.length > 0
            ? product?.images[0]?.url
            : '/placeholder-product.jpg';

          return (
            <Card
              key={product._id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/admin/products/${product._id}`)}
            >
              <div className="relative h-48 w-full">
                <Image
                  src={primaryImage || '/placeholder-product.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge  className="capitalize bg-white text-black">
                    {product.status}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                  <div className="flex items-center text-sm text-amber-500">
                    <Star className="h-4 w-4 fill-current mr-1" />
                    {product.ratings?.averageRating?.toFixed(1) || 'N/A'}
                  </div>
                </div>

                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {product.listingLocation?.city || 'N/A'}, {product.listingLocation?.country || 'N/A'}
                </div>

                <div className="mt-2">
                  {product.price?.discountedPrice ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(product.price.discountedPrice)}
                      </span>
                      <span className="text-sm line-through text-muted-foreground">
                        {formatCurrency(product.price.currentPrice || 0)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-primary">
                      {product.price?.currentPrice ? formatCurrency(product.price.currentPrice) : 'Price on request'}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t text-sm">
                  <div className="flex items-center text-muted-foreground">
                    {/* <Clock className="h-4 w-4 mr-1" /> */}
                    {/* {format(new Date(product?.updatedAt || product.createdAt), 'MMM d, yyyy')} */}
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/dashboard/${product._id}`);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

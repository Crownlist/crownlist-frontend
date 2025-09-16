/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState} from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Image as ImageIcon, Tag, Clock, MapPin, User, Check, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner'; 
import { apiClientAdmin } from '@/lib/interceptor';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: {
    currentPrice: number;
    discountedPrice?: number;
  };
  images: Array<{
    url: string;
    altText: string;
    isPrimary: boolean;
    _id: string;
  }>;
  status: 'draft' | 'reviewing' | 'live' | 'rejected' | 'sold' | 'archived';
  category: string;
  subCategory: string;
  features: string[];
  listingLocation: {
    city: string;
    country: string;
  };
  seller: string;
  updatedAt: string;
//   updatedAt: string;
}

interface ProductsResponse {
  status: string;
  data: {
    products: Product[];
    totalProducts: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'reviewing', label: 'Under Review' },
  { value: 'live', label: 'Live' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'sold', label: 'Sold' },
  { value: 'archived', label: 'Archived' },
];

export default function ProductDetailsClient({ productId }: { productId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState('');
  const [product, setProduct] = useState<Product | null>(null);

  const { data: productsData, isLoading, error } = useQuery<ProductsResponse>({
    queryKey: ['adminProduct', productId],
    queryFn: async () => {
      try {
        console.log("productId", productsData)
        const response = await apiClientAdmin.get(`/products/all?${productId}`);
        console.log("resssr", response);
        const foundProduct = response.data.data.products
        if (foundProduct) {
            setProduct(foundProduct);
            setSelectedStatus(foundProduct.status);
          }
        if (!response.data.data) throw new Error('Products not found');
        return response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
      }
    },
  });

  // Find the specific product from the products array
//   useEffect(() => {
//     if (productsData?.data?.products) {
//       const foundProduct = productsData.data.products.find(p => p._id === productId);
//       if (foundProduct) {
//         setProduct(foundProduct);
//         setSelectedStatus(foundProduct.status);
//       }
//     }
//   }, [productsData, productId]);

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      try {     
        const response = await apiClientAdmin.patch(`/products/${productId}/status`, { status: newStatus });
        return response.data;
      } catch (error) {
        console.error('Error updating status:', error);
        throw new Error('Failed to update status');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProduct', productId] });
      toast.success('Product status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update product status');
    },
  });

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    updateStatusMutation.mutate(value);
  };

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" /> Back to Products
        </Button>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-4">The product you &apos; re looking for doesn &apos; t exist or has been removed.</p>
          <Button onClick={() => router.push('/admin/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }
  console.log("proff", product)
  const primaryImage = product.images?.[0];
  const formattedPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(product?.price?.currentPrice);

  const discountedPrice = product?.price?.discountedPrice
    ? new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
      }).format(product?.price?.discountedPrice)
    : null;

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ChevronLeft className="h-4 w-4 mr-2" /> Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Images */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={getStatusVariant(product?.status)} className="capitalize">
                      {product?.status}
                    </Badge>
                    {/* <span className="text-sm text-muted-foreground">
                      Posted {format(new Date(product?.updatedAt), 'MMM d, yyyy')}
                    </span> */}
                  </div>
                  <CardTitle className="text-2xl font-bold">{product?.name}</CardTitle>
                  <CardDescription className="text-lg mt-2">
                    {formattedPrice}
                    {discountedPrice && (
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        {discountedPrice}
                      </span>
                    )}
                  </CardDescription>
                </div>
                
                <Select 
                  value={selectedStatus} 
                  onValueChange={handleStatusChange}
                  disabled={updateStatusMutation.isPending}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {primaryImage ? (
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={primaryImage.url}
                    alt={primaryImage.altText || product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}

              {/* Additional Images */}
              {product?.images?.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {product?.images?.map((image: any) => (
                    <div key={image._id} className="aspect-square relative rounded-md overflow-hidden border">
                      <Image
                        src={image.url}
                        alt={image.altText || `${product.name} - ${image._id}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{product?.description}</p>
              
              {product?.features && product?.features?.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Features</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {product.features.map((feature: any, index: any) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Product Details Sidebar */}
        <div className="space-y-6">
          {/* Seller Information */}
          <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">Seller ID: {product?.seller}</p>
                  {/* <p className="text-sm text-muted-foreground">Member since {format(new Date(product.updatedAt), 'MMM yyyy')}</p> */}
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/admin/users/${product?.seller}`}>
                  View Seller Profile
                </Link>
              </Button>     
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Tag className="h-4 w-4 text-muted-foreground mr-2" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{product?.category}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 text-muted-foreground mr-2" />
                <div>
                  <p className="text-sm text-muted-foreground">Subcategory</p>
                  <p className="font-medium">{product?.subCategory}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">
                    {product?.listingLocation?.city}, {product?.listingLocation?.country}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  {/* <p className="font-medium">
                    {format(new Date(product?.updatedAt), 'MMM d, yyyy')}
                  </p> */}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Actions */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {product?.status === 'archived' 
                      ? 'This product is currently archived.' 
                      : 'Archive this product to remove it from public view.'}
                  </p>
                  <Button 
                    variant={product?.status === 'archived' ? 'outline' : 'destructive'}
                    className="w-full"
                    onClick={() => handleStatusChange(product?.status === 'archived' ? 'draft' : 'archived')}
                    disabled={updateStatusMutation.isPending}
                  >
                    {product?.status === 'archived' ? 'Unarchive Product' : 'Archive Product'}
                  </Button>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Rejecting this product will notify the seller and remove it from public view.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
                    onClick={() => handleStatusChange('rejected')}
                    disabled={updateStatusMutation.isPending || product.status === 'rejected'}
                  >
                    {product.status === 'rejected' ? 'Product Rejected' : 'Reject Product'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProductDetailsSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="mt-4 grid grid-cols-4 gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="aspect-square w-full rounded-md" />
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-9 w-full rounded-md" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'live':
      return 'default';
    case 'draft':
      return 'secondary';
    case 'reviewing':
      return 'outline';
    case 'rejected':
      return 'destructive';
    case 'archived':
      return 'outline';
    default:
      return 'default';
  }
}
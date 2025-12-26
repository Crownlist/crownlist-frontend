import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header1";
import Footer from "@/components/Footer";
import {
  ProductImageGallery,
  ProductAccordion,
  SafetyTipsSection,
  SimilarProducts,
} from "@/components/Product";
import ProductDetailsSidebar from "@/components/Home/ProductDetailsSidebar";
import {
  fetchProductBySlug,
  fetchSimilarProducts,
  generateProductMetadata,
  formatProductDate,
} from "@/lib/server/product-service";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you're looking for doesn't exist.",
    };
  }

  const metadata = generateProductMetadata(product);

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    openGraph: metadata.openGraph as Record<string, unknown>,
    twitter: metadata.twitter as Record<string, unknown>,
    alternates: metadata.alternates as Record<string, unknown>,
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export async function generateStaticParams() {
  // This can be empty if you want dynamic rendering
  // or populated with top products for better performance
  return [];
}

/**
 * Server Component: Product Detail Page
 */
export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch product data server-side
  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // console.log("Product Detail Page - product:", product);

  // Fetch similar products
  const categorySlug = product.category?.slug || product.subCategory?.slug;
  const similarProducts = categorySlug
    ? await fetchSimilarProducts(categorySlug, 4, product._id)
    : [];

  // Format data for display
  const images = product.images?.map((img) => img.url) || ["/placeholder.svg"];
  const postedDate = formatProductDate(product.createdAt);

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Header */}
      <Header hidden={false} />

      <main className="flex-1 w-full">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Product Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            {product.name}
          </h1>

          {/* Enhanced Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 overflow-x-auto pb-2">
              <Link
                href="/"
                className="hover:text-gray-900 transition-colors whitespace-nowrap"
              >
                Home
              </Link>
              <ChevronRight size={14} className="shrink-0" />

              {product.category && (
                <>
                  <Link
                    href={`/${product.category.slug}`}
                    className="hover:text-gray-900 transition-colors truncate max-w-[150px] sm:max-w-none"
                  >
                    {product.category.name}
                  </Link>
                  <ChevronRight size={14} className="shrink-0" />
                </>
              )}

              {product.subCategory && (
                <>
                  <Link
                    href={`/${product.category?.slug || ""}/${
                      product.subCategory.slug
                    }`}
                    className="hover:text-gray-900 transition-colors truncate max-w-[150px] sm:max-w-none"
                  >
                    {product.subCategory.name}
                  </Link>
                  <ChevronRight size={14} className="shrink-0" />
                </>
              )}

              <span className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-none">
                {product.name}
              </span>
            </div>
          </nav>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column - Product Images and Info (2 columns on desktop) */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Product Image Gallery */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <ProductImageGallery images={images} productId={product._id} />
              </div>

              {/* Product Information Sections */}
              {product && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <ProductAccordion product={product} />
                </div>
              )}

              {/* Safety Tips Section */}
              <SafetyTipsSection />

              <div className="lg:hidden block lg:col-span-1">
                {/* Sticky sidebar on desktop, normal flow on mobile */}
                <div className="lg:sticky lg:top-6">
                  <ProductDetailsSidebar
                    product={product}
                    postedDate={postedDate}
                  />
                </div>
              </div>

              {/* Similar Products */}
              {similarProducts.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <SimilarProducts
                    products={similarProducts}
                    loading={false}
                    currentId={product._id}
                    currentSlug={product.slug}
                  />
                </div>
              )}
            </div>

            {/* Right Column - Product Details Sidebar (1 column on desktop) */}
            <div className="hidden lg:block lg:col-span-1">
              {/* Sticky sidebar on desktop, normal flow on mobile */}
              <div className="lg:sticky lg:top-6">
                <ProductDetailsSidebar
                  product={product}
                  postedDate={postedDate}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

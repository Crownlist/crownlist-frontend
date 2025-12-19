"use client";

import SectionHeader from "@/components/Home/Section-header";
import ProductSection from "@/components/Home/ProductSection";
import { useCategories } from "@/hooks/useCategories";
import { useState, useEffect, useRef } from "react";
import { Product } from "@/types/product/product";
import { Subcategory, Category } from "@/types/category/category";
import { apiClientPublic } from "@/lib/interceptor";
import CategorySubcategoriesModal from "@/components/CategorySubcategoriesModal";

interface CategoryWithProducts {
  category: Category;
  products: Product[];
  loading: boolean;
}

export default function FeaturedSubcategoriesSection() {
  const { categories } = useCategories();

  const [categoryProducts, setCategoryProducts] = useState<
    CategoryWithProducts[]
  >([]);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasFetchedProductsRef = useRef(false);

  // Fetch products for all categories
  useEffect(() => {
    const fetchProductsForCategories = async () => {
      // Only fetch once when categories are available
      if (hasFetchedProductsRef.current || categories.length === 0) {
        return;
      }
      hasFetchedProductsRef.current = true;

      setIsFetchingCategories(true);

      try {
        const allCategoriesWithProducts: CategoryWithProducts[] = [];

        // Loop through all categories
        for (const category of categories) {
          if (!category.subCategories || category.subCategories.length === 0) {
            continue;
          }

          // Collect all products from subcategories
          const allProducts: Product[] = [];

          // Fetch products for each subcategory using Promise.all for parallel requests
          const subcategoryPromises = category.subCategories.map(
            async (subcategory: Subcategory) => {
              try {
                const response = await apiClientPublic.get(
                  `/products?subcategory_slug=${subcategory.slug}&limit=10`
                );
                const products = response.data?.products || [];
                return products as Product[];
              } catch {
                return [] as Product[];
              }
            }
          );

          const results = await Promise.all(subcategoryPromises);
          results.forEach((products) => allProducts.push(...products));

          // Shuffle and pick up to 4 random products
          const shuffledProducts = allProducts.sort(() => 0.5 - Math.random());
          const selectedProducts = shuffledProducts.slice(0, 4);

          if (selectedProducts.length > 0) {
            allCategoriesWithProducts.push({
              category,
              products: selectedProducts,
              loading: false,
            });
          }
        }

        // Limit to 10 categories
        const filteredResults = allCategoriesWithProducts.slice(0, 10);

        setCategoryProducts(filteredResults);
      } catch {
        setCategoryProducts([]);
      } finally {
        setIsFetchingCategories(false);
      }
    };

    fetchProductsForCategories();
  }, [categories]);

  // Helper function to convert API Product to ProductSection Product
  const convertApiProductToSectionProduct = (p: Product) => ({
    id: p._id,
    slug: p.slug,
    image: p.images?.[0]?.url || "/placeholder.svg",
    title: p.name,
    description: p.description || "",
    price: p.price?.currentPrice
      ? `₦${p.price.currentPrice.toLocaleString()}`
      : "",
    time: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "",
    location: p.listingLocation
      ? `${p.listingLocation.city || ""}${p.listingLocation.city ? ", " : ""}${
          p.listingLocation.country || ""
        }`
      : "",
    distance: "",
    condition: "New",
    breadcrumbCat:
      typeof p.category === "object"
        ? (p.category as Category).slug
        : (p.category as string),
    breadcrumbSub:
      typeof p.subCategory === "object"
        ? (p.subCategory as Subcategory).slug
        : (p.subCategory as string),
    breadcrumbLabel: p.name,
  });

  const handleSeeMoreClick = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  if (isFetchingCategories) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-8">
            <SectionHeader title="Loading..." showViewToggle={false} />
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 md:gap-4">
              {[1, 2, 3, 4].map((j) => (
                <div
                  key={j}
                  className="rounded-lg overflow-hidden border border-gray-200"
                >
                  <div className="aspect-square w-full bg-gray-200 animate-pulse" />
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded w-full mt-2 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/3 mt-3 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (categoryProducts.length === 0) {
    return null;
  }

  return (
    <>
      {categoryProducts.map((item, index) => (
        <ProductSection
          key={`category-products-${item.category._id}-${index}`}
          title={item.category.name}
          products={item.products.map(convertApiProductToSectionProduct)}
          initialView="grid"
          showSeeMore
          onSeeMoreClick={() => handleSeeMoreClick(item.category)}
        />
      ))}
      <CategorySubcategoriesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
      />
    </>
  );
}

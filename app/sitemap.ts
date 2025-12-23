import { MetadataRoute } from "next";
import { baseURL } from "@/constants";

interface Product {
  _id: string;
  slug: string;
  updatedAt?: string;
  createdAt?: string;
}

async function fetchAllProducts(): Promise<Product[]> {
  try {
    if (!baseURL) return [];

    const response = await fetch(`${baseURL}products?limit=1000`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 3600, // ISR: Revalidate every hour
        tags: ["products-sitemap"],
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch products: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data?.data?.products || data?.products || [];
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://crownlist.store";
  const products = await fetchAllProducts();

  const productUrls = products.map((product: Product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updatedAt
      ? new Date(product.updatedAt)
      : new Date(product.createdAt || new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Product Categories
    {
      url: `${baseUrl}/category/phones-tablets`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/category/electronics`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/category/fashion`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/category/property`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    // Dynamic Product Detail Pages
    ...productUrls,
  ];
}

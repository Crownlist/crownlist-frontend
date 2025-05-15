"use client"

import Link from "next/link"
import ProductCard from "./Product-card"
// import ProductCard from "./ProductCard" // adjust the path as needed

interface PropertyGridProps {
  properties: Array<{
    id: number
    title: string
    description: string
    location: string
    features: string[]
    price: string
    image: string
    category: string
    type: string
  }>
  viewMode?: "grid" | "list"
}

export default function PropertyGrid({ properties, viewMode = "grid" }: PropertyGridProps) {
  return (
    <div
      className={`grid ${viewMode === "grid"
          ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          : "grid-cols-1 gap-4"
        }`}
    >
      {properties.map((property) => (
        <Link key={property.id} href={`/product/${property.id}`}>
          <ProductCard
            id={property.id}
            image={property.image}
            title={property.title}
            price={property.price}
            description={property.description}
            location={property.location}
            viewMode={viewMode}
            labels={property.features}
          />
        </Link>
      ))}
    </div>
  )
}

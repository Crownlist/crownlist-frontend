"use client"

import Image from "next/image"
import { Heart, MapPin } from "lucide-react"

interface PropertyListProps {
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
}

export default function PropertyList({ properties }: PropertyListProps) {
  return (
    <div className="space-y-6">
      {properties.map((property) => (
        <div key={property.id} className="border rounded-lg overflow-hidden flex flex-col md:flex-row">
          <div className="relative h-[200px] md:h-auto md:w-[300px] flex-shrink-0">
            <Image
              src={property.image}
              alt={property.title}
              fill
              className="object-cover"
            />
            <button className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md">
              <Heart size={18} className="text-gray-600" />
            </button>
          </div>
          <div className="p-4 flex-1">
            <h3 className="font-medium text-lg mb-1">{property.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{property.description}</p>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <MapPin size={14} />
                <span>{property.location}</span>
              </div>
              {property.features.map((feature, index) => (
                <div key={index} className="text-gray-500 text-sm">
                  {feature}
                </div>
              ))}
            </div>
            <div className="font-medium">{property.price}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
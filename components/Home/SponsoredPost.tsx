"use client"

import Image from "next/image"
import { Heart, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

interface ProductItem {
  id: string | number
  title: string
  description: string
  location: string
  category: string
  price: string
  image: string
}

interface SponsoredPostProps {
  items: ProductItem[]
  autoSlide?: boolean
  autoSlideInterval?: number
}

export default function SponsoredPost({ items, autoSlide = true, autoSlideInterval = 5000 }: SponsoredPostProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedItems, setLikedItems] = useState<Set<string | number>>(new Set())

  // Auto slide functionality
  useEffect(() => {
    if (!autoSlide) return

    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1))
    }, autoSlideInterval)

    return () => clearInterval(slideInterval)
  }, [autoSlide, autoSlideInterval, items.length])

  // Handle navigation
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1))
  }

  // Handle like toggle
  const toggleLike = (id: string | number) => {
    setLikedItems((prevLiked) => {
      const newLiked = new Set(prevLiked)
      if (newLiked.has(id)) {
        newLiked.delete(id)
      } else {
        newLiked.add(id)
      }
      return newLiked
    })
  }

  // If no items provided, show placeholder
  if (!items || items.length === 0) {
    return <div className="w-full max-w-3xl">No sponsored posts available</div>
  }

  const currentItem = items[currentIndex]

  return (
    <div className="w-full  md:flex md:justify-center">
      {/* <div className="text-[#333] font-medium text-base mb-2">Sponsored post</div> */}
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden max-w-3xl">
        {/* Main Image */}
        <div className="absolute inset-0 transition-opacity duration-500">
          <Image
            src={currentItem.image || "/placeholder.svg"}
            alt={currentItem.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Navigation Arrows */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-colors z-10"
          onClick={goToPrevious}
          aria-label="Previous item"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-colors z-10"
          onClick={goToNext}
          aria-label="Next item"
        >
          <ChevronRight size={20} />
        </button>

        {/* Like Button */}
        <button
          className="absolute top-4 right-4 text-gray-200 hover:text-white transition-colors z-10"
          onClick={() => toggleLike(currentItem.id)}
          aria-label={likedItems.has(currentItem.id) ? "Unlike" : "Like"}
        >
          <Heart size={24} fill={likedItems.has(currentItem.id) ? "white" : "none"} />
        </button>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white z-10">
          <h2 className="text-2xl font-bold mb-1">{currentItem.title}</h2>
          <p className="text-sm mb-2">{currentItem.description}</p>

          <div className="flex items-center gap-2 mb-2">
            <MapPin size={16} className="text-white/80" />
            <span className="text-sm text-white/90">{currentItem.location}</span>
            <div className="mx-2 text-white/50">|</div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded">{currentItem.category}</span>
          </div>

          <div className="text-xl font-bold">{currentItem.price}</div>
        </div>

        {/* Slide Indicators */}
        {items.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {items.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


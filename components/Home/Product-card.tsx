/* eslint-disable */
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductCardProps {
  image: string
  title: string
  price: string
  location: string
  time: string
  distance: string
  isSponsored?: boolean
}

export default function ProductCard({
  image,
  title,
  price,
  location,
  time,
  distance,
  isSponsored = false,
}: ProductCardProps) {
  return (
    <div className="group relative border border-gray-200 rounded-md overflow-hidden bg-white hover:shadow-sm transition-shadow">
      <Link href="#" className="block">
        <div className="relative aspect-[4/3]">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/80 hover:bg-white"
          >
            <Heart className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="p-2">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-xs line-clamp-2 mb-1">{title}</h3>
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="font-bold text-xs">{price}</span>
            {isSponsored && <span className="text-[9px] text-muted-foreground bg-muted px-1 rounded">Sponsored</span>}
          </div>
          <div className="flex flex-wrap gap-x-1 text-[9px] text-muted-foreground">
            <span>{location}</span>
            <span>•</span>
            <span>{time}</span>
            <span>•</span>
            <span>{distance}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}


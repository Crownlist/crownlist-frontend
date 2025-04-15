// CategoryScroll.tsx

import { ChevronRight } from "lucide-react"
import Image from "next/image"

const categories = [
  { title: "House", cta: "Explore", img: "/assets/images/house.png", comingSoon: false },
  { title: "Phone & tablets", cta: "Explore", img: "/assets/images/pandt.png", comingSoon: false },
  { title: "Fashion", cta: "Explore", img: "/assets/images/fashion.png", comingSoon: false },
  { title: "Electronics", cta: "Explore", img: "/assets/images/elect.png", comingSoon: false },
  { title: "Cars", cta: "Coming soon", img: "/assets/images/cars.png", comingSoon: true },
  { title: "Jobs", cta: "Coming soon", img: "/assets/images/jobs.png", comingSoon: true },
  { title: "Services", cta: "Coming soon", img: "/assets/images/services.png", comingSoon: true },
  { title: "Sneakers", cta: "Coming soon", img: "/assets/images/cars.png", comingSoon: true },

]

const CategoryScroll = () => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Category</h2>

      <div className="flex overflow-x-auto no-scrollbar gap-4 py-1">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="relative min-w-[140px] h-[160px] rounded-xl overflow-hidden flex-shrink-0"
          >
            <Image
              src={cat.img}
              alt={cat.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-3 py-4 flex flex-col justify-end">
              <h3 className="text-white text-sm font-medium">{cat.title}</h3>
              {cat.comingSoon ? (
                <span className="bg-white text-xs text-black rounded-full px-3 py-1 w-fit mt-1">
                  Coming soon
                </span>
              ) : (
                <button className="flex text-white text-xs  mt-1 justify-start">
                  {cat.cta}  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryScroll

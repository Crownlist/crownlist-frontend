/* eslint-disable */
import Image from "next/image"
import Link from "next/link"
import { Heart, ChevronDown, Search, Bell, MessageSquare, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProductCard from "@/components/Home/Product-card"
import SectionHeader from "@/components/Home/Section-header"
import Header from "@/components/Header"
import Hero from "@/components/Home/Hero"
import SponsoredPost from "@/components/Home/SponsoredPost"
import Footer from "@/components/Footer"

const categories = [
  { name: 'Properties', posts: '2,392,915', icon: '🏠' },
  { name: 'Phone and tablets', posts: '8,238', icon: '💻' },
  { name: 'Fashion', posts: '8,238', icon: '👜' },
  { name: 'Electronics', posts: '8,238', icon: '🔌' },
  { name: 'Cars', posts: '0', icon: '🚗', status: 'Coming soon' },
  { name: 'Jobs', posts: '0', icon: '💼', status: 'Coming soon' },
  { name: 'Services', posts: '0', icon: '🔧', status: 'Coming soon' },
];

export default function Home() {
  const sponsoredItems = [
    {
      id: "1",
      title: "Men tops",
      description: "Brand new 2018 Mercedes benz viano/sprinter ...",
      location: "Lagos, Amuwo-Odofin",
      category: "Hand craft",
      price: "₦32,695,000",
      image:
        "/product1.png",
    },
    {
      id: "2",
      title: "Women's Dresses",
      description: "Premium quality summer collection 2023",
      location: "Lagos, Ikeja",
      category: "Fashion",
      price: "₦15,500",
      image: "/product2.png",
    },
    {
      id: "3",
      title: "Casual Shoes",
      description: "Comfortable leather shoes for everyday wear",
      location: "Abuja, Central",
      category: "Footwear",
      price: "₦22,800",
      image: "/product3.png",
    },
  ]
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header />
      

      {/* Hero Section */}
      {/* <section className="relative h-[300px]">
        <Image
          src="/placeholder.svg?height=400&width=1200"
          alt="Living room with couch and coffee table"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30">
          <div className="h-full flex flex-col justify-center px-4 max-w-[1200px] mx-auto">
            <h1 className="text-white text-3xl font-bold mb-1">
              Discover top deals
              <br />
              tailored for you
            </h1>
            <p className="text-white text-sm mb-4">Find exactly what you're looking for in your area</p>
            <div className="flex">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">Browse now</Button>
            </div>
          </div>
        </div>
      </section> */}
      <Hero/>

      {/* Main Content */}
      <main className="flex flex-row justify-between py-6 max-w-[1200px] mx-auto w-full">
        <div className="px-4">
          {/* Popular Items */}
          <SectionHeader title="Popular in Lagos" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <ProductCard
              image="/product1.png"
              title="Vintage coffee table"
              price="$65.00"
              location="San Francisco"
              time="2 hours ago"
              distance="3 miles"
            />
            <ProductCard
              image="/product2.png"
              title="Ergonomic designer chair"
              price="$120.00"
              location="Oakland"
              time="3 hours ago"
              distance="5 miles"
            />
            <ProductCard
              image="/product3.png"
              title="PHILIPS Smart Screen (40in)"
              price="$199.00"
              location="Berkeley"
              time="1 day ago"
              distance="7 miles"
              isSponsored
            />
            <ProductCard
              image="/product4.png"
              title="Samsung Galaxy S22 Ultra"
              price="$650.00"
              location="San Jose"
              time="5 hours ago"
              distance="12 miles"
            />
          </div>

          {/* See More Button */}
          <div className="flex justify-center mb-8">
            <Button variant="outline" className="rounded-full px-6 text-xs h-8 border-gray-300">
              See more
            </Button>
          </div>

          {/* Recommended for you */}
          <SectionHeader title="Sponsored Post" />

          <div className="mb-8">
            {/* <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
              <Image
                src="/product1.png"
                alt="Clothing rack with colorful clothes"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <h3 className="text-white font-bold text-lg">Clothing</h3>
                <p className="text-white text-sm">Find great deals on clothing near you</p>
                <Button
                  size="sm"
                  variant="secondary"
                  className="mt-2 bg-white text-black hover:bg-gray-100 h-7 text-xs"
                >
                  Shop now
                </Button>
              </div>
            </div> */}
            <SponsoredPost
            items={sponsoredItems}
            />
          </div>

          {/* Recently viewed items */}
          <SectionHeader title="Services you might need" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <ProductCard
              image="/product1.png"
              title="Vintage coffee table"
              price="$65.00"
              location="San Francisco"
              time="2 hours ago"
              distance="3 miles"
            />
            <ProductCard
              image="/product1.png"
              title="Ergonomic designer chair"
              price="$120.00"
              location="Oakland"
              time="3 hours ago"
              distance="5 miles"
            />
          </div>

          {/* Phones & tablets */}
          <SectionHeader title="Phones & tablets" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <ProductCard
              image="/product1.png"
              title="Samsung Galaxy S22 Ultra"
              price="$650.00"
              location="San Jose"
              time="5 hours ago"
              distance="12 miles"
            />
            <ProductCard
              image="/product1.png"
              title="PHILIPS Smart Screen (40in)"
              price="$199.00"
              location="Berkeley"
              time="1 day ago"
              distance="7 miles"
            />
          </div>

          {/* Featured */}
          <SectionHeader title="Properties" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <ProductCard
              image="/product1.png"
              title="Vintage coffee table"
              price="$65.00"
              location="San Francisco"
              time="2 hours ago"
              distance="3 miles"
            />
            <ProductCard
              image="/product1.png"
              title="Ergonomic designer chair"
              price="$120.00"
              location="Oakland"
              time="3 hours ago"
              distance="5 miles"
            />
            <ProductCard
              image="/product1.png"
              title="Vintage coffee table"
              price="$65.00"
              location="San Francisco"
              time="2 hours ago"
              distance="3 miles"
            />
            <ProductCard
              image="/product1.png"
              title="Ergonomic designer chair"
              price="$120.00"
              location="Oakland"
              time="3 hours ago"
              distance="5 miles"
            />
          </div>

          {/* See More Button */}
          <div className="flex justify-center mb-8">
            <Button variant="outline" className="rounded-full px-6 text-xs h-8 border-gray-300">
              See more
            </Button>
          </div>

          {/* Featured - Second Section */}
          <SectionHeader title="Properties" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <ProductCard
              image="/product1.png"
              title="Vintage coffee table"
              price="$65.00"
              location="San Francisco"
              time="2 hours ago"
              distance="3 miles"
            />
            <ProductCard
              image="/product1.png"
              title="Ergonomic designer chair"
              price="$120.00"
              location="Oakland"
              time="3 hours ago"
              distance="5 miles"
            />
            <ProductCard
              image="/product1.png"
              title="Vintage coffee table"
              price="$65.00"
              location="San Francisco"
              time="2 hours ago"
              distance="3 miles"
            />
            <ProductCard
              image="/product1.png"
              title="Ergonomic designer chair"
              price="$120.00"
              location="Oakland"
              time="3 hours ago"
              distance="5 miles"
            />
          </div>

          {/* See More Button */}
          <div className="flex justify-center mb-8">
            <Button variant="outline" className="rounded-full px-6 text-xs h-8 border-gray-300">
              See more
            </Button>
          </div>
        </div>
        {/* <div>Categories Dropdown</div> */}
        {/* Sidebar */}
        <div className="bg-white rounded-lg  p-5 h-full  shadow-md">
            <div className="flex justify-center items-center gap-2 mb-6 p-5">
              <Image
                src={'/cat.png'}
                alt="image"
                width={45}
                height={45}

              />
            </div>
            <div className="space-y-4">
              {categories.map((category, index) => (
                <>
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.posts} post</p>
                    </div>
                  </div>
                  {category.status && (
                    <span className="text-sm text-gray-500">{category.status}</span>
                  )}
                </div>
                <div className="border border-gray-100 w-full"/>
                </>
              ))}
            </div>
          </div>
      </main>

      <Footer/>
    </div>
  )
}

// import Hero from "@/components/Home/Hero";

// export default function Home() {
//   return (
//     <main>
//       <Hero />
//     </main>
//   );
// }

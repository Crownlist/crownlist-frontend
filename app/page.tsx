/* eslint-disable */
"use client"
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
import ProductSection from "@/components/Home/ProductSection"
import { useEffect, useRef, useState } from "react"

const categories = [
  { name: 'Properties', posts: '2,392,915', icon: '🏠' },
  { name: 'Phone and tablets', posts: '8,238', icon: '💻' },
  { name: 'Fashion', posts: '8,238', icon: '👜' },
  { name: 'Electronics', posts: '8,238', icon: '🔌' },
  { name: 'Cars', posts: '0', icon: '🚗', status: 'Coming soon' },
  { name: 'Jobs', posts: '0', icon: '💼', status: 'Coming soon' },
  { name: 'Services', posts: '0', icon: '🔧', status: 'Coming soon' },
];

// Sample data matching the UI in the image
const popularItems = [
  {
    image: "/product1.png",
    title: "The Green Sofa",
    description: "This product is perfect for your balcony or other small spaces. Comes in a set, fits easily folded.",
    price: "₦85,000",
    time: "2 hours ago",
    location: "Lekki, Lagos",
    distance: "3km away",
    labels: ["Furniture", "Home"],
  },
  {
    image: "/product2.png",
    title: "Dr Andrews Glasgow Stove",
    description:
      "A stove, a must-get part of a package can be a great addition to your kitchen perfect for a fine cooking experience.",
    price: "₦65,000",
    time: "3 hours ago",
    location: "Ikeja, Lagos",
    distance: "5km away",
    labels: ["Kitchen", "Appliances"],
  },
  {
    image: "/product3.png",
    title: "AMOLED Touch Screen Laptop",
    description: "Corei5 i7 - 16 - Intel Core Ultra 7 - 16GB RAM - 512GB SSD - Windows 11",
    price: "₦625,000",
    time: "1 day ago",
    location: "VI, Lagos",
    distance: "7km away",
    labels: ["Electronics", "Laptop", "Gadget"],
  },
  {
    image: "/product4.png",
    title: "SamsungGalaxy Note20 5G",
    description: "The Samsung Galaxy Note20 5G is a powerful phone w/ beautiful 6.7 in Infinity-O with a mighty S Pen.",
    price: "₦350,000",
    time: "5 hours ago",
    location: "Ajah, Lagos",
    distance: "12km away",
    labels: ["Phone", "Samsung", "Gadget"],
  },
]

const servicesItems = [
  {
    image: "/product1.png",
    title: "Men thrift",
    description: "Brand new thrift clothes for men. All sizes available.",
    price: "₦25,000",
    time: "2 hours ago",
    location: "Surulere, Lagos",
    distance: "3km away",
    labels: ["Clothing", "Fashion", "Men"],
  },
  {
    image: "/product2.png",
    title: "Table and 2 folding chairs",
    description: "This product is perfect for your balcony or other small spaces. Comes in a set, fits easily folded.",
    price: "₦35,000",
    time: "3 hours ago",
    location: "Yaba, Lagos",
    distance: "5km away",
    labels: ["Furniture", "Outdoor"],
  },
]

const phonesItems = [
  {
    image: "/product1.png",
    title: "SamsungGalaxy Note20 5G",
    description: "The Samsung Galaxy Note20 5G is a powerful phone w/ beautiful 6.7 in Infinity-O with a mighty S Pen.",
    price: "₦350,000",
    time: "5 hours ago",
    location: "Ajah, Lagos",
    distance: "12km away",
    labels: ["Phone", "Samsung", "Gadget"],
  },
  {
    image: "/product2.png",
    title: "AMOLED Touch Screen Laptop",
    description: "Corei5 i7 - 16 - Intel Core Ultra 7 - 16GB RAM - 512GB SSD - Windows 11",
    price: "₦625,000",
    time: "1 day ago",
    location: "VI, Lagos",
    distance: "7km away",
    labels: ["Electronics", "Laptop", "Gadget"],
  },
]

const propertiesItems = [
  {
    image: "/product1.png",
    title: "Table and 2 folding chairs",
    description: "This product is perfect for your balcony or other small spaces. Comes in a set, fits easily folded.",
    price: "₦35,000",
    time: "3 hours ago",
    location: "Yaba, Lagos",
    distance: "5km away",
    labels: ["Furniture", "Outdoor"],
  },
  {
    image: "/product2.png",
    title: "Small space PC gaming",
    description:
      "A stove, a must-get part of a package can be a great addition to your kitchen perfect for a fine cooking experience.",
    price: "₦65,000",
    time: "3 hours ago",
    location: "Ikeja, Lagos",
    distance: "5km away",
    labels: ["Gaming", "Electronics"],
  },
]

// Sponsored items data
// const sponsoredItems = [
//   {
//     image: "/product1.png",
//     title: "Men thrift",
//     description: "Brand new thrift clothes for men. All sizes available.",
//     buttonText: "Shop now",
//   },
// ]


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
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        console.log(heroBottom)
        setIsSticky(heroBottom <= 186); // Stick when the hero is out of view
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <div className="flex flex-col relative">
        <div ref={heroRef}>
        <Hero />
        </div>

        {/* Main Content */}
        <main className="flex flex-row justify-between py-6  mx-auto w-full container">
          <div className="px-4 py-4 flex flex-col max-w-4xl">
            {/* Popular Items */}
            <ProductSection
              title="Popular in Lagos"
              products={popularItems}
              initialView="grid"
              showSeeMore
              onSeeMoreClick={() => console.log("See more clicked")}
            />

            {/* Sponsored Post */}
            <div className="mb-8">
              <SectionHeader title="Sponsored post" showViewToggle={false} />
              <SponsoredPost items={sponsoredItems} />
            </div>

            {/* Services you might need */}
            <ProductSection title="Services you might need" products={servicesItems} initialView="grid" />

            {/* Phones & tablets */}
            <ProductSection
              title="Phones & tablets"
              products={phonesItems}
              initialView="grid"
              showSeeMore
              onSeeMoreClick={() => console.log("See more clicked")}
            />

            {/* Properties */}
            <ProductSection
              title="Properties"
              products={propertiesItems}
              initialView="grid"
              showSeeMore
              onSeeMoreClick={() => console.log("See more clicked")}
            />
          </div>
          {/* <div>Categories Dropdown</div> */}
          {/* Sidebar */}
          <div className={`hidden sm:flex w-[290px]  lg:w-[320px] ${isSticky ? "fixed top-25 right-0 lg:right[190px]" : "relative"}`}>
          <div className="">
            <div className={`bg-white rounded-lg  p-5 w-[290px] md:w-[310px] lg:w-[320px] shadow-md ${isSticky ? "" : " absolute top-[-85px] md:top-[-120px]  right-[-38px] md:right-[-15px] "}`}>
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
                  <div key={index}>
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
                    <div className="border border-gray-100 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </main>
      </div>
      <Footer />
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


"use client"

import SectionHeader from "@/components/Home/Section-header"
import Header from "@/components/Header1"
import Hero from "@/components/Home/Hero"
import SponsoredPost from "@/components/Home/SponsoredPost"
import Footer from "@/components/Footer"
import ProductSection from "@/components/Home/ProductSection"
import { useRef } from "react"
import CategoryGrid from "@/components/Home/Category"
import { useRouter } from "next/navigation"
import CategoryScroll from "@/components/Home/CategoryScroll"
import { useProducts, ApiProduct } from "@/hooks/useProducts"
import { useCategories } from "@/hooks/useCategories"



/* const popularItems = [
  {
    id: "1",
    image: "/product1.png",
    title: "The Green Sofa",
    description: "This product is perfect for your balcony or other small spaces. Comes in a set, fits easily folded.",
    price: "₦85,000",
    time: "2 hours ago",
    location: "Lekki, Lagos",
    distance: "3km away",
    labels: ["Furniture", "Home"],
    condition: "New",
  },
  {
    id: "2",
    image: "/product2.png",
    title: "Dr Andrews Glasgow Stove",
    description:
      "A stove, a must-get part of a package can be a great addition to your kitchen perfect for a fine cooking experience.",
    price: "₦65,000",
    time: "3 hours ago",
    location: "Ikeja, Lagos",
    distance: "5km away",
    labels: ["Kitchen", "Appliances"],
    condition: "New",
  },
  {
    id: "3",
    image: "/product3.png",
    title: "AMOLED Touch Screen Laptop",
    description: "Corei5 i7 - 16 - Intel Core Ultra 7 - 16GB RAM - 512GB SSD - Windows 11",
    price: "₦625,000",
    time: "1 day ago",
    location: "VI, Lagos",
    distance: "7km away",
    labels: ["Electronics", "Laptop", "Gadget"],
    condition: "New",
  },
  {
    id: "4",
    image: "/product4.png",
    title: "SamsungGalaxy Note20 5G",
    description: "The Samsung Galaxy Note20 5G is a powerful phone w/ beautiful 6.7 in Infinity-O with a mighty S Pen.",
    price: "₦350,000",
    time: "5 hours ago",
    location: "Ajah, Lagos",
    distance: "12km away",
    labels: ["Phone", "Samsung", "Gadget"],
    condition: "New",
  },
]

 const servicesItems = [
  {
    id: "5",
    image: "/product1.png",
    title: "Men thrift",
    description: "Brand new thrift clothes for men. All sizes available.",
    price: "₦25,000",
    time: "2 hours ago",
    location: "Surulere, Lagos",
    distance: "3km away",
    labels: ["Clothing", "Fashion", "Men"],
    condition: "New",
  },
  {
    id: "6",
    image: "/product2.png",
    title: "Table and 2 folding chairs",
    description: "This product is perfect for your balcony or other small spaces. Comes in a set, fits easily folded.",
    price: "₦35,000",
    time: "3 hours ago",
    location: "Yaba, Lagos",
    distance: "5km away",
    labels: ["Furniture", "Outdoor"],
    condition: "New",
  },
  {
    id: "7",
    image: "/product3.png",
    title: "Women thrift",
    description: "Brand new thrift clothes for men. All sizes available.",
    price: "₦75,000",
    time: "2 hours ago",
    location: "Badagry, Lagos",
    distance: "3km away",
    labels: ["Clothing", "Fashion", "Men"],
    condition: "New",
  },
  {
    id: "8",
    image: "/product4.png",
    title: "Men shirts",
    description: "Brand new thrift clothes for men. All sizes available.",
    price: "₦75,000",
    time: "2 hours ago",
    location: "Badagry, Lagos",
    distance: "3km away",
    labels: ["Clothing", "Fashion", "Men"],
    condition: "New",
  },
]

 const phonesItems = [
  {
    id: "9",
    image: "/product1.png",
    title: "SamsungGalaxy Note20 5G",
    description: "The Samsung Galaxy Note20 5G is a powerful phone w/ beautiful 6.7 in Infinity-O with a mighty S Pen.",
    price: "₦350,000",
    time: "5 hours ago",
    location: "Ajah, Lagos",
    distance: "12km away",
    labels: ["Phone", "Samsung", "Gadget"],
    condition: "New",
  },
  {
    id: "10",
    image: "/product2.png",
    title: "AMOLED Touch Screen Laptop",
    description: "Corei5 i7 - 16 - Intel Core Ultra 7 - 16GB RAM - 512GB SSD - Windows 11",
    price: "₦625,000",
    time: "1 day ago",
    location: "VI, Lagos",
    distance: "7km away",
    labels: ["Electronics", "Laptop", "Gadget"],
    condition: "New",
  },
  {
    id: "11",
    image: "/product4.png",
    title: "Men shirts",
    description: "Brand new thrift clothes for men. All sizes available.",
    price: "₦75,000",
    time: "2 hours ago",
    location: "Badagry, Lagos",
    distance: "3km away",
    labels: ["Clothing", "Fashion", "Men"],
    condition: "New",
  },
  {
    id: "12",
    image: "/product2.png",
    title: "Lenovo PC",
    description: "Brand new thrift clothes for men. All sizes available.",
    price: "₦75,000",
    time: "2 hours ago",
    location: "Badagry, Lagos",
    distance: "3km away",
    labels: ["Clothing", "Fashion", "Men"],
    condition: "New",
  },
]

const propertiesItems = [
  {
    id: "13",
    image: "/product1.png",
    title: "Table and 2 folding chairs",
    description: "This product is perfect for your balcony or other small spaces. Comes in a set, fits easily folded.",
    price: "₦35,000",
    time: "3 hours ago",
    location: "Yaba, Lagos",
    distance: "5km away",
    labels: ["Furniture", "Outdoor"],
    condition: "New",
  },
  {
    id: "14",
    image: "/product2.png",
    title: "Small space PC gaming",
    description:
      "A stove, a must-get part of a package can be a great addition to your kitchen perfect for a fine cooking experience.",
    price: "₦65,000",
    time: "3 hours ago",
    location: "Ikeja, Lagos",
    distance: "5km away",
    labels: ["Gaming", "Electronics"],
    condition: "New",
  },
  {
    id: "15",
    image: "/product3.png",
    title: "Samsung s25 Ultra",
    description:
      "A stove, a must-get part of a package can be a great addition to your kitchen perfect for a fine cooking experience.",
    price: "₦65,000",
    time: "3 hours ago",
    location: "Ikeja, Lagos",
    distance: "5km away",
    labels: ["Gaming", "Electronics"],
    condition: "New",
  },
  {
    id: "16",
    image: "/product2.png",
    title: "Small space PC gaming",
    description:
      "A stove, a must-get part of a package can be a great addition to your kitchen perfect for a fine cooking experience.",
    price: "₦65,000",
    time: "3 hours ago",
    location: "Ikeja, Lagos",
    distance: "5km away",
    labels: ["Gaming", "Electronics"],
    condition: "New",
  },
]

   const sponsoredItems = [
    {
      id: "17",
      title: "Men tops",
      description: "Brand new 2018 Mercedes benz viano/sprinter ...",
      location: "Lagos, Amuwo-Odofin",
      category: "Hand craft",
      price: "₦32,695,000",
      image:
        "/product1.png",
    },
    {
      id: "18",
      title: "Women's Dresses",
      description: "Premium quality summer collection 2023",
      location: "Lagos, Ikeja",
      category: "Fashion",
      price: "₦15,500",
      image: "/product2.png",
    },
    {
      id: "19",
      title: "Casual Shoes",
      description: "Comfortable leather shoes for everyday wear",
      location: "Abuja, Central",
      category: "Footwear",
      price: "₦22,800",
      image: "/product3.png",
    },
  ] */


export default function Home() {
  const { products: apiProducts, loading: loadingProducts } = useProducts()
  useCategories() // ensure categories remains loaded elsewhere without lint noise
  const heroRef = useRef<HTMLDivElement | null>(null);
  // const [isSticky, setIsSticky] = useState(false);
  const router = useRouter()
  // console.log(isSticky)



  const handleSeeMore = (url: string) =>{
    router.push(url)
  }

  // Removed dummy merge helper since sections now display only fetched items


  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header hidden={true} />
      

      {/* Hero Section */}
      <div className="flex flex-col relative">
        <div ref={heroRef}>
        <Hero />
        </div>

        {/* Main Content */}
        <main className="flex flex-col-reverse gap-3 md:gap-12  justify-between py-6  mx-auto w-full container max-md:px-4">
          <div className=" py-4 flex flex-col  md:w-full">
            {/* Trending Now - only fetched items */}
            {loadingProducts ? (
              <div className="mb-8">
                <SectionHeader title="Trending Now" showViewToggle={false} />
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 md:gap-4">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="rounded-lg overflow-hidden border border-gray-200">
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
            ) : (
              <ProductSection
                title="Trending Now"
                products={apiProducts.slice(0, 2).map((p: ApiProduct) => ({
                  id: p._id,
                  image: p.images?.[0]?.url || "/placeholder.svg",
                  title: p.name,
                  description: p.description || "",
                  price: p.price?.currentPrice ? `₦${p.price.currentPrice.toLocaleString()}` : "",
                  time: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "",
                  location: p.listingLocation ? `${p.listingLocation.city || ''}${p.listingLocation.city ? ', ' : ''}${p.listingLocation.country || ''}` : "",
                  distance: "",
                  labels: [],
                  condition: "New",
                  breadcrumbCat: "Category",
                  breadcrumbSub: "Subcategory",
                  breadcrumbLabel: p.name,
                }))}
                initialView="grid"
                showSeeMore
                onSeeMoreClick={() => handleSeeMore("/sponsored")}
              />
            )}

            {/* Sponsored Post - only fetched items */}
            <div className="mb-8">
              <SectionHeader title="Sponsored post" showViewToggle={false} />
              {loadingProducts ? (
                <div className="grid grid-cols-2 gap-4">
                  {[1,2].map((i) => (
                    <div key={i} className="rounded-lg overflow-hidden border border-gray-200">
                      <div className="aspect-[4/3] w-full bg-gray-200 animate-pulse" />
                      <div className="p-3">
                        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                        <div className="h-3 bg-gray-100 rounded w-full mt-2 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <SponsoredPost items={apiProducts.slice(0, 2).map((p: ApiProduct) => ({
                  id: p._id,
                  image: p.images?.[0]?.url || "/placeholder.svg",
                  title: p.name,
                  description: p.description || "",
                  location: p.listingLocation ? `${p.listingLocation.city || ''}${p.listingLocation.city ? ', ' : ''}${p.listingLocation.country || ''}` : "",
                  category: 'Featured',
                  price: p.price?.currentPrice ? `₦${p.price.currentPrice.toLocaleString()}` : "",
                }))} />
              )}
            </div>

            {/* Featured Electronics - only fetched items */}
            {loadingProducts ? (
              <div className="mb-2">
                <SectionHeader title="Featured Electronics" showViewToggle={false} />
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 md:gap-4">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="rounded-lg overflow-hidden border border-gray-200">
                      <div className="aspect-square w-full bg-gray-200 animate-pulse" />
                      <div className="p-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                        <div className="h-3 bg-gray-100 rounded w-full mt-2 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <ProductSection title="Featured Electronics" products={apiProducts.slice(0, 2).map((p: ApiProduct) => ({
                id: p._id,
                image: p.images?.[0]?.url || "/placeholder.svg",
                title: p.name,
                description: p.description || "",
                price: p.price?.currentPrice ? `₦${p.price.currentPrice.toLocaleString()}` : "",
                time: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "",
                location: p.listingLocation ? `${p.listingLocation.city || ''}${p.listingLocation.city ? ', ' : ''}${p.listingLocation.country || ''}` : "",
                distance: "",
                condition: "New",
                breadcrumbCat: "Category",
                breadcrumbSub: "Subcategory",
                breadcrumbLabel: p.name,
              }))} initialView="grid" 
              showSeeMore
              onSeeMoreClick={() => handleSeeMore("/category/electronics")}
              />
            )}

            {/* Phones & tablets - only fetched items */}
            {loadingProducts ? (
              <div className="mb-2">
                <SectionHeader title="Featured Phones & tablets" showViewToggle={false} />
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 md:gap-4">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="rounded-lg overflow-hidden border border-gray-200">
                      <div className="aspect-square w-full bg-gray-200 animate-pulse" />
                      <div className="p-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                        <div className="h-3 bg-gray-100 rounded w-full mt-2 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <ProductSection
                title="Featured Phones & tablets"
                products={apiProducts.slice(0, 2).map((p: ApiProduct) => ({
                  id: p._id,
                  image: p.images?.[0]?.url || "/placeholder.svg",
                  title: p.name,
                  description: p.description || "",
                  price: p.price?.currentPrice ? `₦${p.price.currentPrice.toLocaleString()}` : "",
                  time: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "",
                  location: p.listingLocation ? `${p.listingLocation.city || ''}${p.listingLocation.city ? ', ' : ''}${p.listingLocation.country || ''}` : "",
                  distance: "",
                  condition: "New",
                  breadcrumbCat: "Category",
                  breadcrumbSub: "Subcategory",
                  breadcrumbLabel: p.name,
                }))}
                initialView="grid"
                showSeeMore
                onSeeMoreClick={() => handleSeeMore("/category/phone-tablets")}
              />
            )}

            {/* Properties - only fetched items */}
            {loadingProducts ? (
              <div className="mb-2">
                <SectionHeader title="Featured Properties" showViewToggle={false} />
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 md:gap-4">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="rounded-lg overflow-hidden border border-gray-200">
                      <div className="aspect-square w-full bg-gray-200 animate-pulse" />
                      <div className="p-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                        <div className="h-3 bg-gray-100 rounded w-full mt-2 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <ProductSection
                title="Featured Properties"
                products={apiProducts.slice(0, 2).map((p: ApiProduct) => ({
                  id: p._id,
                  image: p.images?.[0]?.url || "/placeholder.svg",
                  title: p.name,
                  description: p.description || "",
                  price: p.price?.currentPrice ? `₦${p.price.currentPrice.toLocaleString()}` : "",
                  time: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "",
                  location: p.listingLocation ? `${p.listingLocation.city || ''}${p.listingLocation.city ? ', ' : ''}${p.listingLocation.country || ''}` : "",
                  distance: "",
                  condition: "New",
                  breadcrumbCat: "Category",
                  breadcrumbSub: "Subcategory",
                  breadcrumbLabel: p.name,
                }))}
                initialView="grid"
                showSeeMore
                onSeeMoreClick={() => handleSeeMore("/category/property")}
              />
            )}
          </div>
          {/* <div>Categories Dropdown</div> */}
          <div className="relative sm:hidden">
            <CategoryGrid/>
          </div>
          <div className="relative max-sm:hidden">
            <CategoryScroll />
          </div>
          
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}


  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (heroRef.current) {
  //       const heroBottom = heroRef.current.getBoundingClientRect().bottom;
  //       // console.log(heroBottom)
  //       setIsSticky(heroBottom <= 186); // Stick when the hero is out of view
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  {/* Sidebar */}
          {/* <div className={`hidden sm:flex w-[290px]  lg:w-[320px] ${isSticky ? "fixed top-25 right-0 lg:right[190px]" : "relative"}`}>
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
                        <span className="text-2xl">
                          {category.icon}
                        </span>
                        <div>
                          <h3 className="font-medium">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {category.posts} post
                          </p>
                        </div>
                      </div>
                      {category.status && (
                        <span className="text-sm text-gray-500">
                          {category.status}
                        </span>
                      )}
                    </div>
                    <div className="border border-gray-100 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div> */}
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

export default function Home() {
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
      <main className="flex-1 py-6 max-w-[1200px] mx-auto">
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
            <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
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
            </div>
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
      </main>

      {/* Newsletter */}
      <section className="bg-black text-white py-10">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Sign up for news and special offers</h2>
              
            </div>
            <div className='flex flex-col gap-1 max-w-1l'>
            <p className="text-sm text-gray-400">Get the latest cars, car news, buying tips and updates straight to your inbox. Sign up to our newsletter now.</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-gray-800 border-gray-700 text-white h-10 rounded-md"
              />
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">Subscribe</Button>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8 border-t border-gray-800">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4 text-sm">ABOUT</h3>
              <ul className="space-y-2 text-xs text-gray-400">
                <li>
                  <Link href="#">About us</Link>
                </li>
                <li>
                  <Link href="#">Careers</Link>
                </li>
                <li>
                  <Link href="#">Press</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-sm">SUPPORT</h3>
              <ul className="space-y-2 text-xs text-gray-400">
                <li>
                  <Link href="#">Help Center</Link>
                </li>
                <li>
                  <Link href="#">Safety Center</Link>
                </li>
                <li>
                  <Link href="#">Community</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-sm">LEGAL</h3>
              <ul className="space-y-2 text-xs text-gray-400">
                <li>
                  <Link href="#">Terms</Link>
                </li>
                <li>
                  <Link href="#">Privacy</Link>
                </li>
                <li>
                  <Link href="#">Cookies</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-sm">INSTALL APP</h3>
              <div className="flex gap-2 mb-4">
                <Link href="#" className="block">
                  <div className="bg-gray-800 rounded p-1 text-xs">App Store</div>
                </Link>
                <Link href="#" className="block">
                  <div className="bg-gray-800 rounded p-1 text-xs">Google Play</div>
                </Link>
              </div>
              <div className="flex gap-2">
                <Link href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          {/*kkk  */}
        </div>
        <div className="bg-black text-white py-8 md:py-12 md:m-3  border-t border-gray-800 relative h-full">
          <Image src={"/fottertext.png"} alt={'footer'} fill className="object-fill" />
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
            © 2023 crownlist. All rights reserved.
          </div>
      </footer>
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

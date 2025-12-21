"use client";

import Header from "@/components/Header1";
import Hero from "@/components/Home/Hero";
import Footer from "@/components/Footer";
import CategoryGrid from "@/components/Home/Category";
import CategoryScroll from "@/components/Home/CategoryScroll";
import TrendingSection from "@/components/Home/TrendingSection";
import SponsoredSection from "@/components/Home/SponsoredSection";
import FeaturedSubcategoriesSection from "@/components/Home/FeaturedSubcategoriesSection";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSeeMore = (url: string) => {
    router.push(url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header hidden={true} />

      {/* Hero Section */}
      <div className="flex flex-col relative">
        <div>
          <Hero />
        </div>

        {/* Main Content */}
        <main className="flex flex-col-reverse gap-3 md:gap-12  justify-between py-6  mx-auto w-full container max-md:px-4">
          <div className=" py-4 flex flex-col  md:w-full">
            <TrendingSection onSeeMoreClick={() => handleSeeMore("/product")} />
            <SponsoredSection />
            <FeaturedSubcategoriesSection />
          </div>

          <div className="relative sm:hidden">
            <CategoryGrid />
          </div>
          <div className="relative max-sm:hidden">
            <CategoryScroll />
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

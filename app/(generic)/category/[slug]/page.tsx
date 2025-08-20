import Footer from "@/components/Footer"
import Header from "@/components/Header1"
import SearchCategory from "@/components/Home/SearchCategory"
//import { useState } from "react"
// import { Metadata } from "next"

interface PageProp {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const filterData = {
  property: {
    label: "Property",
    options: ["Student", "Personal", "Office"],
  },
  "phones-tablets": {
    label: "Phones & Tablets",
    options: ["Mobile phone", "Accessories", "Tablets", "Smart watches"],
  },
  electronics: {
    label: "Electronics",
    options: ["Hardware", "Monitors", "Laptops", "Headphones", "Music equipment", "Cameras"],
  },
  fashion: {
    label: "Fashion",
    options: ["Bags", "Clothes", "Jewelry", "Shoes"],
  },
}

// Title formatter
const formatTitle = (slug: string) => slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

// export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
//   const formattedCategory = formatTitle(params.slug)
//   return {
//     title: `${formattedCategory} | CrownList`,
//     description: `Browse ${formattedCategory} listings on CrownList`,
//   }
// }

export default async function CategoryPage(props: PageProp) {
  const {slug} = await props.params
  const searchParams = await props.searchParams
  const category = slug

  const subcategoryParam = searchParams?.subcategory
  const subcategory = typeof subcategoryParam === "string"
    ? subcategoryParam
    : Array.isArray(subcategoryParam)
    ? subcategoryParam[0]
    : undefined

  const formattedCategory = formatTitle(category)
  const formattedSubcategory = subcategory ? formatTitle(subcategory) : undefined

  const filters = category in filterData
    ? filterData[category as keyof typeof filterData]
    : { label: formattedCategory, options: [] }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header hidden={false} />
      <main className="container mx-auto py-6 max-md:px-5 flex-1">
        <SearchCategory
          category={category}
          subcategory={subcategory}
          categoryTitle={formattedCategory}
          subcategoryTitle={formattedSubcategory}
          filters={filters}
          searchParams={searchParams}
        />
      </main>
      <Footer />
    </div>
  )
}

export function generateStaticParams() {
  return [
    { slug: "property" },
    { slug: "phones-tablets" },
    { slug: "electronics" },
    { slug: "fashion" },
  ]
}

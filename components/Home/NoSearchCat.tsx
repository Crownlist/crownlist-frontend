/* eslint-disable */
import {useState } from "react";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";
import { ChevronRight, Upload, Heart } from "lucide-react";
import { useCategories } from "@/hooks/useCategories"
import { Category, Subcategory } from "@/types/category/category"

const NoSearchCat = ({ cat, subcat }: any) => {

const { categories } = useCategories()

  // Find the current category based on the cat prop
  const currentCategory = categories.find(category => category.slug === cat || category.name.toLowerCase() === cat?.toLowerCase())


 const generateCategoryUrl = (category: Category, subcategory?: Subcategory) => {
    if (subcategory) {
      return `/category/${category.slug}?subcategory=${subcategory.name.toLowerCase().replace(/\s+/g, '-')}`
    }
    return `/category/${category.slug}`
  }





  const similarProducts = [
    {
      id: 1,
      title: "The Green hostel",
      description:
        "This product is perfect for your balcony or other smaller spaces since it can be easily folded",
      location: "Eleko",
      features: ["One room", "Gate"],
      price: "₦95,232",
      image: "/product1.png",
    },
    {
      id: 2,
      title: "St Andrews Glasgow Green",
      description:
        "A corner, a nook or even part of a passage can be a well-equipped, comfortable place for a few ...",
      location: "Poly gate",
      features: ["Room & parlor", "24hrs solar"],
      price: "₦595,232",
      image: "/product2.png",
    },
    {
      id: 3,
      title: "St Andrews Glasgow Green",
      description:
        "A corner, a nook or even part of a passage can be a well-equipped, comfortable place for a few ...",
      location: "Poly gate",
      features: ["Room & parlor", "24hrs solar"],
      price: "₦595,232",
      image: "/product4.png",
    },
    {
      id: 4,
      title: "St Andrews Glasgow Green",
      description:
        "A corner, a nook or even part of a passage can be a well-equipped, comfortable place for a few ...",
      location: "Poly gate",
      features: ["Room & parlor", "24hrs solar"],
      price: "₦595,232",
      image: "/product2.png",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="container mx-auto  py-6 max-md:px-5">
        {/* Breadcrumb */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 ">
            <Link href="/" className="hover:text-gray-700">
              Home
            </Link>
            <ChevronRight size={16} />
            <span className="text-gray-700">Category</span>
            <ChevronRight size={16} />
            <span className="text-gray-700">{cat}</span>
          </div>
          <div className="flex flex-row gap-0">
            <p className="font-semibold">Search results -  {subcat} </p>
            <p className="font-light">({subcat > 0 ? subcat : 0 } results found)</p>
          </div>
        </div>
        {/* {subcat > 0 ? subcat : 0 } */}

        <div className="flex flex-col ">
          {/* Left Sidebar */}
          {/* <div className="w-full md:w-[280px] shrink-0">
                        {/* <h1 className="text-xl font-medium mb-6">Property</h1> 


                    </div> */}

          {/* Main Content */}
          <div className="flex flex-col relative w-full">
            {/* No Results */}
            <div className="flex flex-col items-center justify-center text-center py-1">
              <div className="mb-2 text-purple-600">
                <Image
                  src={cat.image || "/binocular.png"}
                  width={45}
                  height={45}
                  alt="binocular"
                />
              </div>
              <h2 className="text-xl font-medium mb-2">
                {subcat = subcat.length > 0 ? `Results found for ${subcat}` : `No search results for &ldquo; ${subcat}&ldquo;` }
                                
              </h2>
              <div className="text-gray-500 max-w-md space-y-2">
                {currentCategory?.subCategories && currentCategory.subCategories.length > 0 ? (
                  <div className="space-y-2">
                    
                    {/* <div>
                      {currentCategory.subCategories.map((subcategory) => (
                        <div key={subcategory._id} className="">
                          {subcategory.imageUrl ? (
                            <Image 
                              src={subcategory.imageUrl} 
                              alt={subcategory.name} 
                              width={500} 
                              height={56}
                              className="object-cover "
                            />
                          ) : (
                            <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-xs text-gray-600">
                                {subcategory.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="text-xs text-gray-600">{subcategory.name}</span>
                        </div>
                      ))}
                    </div> */}
                    </div>
                 
                ) : (
                  <>
                    <p>Ensure all words are spelled correctly</p>
                    <p>Try using different or more general keywords</p>
                    <p>Remove filters or search for a broader category</p>
                  </>
                )}
              </div>
            </div>

            {/* Request Product Form */}
            <div className="mt-5 bg-white shadow  rounded-lg overflow-hidden w-full">
              <div className="flex flex-col md:flex-row w-full justify-between">
                <div className="p-6 md:w-1/2">
                  <h2 className="text-xl font-medium mb-2">
                    Request product/services
                  </h2>
                  <p className="text-gray-500 mb-6">
                    If you can&lsquo;t find the product you&lsquo;re looking
                    for, please enter the product or service details below.
                  </p>

                  <form className="flex flex-col gap-2 ">
                    <div>
                      <label className="block mb-1 text-sm">Full name</label>
                       <Input
                        className="w-full"
                        pattern="[A-Za-z\s]+"
                        title="Only letters and spaces are allowed"
                        onKeyDown={(e) => {
                          if (!/[A-Za-z\s]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => {
                          // Remove any numbers from input
                          e.target.value = e.target.value.replace(/[0-9]/g, "");
                        }}
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm">
                        Contact number
                      </label>
                      <Input
                        className="w-full"
                        type="tel"
                        pattern="[0-9]+"
                        title="Only numbers are allowed"
                        onKeyDown={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => {
                          // Remove any non-numeric characters from input
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,""
                          );
                        }}
                      />
                    </div>

                    {/* New Category Select Field */}
                    <div>
                      <label className="block mb-1 text-sm">Category</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                        <option value="">Select a category</option>
                        <option value="phones-tablets">Phones & Tablets</option>
                        <option value="land">Land</option>
                        <option value="property">Property</option>
                        <option value="electronics">Electronics</option>
                        <option value="home-appliances">Home Appliances</option>
                        <option value="automotive">Automotive</option>
                        <option value="fashion">Fashion & Accessories</option>
                        <option value="services">Services</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm">Image(s)</label>
                      <div className="border border-dashed rounded-md p-4 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Upload size={20} className="text-gray-400" />
                          <div className="text-sm">
                            <span className="text-blue-600 font-medium">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </div>
                          <div className="text-xs text-gray-400">
                            SVG, PNG, JPG or GIF (max. 800×400px)
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Description</label>
                      <Textarea className="w-full min-h-[100px]" />
                    </div>
                    <div className="flex w-full justify-center">
                      <Button className="flex w-full justify-center max-w-xl md:p-6 items-center bg-[#1F058F] hover:bg-[#2a0bc0] text-white mt-3  ">
                        Request product
                      </Button>
                    </div>
                  </form>
                </div>
                <div className="w-full h-auto relative md:w-1/2 p-6 ">
                  <Image
                    src="/hanger.png"
                    alt="Clothing on hangers"
                    width={600}
                    height={600}
                    className="object-cover h-full w-full rounded-r-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* You might also like these */}
          <div className="mt-8 mb-8 px-4 md:px-0 max-w-7xl mx-auto">
            <h3 className="font-medium text-lg mb-4">
              You might also like these
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {similarProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="relative h-[160px] cursor-pointer">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                    <button className="absolute top-2 right-2 h-7 w-7 bg-white rounded-full flex items-center justify-center cursor-pointer">
                      <Heart size={14} className="text-gray-500" />
                    </button>
                  </div>
                  <div className="p-3 shadow-sm hover:shadow-xl transition duration-200 cursor-pointer">
                    <h4 className="font-medium text-sm">{product.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex gap-2 md:gap-1 mt-2 w-full justify-start md:justify-center">
                      <div className="text-xs md:text-[10px] bg-gray-100 px-2 py-1 rounded">
                        {product.location}
                      </div>
                      {product.features.map((feature, index) => (
                        <div
                          key={index}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="font-medium text-sm mt-2">
                      {product.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoSearchCat;

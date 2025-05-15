"use client"
import React from 'react'
import ProductSection from './ProductSection'
import SectionHeader from './Section-header';
import SponsoredPost from './SponsoredPost';

const Pdisp = () => {
  const popularItems = [
    {
      id: "1", // Added ID
      image: "/assets/images/green-sofa.jpg",
      title: "The Green Sofa",
      description: "This product is perfect for your balcony or other small spaces. Comes in a set, fits easily folded.",
      price: "₦85,000",
      time: "2 hours ago",
      location: "Lekki, Lagos",
      distance: "3km away",
      labels: ["Furniture", "Home"],
      condition: "New", // Added condition
    },
    {
      id: "2", // Added ID
      image: "/assets/images/glasgow-stove.jpg",
      title: "Dr Andrews Glasgow Stove",
      description:
        "A stove, a must-get part of a package can be a great addition to your kitchen perfect for a fine cooking experience.",
      price: "₦65,000",
      time: "3 hours ago",
      location: "Ikeja, Lagos",
      distance: "5km away",
      labels: ["Kitchen", "Appliances"],
      condition: "New", // Added condition
    },
    {
      id: "3", // Added ID
      image: "/assets/images/laptop.jpg",
      title: "AMOLED Touch Screen Laptop",
      description: "Corei5 i7 - 16 - Intel Core Ultra 7 - 16GB RAM - 512GB SSD - Windows 11",
      price: "₦625,000",
      time: "1 day ago",
      location: "VI, Lagos",
      distance: "7km away",
      labels: ["Electronics", "Laptop", "Gadget"],
      condition: "New", // Added condition
    },
    {
      id: "4", // Added ID
      image: "/assets/images/samsung.jpg",
      title: "SamsungGalaxy Note20 5G",
      description: "The Samsung Galaxy Note20 5G is a powerful phone w/ beautiful 6.7 in Infinity-O with a mighty S Pen.",
      price: "₦350,000",
      time: "5 hours ago",
      location: "Ajah, Lagos",
      distance: "12km away",
      labels: ["Phone", "Samsung", "Gadget"],
      condition: "Used", // Added condition
    },
  ];

  const servicesItems = [
    {
      id: "5", // Added ID
      image: "/assets/images/clothing-rack.jpg",
      title: "Men thrift",
      description: "Brand new thrift clothes for men. All sizes available.",
      price: "₦25,000",
      time: "2 hours ago",
      location: "Surulere, Lagos",
      distance: "3km away",
      labels: ["Clothing", "Fashion", "Men"],
      condition: "New", // Added condition
    },
    {
      id: "6", // Added ID
      image: "/assets/images/table-chairs.jpg",
      title: "Table and 2 folding chairs",
      description: "This product is perfect for your balcony or other small spaces. Comes in a set, fits easily folded.",
      price: "₦35,000",
      time: "3 hours ago",
      location: "Yaba, Lagos",
      distance: "5km away",
      labels: ["Furniture", "Outdoor"],
      condition: "New", // Added condition
    },
  ];

  const phonesItems = [
    {
      id: "7", // Added ID
      image: "/assets/images/samsung.jpg",
      title: "SamsungGalaxy Note20 5G",
      description: "The Samsung Galaxy Note20 5G is a powerful phone w/ beautiful 6.7 in Infinity-O with a mighty S Pen.",
      price: "₦350,000",
      time: "5 hours ago",
      location: "Ajah, Lagos",
      distance: "12km away",
      labels: ["Phone", "Samsung", "Gadget"],
      condition: "Used", // Added condition
    },
    {
      id: "8", // Added ID
      image: "/assets/images/laptop.jpg",
      title: "AMOLED Touch Screen Laptop",
      description: "Corei5 i7 - 16 - Intel Core Ultra 7 - 16GB RAM - 512GB SSD - Windows 11",
      price: "₦625,000",
      time: "1 day ago",
      location: "VI, Lagos",
      distance: "7km away",
      labels: ["Electronics", "Laptop", "Gadget"],
      condition: "New", // Added condition
    },
  ];

  const propertiesItems = [
    {
      id: "9", // Added ID
      image: "/assets/images/table-chairs.jpg",
      title: "Table and 2 folding chairs",
      description: "This product is perfect for your balcony or other small spaces. Comes in a set, fits easily folded.",
      price: "₦35,000",
      time: "3 hours ago",
      location: "Yaba, Lagos",
      distance: "5km away",
      labels: ["Furniture", "Outdoor"],
      condition: "New", // Added condition
    },
    {
      id: "10", // Added ID
      image: "/assets/images/small-space.jpg",
      title: "Small space PC gaming",
      description:
        "A stove, a must-get part of a package can be a great addition to your kitchen perfect for a fine cooking experience.",
      price: "₦65,000",
      time: "3 hours ago",
      location: "Ikeja, Lagos",
      distance: "5km away",
      labels: ["Gaming", "Electronics"],
      condition: "Used", // Added condition
    },
  ];

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
  ];

  return (
    <>
      <div className="px-4 py-4">
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
        <ProductSection title="Services you might need" products={servicesItems} initialView="list" />

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
    </>
  );
};

export default Pdisp;
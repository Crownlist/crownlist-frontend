// utils/mockData.ts

export const mockData = [
    // Phones & Tablets
    ...Array.from({ length: 9 }).map((_, i) => ({
      id: i + 1,
      title: "Phone Item " + (i + 1),
      description: "A premium phone item",
      location: "Lagos",
      features: ["64GB", "4G"],
      price: "₦120,000",
      image: "/cat1.png",
      category: "phones-tablets",
      type: ["mobile", "accessories", "tablets", "watches"][i % 4],
    })),
  
    // Electronics
    ...Array.from({ length: 9 }).map((_, i) => ({
      id: 100 + i,
      title: "Electronic Item " + (i + 1),
      description: "High-quality electronic device",
      location: "Abuja",
      features: ["Bluetooth", "HD"],
      price: "₦220,000",
      image: "/cat2.png",
      category: "electronics",
      type: ["hardware", "monitors", "laptops", "headphones", "music", "cameras"][i % 6],
    })),
  
    // Properties
    ...Array.from({ length: 9 }).map((_, i) => ({
      id: 200 + i,
      title: "Property Listing " + (i + 1),
      description: "Great accommodation offer",
      location: "Ibadan",
      features: ["1 room", "Water"],
      price: "₦90,000",
      image: "/cat3.png",
      category: "property",
      type: ["student", "personal", "office"][i % 3],
    })),
  
    // Fashion
    ...Array.from({ length: 9 }).map((_, i) => ({
      id: 300 + i,
      title: "Fashion Item " + (i + 1),
      description: "Trendy fashion gear",
      location: "Port Harcourt",
      features: ["Cotton", "Slim fit"],
      price: "₦15,000",
      image: "/cat4.png",
      category: "fashion",
      type: ["bags", "clothes", "jewelry", "shoes"][i % 4],
    })),
  ]
  
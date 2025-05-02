// utils/mockData.ts
export  const termsAndConditions = [
  {
    id: 1,
    title: "ACCEPTANCE OF THE TERMS",
    content: "These Terms and Conditions of Use (the “Terms”) constitute a binding and enforceable legal contract between CROWNLIST and you. By accessing or using the CROWNLIST website and mobile applications (collectively, the “Platform”), you agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not access or use the Platform.",
  },
  {
    id: 2,
    title: "ACCOUNT REGISTRATION",
    content: "To use certain features of the Platform, you must register an account (the “Account”). You may create an Account by providing your name, email address, and password. Alternatively, you can sign up directly using your Google account. You are responsible for maintaining the confidentiality of your Account details and for all activities that occur under your Account.",
  },
  {
    id: 3,
    title: "TARGET AUDIENCE",
    content: "CROWNLIST is primarily targeted at students and youth, but anyone can use the Platform to buy or sell items across various categories, including but not limited to: - Property - Fashion - Electronics - Mobile and Tablet - Jobs - Cars - Services",
  },
  {
    id: 4,
    title: "USER CONTENT",
    content: "Users are solely responsible for the content they post on the Platform (“User Content”). CROWNLIST does not pre-screen User Content but reserves the right to remove any content that violates these Terms or is deemed inappropriate at our discretion.",
    subSections: [
      {
        id: "4.1",
        title: "Prohibited Content",
        content: "Users must not post content that: - Is false, misleading, or deceptive - Infringes on any third-party rights - Contains explicit or pornographic material - Promotes illegal activities - Violates any applicable laws or regulations",
      },
    ],
  },
  {
    id: 5,
    title: "LISTING AND FEES",
    content: "CROWNLIST allows free listings by default. Users may promote their listings (featured) for a small fee, and also have the option to upgrade their Accounts for enhanced features that may lead to increased visibility and trust.",
  },
  {
    id: 6,
    title: "DISPUTE RESOLUTION",
    content: "While CROWNLIST aims to provide a satisfactory experience for all users, we are not responsible for resolving disputes between users. Users are encouraged to communicate directly to resolve any issues amicably.",
  },
  {
    id: 7,
    title: "PRIVACY POLICY",
    content: "Your privacy is important to us. Please review our Privacy Policy, which outlines how we collect, use, and protect your personal information. (Note: You may need to develop a Privacy Policy later.)",
  },
  {
    id: 8,
    title: "GOVERNING LAW",
    content: "These Terms shall be governed by the laws of the Federal Republic of Nigeria. Any disputes arising from these Terms shall be resolved in accordance with applicable laws.",
  },
  {
    id: 9,
    title: "MODIFICATIONS TO THE TERMS",
    content: "CROWNLIST reserves the right to modify these Terms at any time. Any changes will be effective immediately upon posting on the Platform. Your continued use of the Platform after changes signifies your acceptance of the modified Terms.",
  },
  {
    id: 10,
    title: "CONTACT INFORMATION",
    content: "For any questions or concerns regarding these Terms, please contact us at: [support@crownlist.ng](mailto:support@crownlist.ng).",
  },
];
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
  
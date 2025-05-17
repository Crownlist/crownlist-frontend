"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import DeleteModal from "@/components/Home/DeleteModal";

export default function ProductDashboard() {
    const [activeTab, setActiveTab] = useState("product");
    const [activeFilter, setActiveFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = () => {
        // perform delete logic here
        console.log("Post deleted!");
        setIsModalOpen(false);
    };
    const products = [
        {
            id: 1,
            title: "The Green hostel",
            description: "This product is perfect for your balcony or other smaller spaces since it can be easily folded",
            status: "reviewing",
            featured: true,
            image: "/product1.png",
        },
        {
            id: 2,
            title: "St Andrews Glasgow Green",
            description: "A corner, a nook or even part of a passage can be a well-equipped, comfortable place for a few ...",
            status: "live",
            featured: true,
            image: "/product2.png",
        },
        {
            id: 3,
            title: "Samsung Galaxy Note20 5G",
            description: "The Samsung Galaxy Note20 5G is a powerful phone as beautiful as it is intelligent with a mighty...",
            status: "live",
            featured: true,
            image: "/product3.png",
        },
        {
            id: 4,
            title: "AMOLED Touch Screen Laptop",
            description: "Copilot+ PC - 16\" - Intel Core Ultra 7 - 16GB Memory - 1TB SSD - Gray",
            status: "decline",
            featured: false,
            image: "/product4.png",
        },
        {
            id: 5,
            title: "DAMMÄNG",
            description: "The stackable bins help you save space and allow waste sorting to be part of the home interior",
            status: "live",
            featured: false,
            image: "/product4.png",
        },
    ];

    const filtered = products.filter(
        (p) => activeFilter === "all" || p.status === activeFilter
    );

    const statusColor = {
        live: "bg-green-100 text-green-700",
        reviewing: "bg-yellow-100 text-yellow-800",
        decline: "bg-red-100 text-red-700",
    };

    return (
        <div className="p-6 bg-white min-h-screen">
            {/* Header Tabs */}
            <h1 className="text-2xl font-bold mb-5 justify-start flex ">Product</h1>
            <div className="flex justify-between items-center mb-4 w-full ">
                <Tabs value={activeTab} onValueChange={setActiveTab}
                    className=" p-1 shadow-sm w-full  rounded-md"
                >
                    <TabsList className="bg-white   flex justify-start ">
                        <TabsTrigger value="product" className=" data-[state=active]:border-[#1F058F] data-[state=active]:text-[#1F058F] "
                        >Post</TabsTrigger>
                        <TabsTrigger value="feedback" className=" data-[state=active]:border-[#1F058F] data-[state=active]:text-[#1F058F] ">Feedback</TabsTrigger>
                    </TabsList>
                </Tabs>

            </div>

            {activeTab == 'product' && (
                <>
                    <div className="font-bold mb-2">Post</div>
                    <div className="flex flex-row items-center  mb-4 justify-between text-center">
                        <p className="text-sm text-muted-foreground flex">
                            Keep track and manage your post
                        </p>
                        <Button className="bg-[#1F058F] hover:bg-[#2e0a94] text-white px-5 py-2 rounded-full text-[13px]">
                            Add product
                        </Button>
                    </div>
                    {/* Status Filters */}
                    <div className="flex gap-2 mb-6 border-[1.5px] border-[#1F058F] p-2 rounded-md">
                        {["all", "live", "reviewing", "decline"].map((status) => (
                            <Button
                                key={status}
                                // variant={activeFilter === status ? "default" : status === "decline" ? "destructive" : "outline"}
                                className={`px-5 rounded-md ${activeFilter === status ? "bg-[#1F058F] hover:bg-[#2f0a94dc]" : ' text-black shadow-none bg-transparent hover:bg-transparent hover:text-[#1F058F]'}`}
                                onClick={() => setActiveFilter(status)}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Button>
                        ))}
                    </div>

                    {/* Product Cards */}
                    <div className="space-y-4 gap-3 flex flex-col w-full h-full">
                        {filtered.map((product) => (
                            // <Link href={'/seller/product/product_details'} key={product.id}>
                                <div key={product.id}
                                    className="flex max-md:flex-col flex-row bg-white rounded-xl shadow p-4 gap-5 md:gap-7  md:items-center  overflow-hidden"
                                >

                                    <div className="relative h-[200px]  md:w-[400px] flex-shrink-0 rounded ">
                                        <Image
                                            src={product.image}
                                            alt={product.title}
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                        {product.featured && (
                                            <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-3 w-full h-[100%] justify-start  align-middle">
                                        <div className="flex flex-col gap-2 justify-start ">
                                            <div className="flex flex-col ">
                                                <h3 className="flex font-semibold text-base">{product.title}</h3>
                                                <p className="flex text-sm text-gray-500 mt-1 line-clamp-2">
                                                    {product.description}
                                                </p>
                                            </div>
                                            <div className={`flex justify-start px-4 w-fit  py-1 text-xs font-medium rounded-full  ${statusColor[product.status as keyof typeof statusColor]}`}>
                                                {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-1">
                                                <Button className="flex p-1 gap-1 items-center align-middle bg-transparent shadow-none hover:bg-transparent hover:text-[#1F058F]">
                                                    <div className="flex">
                                                        <Image src={'/edit.svg'} width={15} height={15} alt='svg' />
                                                    </div>
                                                    <div className="text-[#525252] hover:text-[#1F058F] text-sm underline">
                                                        Edit
                                                    </div>
                                                </Button>
                                                <Button className="flex p-1 gap-1 items-center align-middle bg-transparent shadow-none hover:bg-transparent hover:text-[#1F058F]" onClick={() => setIsModalOpen(true)}>
                                                    <div className="flex hover:text-[#1F058F]">
                                                        <Image src={'/del.svg'} width={15} height={15} alt='svg' />
                                                    </div>
                                                    <div className="text-[#525252] text-sm underline hover:text-[#1F058F] ">
                                                        Delete
                                                    </div>
                                                </Button>
                                            </div>
                                            <Button className="text-[#1F058F] border border-[#1F058F] hover:bg-[#2e0a94] bg-transparent  hover:text-white px-1 lg:px-4 py-1  rounded-full text-[12px]">Promote</Button>
                                        </div>
                                    </div>
                                </div>
                            // </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between max-md:flex-col max-md:items-start max-md:gap-2  py-4 items-center text-sm text-gray-600">
                        <p>Showing 5 of 50</p>
                        <div className="flex gap-2 w-fit">
                            <Button variant="outline" className="max-sm:text-[10px] px-2 py-1">Previous</Button>
                            {[1, 2, 3].map((page) => (
                                <Button key={page} variant="outline" >{page}</Button>
                            ))}
                            <span className="px-2 py-1">...</span>
                            <Button variant="outline">10</Button>
                            <Button variant="outline" className="max-sm:text-[10px] px-2 py-1">Next</Button>
                        </div>
                    </div>
                </>
            )}

            {activeTab == 'feedback' && (
                <>
                    <div className="pt-3 flex flex-col w-full  h-full">
                        <div className=" w-full mx-auto">
                            <h1 className="text-md font-bold mb-1 justify-start flex ">Feedback</h1>
                            <p className="text-gray-600 mb-12">Manage your post feedback</p>
                            <div className=" flex flex-col h-full  justify-center items-center">
                                <div className="mb-4 flex justify-center">
                                    <Image
                                        src={'/feed.svg'}
                                        width={80}
                                        height={80}
                                        alt="box"
                                    />
                                </div>

                                <h2 className="text-xl font-semibold mb-2">No feedback</h2>
                                <p className="text-gray-500 mb-8">You currently have no post feedback to display</p>

                                <Link href={'/seller/product/1'}>
                                    <Button className="bg-[#1F058F] hover:bg-[#2e0a94] text-white px-8 py-2 rounded-full">Post product</Button>
                                </Link>
                                <div className="mt-16 text-center text-gray-600 text-sm">
                                    <p>For further assistance reach out via our 24/7</p>
                                    <p>
                                        via email at{" "}
                                        <a href="mailto:support@crownlist.com" className="text-[#1F058F]">
                                            support@crownlist.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <DeleteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onDelete={handleDelete}
            />
        </div>
    );
}

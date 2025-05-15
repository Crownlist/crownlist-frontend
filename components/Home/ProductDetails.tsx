"use client"


import Image from "next/image";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";



interface ProductDetailsProps {
    postedDate: string; 
    condition: "Brand New" | "Used"
    // productId: string; 
  }


const ProductDetails = ({postedDate, condition} : ProductDetailsProps) => {
    const [view, setView] = useState<"default" | "requestCall" | "sendMessage" | "contactInfo">(
        "default"
    );

    // Handles submission with toast notification
    const handleSubmit = (type: string) => {
        toast.success(`${type} successful`, {
            position: "bottom-center",
        });

        // Reset back to default after showing toast
        setTimeout(() => setView("default"), 2000);
    };
    const handleCancel = () => {
        setView("default")
    }

       
    
    return (
        <section className="w-full max-w-2xl justify-end">
            <Toaster /> {/* Toast Notifications */}
            <div className=" w-full  mx-auto">
                {/*  bg-white p-6 rounded-lg shadow-md md:shadow-lg w-full max-w-md mx-auto */}
                {/* Toggle between Product Details and Request Call UI */}
                {view === "default" && (
                    // ============= Product Details Card =============
                    <div className="bg-white p-6 rounded-lg border w-full shadow-md md:shadow-lg">
                        <h1 className="text-xl font-medium mb-4">Furnished room and parlor in Eleko Junction, Poygate for rent</h1>

                        {/* Seller Information */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden relative">
                                <Image src="/profile.png" alt="Seller" fill className="object-cover" />
                            </div>
                            <div>
                                <h3 className="font-medium text-sm">Oyekinps Properties</h3>
                                <p className="text-xs text-gray-500">6 years on crownlist</p>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold">$90.15</span>
                                <span className="text-sm text-gray-500 line-through">$99.95</span>
                            </div>
                        </div>
                            {/* Added Posted Date */}
                            <p className="text-[12px] text-gray-600 mt-2 mb-2">
                                <span className="font-medium">Posted:</span>{postedDate || "12/1/2024"}
                            </p>
                                        

                        {/* Features */}
                        <div className="flex gap-4 mb-6">
                            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#4B5563" strokeWidth="2" />
                                    <path d="M3 9H21" stroke="#4B5563" strokeWidth="2" />
                                </svg>
                                <span className="text-xs">One room</span>
                            </div>
                            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15 8H9V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8Z"
                                        fill="#4B5563"
                                    />
                                </svg>
                                <span className="text-xs">Gate</span>
                            </div>

                            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full"  >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15 8H9V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8Z"
                                        fill="#4B5563"
                                    />
                                </svg>
                                <p className="text-sm text-gray-600">
                                <span>
                                {condition === "Brand New" ? "Brand New" : "Used"}
                                    </span>
                                </p>
                          
                            </div>


                           
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Button className="w-full  text-white bg-[#1F058F] hover:bg-[#2a0bc0]"
                                onClick={() => setView("requestCall")}
                            >Request call</Button>
                            <Button variant="outline" className="w-full"
                                onClick={() => setView("sendMessage")}
                            >
                                Send message
                            </Button>
                            <Button variant="outline" className="w-full"
                                onClick={() => setView("contactInfo")}
                            >
                                Contact information
                            </Button>
                        </div>

                        {/* Share Product */}
                        <div className="mt-6 w-full">
                            <p className="text-sm font-medium mb-3">Share product</p>
                            <div className="flex gap-1 md:gap-3">
                                <Button variant="outline" size="sm" className="flex items-center border-none gap-1 md:gap-2 text-xs">
                                    <Copy size={14} />
                                    Copy link
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2 border-none text-xs "
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M17.6 6.32C16.12 6.32 14.92 7.52 14.92 9C14.92 9.2 14.96 9.4 15 9.58L8.98 12.58C8.54 12.04 7.88 11.68 7.12 11.68C5.64 11.68 4.44 12.88 4.44 14.36C4.44 15.84 5.64 17.04 7.12 17.04C7.88 17.04 8.54 16.68 8.98 16.14L15 19.14C14.96 19.32 14.92 19.52 14.92 19.72C14.92 21.2 16.12 22.4 17.6 22.4C19.08 22.4 20.28 21.2 20.28 19.72C20.28 18.24 19.08 17.04 17.6 17.04C16.84 17.04 16.18 17.4 15.74 17.94L9.72 14.94C9.76 14.76 9.8 14.56 9.8 14.36C9.8 14.16 9.76 13.96 9.72 13.78L15.74 10.78C16.18 11.32 16.84 11.68 17.6 11.68C19.08 11.68 20.28 10.48 20.28 9C20.28 7.52 19.08 6.32 17.6 6.32Z"
                                            fill="#10B981"
                                        />
                                    </svg>
                                    Whatsapp
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex border-none items-center gap-2 text-xs "
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z"
                                            fill="#EC4899"
                                        />
                                    </svg>
                                    Instagram
                                </Button>
                            </div>
                        </div>
                    </div>

                )}
                {view === "requestCall" && (
                    // ============= Request Call UI =============
                    <div className="bg-white p-6 rounded-lg border w-full">
                        <button onClick={() => setView("default")} className="text-gray-500">
                            ←
                        </button>
                        <h2 className="text-xl font-bold mt-2">Request call</h2>
                        <p className="text-gray-500 mb-4">
                            Enter your contact information for Seller to reach out to you
                        </p>

                        <input
                            type="text"
                            placeholder="Full name"
                            className="w-full p-2 border rounded-lg mb-2"
                        />
                        <input
                            type="tel"
                            placeholder="Phone number"
                            className="w-full p-2 border rounded-lg mb-4"
                        />

                        {/* Request Call Button */}
                        <button
                            onClick={() => handleSubmit("Message sent")}
                            className="bg-[#1F058F] hover:bg-[#2a0bc0] text-white px-4 py-2 rounded-lg w-full"
                        >
                            Request Call
                        </button>

                        {/* Cancel Button */}
                        <button
                            onClick={handleCancel}
                            className="border px-4 py-2 rounded-lg w-full mt-2 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {view === "contactInfo" && (
                    <div className="bg-white p-6 rounded-lg border w-full">
                        <button onClick={() => setView("default")} className="text-gray-500">
                            ←
                        </button>
                        <h2 className="font-bold text-lg">Contact Information</h2>
                        <p>Type your message, enquiry, or concern for the seller</p>

                        <div className="flex items-center gap-3 mt-4">
                          
                            <Image 
                               src="/profile.png"
                                alt="Seller Avatar"
                                className="w-10 h-10 rounded-full">

                            </Image>
                            <div>
                                <h3 className="font-semibold">Oyekings Properties</h3>
                                <p className="text-sm flex items-center p-2">
                                    📞 081 0000 0000 &nbsp; 📧 Oyekings@joelist.com.ng
                                </p>
                                <p className="text-sm flex items-center p-2">
                                    📍 Kwara, Nigeria &nbsp; ⭐ 90.9% positive feedback
                                </p>
                            </div>
                        </div>
                        
                        <button className="border py-2 px-4 w-full mt-4 mb-2 rounded-lg hover:bg-gray-100"
                        onClick={() => setView("default")}
                        >See Store</button>
                        <button
                            onClick={() => setView("sendMessage")}
                            className="bg-[#1F058F] hover:bg-[#2a0bc0] text-white px-4 py-2 rounded-lg w-full "
                        >
                            Message Seller
                        </button>
                        <button className="border rounded-lg py-2 px-4 w-full mt-2 hover:bg-gray-100"
                            onClick={() => setView("default")}
                        >Cancel</button>
                    </div>
                )}


                {view === "sendMessage" && (
                    <div className="bg-white p-6 rounded-lg border w-full">
                        <button onClick={() => setView("default")} className="text-gray-500">
                            ←
                        </button>
                        <h2 className="font-bold text-lg">Send Message</h2>
                        <p>Type your message, enquiry, or concern for the Seller to answer</p>
                        <textarea placeholder="Message" className="border p-2 w-full mt-2" />
                        <button
                            onClick={() => handleSubmit("Message sent")}
                             className=" text-white px-4 py-2 rounded-lg w-full bg-[#1F058F] hover:bg-[#2a0bc0] mt-2"
                        >
                            Send Message
                        </button>
                        <button
                            onClick={() => setView("default")}
                            className="border py-2 px-4 w-full mt-2 rounded-lg hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div >
        </section>
    );
};

export default ProductDetails;

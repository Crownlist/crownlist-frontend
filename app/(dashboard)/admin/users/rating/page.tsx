"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Flag, MessageSquare, Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UserRatingPage() {
  const [activeTab, setActiveTab] = useState("rating")
  console.log(setActiveTab)
  
  //Reviews
  const reviews = [
    {
      id: 1,
      name: "Jimoh Adesina",
      avatar: "/profile.png",
      rating: 5,
      date: "12/1/2024",
      message:
        "10 days from the date of delivery. We ask you make sure the items have not been worn, washed, or damaged, and that you ship the item(s) back in their original packaging and box.",
      replies: [
        {
          id: 101,
          name: "Joe",
          avatar: "/profile.png",
          date: "12/1/2024",
          message:
            "10 days from the date of delivery. We ask you make sure the items have not been worn, washed, or damaged, and that you ship the item(s) back in their original packaging and box.",
        },
      ],
    },
    {
      id: 2,
      name: "Dominic",
      avatar: "/profile.png",
      rating: 4,
      date: "12/1/2024",
      message:
        "10 days from the date of delivery. We ask you make sure the items have not been worn, washed, or damaged, and that you ship the item(s) back in their original packaging and box.",
      replies: [],
    },
  ];
  return (
    <div className="p-4 md:p-12">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-6">
        <Link href="/admin/users" className="text-[#1a0066]">
          Users
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <span className="text-[#1a0066] font-medium">Users details</span>
      </div>

      {/* User Profile Summary */}
      <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        <div className="w-20 h-20 rounded-full overflow-hidden">
          <Image src="/profile.png" width={80} height={80} alt="User avatar" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1">Jimoh Adesina</h1>
          <p className="text-gray-600 mb-2">8 years on crownlist</p>

          <div className="space-y-2 mb-4">
            <div className="flex flex-row gap-3">
              <div className="flex items-center">
                <div className="w-5 h-5 mr-2 text-green-500">
                  <Image
                    src='/what.png'
                    alt='map'
                    width={30}
                    height={30}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span>081 0000 0000</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 mr-2 ">
                  <Image
                    src='/gmail.png'
                    alt='map'
                    width={30}
                    height={30}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span>Oyekings@joelist.com.ng</span>
              </div>
            </div>
            <div className="flex flex-row gap-3">
              <div className="flex items-center">
                <div className="w-5 h-5 mr-2 ">
                  <Image
                    src='/gmap.png'
                    alt='map'
                    width={30}
                    height={30}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span>Kwara, Nigeria</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500 fill-yellow-500" />
                <span>90.9% positive feedback</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="flex items-center gap-2 rounded-full shadow-none hover:shadow ">
              <MessageSquare className="h-4 w-4" />
              Message user
            </Button>
            <Button variant="outline" className="flex items-center gap-2 rounded-full shadow-none hover:shadow">
              <Flag className="h-4 w-4" />
              Flag user
            </Button>
            <Button variant="outline" className="flex items-center gap-2 rounded-full shadow-none hover:shadow">
              <X className="h-4 w-4" />
              Block user
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#f0eeff] rounded-full p-1 inline-flex mb-8 w-full">
        <Link
          href={`/admin/users/1}`}
          className={`px-6 py-2 rounded-full ${activeTab === "details" ? "bg-white text-[#1a0066] font-medium shadow-sm" : "text-gray-700 font-medium"
            }`}
        >
          Details
        </Link>
        <Link
          href={`/admin/users/1}/products`}
          className={`px-6 py-2 rounded-full ${activeTab === "products" ? "bg-white text-[#1a0066] font-medium shadow-sm" : "text-gray-700 font-medium"
            }`}
        >
          Products
        </Link>
        <Link
          href={`/admin/users/1}/rating`}
          className={`px-6 py-2 rounded-full ${activeTab === "rating" ? "bg-white text-[#1a0066] font-medium shadow-sm" : "text-gray-700 font-medium"
            }`}
        >
          Rating
        </Link>
      </div>

      <div className="mt-2 space-y-4 flex flex-col md:flex-row gap-2 justify-start">
        {/* Overall Rating */}
        <div className="flex w-full flex-col">
        <div className="flex text-2xl  font-bold text-black pb-3">Reviews</div>
          <div className="flex gap-3 flex-row mt-3">
            <div className="flex text-2xl font-bold text-black">4</div>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index} className={`text-yellow-400 text-2xl ${index < 4 ? "" : "opacity-50"}`}>★</span>
              ))}
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-2">Overall rating</p>
          <div className="mt-2 space-y-1 max-w-xl">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm">{rating}</span>
                <div className="h-2 bg-white rounded-md flex-grow">
                  <div className={`h-full bg-gray-600 rounded-md`} style={{ width: `${rating * 20}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Reviews List */}
        <div className="flex flex-col">
          {reviews.map((review) => (
            <div key={review.id} className="space-y-4">
              {/* Main Review */}
              <div className="flex gap-4">
                <Image src={review.avatar} alt={review.name} width={55} height={55} className="rounded-full h-[46px] w-[64px]" />
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index} className={`text-yellow-400 text-lg ${index < review.rating ? "" : "opacity-50"}`}>★</span>
                    ))}
                    <span className="text-sm text-gray-400 ml-2">{review.date}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{review.message}</p>
                </div>
              </div>

              {/* Replies */}
              {review.replies.length > 0 && (
                <div className="ml-12 space-y-4">
                  {review.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-4">
                      <Image src={reply.avatar} alt={reply.name} width={55} height={55} className="rounded-full h-[46px] w-[64px]" />
                      <div>
                        <p className="font-medium text-gray-300">{reply.name}</p>
                        <p className="text-xs text-gray-500">{reply.date}</p>
                        <p className="text-gray-400 text-sm mt-1">{reply.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 text-gray-400 text-sm">
                <button className="flex items-center gap-1">
                  <span className="text-lg">💬</span> See messages
                </button>
                <span>|</span>
                <button className="flex items-center gap-1">
                  <span className="text-lg">✉️</span> Reply messages
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>
      <div className="flex justify-center mt-3">
        <button className="text-gray-600 underline text-semibold text-sm">More reviews</button>
      </div>
    </div>
  )
}

import React from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ProductData } from "@/hooks/useProductData";

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  message: string;
  replies: Array<{
    id: number;
    name: string;
    avatar: string;
    date: string;
    message: string;
  }>;
}

interface ProductAccordionProps {
  product: ProductData;
}

interface FacilityItem {
  label?: string;
  value?: string;
  facility?: string;
  detail?: string;
}

export const ProductAccordion: React.FC<ProductAccordionProps> = ({
  product,
}) => {
  // Mock reviews data - in real app this would come from API
  const reviews: Review[] = [
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

  const overviewData = [
    { facility: "Wifi", detail: "No" },
    { facility: "Water", detail: "Yes" },
    { facility: "Generator", detail: "You pay weekly for fuel" },
    { facility: "Neighbor", detail: "3 apartment" },
  ];

  return (
    <div className="space-y-4">
      <Accordion
        type="single"
        collapsible
        defaultValue="description"
        className="space-y-4"
      >
        {/* Description Section */}
        <AccordionItem value="description" className="border-b pb-4">
          <AccordionTrigger className="flex items-center justify-between w-full text-left py-2">
            <span className="font-medium">Description</span>
          </AccordionTrigger>
          <AccordionContent className="mt-2 text-gray-600">
            <p>{product?.description || product?.name}</p>
          </AccordionContent>
        </AccordionItem>

        {/* Overview Section */}
        <AccordionItem value="overview" className="border-b pb-4">
          <AccordionTrigger className="flex items-center justify-between w-full text-left py-2">
            <span className="font-medium">Overview</span>
          </AccordionTrigger>
          <AccordionContent className="mt-2 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-white">
                <thead>
                  <tr className="bg-[#F5F5F5] text-[#525252]">
                    <th className="border border-[#F5F5F5] px-4 py-2 text-left">
                      Facilities
                    </th>
                    <th className="border border-[#F5F5F5] px-4 py-2 text-left">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(product?.facility?.facilities || overviewData).map(
                    (item: FacilityItem, index: number) => (
                      <tr key={index} className="bg-white text-[#525252]">
                        <td className="border border-[#F5F5F5] px-4 py-2">
                          {item.label || item.facility}
                        </td>
                        <td className="border border-[#F5F5F5] px-4 py-2">
                          {item.value || item.detail}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Property Description */}
            <p className="text-[#525252] text-sm mt-4">
              16 bed en suite property to let, 4 wheelchair access bedrooms,
              with communal kitchens and dining/lounge areas. Reception/office
              with a surveillance monitor. CCTV throughout inside and out.
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* Reviews Section */}
        <AccordionItem value="reviews" className="border-b pb-4">
          <AccordionTrigger className="flex items-center justify-between w-full text-left py-2">
            <span className="font-medium">Reviews</span>
          </AccordionTrigger>
          <AccordionContent className="mt-2 space-y-4 flex flex-col md:flex-row gap-12 justify-between">
            {/* Overall Rating */}
            <div className="flex w-full flex-col">
              <p className="text-2xl font-bold text-white">4</p>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className={`text-yellow-400 text-xl ${
                      index < 4 ? "" : "opacity-50"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-2">Overall rating</p>
              <div className="mt-2 space-y-1">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm">{rating}</span>
                    <div className="h-2 bg-white rounded-md flex-grow">
                      <div
                        className={`h-full bg-gray-600 rounded-md`}
                        style={{ width: `${rating * 20}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div>
              {reviews.map((review) => (
                <div key={review.id} className="space-y-4">
                  {/* Main Review */}
                  <div className="flex gap-4">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      width={55}
                      height={55}
                      className="rounded-full h-[46px] w-[64px]"
                    />
                    <div>
                      <p className="font-semibold">{review.name}</p>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <span
                            key={index}
                            className={`text-yellow-400 text-lg ${
                              index < review.rating ? "" : "opacity-50"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="text-sm text-gray-400 ml-2">
                          {review.date}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        {review.message}
                      </p>
                    </div>
                  </div>

                  {/* Replies */}
                  {review.replies.length > 0 && (
                    <div className="ml-12 space-y-4">
                      {review.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-4">
                          <Image
                            src={reply.avatar}
                            alt={reply.name}
                            width={55}
                            height={55}
                            className="rounded-full h-[46px] w-[64px]"
                          />
                          <div>
                            <p className="font-medium text-gray-300">
                              {reply.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {reply.date}
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                              {reply.message}
                            </p>
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
              <button className="text-green-400 font-semibold text-sm">
                More reviews
              </button>
            </div>
            {/* More Reviews */}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

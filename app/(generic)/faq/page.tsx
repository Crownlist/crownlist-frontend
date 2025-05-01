"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { faqData } from "@/constants/faqData"
import Header from "@/components/Header1"
import Footer from "@/components/Footer"



export default function FAQSection() {

  const [openItems, setOpenItems] = useState<Record<number, boolean>>({
    1: true, 
  })

  const toggleItem = (id: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (

    <>
    <Header hidden={false} />
  

    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="bg-[#f2e9ff] text-[#6941c6] px-3 py-1 rounded-full text-sm font-medium mb-4">FAQs</div>
        <h2 className="text-3xl font-bold mb-2">Frequently asked questions</h2>
        <p className="text-gray-600 max-w-xl">
          Everything you need to know about the product and billing. Can&apos;t find the answer you&apos;re looking for?{" "}
          <Link href="#" className="text-[#6941c6] font-medium hover:underline">
            Please chat to our friendly team
          </Link>
        </p>
      </div>

      <div className="relative mb-10 max-w-md mx-auto">
        <Input type="text" placeholder="Search" className="pl-10 pr-4 py-2 rounded-full border border-gray-300" />
        <Button className="absolute right-0 top-0 bottom-0 rounded-r-full bg-[#3e0bac] hover:bg-[#2e0880] text-white px-5">
          Search
        </Button>
      </div>

      <div className="space-y-4">
        {faqData.map((faq) => (
          <div key={faq.id} className="border-b border-gray-200 pb-4">
            <button
              className="flex justify-between items-center w-full text-left py-2 focus:outline-none"
              onClick={() => toggleItem(faq.id)}
              aria-expanded={!!openItems[faq.id]}
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
              <PlusCircle
                className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                  openItems[faq.id] ? "transform rotate-45" : ""
                }`}
              />
            </button>
            {openItems[faq.id] && (
              <div className="mt-2 text-gray-600 animate-fadeIn">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </>
  )
}

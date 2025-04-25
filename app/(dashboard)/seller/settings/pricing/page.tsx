"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")

  const plans = [
    {
      name: "Basic plan",
      price: "₦5,000",
      description: "Our basic plan to get you started",
      features: [
        "Access to basic features",
        "Basic reporting and analytics",
        "Up to 10 individual users",
        "20GB individual data each user",
        "Basic chat and email support",
      ],
      featurePrefix: "Everything in our free plan plus....",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13 10V3L4 14H11V21L20 10H13Z"
            stroke="#1F058F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      popular: false,
    },
    {
      name: "Standard plan",
      price: "₦5,000",
      description: "Our most popular plan",
      features: [
        "Access to basic features",
        "Basic reporting and analytics",
        "Up to 10 individual users",
        "20GB individual data each user",
        "Basic chat and email support",
      ],
      featurePrefix: "Everything in Basic plus....",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z"
            stroke="#1F058F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      popular: true,
    },
    {
      name: "Premium plan",
      price: "₦5,000",
      description: "Best for large teams",
      features: [
        "Access to basic features",
        "Basic reporting and analytics",
        "Up to 10 individual users",
        "20GB individual data each user",
        "Basic chat and email support",
      ],
      featurePrefix: "Everything in Business plus....",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z"
            stroke="#1F058F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      popular: false,
    },
  ]

  return (
    <div className="py-12 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block bg-purple-100 text-[#1F058F] px-4 py-1 rounded-full text-sm font-medium mb-4">
          Pricing
        </div>
        <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
        <p className="text-xl text-gray-600 mb-2">
          We believe crownlist should be accessible to all, no matter the size.
        </p>
        <p className="text-gray-500">No hidden fees. Cancel anytime. Start free, upgrade when ready</p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex rounded-md border p-1">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded",
              billingCycle === "monthly" ? "bg-white shadow-sm" : "text-gray-500",
            )}
          >
            Monthly billing
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded",
              billingCycle === "annual" ? "bg-white shadow-sm" : "text-gray-500",
            )}
          >
            Annual billing
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div key={index} className="border rounded-lg overflow-hidden w-fill shadow-lg ">
            <div className="p-6 flex flex-col w-full h-full">
              {/* Plan Header */}
              <div className="mb-6 flex flex-col justify-center w-full">
                <div className="flex w-full justify-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-4  ">
                  {plan.icon}
                </div>
                </div>
                <h3 className="text-lg font-semibold text-[#1F058F] mb-2 flex justify-center">{plan.name}</h3>
                <div className="flex items-baseline  w-full justify-center">
                  <span className="text-[25px] lg:text-3xl font-bold">{plan.price}</span>
                  <span className="ml-1 text-gray-500">per month</span>
                </div>
                <p className="text-gray-600 mt-1 flex  w-full justify-center">{plan.description}</p>
              </div>

              {/* CTA Button */}
              <Button
                className={cn(
                  "w-full mb-6",
                  plan.popular
                    ? "bg-[#1F058F] hover:bg-[#2a0bc0]"
                    : "bg-white text-[#1F058F] border border-[#1F058F] hover:bg-gray-50",
                )}
              >
                Get started
              </Button>
              <div className="w-full bg-[#E4E7EC] h-[2px] mt-2 mb-4"/>

              {/* Features */}
              <div className="mt-auto">
                <h4 className="font-[500] mb-4">FEATURES</h4>
                <p className="text-gray-600 mb-4">
                  Everything in{" "}
                  {plan.name === "Basic plan" ? "our free plan" : plan.name === "Standard plan" ? "Basic" : "Business"}{" "}
                  plus....
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className="h-4 w-4 text-white bg-green-500  rounded-full mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

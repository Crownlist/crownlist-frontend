/* eslint-disable */
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Layers, Zap } from "lucide-react"
import { apiClientPublic } from "@/lib/interceptor"
import { toast } from "sonner"

interface ListingLimitItem {
  _id?: string
  subCategory: string | { _id: string; name: string }
  limit: number
}

interface SubscriptionPlan {
  _id: string
  name: string
  description: string
  features: string[]
  listingLimit: ListingLimitItem[]
  amount: number
  billing_cycle: "daily" | "weekly" | "monthly" | "annually"
  status: "active" | "inactive"
  createdAt?: string
}

export default function SellerSubscriptionPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const res = await apiClientPublic.get("/subscriptionplans")
      const data = (res as any)?.data
      setPlans(Array.isArray(data) ? (data as SubscriptionPlan[]) : [])
    } catch (e: any) {
      toast.error(String(e?.message || e))
      setPlans([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPlans() }, [])

  return (
    <div className="w-full mx-auto p-4 md:p-6">
      <h1 className="text-xl font-semibold mb-2">Plan details</h1>
      <p className="text-gray-600 mb-8">Select your plan</p>

      {loading ? (
        <div className="flex justify-center items-center h-48"><p>Loading plans...</p></div>
      ) : plans.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500">No subscription plans available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan, idx) => (
            <div key={plan._id} className="border rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {idx === 0 ? (
                      <Zap className="h-5 w-5 text-[#1F058F]" />
                    ) : (
                      <Layers className="h-5 w-5 text-[#1F058F]" />
                    )}
                  </div>
                </div>
                <h3 className="text-center text-[#1F058F] font-semibold text-lg mb-2">{plan.name}</h3>
                <div className="text-center mb-2">
                  <span className="text-3xl font-bold">₦{Number(plan.amount).toLocaleString()}</span>
                  <span className="text-gray-500 ml-1">per {plan.billing_cycle}</span>
                </div>
                <p className="text-center text-gray-600 mb-6">{plan.description}</p>
                <Button
                  variant={idx % 2 === 0 ? "outline" : "default"}
                  className={idx % 2 === 0 ? "w-full border-[#1F058F] text-[#1F058F] hover:bg-[#1F058F] hover:text-white" : "w-full bg-[#1F058F] hover:bg-[#2a0bc0]"}
                >
                  Get started
                </Button>
              </div>

              <div className="border-t p-6">
                <h4 className="font-medium mb-2">FEATURES</h4>
                {plan.features?.length ? (
                  <ul className="space-y-3">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start">
                        <div className="mr-2 mt-1 flex-shrink-0">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                        </div>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">-</p>
                )}
              </div>

              <div className="border-t p-6">
                <h4 className="font-medium mb-2">LISTING LIMITS</h4>
                {plan.listingLimit?.length ? (
                  <ul className="space-y-2 text-sm">
                    {plan.listingLimit.map((item, i) => {
                      const subId = typeof item.subCategory === "string" ? item.subCategory : item.subCategory?._id
                      const subName = typeof item.subCategory === "string" ? item.subCategory : (item.subCategory?.name || subId)
                      return (
                        <li key={`${subId}-${i}`} className="flex items-center justify-between">
                          <span className="text-gray-700">{subName}</span>
                          <span className="text-gray-500">Limit: {item.limit}</span>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-500">No listing limits</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

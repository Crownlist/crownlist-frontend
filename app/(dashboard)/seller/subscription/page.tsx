/* eslint-disable */
"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Check, Layers, Zap } from "lucide-react"
import { apiClientPublic, apiClientUser } from "@/lib/interceptor"
import { useGetSubscription } from "@/lib/useGetSubscription"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"

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
  const [subscribing, setSubscribing] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const paymentStatus = searchParams.get('status')
  const paymentMessage = searchParams.get('message')

  // Get current subscription data
  const { subscriptionData } = useGetSubscription()

  // Fetch subscription plans on component mount
  useEffect(() => {
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

    fetchPlans()
  }, [])

  // Handle payment callback
  useEffect(() => {
    if (paymentStatus === 'success') {
      toast.success(paymentMessage || 'Payment successful! Redirecting to dashboard...')
      // Redirect to dashboard after a short delay
      const timer = setTimeout(() => {
        router.push('/seller/dashboard')
      }, 2000)
      return () => clearTimeout(timer)
    } else if (paymentStatus === 'error') {
      toast.error(paymentMessage || 'Payment failed. Please try again.')
    }
  }, [paymentStatus, paymentMessage, router])

  const handleSubscribeClick = (planId: string) => {
    setSelectedPlan(planId)
    setShowConfirmModal(true)
  }

  const handleSubscribe = async () => {
    if (!selectedPlan) return

    try {
      setSubscribing(selectedPlan)
      const res = await apiClientUser.post(`/subscriptions/${selectedPlan}`)

      if (res?.data?.paymentPage) {
        // Close modal and redirect to Paystack
        setShowConfirmModal(false)
        window.location.href = res.data.paymentPage
      } else {
        throw new Error('No payment page URL received')
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to initiate subscription. Please try again.'
      toast.error(errorMessage)
      setShowConfirmModal(false)
    } finally {
      setSubscribing(null)
      setSelectedPlan(null)
    }
  }


  // Fetch subscription plans on component mount
  useEffect(() => {
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

    fetchPlans()
  }, [])

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
                  onClick={() => handleSubscribeClick(plan._id)}
                  disabled={!!subscribing || plan._id === subscriptionData?.data?.subscription?.subscriptionPlanId?._id}
                >
                  {subscribing === plan._id ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : plan._id === subscriptionData?.data?.subscription?.subscriptionPlanId?._id ? (
                    'Current Plan'
                  ) : (
                    'Get started'
                  )}
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

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false)
          setSelectedPlan(null)
        }}
        onConfirm={handleSubscribe}
        title="Confirm Subscription"
        description="You will be redirected to Paystack to complete your payment. Continue?"
        confirmText={subscribing ? "Processing..." : "Proceed to Payment"}
        cancelText="Cancel"
        isPending={!!subscribing}
      />
    </div>
  )
}

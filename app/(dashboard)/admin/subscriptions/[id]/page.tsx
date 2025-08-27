/* eslint-disable */
"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import { apiClientAdmin } from "@/lib/interceptor"

interface ListingLimitItem {
  _id?: string
  subCategory: string | { _id: string; name: string }
  limit: number
}

interface SubscriptionPlan {
  _id?: string
  name: string
  description: string
  features: string[]
  listingLimit: ListingLimitItem[]
  amount: number
  billing_cycle: "daily" | "weekly" | "monthly" | "annually"
  status: "active" | "inactive"
  createdAt?: string
}

export default function AdminSubscriptionDetailPage() {
  const params = useParams<{ id: string }>()
  const id = useMemo(()=> params?.id as string, [params])
  const router = useRouter()

  const [plan, setPlan] = useState<SubscriptionPlan | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchPlan = async () => {
    if (!id) return
    try {
      setLoading(true)
      const res = await apiClientAdmin.get(`/subscriptionplans/${id}`)
      console.log("planres", res)
      const data: SubscriptionPlan | undefined = (res?.data as any)?.data
      if (data) {
        setPlan(data)
      } else {
        setPlan(null)
      }
    } catch (e: any) {
      toast.error(`Failed to load plan: ${String(e?.message || e)}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPlan() }, [id])


  if (loading && !plan) {
    return (
      <div className="p-6"><p>Loading plan...</p></div>
    )
  }

  if (!plan) {
    return (
      <div className="p-6">
        <Button variant="outline" onClick={()=>router.back()}><ArrowLeft className="h-4 w-4 mr-1"/>Back</Button>
        <div className="mt-6 border rounded-lg p-8 text-center">
          <p className="text-gray-500">Plan not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={()=>router.back()}><ArrowLeft className="h-4 w-4 mr-1"/>Back</Button>
          <h1 className="text-2xl font-bold">{plan.name}</h1>
        </div>
        {/* Edit removed as per requirement */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Description</h2>
            <p className="text-gray-700">{plan.description}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Features</h2>
            {plan.features?.length ? (
              <ul className="list-disc ml-6 space-y-1 text-gray-700">
                {plan.features.map((f, i)=> (<li key={i}>{f}</li>))}
              </ul>
            ) : (
              <p className="text-gray-500">-</p>
            )}
          </div>
        </div>
        <div className="border rounded-lg p-6 space-y-3">
          <div className="flex justify-between"><span className="text-gray-600">Amount</span><span className="font-semibold">₦{Number(plan.amount).toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Billing</span><span className="capitalize">{plan.billing_cycle}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Status</span><span>
            <span className={`px-2 py-1 rounded-full text-xs ${plan.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{plan.status}</span>
          </span></div>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Listing Limits</h2>
        {plan.listingLimit?.length ? (
          <Table className="border rounded-lg">
            <TableHeader>
              <TableRow>
                <TableHead>Subcategory</TableHead>
                <TableHead>Limit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plan.listingLimit.map((it)=> (
                <TableRow key={it._id ?? `${typeof it.subCategory === 'string' ? it.subCategory : it.subCategory?._id}`}>
                  <TableCell>{typeof it.subCategory === 'string' ? it.subCategory : it.subCategory?.name}</TableCell>
                  <TableCell>{it.limit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500">No limits configured</p>
        )}
      </div>

      {/* Edit dialog removed */}
    </div>
  )
}

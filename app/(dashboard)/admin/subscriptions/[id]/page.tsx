/* eslint-disable */
"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { ArrowLeft, Pencil } from "lucide-react"
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
  const [isEditOpen, setIsEditOpen] = useState(false)

  // Edit form state
  const [form, setForm] = useState<SubscriptionPlan | null>(null)
  const [featuresInput, setFeaturesInput] = useState("")
  // Listing limit helpers (edit dialog)
  const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>([])
  const [subcategoriesByCat, setSubcategoriesByCat] = useState<Record<string, Array<{ _id: string; name: string }>>>({})
  const [selectedCatForLimit, setSelectedCatForLimit] = useState<string>("")
  const [selectedSubForLimit, setSelectedSubForLimit] = useState<string>("")
  const [limitValue, setLimitValue] = useState<number | "">("")
  const [loadingCats, setLoadingCats] = useState(false)
  const [loadingSubs, setLoadingSubs] = useState(false)

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

  // lazy-load categories when edit dialog opens
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCats(true)
        const res = await apiClientAdmin.get("/categories")
        const cats = (res as any)?.data?.data?.total || []
        setCategories(Array.isArray(cats) ? cats : [])
      } finally {
        setLoadingCats(false)
      }
    }
    if (isEditOpen && categories.length === 0) fetchCategories()
  }, [isEditOpen, categories.length])

  const fetchSubcategories = async (catId: string) => {
    if (!catId) return
    try {
      setLoadingSubs(true)
      const res = await apiClientAdmin.get(`/categories/${catId}`)
      const subs = (res as any)?.data?.data?.subCategories || []
      setSubcategoriesByCat(prev => ({ ...prev, [catId]: Array.isArray(subs) ? subs : [] }))
    } finally {
      setLoadingSubs(false)
    }
  }

  const subOptions = selectedCatForLimit ? (subcategoriesByCat[selectedCatForLimit] || []) : []

  const addListingLimitItem = () => {
    if (!form) return
    if (!selectedSubForLimit) { toast.error("Select a subcategory"); return }
    const lim = typeof limitValue === "number" ? limitValue : Number(limitValue)
    if (!lim || lim <= 0) { toast.error("Enter a valid limit"); return }
    setForm(prev => {
      if (!prev) return prev
      const existsIdx = prev.listingLimit.findIndex(it => (typeof it.subCategory === 'string' ? it.subCategory : it.subCategory?._id) === selectedSubForLimit)
      const next = [...prev.listingLimit]
      if (existsIdx >= 0) next[existsIdx] = { ...next[existsIdx], subCategory: selectedSubForLimit, limit: lim }
      else next.push({ subCategory: selectedSubForLimit, limit: lim })
      return { ...prev, listingLimit: next }
    })
    setLimitValue("")
  }

  const removeListingLimitItem = (subId: string) => {
    setForm(prev => prev ? ({
      ...prev,
      listingLimit: prev.listingLimit.filter(it => (typeof it.subCategory === 'string' ? it.subCategory : it.subCategory?._id) !== subId)
    }) : prev)
  }

  const openEdit = () => {
    if (!plan) return
    setForm({ ...plan })
    setFeaturesInput(plan.features?.join(", ") || "")
    setIsEditOpen(true)
  }

  const handleUpdate = async () => {
    if (!form || !id) return
    try {
      setLoading(true)
      const payload = {
        name: form.name?.trim(),
        description: form.description?.trim(),
        features: featuresInput.split(",").map(f=>f.trim()).filter(Boolean),
        listingLimit: form.listingLimit || [],
        amount: Number(form.amount),
        billing_cycle: form.billing_cycle,
        status: form.status,
      }
      // Assuming PATCH endpoint exists at /subscriptionplans/:id
      const res = await apiClientAdmin.patch(`/subscriptionplans/${id}`, payload)
      toast.success((res as any)?.message ?? "Plan updated")
      setIsEditOpen(false)
      fetchPlan()
    } catch (e: any) {
      toast.error(`Failed to update plan: ${String(e?.message || e)}`)
    } finally {
      setLoading(false)
    }
  }

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
        <Button className="bg-[#1F058F] hover:bg-[#1F058F]/90" onClick={openEdit}>
          <Pencil className="h-4 w-4 mr-2"/> Edit
        </Button>
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

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[1000px]">
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
          </DialogHeader>
          {form && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input value={form.name} onChange={(e)=> setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e)=> setForm({ ...form, description: e.target.value })}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Features (comma-separated)</label>
                <Input value={featuresInput} onChange={(e)=> setFeaturesInput(e.target.value)} placeholder="e.g., Whatsapp support, Email Notification" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (NGN)</label>
                  <Input type="number" value={form.amount} onChange={(e)=> setForm({ ...form, amount: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Billing</label>
                  <Select value={form.billing_cycle} onValueChange={(v: "daily"|"weekly"|"monthly"|"annually")=> setForm({ ...form, billing_cycle: v })}>
                    <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Listing Limits</label>
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-1">
                    <Select
                      value={selectedCatForLimit}
                      onValueChange={(v)=>{ setSelectedCatForLimit(v); setSelectedSubForLimit(""); if (!subcategoriesByCat[v]) fetchSubcategories(v) }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loadingCats ? "Loading categories..." : "Select category"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(c => (
                          <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={selectedSubForLimit}
                      onValueChange={setSelectedSubForLimit}
                      disabled={!selectedCatForLimit || loadingSubs}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={!selectedCatForLimit ? "Select category first" : (loadingSubs ? "Loading..." : "Select subcategory")} />
                      </SelectTrigger>
                      <SelectContent>
                        {subOptions.map(s => (
                          <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={limitValue as any}
                        onChange={(e)=> setLimitValue(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Limit"
                      />
                      <Button size="sm" className="bg-[#1F058F] hover:bg-[#1F058F]/90" type="button" onClick={addListingLimitItem}>Add</Button>
                    </div>
                  </div>
                  {form.listingLimit.length > 0 ? (
                    <div className="border rounded-md divide-y">
                      {form.listingLimit.map(it => {
                        const subId = typeof it.subCategory === 'string' ? it.subCategory : it.subCategory?._id
                        const name = (() => {
                          if (typeof it.subCategory !== 'string' && it.subCategory?.name) return it.subCategory.name
                          const allSubs = selectedCatForLimit ? (subcategoriesByCat[selectedCatForLimit] || []) : []
                          return allSubs.find(s => s._id === subId)?.name || subId
                        })()
                        return (
                          <div key={`${subId}-${it.limit}`} className="flex items-center justify-between px-3 py-2 text-sm">
                            <div>
                              <span className="font-medium">{name}</span>
                              <span className="text-gray-500"> • Limit: {it.limit}</span>
                            </div>
                            <Button variant="outline" size="sm" onClick={()=> removeListingLimitItem(subId!)}>Remove</Button>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No listing limits added.</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select value={form.status} onValueChange={(v: "active"|"inactive")=> setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={()=> setIsEditOpen(false)}>Cancel</Button>
                <Button className="bg-[#1F058F] hover:bg-[#1F058F]/90" onClick={handleUpdate} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

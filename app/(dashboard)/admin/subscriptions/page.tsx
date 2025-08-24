/* eslint-disable */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Plus } from "lucide-react"
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

interface Category {
  _id: string
  name: string
}

interface Subcategory {
  _id: string
  name: string
}

export default function AdminSubscriptionsPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Create form state
  const [createForm, setCreateForm] = useState<SubscriptionPlan>({
    name: "",
    description: "",
    features: [],
    listingLimit: [],
    amount: 0,
    billing_cycle: "monthly",
    status: "active",
  })
  const [featuresInput, setFeaturesInput] = useState<string>("")
  const [errors, setErrors] = useState<Partial<Record<keyof SubscriptionPlan | "featuresInput", string>>>({})

  // Listing limit helpers
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategoriesByCat, setSubcategoriesByCat] = useState<Record<string, Subcategory[]>>({})
  const [selectedCatForLimit, setSelectedCatForLimit] = useState<string>("")
  const [selectedSubForLimit, setSelectedSubForLimit] = useState<string>("")
  const [limitValue, setLimitValue] = useState<number | "">("")
  const [loadingCats, setLoadingCats] = useState(false)
  const [loadingSubs, setLoadingSubs] = useState(false)

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const res = await apiClientAdmin.get("/subscriptionplans")
      const data = res?.data?.data
      if (Array.isArray(data)) setPlans(data as SubscriptionPlan[])
      else setPlans([])
    } catch (e: any) {
      toast.error(`Failed to load plans: ${String(e?.message || e)}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  // Fetch categories when dialog opens the first time
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCats(true)
        const res = await apiClientAdmin.get("/categories")
        console.log("catres", res)
        const cats: Category[] =
          res?.data?.data?.total || []
        setCategories(Array.isArray(cats) ? cats : [])
      } catch (error) {
         console.log(error)
        // keep non-blocking
      } finally {
        setLoadingCats(false)
      }
    }
    if (isCreateOpen && categories.length === 0) fetchCategories()
  }, [isCreateOpen, categories.length])

  const fetchSubcategories = async (catId: string) => {
    if (!catId) return
    try {
      setLoadingSubs(true)
      const res = await apiClientAdmin.get(`/categories/${catId}`)
      const subs: Subcategory[] = res?.data?.data?.subCategories || res?.data?.subCategories || []
      setSubcategoriesByCat(prev => ({ ...prev, [catId]: Array.isArray(subs) ? subs : [] }))
    } catch (e) {
      setSubcategoriesByCat(prev => ({ ...prev, [catId]: [] }))
    } finally {
      setLoadingSubs(false)
    }
  }

  const validateCreate = () => {
    const next: typeof errors = {}
    if (!createForm.name.trim()) next.name = "Name is required"
    if (!createForm.description.trim()) next.description = "Description is required"
    if (!featuresInput.trim()) next.featuresInput = "Enter at least one feature"
    // listingLimit is optional for now; can be managed in a dedicated edit view
    if (!createForm.amount || createForm.amount < 0) next.amount = "Amount is required"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleCreate = async () => {
    if (!validateCreate()) {
      toast.error("Please fix the highlighted fields")
      return
    }
    try {
      setLoading(true)
      const payload = {
        name: createForm.name.trim(),
        description: createForm.description.trim(),
        features: featuresInput
          .split(",")
          .map(f => f.trim())
          .filter(Boolean),
        listingLimit: createForm.listingLimit,
        amount: Number(createForm.amount),
        billing_cycle: createForm.billing_cycle,
        status: createForm.status,
      }
      const res = await apiClientAdmin.post("/subscriptionplans", payload)
      toast.success(res?.data?.message ?? "Plan created")
      // reset
      setCreateForm({ name: "", description: "", features: [], listingLimit: [], amount: 0, billing_cycle: "monthly", status: "active" })
      setFeaturesInput("")
      setSelectedCatForLimit("")
      setSelectedSubForLimit("")
      setLimitValue("")
      setIsCreateOpen(false)
      fetchPlans()
    } catch (e: any) {
      toast.error(`Failed to create plan: ${String(e?.message || e)}`)
    } finally {
      setLoading(false)
    }
  }

  const subOptions = selectedCatForLimit ? (subcategoriesByCat[selectedCatForLimit] || []) : []

  const addListingLimitItem = () => {
    if (!selectedSubForLimit) {
      toast.error("Select a subcategory")
      return
    }
    const lim = typeof limitValue === "number" ? limitValue : Number(limitValue)
    if (!lim || lim <= 0) {
      toast.error("Enter a valid limit")
      return
    }
    setCreateForm(prev => {
      const existsIdx = prev.listingLimit.findIndex(it => (typeof it.subCategory === 'string' ? it.subCategory : it.subCategory?._id) === selectedSubForLimit)
      const next = [...prev.listingLimit]
      if (existsIdx >= 0) next[existsIdx] = { ...next[existsIdx], subCategory: selectedSubForLimit, limit: lim }
      else next.push({ subCategory: selectedSubForLimit, limit: lim })
      return { ...prev, listingLimit: next }
    })
    setLimitValue("")
  }

  const removeListingLimitItem = (subId: string) => {
    setCreateForm(prev => ({
      ...prev,
      listingLimit: prev.listingLimit.filter(it => (typeof it.subCategory === 'string' ? it.subCategory : it.subCategory?._id) !== subId)
    }))
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscription Plans</h1>
        <Dialog open={isCreateOpen} onOpenChange={(o)=>{ setIsCreateOpen(o); if(!o){ setCreateForm({ name: "", description: "", features: [], listingLimit: [], amount: 0, billing_cycle: "monthly", status: "active" }); setFeaturesInput(""); setErrors({}); } }}>
          <DialogTrigger asChild>
            <Button className="bg-[#1F058F] hover:bg-[#1F058F]/90">
              <Plus className="mr-2 h-4 w-4" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[1190px]">
            <DialogHeader>
              <DialogTitle>Create Subscription Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <Input
                  value={createForm.name}
                  onChange={(e)=>{ setCreateForm({ ...createForm, name: e.target.value }); if(e.target.value.trim()) setErrors(prev=>({ ...prev, name: undefined })) }}
                  placeholder="e.g., Basic"
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={createForm.description}
                  onChange={(e)=>{ setCreateForm({ ...createForm, description: e.target.value }); if(e.target.value.trim()) setErrors(prev=>({ ...prev, description: undefined })) }}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
                  rows={3}
                  placeholder="Short summary of this plan"
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Features (comma-separated) *</label>
                <Input
                  value={featuresInput}
                  onChange={(e)=>{ setFeaturesInput(e.target.value); if(e.target.value.trim()) setErrors(prev=>({ ...prev, featuresInput: undefined })) }}
                  placeholder="e.g., 10 listings, Featured badge, Email support"
                />
                {errors.featuresInput && <p className="text-sm text-red-600 mt-1">{errors.featuresInput}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (NGN) *</label>
                  <Input
                    type="number"
                    value={createForm.amount}
                    onChange={(e)=>{ const v = Number(e.target.value); setCreateForm({ ...createForm, amount: v }); if(v >= 0) setErrors(prev=>({ ...prev, amount: undefined })) }}
                    placeholder="e.g., 2000"
                  />
                  {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Listing Limits</label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                    {createForm.listingLimit.length > 0 ? (
                      <div className="border rounded-md divide-y">
                        {createForm.listingLimit.map(it => {
                          const subId = typeof it.subCategory === 'string' ? it.subCategory : it.subCategory?._id
                          const name = (() => {
                            if (typeof it.subCategory !== 'string' && it.subCategory?.name) return it.subCategory.name
                            // fallback: find in loaded options
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Billing Cycle *</label>
                  <Select value={createForm.billing_cycle} onValueChange={(v: "daily"|"weekly"|"monthly"|"annually")=>setCreateForm({ ...createForm, billing_cycle: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status *</label>
                  <Select value={createForm.status} onValueChange={(v: "active"|"inactive")=>setCreateForm({ ...createForm, status: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={()=>{ setIsCreateOpen(false) }}>Cancel</Button>
                <Button className="bg-[#1F058F] hover:bg-[#1F058F]/90" onClick={handleCreate} disabled={loading}>
                  {loading ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><p>Loading plans...</p></div>
      ) : plans.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500">No subscription plans found</p>
          <Button className="mt-4 bg-[#1F058F] hover:bg-[#1F058F]/90" onClick={()=>setIsCreateOpen(true)}>
            Create First Plan
          </Button>
        </div>
      ) : (
        <Table className="border rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Billing</TableHead>
              <TableHead>Listing Limit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((p)=> (
              <TableRow key={p._id}>
                <TableCell className="font-medium cursor-pointer text-[#1F058F]" onClick={()=> p._id && router.push(`/admin/subscriptions/${p._id}`)}>
                  {p.name}
                </TableCell>
                <TableCell>₦{Number(p.amount).toLocaleString()}</TableCell>
                <TableCell className="capitalize">{p.billing_cycle}</TableCell>
                <TableCell>
                  {Array.isArray(p.listingLimit) && p.listingLimit.length > 0 ? (
                    <div className="space-y-1">
                      {p.listingLimit.map((it)=> (
                        <div key={it._id ?? `${typeof it.subCategory === 'string' ? it.subCategory : it.subCategory?._id}-${it.limit}`} className="text-sm">
                          <span className="font-medium">{typeof it.subCategory === 'string' ? it.subCategory : it.subCategory?.name}</span>: {it.limit}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${p.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {p.status}
                  </span>
                </TableCell>
                <TableCell>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}


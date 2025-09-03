/* eslint-disable */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { apiClientAdmin } from "@/lib/interceptor"

interface AddOnService {
  _id?: string
  name: string
  category: string
  description: string
  amount: string
  billing_cycle: "daily" | "weekly" | "monthly" | "annually"
  billing_type: "one-time" | "recurring"
  status: "active" | "inactive"
  included_add_ons?: string[]
  createdAt?: string
}

export default function AdminAddOnServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState<AddOnService[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [categories, setCategories] = useState<Array<{ _id?: string; name: string; slug?: string }>>([])

  const [form, setForm] = useState<AddOnService>({
    name: "",
    category: "",
    description: "",
    amount: '',
    billing_cycle: "monthly",
    billing_type: "one-time",
    status: "active",
    included_add_ons: [],
  })
  const [errors, setErrors] = useState<Partial<Record<keyof AddOnService, string>>>({})
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null)

  const fetchServices = async () => {
    try {
      setLoading(true)
      const res = await apiClientAdmin.get("/addonservices")
      const data = (res as any)?.data?.data || (res as any)?.data
      setServices(Array.isArray(data) ? data : [])
    } catch (e: any) {
      toast.error(`Failed to load add-on services: ${String(e?.message || e)}`)
    } finally {
      setLoading(false)
    }
  }

  // const fetchCategories = async () => {
  //   try {
  //     const res = await apiClientAdmin.get("/categories")
  //     const data = (res as any)?.data?.data || (res as any)?.data
  //     // Normalize to array of { name, _id, slug }
  //     const list = Array.isArray(data?.items ?? data?.total ?? data) ? (data.items ?? data.total ?? data) : []
  //     setCategories(list.map((c: any) => ({ _id: c?._id ?? c?.id, name: c?.name, slug: c?.slug })))
  //   } catch (e: any) {
  //     // Non-blocking; fallback to manual input if fetch fails
  //     console.warn("Failed to load categories for add-on select:", e)
  //   }
  // }

  useEffect(() => { 
    fetchServices(); 
    setCategories([
      { _id: "1", name: "Listing Visibility", slug: "listing-visibility" },
      { _id: "2", name: "Listing Boost", slug: "listing-boost" },
      { _id: "3", name: "Listing Featured", slug: "listing-featured" },
    ])
  }, [])

  const validate = () => {
    const next: typeof errors = {}
    if (!form.name?.trim()) next.name = "Name is required"
    else if (form.name.trim().length < 3) next.name = "Name must be at least 3 characters"
    else if (form.name.trim().length > 80) next.name = "Name must be at most 80 characters"

    if (!form.category?.trim()) next.category = "Category is required"
    else if (form.category.trim().length < 3) next.category = "Category must be at least 3 characters"
    else if (form.category.trim().length > 80) next.category = "Category must be at most 80 characters"

    if (!form.description?.trim()) next.description = "Description is required"
    else if (form.description.trim().length < 10) next.description = "Description must be at least 10 characters"
    else if (form.description.trim().length > 1000) next.description = "Description must be at most 1000 characters"

    if (form.amount == null || isNaN(Number(form.amount)) || Number(form.amount) <= 0) next.amount = "Amount must be greater than 0"
    if (!form.billing_cycle) next.billing_cycle = "Billing cycle is required"
    if (!form.billing_type) next.billing_type = "Billing type is required"
    if (!form.status) next.status = "Status is required"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleCreate = async () => {
    if (!validate()) return toast.error("Please fix the highlighted fields")
    try {
      setLoading(true)
      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        amount: Number(form.amount),
        billing_cycle: form.billing_cycle,
        billing_type: form.billing_type,
        status: form.status,
      }
      const res = await apiClientAdmin.post("/addonservices", payload)
      const created = (res as any)?.data?.data || (res as any)?.data
      const newId = created?._id || created?.id || null
      toast.success((res as any)?.data?.message ?? "Add-on created")
      setIsCreateOpen(false)
      setForm({ name: "", category: "", description: "", amount: '', billing_cycle: "monthly", billing_type: "one-time", status: "active", included_add_ons: [] })
      setLastCreatedId(newId)
      fetchServices()
    } catch (e: any) {
      toast.error(`Failed to create add-on: ${String(e?.message || e)}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!lastCreatedId) return
    // After list refresh, scroll and highlight
    const t = setTimeout(() => {
      const row = document.getElementById(`addon-row-${lastCreatedId}`)
      if (row) {
        row.scrollIntoView({ behavior: "smooth", block: "center" })
        setHighlightId(lastCreatedId)
        setTimeout(() => setHighlightId(null), 2500)
      }
      setLastCreatedId(null)
    }, 300)
    return () => clearTimeout(t)
  }, [services, lastCreatedId])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add-on Services</h1>
        <Dialog open={isCreateOpen} onOpenChange={(o) => { setIsCreateOpen(o); if (!o) { setErrors({}); setForm({ name: "", category: "", description: "", amount: '', billing_cycle: "monthly", billing_type: "one-time", status: "active", included_add_ons: [] }) } }}>
          <DialogTrigger asChild>
            <Button className="bg-[#1F058F] hover:bg-[#1F058F]/90">
              <Plus className="mr-2 h-4 w-4" />
              New Add-on
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[720px]">
            <DialogHeader>
              <DialogTitle>Create Add-on Service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <Input value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); if (e.target.value.trim()) setErrors(prev => ({ ...prev, name: undefined })) }} placeholder="e.g., Visibility Booster" />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <Select
                  value={form.category}
                  onValueChange={(v) => { setForm({ ...form, category: v }); if (v?.trim()) setErrors(prev => ({ ...prev, category: undefined })) }}
                >
                  <SelectTrigger><SelectValue placeholder={categories.length ? "Select category" : "Loading categories..."} /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c._id ?? c.name} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => { setForm({ ...form, description: e.target.value }); if (e.target.value.trim()) setErrors(prev => ({ ...prev, description: undefined })) }}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
                  rows={3}
                  placeholder="Short summary"
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (NGN) *</label>
                  <Input inputMode="numeric"
                    pattern="[0-9]*" value={form.amount} onChange={(e) => { const v = e.target.value; setForm({ ...form, amount: v }); if (!isNaN(Number(v)) && Number(v) >= 0) setErrors(prev => ({ ...prev, amount: undefined })) }} placeholder="e.g., 1500" />
                  {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Billing Cycle *</label>
                  <Select value={form.billing_cycle} onValueChange={(v: "daily" | "weekly" | "monthly" | "annually") => setForm({ ...form, billing_cycle: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.billing_cycle && <p className="text-sm text-red-600 mt-1">{errors.billing_cycle}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Billing Type *</label>
                  <Select value={form.billing_type} onValueChange={(v: "one-time" | "recurring") => setForm({ ...form, billing_type: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-time">One-time</SelectItem>
                      <SelectItem value="recurring">Recurring</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.billing_type && <p className="text-sm text-red-600 mt-1">{errors.billing_type}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status *</label>
                  <Select value={form.status} onValueChange={(v: "active" | "inactive") => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-sm text-red-600 mt-1">{errors.status}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button className="bg-[#1F058F] hover:bg-[#1F058F]/90" onClick={handleCreate} disabled={loading}>
                  {loading ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><p>Loading add-ons...</p></div>
      ) : services.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500">No add-on services found</p>
          <Button className="mt-4 bg-[#1F058F] hover:bg-[#1F058F]/90" onClick={() => setIsCreateOpen(true)}>Create First Add-on</Button>
        </div>
      ) : (
        <Table className="border rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Billing Cycle</TableHead>
              <TableHead>Billing Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((s) => (
              <TableRow key={s._id ?? s.name} id={s._id ? `addon-row-${s._id}` : undefined} className={highlightId && s._id === highlightId ? "bg-yellow-50" : undefined}>
                <TableCell
                  className="font-medium cursor-pointer text-[#1F058F]"
                  onClick={() => s._id && router.push(`/admin/addon-services/${s._id}`)}
                >
                  {s.name}
                </TableCell>
                <TableCell>{s.category}</TableCell>
                <TableCell>₦{Number(s.amount).toLocaleString()}</TableCell>
                <TableCell className="capitalize">{s.billing_cycle}</TableCell>
                <TableCell className="capitalize">{s.billing_type}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${s.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{s.status}</span>
                </TableCell>
                <TableCell>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

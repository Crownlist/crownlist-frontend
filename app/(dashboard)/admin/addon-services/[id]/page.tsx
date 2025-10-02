/* eslint-disable */
"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Trash2, Pencil } from "lucide-react"
import { toast } from "sonner"
import { apiClientAdmin } from "@/lib/interceptor"
import DeleteModal from "@/components/Home/DeleteModal"
import DeleteConfirmationModal from "@/components/DeleteModal"

interface AddOnService {
  _id?: string
  name: string
  category: string
  description: string
  amount: number
  billing_cycle: "daily" | "weekly" | "monthly" | "annually"
  billing_type: "one-time" | "recurring"
  status: "active" | "inactive"
  included_add_ons?: string[]
  createdAt?: string
  updatedAt?: string
}

export default function AdminAddonServiceDetailPage() {
  const params = useParams<{ id: string }>()
  const id = useMemo(() => params?.id as string, [params])
  const router = useRouter()

  const [svc, setSvc] = useState<AddOnService | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<AddOnService | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof AddOnService, string>>>({})

  const fetchService = async () => {
    if (!id) return
    try {
      setLoading(true)
      const res = await apiClientAdmin.get(`/addonservices/one/${id}`)
      const data: AddOnService | undefined = (res as any)?.data?.data || (res as any)?.data
      setSvc(data ?? null)
    } catch (e: any) {
      toast.error(`Failed to load service: ${String(e?.message || e)}`)
      setSvc(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchService() }, [id])

  const openEdit = () => {
    if (!svc) return
    setForm({ ...svc })
    setErrors({})
    setIsEditOpen(true)
  }

  const validate = () => {
    if (!form) return false
    const next: Partial<Record<keyof AddOnService, string>> = {}
    if (!form.name?.trim()) next.name = "Name is required"
    if (!form.category?.trim()) next.category = "Category is required"
    if (!form.description?.trim()) next.description = "Description is required"
    if (!form.amount || form.amount <= 0) next.amount = "Amount must be greater than 0"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSave = async () => {
    if (!form || !id) return
    if (!validate()) {
      toast.error("Please fix the highlighted fields")
      return
    }
    try {
      setSaving(true)
      const payload = {
        name: form.name,
        category: form.category,
        description: form.description,
        amount: form.amount,
        billing_cycle: form.billing_cycle,
        billing_type: form.billing_type,
        status: form.status,
        included_add_ons: form.included_add_ons || []
      }
      const res: any = await apiClientAdmin.put(`/addonservices/${id}`, payload)
      toast.success(res?.data?.message || "Service updated successfully")
      setIsEditOpen(false)
      fetchService()
    } catch (e: any) {
      console.error('Error updating service:', e)
      toast.error(e.response?.data?.message || `Failed to update service: ${String(e?.message || e)}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    try {
      setIsDeleting(true)
      // NOTE: Adjust endpoint/method if your backend differs
      const res = await apiClientAdmin.delete(`/addonservices/${id}`)
      toast.success((res as any)?.data?.message ?? "Service deleted")
      setIsDeleteOpen(false)
      router.push("/admin/addon-services")
    } catch (e: any) {
      toast.error(`Failed to delete: ${String(e?.message || e)}`)
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading && !svc) {
    return <div className="p-6"><p>Loading service...</p></div>
  }

  if (!svc) {
    return (
      <div className="p-6">
        <Button variant="outline" onClick={() => router.back()}><ArrowLeft className="h-4 w-4 mr-1" />Back</Button>
        <div className="mt-6 border rounded-lg p-8 text-center">
          <p className="text-gray-500">Service not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => router.back()}><ArrowLeft className="h-4 w-4 mr-1" />Back</Button>
          <h1 className="text-2xl font-bold">{svc.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openEdit}>
            <Pencil className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button className="bg-red-500 hover:bg-red-600" onClick={() => setIsDeleteOpen(true)} disabled={isDeleting}><Trash2 className="h-4 w-4 mr-2" />{isDeleting ? "Deleting..." : "Delete"}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Description</h2>
            <p className="text-gray-700">{svc.description}</p>
          </div>
          {/* <div>
            <h2 className="text-lg font-semibold mb-2">Included Add-ons</h2>
            {svc.included_add_ons?.length ? (
              <ul className="list-disc ml-6 space-y-1 text-gray-700">
                {svc.included_add_ons.map((f, i) => (<li key={i}>{f}</li>))}
              </ul>
            ) : (
              <p className="text-gray-500">-</p>
            )}
          </div> */}
        </div>
        <div className="border rounded-lg p-6 space-y-3">
          <div className="flex justify-between"><span className="text-gray-600">Amount</span><span className="font-semibold">₦{Number(svc.amount).toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Billing Cycle</span><span className="capitalize">{svc.billing_cycle}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Billing Type</span><span className="capitalize">{svc.billing_type}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Status</span><span>
            <span className={`px-2 py-1 rounded-full text-xs ${svc.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{svc.status}</span>
          </span></div>
          <div className="flex justify-between"><span className="text-gray-600">Created</span><span>{svc.createdAt ? new Date(svc.createdAt).toLocaleString() : "-"}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Updated</span><span>{svc.updatedAt ? new Date(svc.updatedAt).toLocaleString() : "-"}</span></div>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Overview</h2>
        <Table className="border rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Field</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow><TableCell>Name</TableCell><TableCell>{svc.name}</TableCell></TableRow>
            <TableRow><TableCell>Category</TableCell><TableCell>{svc.category}</TableCell></TableRow>
            <TableRow><TableCell>Description</TableCell><TableCell className="max-w-[640px] whitespace-pre-wrap">{svc.description}</TableCell></TableRow>
            <TableRow><TableCell>Amount</TableCell><TableCell>₦{Number(svc.amount).toLocaleString()}</TableCell></TableRow>
            <TableRow><TableCell>Billing Cycle</TableCell><TableCell className="capitalize">{svc.billing_cycle}</TableCell></TableRow>
            <TableRow><TableCell>Billing Type</TableCell><TableCell className="capitalize">{svc.billing_type}</TableCell></TableRow>
            <TableRow><TableCell>Status</TableCell><TableCell className="capitalize">{svc.status}</TableCell></TableRow>
          </TableBody>
        </Table>
      </div>


      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(open) => !saving && setIsEditOpen(open)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Add-on Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={form?.name || ''}
                onChange={(e) => setForm((prev: any) => ({ ...prev!, name: e.target.value }))}
                placeholder="Enter service name"
                className={errors.name ? 'border-red-500' : ''}
                disabled={saving}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Input
                value={form?.category || ''}
                onChange={(e) => setForm((prev: any) => ({ ...prev!, category: e.target.value }))}
                placeholder="Enter category"
                className={errors.category ? 'border-red-500' : ''}
                disabled={saving}
              />
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={form?.description || ''}
                onChange={(e) => setForm((prev: any) => ({ ...prev!, description: e.target.value }))}
                placeholder="Enter description"
                className={errors.description ? 'border-red-500' : ''}
                disabled={saving}
                rows={4}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount (₦)</label>
              <Input
                type="number"
                value={form?.amount || ''}
                onChange={(e) => setForm((prev: any) => ({ ...prev!, amount: Number(e.target.value) }))}
                placeholder="Enter amount"
                className={errors.amount ? 'border-red-500' : ''}
                disabled={saving}
              />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Billing Cycle</label>
                <Select
                  value={form?.billing_cycle || 'monthly'}
                  onValueChange={(value) => setForm((prev: any) => ({ ...prev!, billing_cycle: value }))}
                  disabled={saving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select billing cycle" />
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
                <label className="block text-sm font-medium mb-1">Billing Type</label>
                <Select
                  value={form?.billing_type || 'recurring'}
                  onValueChange={(value) => setForm((prev: any) => ({ ...prev!, billing_type: value }))}
                  disabled={saving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select billing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-time</SelectItem>
                    <SelectItem value="recurring">Recurring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select
                value={form?.status || 'active'}
                onValueChange={(value) => setForm((prev: any) => ({ ...prev!, status: value }))}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* <div>
              <label className="block text-sm font-medium mb-1">Included Add-ons (one per line)</label>
              <Textarea
                value={form?.included_add_ons?.join('\n') || ''}
                onChange={(e) => setForm((prev: any) => ({ ...prev!, included_add_ons: e.target.value.split('\n').map((s: string) => s.trim()).filter(Boolean) }))}
                placeholder="Enter add-ons, one per line"
                disabled={saving}
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Each line will be treated as a separate add-on
              </p>
            </div> */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => !saving && setIsEditOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={onSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete modal */}
      <DeleteModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onDelete={handleDelete} loading={isDeleting} description="Are you sure you want to delete this service?" />
    </div>
  )
}

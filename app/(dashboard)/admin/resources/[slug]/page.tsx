/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Pencil, Trash2 } from "lucide-react"
import { apiClientAdmin } from "@/lib/interceptor"
import DeleteModal from "@/components/Home/DeleteModal"

interface ResourceItem {
  _id?: string
  slug?: string
  name: string
  description: string
  value: string[]
  createdAt?: string
  updatedAt?: string
}

export default function AdminResourceDetailPage() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug as string
  const router = useRouter()

  const [resource, setResource] = useState<ResourceItem | null>(null)
  const [loading, setLoading] = useState(true)

  // edit dialog
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<{ name: string; description: string; valueText: string } | null>(null)
  const [errors, setErrors] = useState<{ name?: string; description?: string; valueText?: string }>({})

  // delete modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchResource = async () => {
    if (!slug) return
    try {
      setLoading(true)
      const res = await apiClientAdmin.get(`/resources/one/${encodeURIComponent(slug)}`)
      const data: ResourceItem = (res as any)?.data?.data || (res as any)?.data
      setResource(data ?? null)
    } catch (e: any) {
      toast.error(`Failed to load resource: ${String(e?.message || e)}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ fetchResource() }, [slug])

  const openEdit = () => {
    if (!resource) return
    setForm({
      name: resource.name,
      description: resource.description,
      valueText: Array.isArray(resource.value) ? resource.value.join("\n") : ""
    })
    setErrors({})
    setIsEditOpen(true)
  }

  const validate = () => {
    if (!form) return false
    const next: typeof errors = {}
    if (!form.name.trim()) next.name = "Name is required"
    else if (form.name.trim().length < 3) next.name = "Name must be at least 3 characters"
    if (!form.description.trim()) next.description = "Description is required"
    else if (form.description.trim().length < 10) next.description = "Description must be at least 10 characters"
    const lines = form.valueText.split(/\r?\n/).map(s=>s.trim()).filter(Boolean)
    if (lines.length === 0) next.valueText = "Enter at least one value (one per line)"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSave = async () => {
    if (!form || !resource) return
    if (!validate()) {
      toast.error("Please fix the highlighted fields")
      return
    }
    try {
      setSaving(true)
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        value: form.valueText.split(/\r?\n/).map(s=>s.trim()).filter(Boolean)
      }
      const res = await apiClientAdmin.patch(`/resources/${encodeURIComponent(resource.slug || "")}` , payload)
      toast.success((res as any)?.data?.message || "Resource updated")
      setIsEditOpen(false)
      fetchResource()
    } catch (e: any) {
      toast.error(`Failed to update resource: ${String(e?.message || e)}`)
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!resource) return
    try {
      setIsDeleting(true)
      await apiClientAdmin.delete(`/resources/${encodeURIComponent(resource.slug || "")}`)
      toast.success("Resource deleted")
      setIsDeleteOpen(false)
      router.push("/admin/resources")
    } catch (e: any) {
      toast.error(`Failed to delete resource: ${String(e?.message || e)}`)
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading resource...</div>
  }

  if (!resource) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Resource not found.</p>
        <Button className="mt-4" onClick={()=> router.push("/admin/resources")}>Back to Resources</Button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{resource.name}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openEdit}>
            <Pencil className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button className="bg-red-600 hover:bg-red-600/90" onClick={()=> setIsDeleteOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div><span className="font-medium">Slug:</span> {resource.slug}</div>
          <div><span className="font-medium">Description:</span> {resource.description}</div>
          <div><span className="font-medium">Items:</span> {Array.isArray(resource.value) ? resource.value.length : 0}</div>
          {resource.createdAt && (
            <div><span className="font-medium">Created:</span> {new Date(resource.createdAt).toLocaleString()}</div>
          )}
          {resource.updatedAt && (
            <div><span className="font-medium">Updated:</span> {new Date(resource.updatedAt).toLocaleString()}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Values</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-1">
            {resource.value?.map((v, idx)=> (
              <li key={idx}>{v}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(o)=> { setIsEditOpen(o); if(!o) setErrors({}) }}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
          </DialogHeader>
          {form && (
            <div className="space-y-4 py-2">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <Input value={form.name} onChange={(e)=> { const v = e.target.value; setForm({ ...form, name: v }); if(v.trim()) setErrors(prev=>({ ...prev, name: undefined })) }} />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
                  rows={3}
                  value={form.description}
                  onChange={(e)=> { const v = e.target.value; setForm({ ...form, description: v }); if(v.trim()) setErrors(prev=>({ ...prev, description: undefined })) }}
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Values (one per line) *</label>
                <textarea
                  className="flex min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
                  rows={8}
                  value={form.valueText}
                  onChange={(e)=> { const v = e.target.value; setForm({ ...form, valueText: v }); if(v.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).length>0) setErrors(prev=>({ ...prev, valueText: undefined })) }}
                />
                {errors.valueText && <p className="text-sm text-red-600 mt-1">{errors.valueText}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={()=> setIsEditOpen(false)} disabled={saving}>Cancel</Button>
                <Button className="bg-[#1F058F] hover:bg-[#1F058F]/90" onClick={onSave} disabled={saving}>{saving?"Saving...":"Save"}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={()=> setIsDeleteOpen(false)}
        onDelete={onDelete}
        loading={isDeleting}
      />
    </div>
  )
}

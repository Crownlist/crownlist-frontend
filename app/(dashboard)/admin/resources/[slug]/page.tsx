/*eslint-disable*/
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
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
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const slug = params?.slug as string

  const [resource, setResource] = useState<ResourceItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<{ valueText: string } | any>(null)
  const [errors, setErrors] = useState<{ name?: string; description?: string; valueText?: string }>({})
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

  useEffect(() => { fetchResource() }, [slug])

  const openEdit = () => {
    if (!resource) return
    setForm({
      valueText: Array.isArray(resource.value) ? resource.value.join("\n") : ""
    })
    setErrors({})
    setIsEditOpen(true)
  }

  const validate = () => {
    if (!form) return false
    const next: typeof errors = {}
    // if (!form.name.trim()) next.name = "Name is required"
    // else if (form.name.trim().length < 3) next.name = "Name must be at least 3 characters"
    // if (!form.description.trim()) next.description = "Description is required"
    // else if (form.description.trim().length < 10) next.description = "Description must be at least 10 characters"
    const lines = form.valueText.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean)
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
        value: form.valueText.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean)
      }
      const res: any = await apiClientAdmin.patch(`/resources/${encodeURIComponent(slug)}`, payload)
      toast.success(res?.data?.message || "Resource updated successfully")
      setIsEditOpen(false)
      fetchResource()
    } catch (e: any) {
      console.error('Error updating resource:', e)
      toast.error(e.response?.data?.message || `Failed to update resource: ${String(e?.message || e)}`)
    } finally {
      setSaving(false)
    }
  }

const handleDelete = async () => {
  if (!slug) return
  try {
    setIsDeleting(true)
    await apiClientAdmin.delete(`/resources/${encodeURIComponent(slug)}`)
    toast.success('Resource deleted successfully')
    router.push('/admin/resources')
  } catch (e: any) {
    console.error('Error deleting resource:', e)
    toast.error(e.response?.data?.message || 'Failed to delete resource')
  } finally {
    setIsDeleting(false)
    setIsDeleteOpen(false)
  }
}

if (loading) {
  return (
    <div className="p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      <p className="mt-2">Loading resource...</p>
    </div>
  )
}

if (!resource) {
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-semibold mb-2">Resource not found</h2>
      <p className="text-muted-foreground mb-4">The resource you're looking for doesn't exist or has been removed.</p>
      <Button onClick={() => router.push('/admin/resources')}>Back to Resources</Button>
    </div>
  )
}

return (
  <div className="p-6 space-y-6">
    <div className="flex items-center justify-between mb-6">
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-2">
          ← Back to Resources
        </Button>
        <h1 className="text-2xl font-bold">{resource.name}</h1>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={openEdit}>
          <Pencil className="h-4 w-4 mr-2" /> Edit
        </Button>
        <Button
         className="bg-red-500 hover:bg-red-600"
          onClick={() => setIsDeleteOpen(true)}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* <div><span className="font-medium">Slug:</span> {resource.slug}</div>
        <div><span className="font-medium">Description:</span> {resource.description}</div> */}
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
          {resource.value?.map((v, idx) => (
            <li key={idx}>{v}</li>
          ))}
        </ul>
      </CardContent>
    </Card>

    <Dialog open={isEditOpen} onOpenChange={(open) => !saving && setIsEditOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Resource</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Values (one per line)</label>
            <textarea
              value={form?.valueText || ''}
              onChange={(e) => setForm((prev : any) => ({ ...prev!, valueText: e.target.value }))}
              placeholder="Enter values, one per line"
              className={`w-full p-2 border rounded ${errors.valueText ? 'border-red-500' : 'border-gray-300'}`}
              rows={8}
              disabled={saving}
            />
            {errors.valueText && <p className="text-red-500 text-sm mt-1">{errors.valueText}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              Each line will be treated as a separate value
            </p>
          </div>
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

    <DeleteModal
      isOpen={isDeleteOpen}
      onClose={() => !isDeleting && setIsDeleteOpen(false)}
      onDelete={handleDelete}
      title="Delete Resource"
      description={`Are you sure you want to delete "${resource.name}"? This action cannot be undone.`}
      loading={isDeleting}
    />
  </div>
)
}

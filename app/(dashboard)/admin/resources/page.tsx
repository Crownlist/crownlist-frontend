/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Plus, Copy, Check } from "lucide-react"
import { apiClientAdmin } from "@/lib/interceptor"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ResourceItem {
  _id?: string
  slug?: string
  name: string
  description: string
  value: string[]
  createdAt?: string
}

export default function AdminResourcesPage() {
  const router = useRouter()
  const [resources, setResources] = useState<ResourceItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // create dialog
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<{ name: string; description: string; valueText: string }>({
    name: "",
    description: "",
    valueText: ""
  })
  const [errors, setErrors] = useState<{ name?: string; description?: string; valueText?: string }>({})
  const [csvLoading, setCsvLoading] = useState(false)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  const fetchResources = async () => {
    try {
      setLoading(true)
      const res = await apiClientAdmin.get("/resources")
      console.log(res?.data)
      const raw = (res as any)?.data?.data?.data || (res as any)?.data
      const list = Array.isArray(raw?.items ?? raw?.total ?? raw) ? (raw.items ?? raw.total ?? raw) : []
      setResources(list as ResourceItem[])
    } catch (e: any) {
      toast.error(`Failed to load resources: ${String(e?.message || e)}`)
    } finally {
      setLoading(false)
    }
  }

  const parseCsvFile = async (file: File) => {
    try {
      setCsvLoading(true)
      const text = await file.text()
      // Split by newlines, also support comma-separated values per line
      const lines = text.split(/\r?\n/)
      const items: string[] = []
      for (const line of lines) {
        const parts = line.split(",").map(s=>s.trim()).filter(Boolean)
        items.push(...parts)
      }
      if (items.length === 0) {
        toast.error("CSV appears to be empty")
        return
      }
      const merged = new Set([
        ...form.valueText.split(/\r?\n/).map(s=>s.trim()).filter(Boolean),
        ...items,
      ])
      setForm(prev=> ({ ...prev, valueText: Array.from(merged).join("\n") }))
      setErrors(prev=> ({ ...prev, valueText: undefined }))
      toast.success(`Loaded ${items.length} items from CSV`)
    } catch (e: any) {
      toast.error(`Failed to read CSV: ${String(e?.message || e)}`)
    } finally {
      setCsvLoading(false)
    }
  }

  useEffect(()=>{ fetchResources() }, [])

  const copyApiEndpoint = (slug: string) => {
    const endpoint = `/resources/one/${slug}`
    navigator.clipboard.writeText(endpoint)
      .then(() => {
        setCopiedSlug(slug)
        toast.success('API endpoint copied to clipboard!')
        setTimeout(() => setCopiedSlug(null), 2000)
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard')
      })
  }

  // Derived filtered & paginated data
  const filtered = useMemo(()=>{
    const q = query.trim().toLowerCase()
    if (!q) return resources
    return resources.filter(r =>
      r.name?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q)
    )
  }, [resources, query])

  const totalPages = useMemo(()=> Math.max(1, Math.ceil(filtered.length / pageSize)), [filtered.length, pageSize])
  const currentPage = Math.min(page, totalPages)
  const pageItems = useMemo(()=> {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, currentPage, pageSize])

  useEffect(()=>{ setPage(1) }, [query, pageSize])

  const validate = () => {
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

  const onCreate = async () => {
    if (!validate()) {
      toast.error("Please fix the highlighted fields")
      return
    }
    try {
      setCreating(true)
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        value: form.valueText.split(/\r?\n/).map(s=>s.trim()).filter(Boolean)
      }
      const res = await apiClientAdmin.post("/resources", payload)
      toast.success((res as any)?.data?.message || "Resource created")
      setIsCreateOpen(false)
      setForm({ name: "", description: "", valueText: "" })
      fetchResources()
    } catch (e: any) {
      toast.error(`Failed to create resource: ${String(e?.message || e)}`)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">Resources</h1>
        <div className="flex-1 min-w-[220px] max-w-md ml-auto">
          <Input
            placeholder="Search by name or description..."
            value={query}
            onChange={(e)=> setQuery(e.target.value)}
          />
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(o)=>{ setIsCreateOpen(o); if(!o){ setForm({ name: "", description: "", valueText: "" }); setErrors({}) } }}>
          <DialogTrigger asChild>
            <Button className="bg-[#1F058F] hover:bg-[#1F058F]/90">
              <Plus className="mr-2 h-4 w-4" />
              New Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Create Resource</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <Input value={form.name} onChange={(e)=>{ setForm({ ...form, name: e.target.value }); if(e.target.value.trim()) setErrors(prev=>({ ...prev, name: undefined })) }} placeholder="e.g., mobile phone brands" />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
                  rows={3}
                  value={form.description}
                  onChange={(e)=>{ setForm({ ...form, description: e.target.value }); if(e.target.value.trim()) setErrors(prev=>({ ...prev, description: undefined })) }}
                  placeholder="Array of mobile phone brands to be used in filter options"
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Values (one per line) *</label>
                <textarea
                  className="flex min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
                  rows={8}
                  value={form.valueText}
                  onChange={(e)=>{ setForm({ ...form, valueText: e.target.value }); if(e.target.value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).length>0) setErrors(prev=>({ ...prev, valueText: undefined })) }}
                  placeholder={`Acer\nAlcatel\nApple\n...`}
                />
                {errors.valueText && <p className="text-sm text-red-600 mt-1">{errors.valueText}</p>}
                <div className="mt-3 flex items-center gap-3">
                  <Input type="file" accept=".csv" onChange={(e)=> { const f = e.target.files?.[0]; if(f) parseCsvFile(f) }} disabled={csvLoading} />
                  <span className="text-xs text-gray-500">Upload CSV (single column or comma-separated)</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={()=> setIsCreateOpen(false)} disabled={creating}>Cancel</Button>
              <Button className="bg-[#1F058F] hover:bg-[#1F058F]/90" onClick={onCreate} disabled={creating}>{creating?"Creating...":"Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">Loading resources...</div>
      ) : resources.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500">No resources found</p>
          <Button className="mt-4 bg-[#1F058F] hover:bg-[#1F058F]/90" onClick={()=> setIsCreateOpen(true)}>Add First Resource</Button>
        </div>
      ) : (
        <Table className="border rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>API Endpoint</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((r)=> (
              <TableRow key={r._id ?? r.slug ?? r.name}>
                <TableCell className="font-medium text-[#1F058F] cursor-pointer" onClick={()=> router.push(`/admin/resources/${r.slug ?? r.name}`)}>
                  {r.name}
                </TableCell>
                <TableCell className="max-w-[500px] truncate">{r.description}</TableCell>
                <TableCell>{Array.isArray(r.value)? r.value.length : 0}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyApiEndpoint(r.slug ?? r.name)}
                    className="flex items-center gap-2"
                  >
                    {copiedSlug === (r.slug ?? r.name) ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="text-xs text-muted-foreground">/resources/one/{r.slug ?? r.name}</span>
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="outline" onClick={()=> router.push(`/admin/resources/${r.slug ?? r.name}`)}>View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {!loading && resources.length > 0 && (
        <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm text-gray-600">Page {currentPage} of {totalPages} • {filtered.length} result(s)</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={()=> setPage(p=> Math.max(1, p-1))} disabled={currentPage===1}>Previous</Button>
            <Button variant="outline" onClick={()=> setPage(p=> Math.min(totalPages, p+1))} disabled={currentPage===totalPages}>Next</Button>
            <div className="w-[140px]">
              <Select value={String(pageSize)} onValueChange={(v)=> setPageSize(Number(v))}>
                <SelectTrigger><SelectValue placeholder="Page size"/></SelectTrigger>
                <SelectContent>
                  {[5,10,20,50,100].map(n=> (
                    <SelectItem key={n} value={String(n)}>{n} / page</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

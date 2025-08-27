/* eslint-disable */
"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { apiClientAdmin } from "@/lib/interceptor"
import DeleteModal from "@/components/Home/DeleteModal"

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
  const id = useMemo(()=> params?.id as string, [params])
  const router = useRouter()

  const [svc, setSvc] = useState<AddOnService | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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

  useEffect(()=>{ fetchService() }, [id])


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
        <Button variant="outline" onClick={()=>router.back()}><ArrowLeft className="h-4 w-4 mr-1"/>Back</Button>
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
          <Button variant="outline" onClick={()=>router.back()}><ArrowLeft className="h-4 w-4 mr-1"/>Back</Button>
          <h1 className="text-2xl font-bold">{svc.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={()=> setIsDeleteOpen(true)} disabled={isDeleting}><Trash2 className="h-4 w-4 mr-2"/>{isDeleting ? "Deleting..." : "Delete"}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Description</h2>
            <p className="text-gray-700">{svc.description}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Included Add-ons</h2>
            {svc.included_add_ons?.length ? (
              <ul className="list-disc ml-6 space-y-1 text-gray-700">
                {svc.included_add_ons.map((f, i)=> (<li key={i}>{f}</li>))}
              </ul>
            ) : (
              <p className="text-gray-500">-</p>
            )}
          </div>
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


      {/* Delete modal */}
      <DeleteModal isOpen={isDeleteOpen} onClose={()=> setIsDeleteOpen(false)} onDelete={handleDelete} loading={isDeleting} />
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

// Types
interface Facility {
  label: string;
  description: string;
  mandatory: boolean;
  filterable: boolean;
  isActive: boolean;
  dataType: "string" | "number" | "boolean" | "array" | "object";
  dataInputType: "text" | "number" | "boolean" | "array" | "object"; // Fixed to match backend enum
  value?: string;
  // _id: string;
}

interface SubcategoryDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  subcategory: {
    _id: string
    name: string
    description: string
    imageUrl: string
    status: string
    createdAt: string
    updatedAt: string
    facilities: Facility[]
  } | null
  onEdit?: (subcategoryId: string) => void
  onDelete?: (subcategoryId: string) => void
}

export function SubcategoryDetailsModal({ isOpen, onClose, subcategory, onEdit, onDelete }: SubcategoryDetailsModalProps) {
  if (!subcategory) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1200px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between w-full">
            <span>{subcategory.name} Details</span>
            <div className="flex items-center gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                className="text-[#1F058F] border-[#1F058F] bg-white hover:bg-[#1F058F]/10"
                onClick={() => onEdit?.(subcategory._id)}
                disabled={!onEdit}
              >
                Edit
              </Button>
              <Button
                size="sm"
                className="bg-[#1F058F] hover:bg-[#1F058F]/90"
                onClick={() => onDelete?.(subcategory._id)}
                disabled={!onDelete}
              >
                Delete
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-4 col-span-1">
            <div className="aspect-square relative rounded-lg overflow-hidden border">
              <Image
                src={subcategory.imageUrl}
                alt={subcategory.name}
                fill
                className="object-cover"
              />
            </div>
             
            <div className="space-y-3 border rounded-lg p-6 bg-gray-50">
              <h3 className="font-semibold text-lg">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{subcategory.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">ID</p>
                  <p className="font-mono text-xs break-all">{subcategory._id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge
                    variant={subcategory.status === "active" ? "default" : "destructive"}
                    className="capitalize"
                  >
                    {subcategory.status}
                  </Badge>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-medium">{subcategory.description}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 border rounded-lg p-6 bg-gray-50">
              <h3 className="font-semibold text-lg">Timestamps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Created At</p>
                  <p className="font-medium">{formatDate(subcategory.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium">{formatDate(subcategory.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Facilities */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Facilities ({subcategory.facilities.length})</h3>
            {subcategory.facilities.length === 0 ? (
              <p className="text-sm text-gray-500">No facilities added</p>
            ) : (
              <div className="space-y-4">
                {subcategory.facilities.map((facility, index) => (
                  <div key={index} className="border rounded-lg p-6 bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium text-lg">{facility.label}</h4>
                        {facility.description && (
                          <p className="text-sm text-gray-600 mt-1">{facility.description}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={facility.isActive ? "default" : "secondary"}>{facility.isActive ? "Active" : "Inactive"}</Badge>
                        {facility.mandatory && <Badge variant="default">Mandatory</Badge>}
                        {facility.filterable && <Badge variant="default">Filterable</Badge>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Data Type</p>
                        <p className="font-medium capitalize">{facility.dataType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Input Type</p>
                        <p className="font-medium capitalize">{facility.dataInputType}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Value</p>
                        <p className="font-medium break-all">
                          {facility.value ? (
                            facility.dataType === "array" || facility.dataType === "object"
                              ? (Array.isArray(facility.value) ? facility.value.join(", ") : facility.value)
                              : facility.value
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} className="bg-[#1F058F] hover:bg-[#1F058F]/90">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
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
}

export function SubcategoryDetailsModal({ isOpen, onClose, subcategory }: SubcategoryDetailsModalProps) {
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{subcategory.name} Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Basic Information</h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{subcategory.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Description</p>
                <p className="font-medium">{subcategory.description}</p>
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
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Timestamps</h3>
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

          {/* Right Column - Facilities */}
          <div className="space-y-4 col-span-2">
            <h3 className="font-semibold text-lg">Facilities ({subcategory.facilities.length})</h3>
            
            {subcategory.facilities.length === 0 ? (
              <p className="text-gray-500">No facilities added</p>
            ) : (
              <div className="space-y-4">
                {subcategory.facilities.map((facility, index) => (
                  <div key={ index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{facility.label}</h4>
                        {facility.description && (
                          <p className="text-sm text-gray-600 mt-1">{facility.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={facility.isActive ? "default" : "secondary"}>
                          {facility.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {facility.mandatory && (
                          <Badge variant="default">Mandatory</Badge>
                        )}
                        {facility.filterable && (
                          <Badge variant="default">Filterable</Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-600">Data Type</p>
                        <p className="font-medium capitalize">{facility.dataType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Input Type</p>
                        <p className="font-medium capitalize">{facility.dataInputType}</p>
                      </div>
                      {facility.value && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600">Value</p>
                          <p className="font-medium break-all">
                            {facility.dataType === "array" || facility.dataType === "object"
                              ? (Array.isArray(facility.value) 
                                ? facility.value.join(", ")
                                : facility.value)
                              : facility.value}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} className="bg-[#1F058F]">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
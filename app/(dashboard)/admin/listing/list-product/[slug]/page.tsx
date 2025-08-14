/* eslint-disable */

"use client"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Trash2, Edit, Plus, ArrowLeft } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { apiClientAdmin } from "@/lib/interceptor"
import { SubcategoryDetailsModal } from "@/components/SubcategoryModal"

// Types
interface Facility {
    label: string;
    description: string;
    mandatory: boolean;
    filterable: boolean;
    isActive: boolean;
    dataType: "string" | "number" | "boolean" | "array" | "object";
    dataInputType: "text" | "number" | "boolean" | "array" | "object";
    value?: string;
    _id?: string;
}

interface Subcategory {
    _id: string
    name: string
    description: string
    imageUrl: string
    status: string
    createdAt: string
    category: string
    facilities: Facility[]
    updatedAt: string
}

interface Category {
    _id: string
    name: string
    slug: string
}

const DATA_TYPES = ["string", "number", "boolean", "array", "object"] as const;
const DATA_INPUT_TYPES = ["text", "number", "boolean", "array", "object"] as const;

export default function SubcategoryManagementPage() {
    const { slug } = useParams()
    const router = useRouter()
    const [category, setCategory] = useState<Category | null>(null)
    const [subcategories, setSubcategories] = useState<Subcategory[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [subcategoryToDelete, setSubcategoryToDelete] = useState<string | null>(null)

    // Create states
    const [newSubcategory, setNewSubcategory] = useState({
        name: "",
        description: "",
        imageUrl: "",
        status: "active",
        facilities: [] as Facility[]
    })
    const [selectedCreateFile, setSelectedCreateFile] = useState<File | null>(null)
    const [createImagePreview, setCreateImagePreview] = useState<string | null>(null)
    const [uploadingCreateImage, setUploadingCreateImage] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    // Edit states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null)
    const [selectedEditFile, setSelectedEditFile] = useState<File | null>(null)
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null)
    const [uploadingEditImage, setUploadingEditImage] = useState(false)

    const uploadImage = async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('fileType', 'Subcategory-images')

        const response = await apiClientAdmin.post("/users/upload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        return response.data.data.fileUrl
    }

    const handleCreateImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setSelectedCreateFile(file)

        if (file) {
            const previewUrl = URL.createObjectURL(file)
            setCreateImagePreview(previewUrl)
        } else {
            setCreateImagePreview(null)
            setNewSubcategory({ ...newSubcategory, imageUrl: "" })
        }
    }

    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setSelectedEditFile(file)

        if (file) {
            const previewUrl = URL.createObjectURL(file)
            setEditImagePreview(previewUrl)
        } else {
            setEditImagePreview(null)
            if (editingSubcategory) {
                setEditingSubcategory({ ...editingSubcategory, imageUrl: editingSubcategory.imageUrl })
            }
        }
    }

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            const categoryResponse = await apiClientAdmin.get(`/categories/${slug}`)
            setCategory(categoryResponse.data?.data?.category || categoryResponse.data)
            setSubcategories(categoryResponse.data?.data?.subCategories || [])
        } catch (error: any) {
            console.error('Error fetching data:', error)
            toast.error(error.response?.data?.message || "Failed to fetch data")
        } finally {
            setLoading(false)
        }
    }, [slug])

    useEffect(() => {
        if (slug) fetchData()
    }, [slug, fetchData])

    const resetCreateForm = () => {
        setNewSubcategory({
            name: "",
            description: "",
            imageUrl: "",
            status: "active",
            facilities: []
        })
        setSelectedCreateFile(null)
        setCreateImagePreview(null)
        setIsCreateModalOpen(false)
    }

    const resetEditForm = () => {
        setEditingSubcategory(null)
        setSelectedEditFile(null)
        setEditImagePreview(null)
        setIsEditModalOpen(false)
    }

    const addNewFacility = () => {
        setNewSubcategory(prev => ({
            ...prev,
            facilities: [
                ...prev.facilities,
                {
                    label: "",
                    description: "",
                    mandatory: false,
                    filterable: false,
                    isActive: true,
                    dataType: "string",
                    dataInputType: "text",
                    value: ""
                }
            ]
        }))
    }

    const updateCreateFacility = (index: number, field: keyof Facility, value: any) => {
        setNewSubcategory(prev => {
            const updatedFacilities = [...prev.facilities]
            updatedFacilities[index] = { ...updatedFacilities[index], [field]: value }
            return { ...prev, facilities: updatedFacilities }
        })
    }

    const removeCreateFacility = (index: number) => {
        setNewSubcategory(prev => {
            const updatedFacilities = [...prev.facilities]
            updatedFacilities.splice(index, 1)
            return { ...prev, facilities: updatedFacilities }
        })
    }

    const addEditFacility = () => {
        if (editingSubcategory) {
            setEditingSubcategory(prev => ({
                ...prev!,
                facilities: [
                    ...prev!.facilities,
                    {
                        label: "",
                        description: "",
                        mandatory: false,
                        filterable: false,
                        isActive: true,
                        dataType: "string",
                        dataInputType: "text",
                        value: ""
                    }
                ]
            }))
        }
    }

    const updateEditFacility = (index: number, field: keyof Facility, value: any) => {
        if (editingSubcategory) {
            setEditingSubcategory(prev => {
                const updatedFacilities = [...prev!.facilities]
                updatedFacilities[index] = { ...updatedFacilities[index], [field]: value }
                return { ...prev!, facilities: updatedFacilities }
            })
        }
    }

    const removeEditFacility = (index: number) => {
        if (editingSubcategory) {
            setEditingSubcategory(prev => {
                const updatedFacilities = [...prev!.facilities]
                updatedFacilities.splice(index, 1)
                return { ...prev!, facilities: updatedFacilities }
            })
        }
    }

    const handleCreateSubcategory = async () => {
        if (!category) {
            toast.error("Category not found")
            return
        }

        if (!newSubcategory.name.trim()) {
            toast.error("Subcategory name is required")
            return
        }

        for (const [index, facility] of newSubcategory.facilities.entries()) {
            if (!facility.label.trim()) {
                toast.error(`Facility #${index + 1}: Label is required`)
                return
            }

            if (["array", "object"].includes(facility.dataType) && !facility.value?.trim()) {
                toast.error(`Facility #${index + 1}: Value is required for ${facility.dataType} data type`)
                return
            }
        }

        try {
            setActionLoading(true)

            let imageUrl = newSubcategory.imageUrl

            if (selectedCreateFile) {
                setUploadingCreateImage(true)
                try {
                    imageUrl = await uploadImage(selectedCreateFile)
                    toast.success("Image uploaded successfully")
                } catch (uploadError: any) {
                    console.error('Image upload error:', uploadError)
                    toast.error("Failed to upload image")
                    return
                } finally {
                    setUploadingCreateImage(false)
                }
            }

            const subcategoryData = {
                name: newSubcategory.name.trim(),
                description: newSubcategory.description.trim(),
                imageUrl: imageUrl,
                status: newSubcategory.status,
                category: category._id,
                facilities: newSubcategory.facilities.map(facility => {
                    const facilityData: any = {
                        label: facility.label,
                        description: facility.description,
                        mandatory: facility.mandatory,
                        filterable: facility.filterable,
                        isActive: facility.isActive,
                        dataType: facility.dataType,
                        dataInputType: facility.dataInputType
                    }

                    if (["array", "object"].includes(facility.dataType)) {
                        facilityData.value = facility.value
                    }

                    return facilityData
                })
            }

            const response = await apiClientAdmin.post("/subcategories/create", subcategoryData)
            const newSub = response.data?.data?.subcategory || response.data
            console.log(newSub)
            fetchData()
            // setSubcategories(prev => [...prev, newSub])
            toast.success("Subcategory created successfully")
            resetCreateForm()
        } catch (error: any) {
            console.error('Create subcategory error:', error)
            toast.error(error.response?.data?.message || "Failed to create subcategory")
        } finally {
            setActionLoading(false)
        }
    }

    const handleUpdateSubcategory = async () => {
        if (!editingSubcategory) return

        if (!editingSubcategory.name.trim()) {
            toast.error("Subcategory name is required")
            return
        }

        for (const [index, facility] of editingSubcategory.facilities.entries()) {
            if (!facility.label.trim()) {
                toast.error(`Facility #${index + 1}: Label is required`)
                return
            }

            if (["array", "object"].includes(facility.dataType) && !facility.value?.trim()) {
                toast.error(`Facility #${index + 1}: Value is required for ${facility.dataType} data type`)
                return
            }
        }

        try {
            setActionLoading(true)

            let imageUrl = editingSubcategory.imageUrl

            if (selectedEditFile) {
                setUploadingEditImage(true)
                try {
                    imageUrl = await uploadImage(selectedEditFile)
                    toast.success("Image uploaded successfully")
                } catch (uploadError: any) {
                    console.error('Image upload error:', uploadError)
                    toast.error("Failed to upload image")
                    return
                } finally {
                    setUploadingEditImage(false)
                }
            }

            const updateData = {
                name: editingSubcategory.name.trim(),
                description: editingSubcategory.description.trim(),
                imageUrl: imageUrl,
                status: editingSubcategory.status,
                facilities: editingSubcategory.facilities.map(facility => {
                    const facilityData: any = {
                        label: facility.label,
                        description: facility.description,
                        mandatory: facility.mandatory,
                        filterable: facility.filterable,
                        isActive: facility.isActive,
                        dataType: facility.dataType,
                        dataInputType: facility.dataInputType
                    }

                    if (["array", "object"].includes(facility.dataType)) {
                        facilityData.value = facility.value
                    }

                    return facilityData
                })
            }

            const response = await apiClientAdmin.patch(
                `/subcategories/update/${editingSubcategory._id}`,
                updateData
            )
            console.log('updatedsub', response)
            // const updatedSub = response.data?.data?.updatedSubcategory 
            fetchData()
            // setSubcategories(response.data?.data?.updatedSubcategory )
            toast.success("Subcategory updated successfully")
            resetEditForm()
        } catch (error: any) {
            console.error('Update subcategory error:', error)
            toast.error(error.response?.data?.message || "Failed to update subcategory")
        } finally {
            setActionLoading(false)
        }
    }

    const handleDeleteSubcategory = async (id: string) => {
        try {
            setActionLoading(true)
            await apiClientAdmin.delete(`/subcategories/delete/${id}`)
            setSubcategories(prev => prev.filter(sub => sub._id !== id))
            toast.success("Subcategory deleted successfully")
        } catch (error: any) {
            console.error('Delete subcategory error:', error)
            toast.error(error.response?.data?.message || "Failed to delete subcategory")
        } finally {
            setActionLoading(false)
        }
    }

    useEffect(() => {
        return () => {
            if (createImagePreview) URL.revokeObjectURL(createImagePreview)
            if (editImagePreview) URL.revokeObjectURL(editImagePreview)
        }
    }, [createImagePreview, editImagePreview])

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-64">
                <p>Loading...</p>
            </div>
        )
    }

    if (!category) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Category not found</p>
                    <Button onClick={() => router.push('/admin/categories')}>
                        Back to Categories
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="flex items-center mb-6">
                <Button
                    variant="outline"
                    className="mr-4"
                    onClick={() => router.push('/admin/listing/list-product')}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">
                    Managing Subcategories for: {category.name}
                </h1>
            </div>

            <div className="flex justify-end mb-6 w-full">
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#1F058F] hover:bg-[#1F058F]/90">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Subcategory
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Subcategory</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Input
                                placeholder="Subcategory Name"
                                value={newSubcategory.name}
                                onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                                required
                            />
                            <Input
                                placeholder="Description"
                                value={newSubcategory.description}
                                onChange={(e) => setNewSubcategory({ ...newSubcategory, description: e.target.value })}
                            />

                            <div className="space-y-2">
                                <label className="block text-sm font-medium mb-1">Image</label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCreateImageChange}
                                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#1F058F] file:text-white hover:file:bg-[#1F058F]/90"
                                />

                                {selectedCreateFile && (
                                    <p className="text-sm text-gray-600">
                                        Selected: {selectedCreateFile.name}
                                    </p>
                                )}

                                {createImagePreview && (
                                    <div className="mt-2">
                                        <img
                                            src={createImagePreview}
                                            alt="Preview"
                                            className="w-20 h-20 object-cover rounded-md border"
                                        />
                                    </div>
                                )}

                                <div className="text-sm text-gray-500">Or paste image URL:</div>
                                <Input
                                    placeholder="https://example.com/image.jpg"
                                    value={newSubcategory.imageUrl}
                                    onChange={(e) => {
                                        setNewSubcategory({ ...newSubcategory, imageUrl: e.target.value })
                                        if (e.target.value) {
                                            setSelectedCreateFile(null)
                                            setCreateImagePreview(null)
                                        }
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={newSubcategory.status}
                                    onChange={(e) => setNewSubcategory({ ...newSubcategory, status: e.target.value })}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-medium">Facilities</h3>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-[#1F058F] border-[#1F058F] hover:bg-[#1F058F]/10"
                                        onClick={addNewFacility}
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Facility
                                    </Button>
                                </div>

                                {newSubcategory.facilities.length === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-4">No facilities added</p>
                                ) : (
                                    <div className="space-y-4">
                                        {newSubcategory.facilities.map((facility, index) => (
                                            <div key={index} className="border flex flex-col-reverse rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-medium">Facility #{index + 1}</h4>
                                                    <Button
                                                       className="bg-[#1F058F]"
                                                        size="sm"
                                                        onClick={() => removeCreateFacility(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Label*</label>
                                                        <Input
                                                            value={facility.label}
                                                            onChange={(e) => updateCreateFacility(index, 'label', e.target.value)}
                                                            placeholder="e.g., Brand, Color, Size"
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Description</label>
                                                        <Input
                                                            value={facility.description}
                                                            onChange={(e) => updateCreateFacility(index, 'description', e.target.value)}
                                                            placeholder="Description of this facility"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Data Type*</label>
                                                        <select
                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                            value={facility.dataType}
                                                            onChange={(e) => updateCreateFacility(index, 'dataType', e.target.value)}
                                                        >
                                                            {DATA_TYPES.map(type => (
                                                                <option key={type} value={type}>{type}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Input Type*</label>
                                                        <select
                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                            value={facility.dataInputType}
                                                            onChange={(e) => updateCreateFacility(index, 'dataInputType', e.target.value)}
                                                        >
                                                            {DATA_INPUT_TYPES.map(type => (
                                                                <option key={type} value={type}>{type}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">
                                                            Value {["array", "object"].includes(facility.dataType) && "*"}
                                                        </label>
                                                        <Input
                                                            value={facility.value || ''}
                                                            onChange={(e) => updateCreateFacility(index, 'value', e.target.value)}
                                                            placeholder={
                                                                facility.dataType === "array" ? "Comma-separated values or URL" :
                                                                    facility.dataType === "object" ? "JSON object or URL" : "Optional value"
                                                            }
                                                            required={["array", "object"].includes(facility.dataType)}
                                                        />
                                                        {["array", "object"].includes(facility.dataType) && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Required for {facility.dataType} data type
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                id={`mandatory-${index}`}
                                                                checked={facility.mandatory}
                                                                onChange={(e) => updateCreateFacility(index, 'mandatory', e.target.checked)}
                                                                className="mr-2"
                                                            />
                                                            <label htmlFor={`mandatory-${index}`} className="text-sm">
                                                                Mandatory
                                                            </label>
                                                        </div>

                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                id={`filterable-${index}`}
                                                                checked={facility.filterable}
                                                                onChange={(e) => updateCreateFacility(index, 'filterable', e.target.checked)}
                                                                className="mr-2"
                                                            />
                                                            <label htmlFor={`filterable-${index}`} className="text-sm">
                                                                Filterable
                                                            </label>
                                                        </div>

                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                id={`active-${index}`}
                                                                checked={facility.isActive}
                                                                onChange={(e) => updateCreateFacility(index, 'isActive', e.target.checked)}
                                                                className="mr-2"
                                                            />
                                                            <label htmlFor={`active-${index}`} className="text-sm">
                                                                Active
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={resetCreateForm}
                                disabled={actionLoading || uploadingCreateImage}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-[#1F058F] hover:bg-[#1F058F]/90"
                                onClick={handleCreateSubcategory}
                                disabled={actionLoading || uploadingCreateImage}
                            >
                                {uploadingCreateImage ? "Uploading..." : actionLoading ? "Creating..." : "Create"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {subcategories?.length == 0 ? (
                <div className="border rounded-lg p-8 text-center">
                    <p className="text-gray-500">No subcategories found for this category</p>
                    <Button
                        className="mt-4 bg-[#1F058F] hover:bg-[#1F058F]/90"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Add First Subcategory
                    </Button>
                </div>
            ) : (
                <Table className="border rounded-lg">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Facilities</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subcategories && subcategories.map((subcategory) => {
                            console.log('subbn', subcategory)
                            return (
                                <TableRow key={subcategory._id}>
                                    <TableCell className="font-medium">
                                        <button
                                            className="hover:underline text-left"
                                            onClick={() => {
                                                setSelectedSubcategory(subcategory)
                                                setIsDetailsModalOpen(true)
                                            }}
                                        >
                                            {subcategory?.name}
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        {subcategory?.description}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {subcategory?.facilities?.slice(0, 3).map((facility, i) => (
                                                <span key={i} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                                    {facility.label}
                                                </span>
                                            ))}
                                            {subcategory?.facilities?.length > 3 && (
                                                <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                                                    +{subcategory.facilities.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${subcategory?.status === "active"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}>
                                            {subcategory?.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(subcategory?.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="flex space-x-2">
                                        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setEditingSubcategory(subcategory)}
                                                    disabled={actionLoading}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-h-[80vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Edit Subcategory</DialogTitle>
                                                </DialogHeader>
                                                {editingSubcategory && (
                                                    <div className="space-y-4 py-4">
                                                        <Input
                                                            placeholder="Subcategory Name"
                                                            value={editingSubcategory.name}
                                                            onChange={(e) => setEditingSubcategory({
                                                                ...editingSubcategory,
                                                                name: e.target.value
                                                            })}
                                                            required
                                                        />
                                                        <Input
                                                            placeholder="Description"
                                                            value={editingSubcategory.description}
                                                            onChange={(e) => setEditingSubcategory({
                                                                ...editingSubcategory,
                                                                description: e.target.value
                                                            })}
                                                        />

                                                        <div className="space-y-2">
                                                            <label className="block text-sm font-medium mb-1">Image</label>
                                                            <Input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleEditImageChange}
                                                                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#1F058F] file:text-white hover:file:bg-[#1F058F]/90"
                                                            />

                                                            {selectedEditFile && (
                                                                <p className="text-sm text-gray-600">
                                                                    Selected: {selectedEditFile.name}
                                                                </p>
                                                            )}

                                                            {editImagePreview ? (
                                                                <div className="mt-2">
                                                                    <img
                                                                        src={editImagePreview}
                                                                        alt="Preview"
                                                                        className="w-20 h-20 object-cover rounded-md border"
                                                                    />
                                                                </div>
                                                            ) : editingSubcategory.imageUrl ? (
                                                                <div className="mt-2">
                                                                    <img
                                                                        src={editingSubcategory.imageUrl}
                                                                        alt="Current"
                                                                        className="w-20 h-20 object-cover rounded-md border"
                                                                    />
                                                                </div>
                                                            ) : null}

                                                            <div className="text-sm text-gray-500">Or paste image URL:</div>
                                                            <Input
                                                                placeholder="Image URL"
                                                                value={editingSubcategory.imageUrl}
                                                                onChange={(e) => {
                                                                    setEditingSubcategory({
                                                                        ...editingSubcategory,
                                                                        imageUrl: e.target.value
                                                                    })
                                                                    if (e.target.value) {
                                                                        setSelectedEditFile(null)
                                                                        setEditImagePreview(null)
                                                                    }
                                                                }}
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium mb-1">Status</label>
                                                            <select
                                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                                value={editingSubcategory.status}
                                                                onChange={(e) => setEditingSubcategory({
                                                                    ...editingSubcategory,
                                                                    status: e.target.value
                                                                })}
                                                            >
                                                                <option value="active">Active</option>
                                                                <option value="inactive">Inactive</option>
                                                            </select>
                                                        </div>

                                                        <div className="border-t pt-4 mt-4">
                                                            <div className="flex justify-between items-center mb-4">
                                                                <h3 className="font-medium">Facilities</h3>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-[#1F058F] border-[#1F058F] hover:bg-[#1F058F]/10"
                                                                    onClick={addEditFacility}
                                                                >
                                                                    <Plus className="h-4 w-4 mr-1" />
                                                                    Add Facility
                                                                </Button>
                                                            </div>

                                                            {editingSubcategory.facilities.length == 0 ? (
                                                                <p className="text-sm text-gray-500 text-center py-4">No facilities added</p>
                                                            ) : (
                                                                <div className="space-y-4 ">
                                                                    {editingSubcategory?.facilities.map((facility, index) => (
                                                                        <div key={facility._id || index} className="border   rounded-lg p-4">
                                                                            <div className="flex justify-between items-start mb-2">
                                                                                <h4 className="font-medium">Facility #{index + 1}</h4>
                                                                                <Button
                                                                                    className="bg-[#1F058F]"
                                                                                    size="sm"
                                                                                    onClick={() => removeEditFacility(index)}
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                            </div>

                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                <div>
                                                                                    <label className="block text-sm font-medium mb-1">Label*</label>
                                                                                    <Input
                                                                                        value={facility.label}
                                                                                        onChange={(e) => updateEditFacility(index, 'label', e.target.value)}
                                                                                        placeholder="e.g., Brand, Color, Size"
                                                                                        required
                                                                                    />
                                                                                </div>

                                                                                <div>
                                                                                    <label className="block text-sm font-medium mb-1">Description</label>
                                                                                    <Input
                                                                                        value={facility.description}
                                                                                        onChange={(e) => updateEditFacility(index, 'description', e.target.value)}
                                                                                        placeholder="Description of this facility"
                                                                                    />
                                                                                </div>

                                                                                <div>
                                                                                    <label className="block text-sm font-medium mb-1">Data Type*</label>
                                                                                    <select
                                                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                                                        value={facility.dataType}
                                                                                        onChange={(e) => updateEditFacility(index, 'dataType', e.target.value)}
                                                                                    >
                                                                                        {DATA_TYPES.map(type => (
                                                                                            <option key={type} value={type}>{type}</option>
                                                                                        ))}
                                                                                    </select>
                                                                                </div>

                                                                                <div>
                                                                                    <label className="block text-sm font-medium mb-1">Input Type*</label>
                                                                                    <select
                                                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                                                        value={facility.dataInputType}
                                                                                        onChange={(e) => updateEditFacility(index, 'dataInputType', e.target.value)}
                                                                                    >
                                                                                        {DATA_INPUT_TYPES.map(type => (
                                                                                            <option key={type} value={type}>{type}</option>
                                                                                        ))}
                                                                                    </select>
                                                                                </div>

                                                                                <div>
                                                                                    <label className="block text-sm font-medium mb-1">
                                                                                        Value {["array", "object"].includes(facility.dataType) && "*"}
                                                                                    </label>
                                                                                    <Input
                                                                                        value={facility.value || ''}
                                                                                        onChange={(e) => updateEditFacility(index, 'value', e.target.value)}
                                                                                        placeholder={
                                                                                            facility.dataType === "array" ? "Comma-separated values or URL" :
                                                                                                facility.dataType === "object" ? "JSON object or URL" : "Optional value"
                                                                                        }
                                                                                        required={["array", "object"].includes(facility.dataType)}
                                                                                    />
                                                                                    {["array", "object"].includes(facility.dataType) && (
                                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                                            Required for {facility.dataType} data type
                                                                                        </p>
                                                                                    )}
                                                                                </div>

                                                                                <div className="space-y-2">
                                                                                    <div className="flex items-center">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            id={`mandatory-edit-${index}`}
                                                                                            checked={facility.mandatory}
                                                                                            onChange={(e) => updateEditFacility(index, 'mandatory', e.target.checked)}
                                                                                            className="mr-2"
                                                                                        />
                                                                                        <label htmlFor={`mandatory-edit-${index}`} className="text-sm">
                                                                                            Mandatory
                                                                                        </label>
                                                                                    </div>

                                                                                    <div className="flex items-center">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            id={`filterable-edit-${index}`}
                                                                                            checked={facility.filterable}
                                                                                            onChange={(e) => updateEditFacility(index, 'filterable', e.target.checked)}
                                                                                            className="mr-2"
                                                                                        />
                                                                                        <label htmlFor={`filterable-edit-${index}`} className="text-sm">
                                                                                            Filterable
                                                                                        </label>
                                                                                    </div>

                                                                                    <div className="flex items-center">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            id={`active-edit-${index}`}
                                                                                            checked={facility.isActive}
                                                                                            onChange={(e) => updateEditFacility(index, 'isActive', e.target.checked)}
                                                                                            className="mr-2"
                                                                                        />
                                                                                        <label htmlFor={`active-edit-${index}`} className="text-sm">
                                                                                            Active
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={resetEditForm}
                                                        disabled={actionLoading || uploadingEditImage}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        className="bg-[#1F058F] hover:bg-[#1F058F]/90"
                                                        onClick={handleUpdateSubcategory}
                                                        disabled={actionLoading || uploadingEditImage}
                                                    >
                                                        {uploadingEditImage ? "Uploading..." : actionLoading ? "Updating..." : "Update"}
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    className="bg-[#1F058F]"
                                                    size="icon"
                                                    onClick={() => {
                                                        setSubcategoryToDelete(subcategory._id)
                                                    }}
                                                    disabled={actionLoading}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Confirm Deletion</DialogTitle>
                                                </DialogHeader>
                                                <div className="py-4">
                                                    <p>Are you sure you want to delete this subcategory? This action cannot be undone.</p>
                                                </div>
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setIsDeleteDialogOpen(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                    className="bg-[#1F058F]"
                                                        onClick={async () => {
                                                            if (subcategoryToDelete) {
                                                                await handleDeleteSubcategory(subcategoryToDelete)
                                                                setIsDeleteDialogOpen(false)
                                                            }
                                                        }}
                                                        disabled={actionLoading}
                                                    >
                                                        {actionLoading ? "Deleting..." : "Delete"}
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            )}
            <SubcategoryDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                subcategory={selectedSubcategory}
            />
        </div>
    )
}
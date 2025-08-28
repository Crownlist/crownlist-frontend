/* eslint-disable */

"use client"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Trash2, Edit, Plus, ArrowLeft, ChevronDown } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
    selectType?: "single" | "multiple";
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
const SELECT_TYPES = ["single", "multiple"] as const;

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
    // Inline errors for create form
    const [createErrors, setCreateErrors] = useState<{ name?: string; description?: string; image?: string }>({})
    const [createFacilityErrors, setCreateFacilityErrors] = useState<Array<{ label?: string; value?: string; selectType?: string }>>([])

    // Edit states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null)
    const [selectedEditFile, setSelectedEditFile] = useState<File | null>(null)
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null)
    const [uploadingEditImage, setUploadingEditImage] = useState(false)
    // Inline errors for edit form
    const [editErrors, setEditErrors] = useState<{ name?: string; description?: string }>({})
    const [editFacilityErrors, setEditFacilityErrors] = useState<Array<{ label?: string; value?: string; selectType?: string }>>([])

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
            setCreateErrors(prev => ({ ...prev, image: undefined }))
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
        setCreateErrors({})
        setCreateFacilityErrors([])
        setIsCreateModalOpen(false)
    }

    const resetEditForm = () => {
        setEditingSubcategory(null)
        setSelectedEditFile(null)
        setEditImagePreview(null)
        setEditErrors({})
        setEditFacilityErrors([])
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
        // expand create facility errors
        setCreateFacilityErrors(prev => [...prev, {}])
    }

    const updateCreateFacility = (index: number, field: keyof Facility, value: any) => {
        setNewSubcategory(prev => {
            const updatedFacilities = [...prev.facilities]
            updatedFacilities[index] = { ...updatedFacilities[index], [field]: value }
            return { ...prev, facilities: updatedFacilities }
        })
        // clear specific field error when valid
        setCreateFacilityErrors(prev => {
            const next = [...prev]
            const errs = { ...(next[index] || {}) }
            if (field === 'label' && String(value).trim()) errs.label = undefined
            if (field === 'value' && String(value).trim()) errs.value = undefined
            if (field === 'selectType' && value) errs.selectType = undefined
            next[index] = errs
            return next
        })
    }

    const removeCreateFacility = (index: number) => {
        setNewSubcategory(prev => {
            const updatedFacilities = [...prev.facilities]
            updatedFacilities.splice(index, 1)
            return { ...prev, facilities: updatedFacilities }
        })
        setCreateFacilityErrors(prev => {
            const next = [...prev]
            next.splice(index, 1)
            return next
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
            setEditFacilityErrors(prev => [...prev, {}])
        }
    }

    const updateEditFacility = (index: number, field: keyof Facility, value: any) => {
        if (editingSubcategory) {
            setEditingSubcategory(prev => {
                const updatedFacilities = [...prev!.facilities]
                updatedFacilities[index] = { ...updatedFacilities[index], [field]: value }
                return { ...prev!, facilities: updatedFacilities }
            })
            setEditFacilityErrors(prev => {
                const next = [...prev]
                const errs = { ...(next[index] || {}) }
                if (field === 'label' && String(value).trim()) errs.label = undefined
                if (field === 'value' && String(value).trim()) errs.value = undefined
                if (field === 'selectType' && value) errs.selectType = undefined
                next[index] = errs
                return next
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
            setEditFacilityErrors(prev => {
                const next = [...prev]
                next.splice(index, 1)
                return next
            })
        }
    }

    const handleCreateSubcategory = async () => {
        if (!category) {
            toast.error("Category not found")
            return
        }

        const nextErrors: { name?: string; description?: string; image?: string } = {}
        if (!newSubcategory.name.trim()) {
            nextErrors.name = "Subcategory name is required"
        }
        if (!newSubcategory.description.trim()) {
            nextErrors.description = "Subcategory description is required"
        }
        // Image required: ensure a file is selected (URL input is hidden for create)
        if (!selectedCreateFile) {
            nextErrors.image = "Subcategory image is required"
        }
        setCreateErrors(nextErrors)
        if (Object.keys(nextErrors).length > 0) {
            toast.error("Please fix the highlighted fields")
            return
        }

        // Validate facilities and collect inline errors
        const facilityErrors: Array<{ label?: string; value?: string; selectType?: string }> = []
        let hasFacilityError = false
        newSubcategory.facilities.forEach((facility, index) => {
            const errs: { label?: string; value?: string; selectType?: string } = {}
            if (!facility.label.trim()) {
                errs.label = 'Label is required'
                hasFacilityError = true
            }
            if (["array", "object"].includes(facility.dataType) && !facility.value?.trim()) {
                errs.value = `Value is required for ${facility.dataType}`
                hasFacilityError = true
            }
            if (facility.dataType === 'array' && !facility.selectType) {
                errs.selectType = 'Select Type is required for array'
                hasFacilityError = true
            }
            facilityErrors[index] = errs
        })
        setCreateFacilityErrors(facilityErrors)
        if (hasFacilityError) {
            toast.error('Please fix facility errors')
            return
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

        if (!editingSubcategory.description.trim()) {
            toast.error("Subcategory description is required")
            return
        }

        const facilityErrors: Array<{ label?: string; value?: string; selectType?: string }> = []
        let hasFacilityError = false
        editingSubcategory.facilities.forEach((facility, index) => {
            const errs: { label?: string; value?: string; selectType?: string } = {}
            if (!facility.label.trim()) {
                errs.label = 'Label is required'
                hasFacilityError = true
            }
            if (["array", "object"].includes(facility.dataType) && !facility.value?.trim()) {
                errs.value = `Value is required for ${facility.dataType}`
                hasFacilityError = true
            }
            if (facility.dataType === 'array' && !facility.selectType) {
                errs.selectType = 'Select Type is required for array'
                hasFacilityError = true
            }
            facilityErrors[index] = errs
        })
        setEditFacilityErrors(facilityErrors)
        if (hasFacilityError) {
            toast.error('Please fix facility errors')
            return
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
                    onClick={() => router.push('/admin/categories')}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">
                    Managing Subcategories for: {category.name}
                </h1>
            </div>
            {/* Creating Subcats */}
            <div className="flex justify-end mb-6 w-full">
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#1F058F] hover:bg-[#1F058F]/90">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Subcategory
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1200px] max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Subcategory</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Subcategory Name *</label>
                                        <Input
                                            placeholder="Subcategory Name"
                                            value={newSubcategory.name}
                                            onChange={(e) => {
                                                setNewSubcategory({ ...newSubcategory, name: e.target.value })
                                                if (e.target.value.trim()) setCreateErrors(prev => ({ ...prev, name: undefined }))
                                            }}
                                            required
                                        />
                                        {createErrors.name && (
                                            <p className="text-sm text-red-600 mt-1">{createErrors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Status</label>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between">
                                                    {newSubcategory.status === "active" ? "Active" : "Inactive"}
                                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[--radix-dropdown-menu-trigger-width]">
                                                <DropdownMenuItem onClick={() => setNewSubcategory({ ...newSubcategory, status: "active" })}>
                                                    Active
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setNewSubcategory({ ...newSubcategory, status: "inactive" })}>
                                                    Inactive
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Description *</label>
                                        <textarea
                                            placeholder="Description"
                                            value={newSubcategory.description}
                                            onChange={(e) => {
                                                setNewSubcategory({ ...newSubcategory, description: e.target.value })
                                                if (e.target.value.trim()) setCreateErrors(prev => ({ ...prev, description: undefined }))
                                            }}
                                            required
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
                                            rows={3}
                                        />
                                        {createErrors.description && (
                                            <p className="text-sm text-red-600 mt-1">{createErrors.description}</p>
                                        )}
                                    </div>

                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Image *</label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCreateImageChange}
                                            className="file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#1F058F] file:text-white hover:file:bg-[#1F058F]/90"
                                        />

                                        {selectedCreateFile && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                Selected: {selectedCreateFile.name}
                                            </p>
                                        )}

                                        {createImagePreview && (
                                            <div className="mt-2">
                                                <img
                                                    src={createImagePreview}
                                                    alt="Preview"
                                                    className="w-24 h-24 object-cover rounded-md border"
                                                />
                                            </div>
                                        )}
                                        {createErrors.image && (
                                            <p className="text-sm text-red-600 mt-2">{createErrors.image}</p>
                                        )}

                                        {/* <div className="text-sm text-gray-500 mt-2">Or paste image URL:</div> */}
                                        {/* <Input
                                            placeholder="https://example.com/image.jpg"
                                            value={newSubcategory.imageUrl}
                                            onChange={(e) => {
                                                setNewSubcategory({ ...newSubcategory, imageUrl: e.target.value })
                                                if (e.target.value) {
                                                    setSelectedCreateFile(null)
                                                    setCreateImagePreview(null)
                                                }
                                            }}
                                            className="mt-2"
                                        /> */}
                                    </div>
                                </div>
                            </div>
                            {/* Facilities */}
                            <div className="border-t pt-6 mt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium">Facilities</h3>
                                </div>

                                {newSubcategory.facilities.length === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                                        No facilities added yet. Click "Add Facility" to get started.
                                    </p>
                                ) : (
                                    <div className="space-y-6">
                                        {newSubcategory.facilities.map((facility: any, index: any) => (
                                            <div key={index} className="border rounded-lg p-6 bg-gray-50">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h4 className="font-medium text-lg">Facility #{index + 1}</h4>
                                                    <Button
                                                        className="text-[#1F058F] border-[#1F058F] bg-white hover:bg-[#1F058F]/10"
                                                        size="sm"
                                                        onClick={() => removeCreateFacility(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Label *</label>
                                                        <Input
                                                            value={facility.label}
                                                            className='bg-white'
                                                            onChange={(e) => updateCreateFacility(index, 'label', e.target.value)}
                                                            placeholder="e.g., Brand, Color, Size"
                                                            required
                                                        />
                                                        {createFacilityErrors?.[index]?.label && (
                                                            <p className="text-sm text-red-600 mt-1">{createFacilityErrors[index].label}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Data Type *</label>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="outline" className="w-full justify-between">
                                                                    {facility.dataType}
                                                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[--radix-dropdown-menu-trigger-width]">
                                                                {DATA_TYPES.map(type => (
                                                                    <DropdownMenuItem key={type} onClick={() => updateCreateFacility(index, 'dataType', type)}>
                                                                        {type}
                                                                    </DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Select Type {facility.dataType === 'array' && '*'}</label>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    className="w-full justify-between"
                                                                    disabled={facility.dataType !== 'array'}
                                                                >
                                                                    {facility.selectType || 'Select Type'}
                                                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[--radix-dropdown-menu-trigger-width]">
                                                                {SELECT_TYPES.map(type => (
                                                                    <DropdownMenuItem key={type} onClick={() => updateCreateFacility(index, 'selectType', type)}>
                                                                        {type}
                                                                    </DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                        {facility.dataType === 'array' && createFacilityErrors?.[index]?.selectType && (
                                                            <p className="text-sm text-red-600 mt-1">{createFacilityErrors[index].selectType}</p>
                                                        )}
                                                    </div>

                                                    <div className="md:col-span-1">
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
                                                            disabled={["boolean", "number", "string"].includes(facility.dataType)}
                                                            className='bg-white'
                                                        />
                                                        {["array", "object"].includes(facility.dataType) && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Required for {facility.dataType} data type
                                                            </p>
                                                        )}
                                                        {createFacilityErrors?.[index]?.value && (
                                                            <p className="text-sm text-red-600 mt-1">{createFacilityErrors[index].value}</p>
                                                        )}
                                                    </div>

                                                    <div className='md:col-span-2'>
                                                        <label className="block text-sm font-medium mb-1">Description *</label>
                                                        <textarea
                                                            value={facility.description}
                                                            className='bg-white flex min-h-[80px] w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical'
                                                            onChange={(e) => updateCreateFacility(index, 'description', e.target.value)}
                                                            placeholder="Description of this facility"
                                                            required
                                                            rows={3}
                                                        />
                                                    </div>
                                                    {/* checkbox */}
                                                    <div className="space-y-3 sm:flex sm:items-center sm:space-y-0 sm:space-x-2 ">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                id={`mandatory-${index}`}
                                                                checked={facility.mandatory}
                                                                onChange={(e) => updateCreateFacility(index, 'mandatory', e.target.checked)}
                                                                className="mr-2"
                                                            />
                                                            <label htmlFor={`mandatory-${index}`} className="text-sm font-medium">
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
                                                            <label htmlFor={`filterable-${index}`} className="text-sm font-medium">
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
                                                            <label htmlFor={`active-${index}`} className="text-sm font-medium">
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
                            {/* Add Facility Button */}
                            <div className="flex w-full justify-end">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex text-[#1F058F] border-[#1F058F] hover:bg-[#1F058F]/10 justify-end"
                                    onClick={addNewFacility}
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Facility
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4 border-t">
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
                                            <DialogContent className="sm:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1200px] max-h-[85vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Edit Subcategory</DialogTitle>
                                                </DialogHeader>
                                                {/* Edit subcategory  */}
                                                {editingSubcategory && (
                                                    <div className="space-y-6 py-4">
                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <label className="block text-sm font-medium mb-2">Subcategory Name *</label>
                                                                    <Input
                                                                        placeholder="Subcategory Name"
                                                                        value={editingSubcategory.name}
                                                                        onChange={(e) => {
                                                                            setEditingSubcategory({
                                                                                ...editingSubcategory,
                                                                                name: e.target.value
                                                                            })
                                                                            if (e.target.value.trim()) setEditErrors(prev => ({ ...prev, name: undefined }))
                                                                        }}
                                                                        required
                                                                    />
                                                                    {editErrors.name && (
                                                                        <p className="text-sm text-red-600 mt-1">{editErrors.name}</p>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium mb-2">Description *</label>
                                                                    <textarea
                                                                        placeholder="Description"
                                                                        value={editingSubcategory.description}
                                                                        onChange={(e) => {
                                                                            setEditingSubcategory({
                                                                                ...editingSubcategory,
                                                                                description: e.target.value
                                                                            })
                                                                            if (e.target.value.trim()) setEditErrors(prev => ({ ...prev, description: undefined }))
                                                                        }}
                                                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
                                                                        rows={3}
                                                                    />
                                                                    {editErrors.description && (
                                                                        <p className="text-sm text-red-600 mt-1">{editErrors.description}</p>
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col w-full">
                                                                    <label className="block text-sm font-medium mb-2">Status</label>
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button variant="outline" className=" w-full justify-between">
                                                                                {editingSubcategory.status === "active" ? "Active" : "Inactive"}
                                                                                <ChevronDown className="h-4 w-4 opacity-50" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent className="">
                                                                            <DropdownMenuItem onClick={() => setEditingSubcategory({
                                                                                ...editingSubcategory,
                                                                                status: "active"
                                                                            })}>
                                                                                Active
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => setEditingSubcategory({
                                                                                ...editingSubcategory,
                                                                                status: "inactive"
                                                                            })}>
                                                                                Inactive
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <div>
                                                                    <label className="block text-sm font-medium mb-2">Image</label>
                                                                    <Input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={handleEditImageChange}
                                                                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#1F058F] file:text-white hover:file:bg-[#1F058F]/90"
                                                                    />

                                                                    {selectedEditFile && (
                                                                        <p className="text-sm text-gray-600 mt-2">
                                                                            Selected: {selectedEditFile.name}
                                                                        </p>
                                                                    )}

                                                                    {editImagePreview ? (
                                                                        <div className="mt-2">
                                                                            <img
                                                                                src={editImagePreview}
                                                                                alt="Preview"
                                                                                className="w-24 h-24 object-cover rounded-md border"
                                                                            />
                                                                        </div>
                                                                    ) : editingSubcategory.imageUrl ? (
                                                                        <div className="mt-2">
                                                                            <img
                                                                                src={editingSubcategory.imageUrl}
                                                                                alt="Current"
                                                                                className="w-24 h-24 object-cover rounded-md border"
                                                                            />
                                                                        </div>
                                                                    ) : null}

                                                                    <div className="text-sm text-gray-500 mt-2">Or paste image URL:</div>
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
                                                                        className="mt-2"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="border-t pt-6 mt-6">
                                                            <div className="flex justify-between items-center mb-4">
                                                                <h3 className="text-lg font-medium">Facilities</h3>

                                                            </div>

                                                            {editingSubcategory.facilities.length == 0 ? (
                                                                <p className="text-sm text-gray-500 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                                                                    No facilities added yet. Click "Add Facility" to get started.
                                                                </p>
                                                            ) : (
                                                                <div className="space-y-6">
                                                                    {editingSubcategory?.facilities.map((facility, index) => (
                                                                        <div key={facility._id || index} className="border rounded-lg p-6 bg-gray-50">
                                                                            <div className="flex justify-between items-start mb-4">
                                                                                <h4 className="font-medium text-lg">Facility #{index + 1}</h4>
                                                                                <Button
                                                                                    className="bg-[#1F058F] hover:bg-[#1F058F]/90"
                                                                                    size="sm"
                                                                                    onClick={() => removeEditFacility(index)}
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                            </div>

                                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                                <div>
                                                                                    <label className="block text-sm font-medium mb-1">Label *</label>
                                                                                    <Input
                                                                                        value={facility.label}
                                                                                        onChange={(e) => updateEditFacility(index, 'label', e.target.value)}
                                                                                        placeholder="e.g., Brand, Color, Size"
                                                                                        required
                                                                                    />
                                                                                    {editFacilityErrors?.[index]?.label && (
                                                                                        <p className="text-sm text-red-600 mt-1">{editFacilityErrors[index].label}</p>
                                                                                    )}
                                                                                </div>

                                                                                {/* data type */}
                                                                                <div>
                                                                                    <label className="block text-sm font-medium mb-1">Data Type *</label>
                                                                                    <DropdownMenu>
                                                                                        <DropdownMenuTrigger asChild>
                                                                                            <Button variant="outline" className="w-full justify-between">
                                                                                                {facility.dataType}
                                                                                                <ChevronDown className="h-4 w-4 opacity-50" />
                                                                                            </Button>
                                                                                        </DropdownMenuTrigger>
                                                                                        <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[--radix-dropdown-menu-trigger-width]">
                                                                                            {DATA_TYPES.map(type => (
                                                                                                <DropdownMenuItem key={type} onClick={() => updateEditFacility(index, 'dataType', type)}>
                                                                                                    {type}
                                                                                                </DropdownMenuItem>
                                                                                            ))}
                                                                                        </DropdownMenuContent>
                                                                                    </DropdownMenu>
                                                                                </div>
                                                                                {/* select type */}
                                                                                <div>
                                                                                    <label className="block text-sm font-medium mb-1">Select Type {facility.dataType === 'array' && '*'}</label>
                                                                                    <DropdownMenu>
                                                                                        <DropdownMenuTrigger asChild>
                                                                                            <Button
                                                                                                variant="outline"
                                                                                                className="w-full justify-between"
                                                                                                disabled={facility.dataType !== 'array'}
                                                                                            >
                                                                                                {facility.selectType || 'Select Type'}
                                                                                                <ChevronDown className="h-4 w-4 opacity-50" />
                                                                                            </Button>
                                                                                        </DropdownMenuTrigger>
                                                                                        <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[--radix-dropdown-menu-trigger-width]">
                                                                                            {SELECT_TYPES.map(type => (
                                                                                                <DropdownMenuItem key={type} onClick={() => updateEditFacility(index, 'selectType', type)}>
                                                                                                    {type}
                                                                                                </DropdownMenuItem>
                                                                                            ))}
                                                                                        </DropdownMenuContent>
                                                                                    </DropdownMenu>
                                                                                    {facility.dataType === 'array' && editFacilityErrors?.[index]?.selectType && (
                                                                                        <p className="text-sm text-red-600 mt-1">{editFacilityErrors[index].selectType}</p>
                                                                                    )}
                                                                                </div>

                                                                                <div className="md:col-span-1">
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
                                                                                    {editFacilityErrors?.[index]?.value && (
                                                                                        <p className="text-sm text-red-600 mt-1">{editFacilityErrors[index].value}</p>
                                                                                    )}
                                                                                </div>

                                                                                {/* description  */}
                                                                                <div className='md:col-span-2'>
                                                                                    <label className="block text-sm font-medium mb-1">Description</label>
                                                                                    <textarea
                                                                                        value={facility.description}
                                                                                        onChange={(e) => updateEditFacility(index, 'description', e.target.value)}
                                                                                        placeholder="Description of this facility"
                                                                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
                                                                                        rows={3}
                                                                                    />
                                                                                </div>

                                                                                <div className="space-y-3 sm:flex sm:items-center sm:space-y-0 sm:space-x-2 ">
                                                                                    <div className="flex items-center">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            id={`mandatory-edit-${index}`}
                                                                                            checked={facility.mandatory}
                                                                                            onChange={(e) => updateEditFacility(index, 'mandatory', e.target.checked)}
                                                                                            className="mr-2"
                                                                                        />
                                                                                        <label htmlFor={`mandatory-edit-${index}`} className="text-sm font-medium">
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
                                                                                        <label htmlFor={`filterable-edit-${index}`} className="text-sm font-medium">
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
                                                                                        <label htmlFor={`active-edit-${index}`} className="text-sm font-medium">
                                                                                            Active
                                                                                        </label>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <div className='flex w-full justify-end mt-2'>
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
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="flex justify-end space-x-3 pt-4 border-t">
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
                                            <DialogContent className="sm:max-w-[500px]">
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
                onEdit={(id) => {
                    const sub = subcategories.find(s => s._id === id) || selectedSubcategory
                    if (sub) {
                        setEditingSubcategory(sub)
                        setIsEditModalOpen(true)
                        setIsDetailsModalOpen(false)
                    }
                }}
                onDelete={(id) => {
                    setSubcategoryToDelete(id)
                    setIsDeleteDialogOpen(true)
                    setIsDetailsModalOpen(false)
                }}
            />
        </div>
    )
}
"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Trash2, Edit, Plus } from "lucide-react"
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
import { ChevronDown } from "lucide-react"
import { apiClientAdmin } from "@/lib/interceptor"

interface Category {
  _id: string
  name: string
  slug: string
  description: string
  imageUrl: string
  status: string
  createdAt: string
}

export default function CategoryManagementPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Updated state for two-step upload
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    imageUrl: "", // Back to imageUrl since API expects URL
    status: "active"
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Inline errors for create form
  const [createErrors, setCreateErrors] = useState<{ name?: string; description?: string; image?: string }>({})
  // Inline errors for edit form
  const [editErrors, setEditErrors] = useState<{ name?: string; description?: string }>({})

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await apiClientAdmin.get("/categories")
      console.log("neww", response)
      setCategories(response.data?.data?.total)
    } catch (error) {
      toast.error(`Failed to fetch categories, ${error}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Upload image to get URL
  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileType', 'Profile-pics')

    const response = await apiClientAdmin.post("/users/upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data.data.fileUrl
  }

  // Handle file selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)

    // Create preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      // clear image url if file picked and clear error
      setNewCategory(prev => ({ ...prev, imageUrl: prev.imageUrl }))
      setCreateErrors(prev => ({ ...prev, image: undefined }))
    } else {
      setImagePreview(null)
      setNewCategory({ ...newCategory, imageUrl: "" })
    }
  }

  // Updated create category handler with two-step process
  const handleCreateCategory = async () => {
    try {
      setLoading(true)

      // Validate required fields before any upload/API calls
      const nextErrors: { name?: string; description?: string; image?: string } = {}
      if (!newCategory.name.trim()) {
        nextErrors.name = "Category name is required"
      }
      if (!newCategory.description.trim()) {
        nextErrors.description = "Category description is required"
      }
      // Image required: either selected file or valid URL
      if (!selectedFile && !newCategory.imageUrl.trim()) {
        nextErrors.image = "Category image is required (upload a file or paste a URL)"
      }
      setCreateErrors(nextErrors)
      if (Object.keys(nextErrors).length > 0) {
        // Also show toast summary
        toast.error("Please fix the highlighted fields")
        return
      }

      let imageUrl = newCategory.imageUrl

      // If user selected a new file, upload it first
      if (selectedFile) {
        setUploadingImage(true)
        try {
          imageUrl = await uploadImage(selectedFile)
          toast.success("Image uploaded successfully")
        } catch (uploadError) {
          toast.error(`Failed to upload image, ${uploadError}`)
          return // Stop if image upload fails
        } finally {
          setUploadingImage(false)
          fetchCategories()
        }
      }

      // Now create category with the image URL (using regular JSON, not FormData)
      const categoryData = {
        name: newCategory.name,
        description: newCategory.description,
        imageUrl: imageUrl,
        status: newCategory.status
      }

      const response = await apiClientAdmin.post("/categories/create", categoryData)
      
      toast.success(response.data.message)
      
      // Reset form
      setNewCategory({ name: "", description: "", imageUrl: "", status: "active" })
      setSelectedFile(null)
      setImagePreview(null)
      setIsCreateModalOpen(false)

    } catch (error) {
      toast.error(`Failed to create category, ${error}`)
    } finally {
      setLoading(false)
      fetchCategories()
    }
  }

  // Update category
  const handleUpdateCategory = async () => {
    if (!editingCategory) return

    try {
      setLoading(true)

      // Validate required fields before API call (inline)
      const nextErrors: { name?: string; description?: string } = {}
      if (!editingCategory.name.trim()) nextErrors.name = "Category name is required"
      if (!editingCategory.description.trim()) nextErrors.description = "Category description is required"
      setEditErrors(nextErrors)
      if (Object.keys(nextErrors).length > 0) {
        toast.error("Please fix the highlighted fields")
        return
      }
      const response = await apiClientAdmin.patch(
        `/categories/update/${editingCategory._id}`,
        editingCategory
      )

      
    console.log(response)
      // toast.success(`${response.data.message}`)
      setIsEditModalOpen(false)
    } catch (error) {
      toast.error(`Failed to update category, ${error}`)
    } finally {
      setLoading(false)
      fetchCategories()
    }
  }

  // Delete category
  const handleDeleteCategory = async (id: string | undefined) => {
    try {
      setLoading(true)
      await apiClientAdmin.delete(`/categories/delete/${id}`)
      fetchCategories()
      toast.success("Category deleted successfully")
    } catch (error) {
      toast.error(`Failed to delete category, ${error}`)
    } finally {
      setLoading(false)
    }
  }

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category Management</h1>

        {/* Create Category Dialog */}
        <Dialog open={isCreateModalOpen} onOpenChange={(o)=>{ setIsCreateModalOpen(o); if(!o){ setNewCategory({ name: "", description: "", imageUrl: "", status: "active" }); setSelectedFile(null); setImagePreview(null); setCreateErrors({}); } }}>
          <DialogTrigger asChild>
            <Button className="bg-[#1F058F] hover:bg-[#1F058F]/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category Name *</label>
                <Input
                  placeholder="Category Name"
                  value={newCategory.name}
                  onChange={(e) => {
                    setNewCategory({ ...newCategory, name: e.target.value })
                    if (e.target.value.trim()) setCreateErrors(prev => ({ ...prev, name: undefined }))
                  }}
                  required
                />
              </div>
              {createErrors.name && (
                <p className="text-sm text-red-600">{createErrors.name}</p>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  placeholder="Description"
                  value={newCategory.description}
                  onChange={(e) => {
                    setNewCategory({ ...newCategory, description: e.target.value })
                    if (e.target.value.trim()) setCreateErrors(prev => ({ ...prev, description: undefined }))
                  }}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
                  rows={3}
                  required
                />
              </div>
              {createErrors.description && (
                <p className="text-sm text-red-600">{createErrors.description}</p>
              )}

              {/* File upload with preview */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Image *</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#1F058F] file:text-white hover:file:bg-[#1F058F]/90"
                />

                {/* Show selected file name */}
                {selectedFile && (
                  <p className="text-sm text-gray-600">
                    Selected: {selectedFile.name}
                  </p>
                )}

                {/* Image preview */}
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                  </div>
                )}

                {/* Or allow manual URL input */}
                <div className="text-sm text-gray-500">Or paste image URL:</div>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={newCategory.imageUrl}
                  onChange={(e) => {
                    setNewCategory({ ...newCategory, imageUrl: e.target.value })
                    // Clear file selection if URL is entered
                    if (e.target.value) {
                      setSelectedFile(null)
                      setImagePreview(null)
                    }
                    setCreateErrors(prev => ({ ...prev, image: undefined }))
                  }}
                />
                {createErrors.image && (
                  <p className="text-sm text-red-600">{createErrors.image}</p>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {newCategory.status === "active" ? "Active" : "Inactive"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[--radix-dropdown-menu-trigger-width]">
                  <DropdownMenuItem onClick={() => setNewCategory({ ...newCategory, status: "active" })}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setNewCategory({ ...newCategory, status: "inactive" })}>
                    Inactive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false)
                  // Reset form when closing
                  setNewCategory({ name: "", description: "", imageUrl: "", status: "active" })
                  setSelectedFile(null)
                  setImagePreview(null)
                  setCreateErrors({})
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#1F058F] hover:bg-[#1F058F]/90"
                onClick={handleCreateCategory}
                disabled={loading || uploadingImage}
              >
                {uploadingImage ? "Uploading Image..." : loading ? "Creating..." : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading categories...</p>
        </div>
      ) : categories?.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500">No categories found</p>
          <Button
            className="mt-4 bg-[#1F058F] hover:bg-[#1F058F]/90"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add First Category
          </Button>
        </div>
      ) : (
        <Table className="border rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.length > 0 && categories?.map(category => (
              <TableRow key={category?._id}>
                <TableCell
                  className="font-medium cursor-pointer text-[#1F058F]"
                  onClick={() => router.push(`/admin/categories/${category._id}`)}
                >
                  {category?.name}
                </TableCell>
                <TableCell>{category?.description}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${category?.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                    }`}>
                    {category?.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(category?.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="flex space-x-2">
                  <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1200px] max-h-[85vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                      </DialogHeader>
                      {editingCategory && (
                        <div className="space-y-6 py-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">Category Name *</label>
                                <Input
                                  placeholder="Category Name"
                                  value={editingCategory.name}
                                  onChange={(e) => {
                                    setEditingCategory({
                                      ...editingCategory,
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
                                <label className="block text-sm font-medium mb-2">Status</label>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                      {editingCategory.status === "active" ? "Active" : "Inactive"}
                                      <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[--radix-dropdown-menu-trigger-width]">
                                    <DropdownMenuItem onClick={() => setEditingCategory({
                                      ...editingCategory,
                                      status: "active"
                                    })}>
                                      Active
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setEditingCategory({
                                      ...editingCategory,
                                      status: "inactive"
                                    })}>
                                      Inactive
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-2">Description *</label>
                                <textarea
                                  placeholder="Description"
                                  value={editingCategory.description}
                                  onChange={(e) => {
                                    setEditingCategory({
                                      ...editingCategory,
                                      description: e.target.value
                                    })
                                    if (e.target.value.trim()) setEditErrors(prev => ({ ...prev, description: undefined }))
                                  }}
                                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
                                  rows={3}
                                  required
                                />
                                {editErrors.description && (
                                  <p className="text-sm text-red-600 mt-1">{editErrors.description}</p>
                                )}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">Image URL</label>
                                <Input
                                  placeholder="Image URL"
                                  value={editingCategory.imageUrl}
                                  onChange={(e) => setEditingCategory({
                                    ...editingCategory,
                                    imageUrl: e.target.value
                                  })}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => { setIsEditModalOpen(false); setEditErrors({}); }}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-[#1F058F] hover:bg-[#1F058F]/90"
                          onClick={() => {
                            // Add delete functionality here
                            // console.log("Delete category:", editingCategory?.id);
                            handleDeleteCategory(editingCategory?._id)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                        <Button
                          className="bg-[#1F058F] hover:bg-[#1F058F]/90"
                          onClick={handleUpdateCategory}
                        >
                          Update
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    className="bg-[#1F058F]"
                    size="icon"
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
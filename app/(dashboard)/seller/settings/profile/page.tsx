/* eslint-disable */

"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Loader2, Eye, EyeOff, X, Check } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { apiClientUser } from "@/lib/interceptor"
import { useGetAuthUser } from "@/lib/useGetAuthUser"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"

interface UserProfile {
  fullName: string
  email: string
  phoneNumber: string
  country: string
  city: string
  address: string
  profilePicture: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export default function ProfileSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentImage, setCurrentImage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  const [formData, setFormData] = useState<UserProfile>({
    fullName: "",
    email: "",
    phoneNumber: "",
    country: "",
    city: "",
    address: "",
    profilePicture: ""
  })

  // Password state
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  // Confirmation modals state
  const [showProfileConfirm, setShowProfileConfirm] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  const { data } = useGetAuthUser("User");
  const user = data?.data?.loggedInAccount

  // Validate file before upload
  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Please select a valid image file (JPEG, PNG, or WebP)"
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB"
    }
    return null
  }

  // Upload image with progress tracking
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileType', 'Profile-images')

    try {
      const response = await apiClientUser.post("/users/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(progress)
          }
        }
      })
         
      return response.data.fileUrl
    } catch (error: any) {
      console.error('Image upload error:', error)
      throw new Error(error.response?.data?.message || "Failed to upload image")
    }
  }

  // Handle image change with validation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    
    if (file) {
      const validationError = validateFile(file)
      if (validationError) {
        toast.error(validationError)
        // Clear the input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }

      setSelectedFile(file)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      toast.success("Image selected successfully")
    } else {
      clearImageSelection()
    }
  }

  // Clear image selection
  const clearImageSelection = () => {
    setSelectedFile(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          setFormData({
            fullName: user?.fullName || "",
            email: user?.email || "",
            phoneNumber: user?.phoneNumber || "",
            country: user?.country || "",
            city: user?.city || "",
            address: user?.address || "",
            profilePicture: user?.profilePicture || "",
          })
          setCurrentImage(user?.profilePicture || "")
        }
      } catch (error) {
        toast.error(`Failed to fetch user data, ${error}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Handle profile form submission confirmation
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowProfileConfirm(true)
  }

  // Handle confirmed profile submission
  const handleConfirmedProfileSubmit = async () => {
    setShowProfileConfirm(false)
    setIsSubmitting(true)

    try {
      let profilePictureUrl = currentImage

      // Upload new image if selected
      if (selectedFile) {
        setIsImageUploading(true)
        setUploadProgress(0)
        
        try {
          profilePictureUrl = await uploadImage(selectedFile)
          toast.success("Image uploaded successfully")
        } catch (uploadError: any) {
          toast.error(uploadError.message)
          return
        } finally {
          setIsImageUploading(false)
          setUploadProgress(0)
        }
      }

      // Validate required fields
      if (!formData.fullName.trim()) {
        toast.error("Full name is required")
        return
      }

      // Update profile with new data
      await apiClientUser.put("/users", {
        ...formData,
        profilePicture: profilePictureUrl,
        accountType: "Seller"
      })

      // Update local state
      setCurrentImage(profilePictureUrl)
      clearImageSelection()
      toast.success("Profile updated successfully")
      
    } catch (error: any) {
      console.error('Update profile error:', error)
      toast.error(error.response?.data?.message || "Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle password submission confirmation
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }
    
    setShowPasswordConfirm(true)
  }

  // Handle confirmed password submission
  const handleConfirmedPasswordSubmit = async () => {
    setShowPasswordConfirm(false)
    setIsSubmitting(true)

    try {
      await apiClientUser.patch("/users/password", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      })
      toast.success("Password changed successfully")
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error: any) {
      console.error('Password change error:', error)
      toast.error("Failed to update password. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  if (isLoading || !user) {
    return (
      <div className="p-4 md:p-6 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Tabs */}
      <div className="border rounded-lg mb-8 border-[#1F058F]">
        <div className="flex">
          <Link href="/seller/settings/profile" className="px-6 py-4 text-white bg-[#1F058F] rounded-l-lg font-medium">
            Profile
          </Link>
          <Link href="/seller/settings/billings" className="px-6 py-4 text-gray-700 hover:bg-gray-50">
            Billings
          </Link>
          <Link href="/seller/settings/pricing" className="px-6 py-4 text-gray-700 hover:bg-gray-50">
            Pricing
          </Link>
        </div>
      </div>

      {/* Profile Details Section */}
      <form onSubmit={handleProfileSubmit} className="space-y-8">
        <div className="mb-10">
          <h2 className="text-lg font-medium mb-1">Profile details</h2>
          <p className="text-gray-600 mb-6">Update and manage your profile</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enhanced Avatar and Upload Section */}
            <div className="md:col-span-2 flex flex-col items-center mb-4">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white text-3xl font-semibold overflow-hidden border-4 border-gray-200">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : currentImage ? (
                    <img
                      src={currentImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (formData.fullName || 'U').charAt(0).toUpperCase()
                  )}
                </div>
                
                {/* Upload Progress Indicator */}
                {isImageUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <div className="text-white text-xs font-medium">
                      {uploadProgress}%
                    </div>
                  </div>
                )}

                {/* Success indicator for uploaded image */}
                {selectedFile && !isImageUploading && (
                  <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>

              {/* File input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept={ALLOWED_FILE_TYPES.join(',')}
                className="hidden"
              />

              {/* File selection info and controls */}
              <div className="flex flex-col items-center space-y-2">
                {selectedFile && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Selected: {selectedFile.name}</span>
                    <button
                      type="button"
                      onClick={clearImageSelection}
                      className="text-red-500 hover:text-red-700"
                      disabled={isImageUploading}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Upload progress bar */}
                {isImageUploading && (
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    type="button"
                    onClick={triggerFileInput}
                    disabled={isImageUploading || isSubmitting}
                  >
                    {isImageUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {selectedFile ? "Change image" : "Upload image"}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  JPEG, PNG, or WebP. Max 5MB.
                </p>
              </div>
            </div>

            {/* Form Fields - Same as before */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full name <span className="text-red-500">*</span>
              </label>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <Input
                name="email"
                value={formData.email}
                disabled
                className="w-full bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone number</label>
              <Input
                name="phoneNumber"
                value={formData.phoneNumber}
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, "");
                  const limited = cleaned.slice(0, 15);
                  const syntheticEvent = {
                    target: Object.assign(
                      e.target,
                      { name: "phoneNumber", value: limited }
                    )
                  };
                  handleChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
                }}
                className="w-full"
                type="tel"
                placeholder="+2348012345678"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <Select
                value={formData.country} 
                onValueChange={(value) => handleSelectChange("country", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nigeria">Nigeria</SelectItem>
                  <SelectItem value="Ghana">Ghana</SelectItem>
                  <SelectItem value="Kenya">Kenya</SelectItem>
                  <SelectItem value="South Africa">South Africa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <Select
                value={formData.city}
                onValueChange={(value) => handleSelectChange("city", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lagos">Lagos</SelectItem>
                  <SelectItem value="Abuja">Abuja</SelectItem>
                  <SelectItem value="Kano">Kano</SelectItem>
                  <SelectItem value="Kwara">Kwara</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Profile Action Buttons */}
        <div className="flex gap-4 mb-12">
          <Button
            type="submit"
            className="bg-[#1F058F] hover:bg-[#2a0bc0] min-w-[140px]"
            disabled={isSubmitting || isImageUploading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting || isImageUploading}
            onClick={() => {
              if (user) {
                setFormData({
                  fullName: user?.fullName || "",
                  email: user?.email || "",
                  phoneNumber: user?.phoneNumber || "",
                  country: user?.country || "",
                  city: user?.city || "",
                  address: user?.address || "",
                  profilePicture: user?.profilePicture || ""
                })
                clearImageSelection()
              }
            }}
          >
            Cancel
          </Button>
        </div>
      </form>

      {/* Password Change Section - Enhanced validation */}
      <form onSubmit={handlePasswordSubmit}>
        <div className="mb-10">
          <h2 className="text-lg font-medium mb-1">Change Password</h2>
          <p className="text-gray-600 mb-6">Update your account password (minimum 8 characters)</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Old password</label>
              <div className="relative">
                <Input
                  name="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className="w-full pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
              <div className="relative">
                <Input
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full pr-10"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm new password</label>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`w-full pr-10 ${
                    passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword
                      ? 'border-red-500'
                      : ''
                  }`}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
              )}
            </div>
          </div>
        </div>

        {/* Password Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            className="bg-[#1F058F] hover:bg-[#2a0bc0]"
            disabled={
              !passwordData.oldPassword || 
              !passwordData.newPassword || 
              passwordData.newPassword !== passwordData.confirmPassword ||
              passwordData.newPassword.length < 8
            }
          >
            Change Password
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setPasswordData({
              oldPassword: "",
              newPassword: "",
              confirmPassword: ""
            })}
          >
            Clear
          </Button>
        </div>
      </form>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showProfileConfirm}
        onClose={() => setShowProfileConfirm(false)}
        onConfirm={handleConfirmedProfileSubmit}
        title="Update Profile"
        description="Are you sure you want to update your profile information?"
        confirmText={isSubmitting ? "Updating..." : "Update Profile"}
        isPending={isSubmitting}
      />

      <ConfirmationModal
        isOpen={showPasswordConfirm}
        onClose={() => setShowPasswordConfirm(false)}
        onConfirm={handleConfirmedPasswordSubmit}
        title="Change Password"
        description="Are you sure you want to change your password?"
        confirmText={isSubmitting ? "Updating..." : "Change Password"}
        isPending={isSubmitting}
      />
    </div>
  )
}
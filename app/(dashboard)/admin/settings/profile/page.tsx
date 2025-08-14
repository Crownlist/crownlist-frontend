/* eslint-disable */

"use client"


import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Eye, EyeOff, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useGetAuthUser } from "@/lib/useGetAuthUser"

export default function AdminProfileSettingsPage() {
  // Profile form state

  const {  data } = useGetAuthUser("Admin");

 
  
  const [profileData, setProfileData] = useState({
    firstname: "Jimoh Adesina",
    email: "Sample@gmail.com",
    phoneNumber: "+234 081 000 000 0000",
    country: "",
    state: "",
    address: "",
    lastname:''
  })

  // Password form state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Loading states
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [isImageUploading, setIsImageUploading] = useState(false)



  useEffect(() => {
    if(data){
      const user : any = data?.data?.data?.loggedInAccount
      setProfileData(user)
    }
  }, [data])
  
  // Image upload ref
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  // Handle profile form submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProfileLoading(true)
    
    try {
      // TODO: Implement profile update API call
      // await apiClientUser.put("/admin/profile", profileData)
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error(`Failed to update profile, ${error}`)
    } finally {
      setIsProfileLoading(false)
    }
  }

  // Handle password form submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    setIsPasswordLoading(true)
    
    try {
      // TODO: Implement password change API call
      // await apiClientUser.put("/admin/change-password", {
      //   oldPassword: passwordData.oldPassword,
      //   newPassword: passwordData.newPassword
      // })
      toast.success("Password changed successfully")
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error) {
      toast.error(`Failed to change password, ${error}`)
    } finally {
      setIsPasswordLoading(false)
    }
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImageUploading(true)
    
    try {
      // TODO: Implement image upload to CDN
      // const imageUrl = await uploadToCdn(file)
      // await apiClientUser.patch("/admin/profile-image", { imageUrl })
      toast.success("Profile image updated successfully")
    } catch (error) {
      toast.error(`Failed to upload image, ${error}`)
    } finally {
      setIsImageUploading(false)
    }
  }

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Tabs */}
      <div className="bg-[#f0eeff] rounded-full p-1 inline-flex mb-8">
        <Link
          href="/admin/settings/profile"
          className="px-6 py-2 rounded-full bg-white text-[#1a0066] font-medium shadow-sm"
        >
          Profile
        </Link>
        <Link
          href="/admin/settings/notification"
          className="px-6 py-2 rounded-full text-gray-700 font-medium hover:bg-gray-50"
        >
          Notification
        </Link>
        <Link href="/admin/settings/team" className="px-6 py-2 rounded-full text-gray-700 font-medium hover:bg-gray-50">
          Team
        </Link>
      </div>

      {/* Profile Details Section */}
      <form onSubmit={handleProfileSubmit}>
        <div className="mb-10 border-b pb-10">
          <h2 className="text-lg font-medium mb-1">Profile details</h2>
          <p className="text-gray-600 mb-6">Update and manage your profile</p>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar and Upload Button */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center text-white text-4xl font-semibold mb-4">
                {profileData?.firstname?.charAt(0)}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                type="button"
                onClick={triggerFileInput}
                disabled={isImageUploading}
              >
                {isImageUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {isImageUploading ? "Uploading..." : "Upload image"}
              </Button>
            </div>

            {/* Form Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
                <Input 
                  name="fullName"
                  value={`${profileData.firstname} ${profileData.lastname}`}
                  onChange={handleProfileChange}
                  className="w-full" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input 
                  name="email"
                  value={profileData.email}
                  disabled
                  className="w-full" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone number</label>
                <Input 
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleProfileChange}
                  className="w-full" 
                  type="tel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <Select
                  value={profileData.country}
                  onValueChange={(value) => setProfileData(prev => ({ ...prev, country: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nigeria">Nigeria</SelectItem>
                    <SelectItem value="ghana">Ghana</SelectItem>
                    <SelectItem value="kenya">Kenya</SelectItem>
                    <SelectItem value="southafrica">South Africa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <Select
                  value={profileData.state}
                  onValueChange={(value) => setProfileData(prev => ({ ...prev, state: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lagos">Lagos</SelectItem>
                    <SelectItem value="abuja">Abuja</SelectItem>
                    <SelectItem value="kano">Kano</SelectItem>
                    <SelectItem value="kwara">Kwara</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <Input 
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  className="w-full" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Action Buttons */}
        <div className="flex gap-4 mb-12">
          <Button 
            type="submit" 
            className="bg-[#1a0066] hover:bg-[#2a0bc0]"
            disabled={isProfileLoading}
          >
            {isProfileLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : "Update Profile"}
          </Button>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </div>
      </form>

      {/* Security Section */}
      <form onSubmit={handlePasswordSubmit}>
        <div className="mb-10 border-b pb-10">
          <h2 className="text-lg font-medium mb-1">Security</h2>
          <p className="text-gray-600 mb-6">Update and manage your password</p>

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
                  className="w-full pr-10" 
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
            </div>
          </div>
        </div>

        {/* Password Action Buttons */}
        <div className="flex gap-4">
          <Button 
            type="submit" 
            className="bg-[#1a0066] hover:bg-[#2a0bc0]"
            disabled={isPasswordLoading || 
              !passwordData.oldPassword || 
              !passwordData.newPassword || 
              passwordData.newPassword !== passwordData.confirmPassword}
          >
            {isPasswordLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : "Change Password"}
          </Button>
          <Button 
            variant="outline" 
            type="button"
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
    </div>
  )
}


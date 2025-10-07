/* eslint-disable */

"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/custom-input";
import { Select, SelectContent, SelectValue, SelectItem, SelectTrigger } from "../ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { uniqueCountries } from "@/constants/countries";
import { countries } from "@/constants/countries";
import { nigerianStates } from "../../constants/states";
import { Eye, EyeOff, Loader2, X, Check } from "lucide-react";
import ReactSelect from "react-select";
import { useGetAuthUser } from "@/lib/useGetAuthUser";
import { apiClientUser } from "@/lib/interceptor";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  countryCode: string;
}

interface PasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [userData, setUserData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    country: '',
    city: '',
    address: '',
    profilePicture: ''
  })

  const { data } = useGetAuthUser("User");

  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false)
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false)
  const [isImageUploading, setIsImageUploading] = useState(false)

  // Image states
  const [currentImage, setCurrentImage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    if (data) {
      const user: any = data?.data?.loggedInAccount
      setUserData(user)
      setCurrentImage(user?.profilePicture || "")
      setIsLoading(false)
    }
  }, [data])

  const [profileFormData, setProfileFormData] = useState<ProfileFormData>({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    countryCode: "+234",
  });

  const [passwordFormData, setPasswordFormData] = useState<PasswordFormData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Update form data when userData changes
  useEffect(() => {
    if (userData) {
      console.log('cityy', userData)
      setProfileFormData({
        fullName: userData?.fullName || "",
        email: userData?.email || "",
        phone: userData?.phoneNumber || "",
        country: userData?.country || "",
        city: userData?.city || "",
        address: userData?.address || "",
        countryCode: "+234",
      });
    }
  }, [userData]);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleProfileChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProfileFormData({ ...profileFormData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordFormData({ ...passwordFormData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

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
  };

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

  // Profile form submission
  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  // Confirmation modal state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState<(() => Promise<void>) | null>(null);

  // Handle profile update after confirmation
  const executeProfileUpdate = async () => {
    setIsProfileSubmitting(true);
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
      if (!profileFormData.fullName.trim()) {
        toast.error("Full name is required")
        return
      }

      // Update profile with new data
      await apiClientUser.put("/users", {
        fullName: profileFormData.fullName,
        phoneNumber: profileFormData.phone,
        country: profileFormData.country,
        city: profileFormData.city, // assuming city maps to state
        address: profileFormData.address,
        profilePicture: profilePictureUrl,
        accountType: "User" // or whatever account type is appropriate
      })

      // Update local state
      setCurrentImage(profilePictureUrl)
      clearImageSelection()
      toast.success("Profile updated successfully")

    } catch (error: any) {
      console.error('Update profile error:', error)
      toast.error(error.response?.data?.message || "Failed to update profile")
    } finally {
      setIsProfileSubmitting(false)
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await executeProfileUpdate();
    setIsSubmitting(false);
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  // Password form submission
  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPasswordSubmitting(true);

    if (!passwordFormData.oldPassword || !passwordFormData.newPassword || !passwordFormData.confirmPassword) {
      toast.error("Please fill in all password fields");
      setIsPasswordSubmitting(false);
      return;
    }

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      setIsPasswordSubmitting(false);
      return;
    }

    if (passwordFormData.newPassword.length < 8) {
      toast.error( "New password must be at least 8 characters long");
      setIsPasswordSubmitting(false);
      return;
    }

    try {
      await apiClientUser.patch("/users/password", {
        oldPassword: passwordFormData.oldPassword,
        newPassword: passwordFormData.newPassword
      })

      toast.success("Password changed successfully")

      setPasswordFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error: any) {
      console.error('Password change error:', error)
      toast.error(error.response?.data?.message || "Failed to change password")
    } finally {
      setIsPasswordSubmitting(false)
    }
  };

  const handleProfileCancel = () => {
    if (userData) {
      setProfileFormData({
        fullName: userData?.fullName || "",
        email: userData?.email || "",
        phone: userData?.phoneNumber || "",
        country: userData?.country || "Nigeria",
        city: userData?.city || "",
        address: userData?.address || "",
        countryCode: "+234",
      });
      clearImageSelection()
      toast("Profile changes discarded");
    }
  };

  const handlePasswordCancel = () => {
    setPasswordFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    toast("Password changes discarded");
  };

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  if (isLoading || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Confirmation Modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to update your profile? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        {/* Profile Details Form */}
        <form onSubmit={handleProfileSubmit}>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Profile Details</h2>
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-20 h-20 mb-4">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="rounded-full object-cover"
                  />
                ) : currentImage ? (
                  <Image
                    src={currentImage}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-[#E63946] text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl">
                    {profileFormData.fullName.charAt(0) || "U"}
                  </div>
                )}

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

                <label className="flex items-center border p-2 gap-2 rounded-2xl cursor-pointer hover:bg-gray-50">
                  {isImageUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Image src="/cloud.png" alt="cloud" width={20} height={20} />
                  )}
                  <span>{selectedFile ? "Change Image" : "Upload Image"}</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ALLOWED_FILE_TYPES.join(',')}
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isImageUploading || isProfileSubmitting}
                  />
                </label>

                <p className="text-xs text-gray-500 text-center">
                  JPEG, PNG, or WebP. Max 5MB.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={profileFormData.fullName}
                  onChange={handleProfileChange}
                  placeholder="Jimoh Adesina"
                  disabled={isProfileSubmitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileFormData.email}
                  disabled
                  placeholder="sample@gmail.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="border border-gray-300 flex flex-row rounded-lg gap-0">
                  <div className="w-[120px] sm:w-[120px]">
                    <Select
                      value={profileFormData.countryCode}
                      onValueChange={(value) => setProfileFormData((prev) => ({ ...prev, countryCode: value }))}
                      disabled={isProfileSubmitting}
                    >
                      <SelectTrigger className="w-full cursor-pointer rounded-l-lg rounded-r-none">
                        <SelectValue placeholder="Select code" />
                      </SelectTrigger>
                      <SelectContent className="max-w-[200px] max-h-[250px]">
                        {uniqueCountries.map((country) => (
                          <SelectItem
                            key={`${country.name}-${country.code}`}
                            value={country.code}
                          >
                            {country.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={profileFormData.phone}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, "");
                      const limited = cleaned.slice(0, 15);
                      const syntheticEvent = {
                        target: Object.assign(
                          e.target,
                          { name: "phone", value: limited }
                        )
                      };
                      handleProfileChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
                    }}
                    placeholder="081 000 0000"
                    className="rounded-r-lg rounded-l-none"
                    disabled={isProfileSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <ReactSelect
                  id="country"
                  value={countries.find(c => c.name === profileFormData.country) ? { value: profileFormData.country, label: profileFormData.country } : null}
                  onChange={(option) => {
                    setProfileFormData((prev) => ({
                      ...prev,
                      country: option?.value || "",
                      city: "",
                    }));
                  }}
                  options={countries.map(country => ({ value: country.name, label: country.name }))}
                  isDisabled={isProfileSubmitting}
                  placeholder="Select country"
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: '40px',
                      borderColor: '#d1d5db',
                      '&:hover': {
                        borderColor: '#9ca3af'
                      }
                    }),
                    menu: (base) => ({
                      ...base,
                      maxHeight: '250px'
                    })
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">State</Label>
                <ReactSelect
                  id="city"
                  value={nigerianStates.find(s => s.value === profileFormData.city) ? { value: profileFormData.city, label: nigerianStates.find(s => s.value === profileFormData.city)!.label } : null}
                  onChange={(option) => {
                    setProfileFormData((prev) => ({ ...prev, city: option?.value || "" }));
                  }}
                  options={nigerianStates.filter(state => state.value !== "Select a state").map(state => ({ value: state.value, label: state.label }))}
                  isDisabled={isProfileSubmitting}
                  placeholder="Select a state"
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: '40px',
                      borderColor: '#d1d5db',
                      '&:hover': {
                        borderColor: '#9ca3af'
                      }
                    }),
                    menu: (base) => ({
                      ...base,
                      maxHeight: '250px'
                    })
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  value={profileFormData.address}
                  onChange={handleProfileChange}
                  placeholder="Enter your address"
                  disabled={isProfileSubmitting}
                />
              </div>
            </div>

            {/* Profile Form Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <Button
                type="submit"
                className="bg-[#1F058F] text-white py-2 px-10 rounded-full min-w-[120px]"
                disabled={isProfileSubmitting || isImageUploading}
              >
                {isProfileSubmitting ? (
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
                className="py-2 px-10 rounded-full"
                onClick={handleProfileCancel}
                disabled={isProfileSubmitting || isImageUploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>

        {/* Security/Password Form */}
        <form onSubmit={handlePasswordSubmit}>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Security</h2>
            <p className="text-gray-600 mb-4">Update your account password (minimum 8 characters)</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Old Password</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    name="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    value={passwordFormData.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter old password"
                    disabled={isPasswordSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordFormData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    disabled={isPasswordSubmitting}
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordFormData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    disabled={isPasswordSubmitting}
                    className={
                      passwordFormData.confirmPassword && passwordFormData.newPassword !== passwordFormData.confirmPassword
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {passwordFormData.confirmPassword && passwordFormData.newPassword !== passwordFormData.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>
            </div>

            {/* Password Form Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <Button
                type="submit"
                className="bg-[#1F058F] text-white py-2 px-10 rounded-full min-w-[140px]"
                disabled={
                  isPasswordSubmitting ||
                  !passwordFormData.oldPassword ||
                  !passwordFormData.newPassword ||
                  passwordFormData.newPassword !== passwordFormData.confirmPassword ||
                  passwordFormData.newPassword.length < 8
                }
              >
                {isPasswordSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="py-2 px-10 rounded-full"
                onClick={handlePasswordCancel}
                disabled={isPasswordSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

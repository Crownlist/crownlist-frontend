"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X } from "lucide-react"
import Header from "@/components/Header1"
import Footer from "@/components/Footer"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { apiClientPublic } from "@/lib/interceptor"
import { useToast } from "@/lib/useToastMessage"
import { SuccessModal } from "@/components/SuccessModal"
import { useGetAuthUser } from "@/lib/useGetAuthUser"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

export default function ShareAnIdea() {
  const [selectedTab, setSelectedTab] = useState("share-idea")
  const [selectedIdea, setSelectedIdea] = useState("")
  const [ideaDescription, setIdeaDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const { handleMessage } = useToast()
  const userData = useSelector((state: RootState) => state.userData?.userData)
  const {} = useGetAuthUser("User")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      setAttachments(prev => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!ideaDescription.trim()) {
      handleMessage('error', 'Please describe your idea.')
      return
    }

    if (!selectedIdea) {
      handleMessage('error', 'Please select an idea category.')
      return
    }

    setIsSubmitting(true)

    try {
      if (!userData) {
        handleMessage('error', 'User data not available. Please log in.')
        return
      }

      const nameParts = userData.fullName?.split(' ') || []
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      // Prepare payload for idea submission
      const payload = {
        firstName,
        lastName,
        email: userData.email,
        message: ideaDescription,
        category: selectedIdea,
        attachments: []
      }

      // Send idea via API
      await apiClientPublic.post('/feedback/idea', payload)
      setShowSuccessModal(true)
      setSelectedIdea("")
      setIdeaDescription("")
      setAttachments([])
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to share idea. Please try again.'
      handleMessage('error', errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
  <>
   <Header hidden={false} />

    <div className="min-h-screen bg-gray-50 ">

      <div className="max-w-2xl mx-auto px-4  items-center mb-8 pt-8">

         <div
              className={`px-6 py-2 text-center w-40 mx-auto items-center rounded-full text-sm font-medium bg-purple-100 text-purple-700 c shadow-sm mb-8 `}
            >
              Share feedback
            </div>



        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-purple-100 text-purple-700 rounded-full py-1 px-4 shadow-sm border">

            <Link
              href="/share-feedback"
              onClick={() => setSelectedTab("share-idea")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTab === "share-idea" ? "bg-white text-purple-700" : "text-gray-800 hover:text-gray-900"
              }`}
            >
              Share an idea
            </Link>
            <Link
              href="/report-bug"
              onClick={() => setSelectedTab("report-bug")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTab === "report-bug" ? "bg-white text-purple-700" : "text-gray-800 hover:text-gray-900"
              }`}
            >
              Report a bug
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Share an idea</h1>
          <p className="text-gray-600 text-lg">
            I have a suggestion or feature request. Can&#39;t find the answer you&#39;re looking for?{" "}
            <a href="#" className="text-purple-600 underline hover:text-purple-700">
              Please chat to our friendly team
            </a>
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Select your idea */}
            <div>
              <Label className="text-base font-medium text-gray-900 mb-4 block">Select your idea</Label>
              <RadioGroup value={selectedIdea} onValueChange={setSelectedIdea} className="grid grid-cols-2 md:grid-cols-3  gap-4">
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value="notification" id="notification" />
                  <Label htmlFor="notification" className="cursor-pointer">
                    Notification
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value="inbox" id="inbox" />
                  <Label htmlFor="inbox" className="cursor-pointer">
                    Inbox
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value="find-service" id="find-service" />
                  <Label htmlFor="find-service" className="cursor-pointer">
                    Find a service
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value="fake-account" id="fake-account" />
                  <Label htmlFor="fake-account" className="cursor-pointer">
                    Fake account
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value="payment" id="payment" />
                  <Label htmlFor="payment" className="cursor-pointer">
                    Payment
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value="order" id="order" />
                  <Label htmlFor="order" className="cursor-pointer">
                    Order
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Attach a file */}
            <div>
              <Label className="text-base font-medium text-gray-900 mb-4 block">Attach a file</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={handleFileClick}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              >
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-4" />
                <div className="text-gray-600">
                  <span className="font-medium text-gray-900 underline">Click to upload</span> or drag and drop
                </div>
                <div className="text-sm text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800×400px)</div>
              </div>
              {attachments.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Selected files:</Label>
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Upload className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                          <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tell us about your idea */}
            <div>
              <Label htmlFor="idea-description" className="text-base font-medium text-gray-900 mb-4 block">
                Tell us about your idea
              </Label>
              <Textarea
                id="idea-description"
                placeholder=""
                value={ideaDescription}
                onChange={(e) => setIdeaDescription(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 text-base font-medium flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Sharing...
                </>
              ) : (
                "Share idea"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>

    <SuccessModal
      open={showSuccessModal}
      onOpenChange={setShowSuccessModal}
      title="Idea Shared!"
      description="Your idea has been submitted successfully. Thank you for your feedback!"
    />

      <Footer/>

    </>
  )
}

// "use client"

// import { useState, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Textarea } from "@/components/ui/textarea"
// import { Upload, X } from "lucide-react"
// import Header from "@/components/Header1"
// import Footer from "@/components/Footer"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { Loader2 } from "lucide-react"
// import { apiClientPublic } from "@/lib/interceptor"
// import { useToast } from "@/lib/useToastMessage"
// import { SuccessModal } from "@/components/SuccessModal"
// import { useGetAuthUser } from "@/lib/useGetAuthUser"
// import { useSelector } from "react-redux"
// import { RootState } from "@/store"

// export default function ReportBug() {
//   const [selectedIdea, setSelectedIdea] = useState("")
//   const [bugDescription, setBugDescription] = useState("")
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [showSuccessModal, setShowSuccessModal] = useState(false)
//   const [attachments, setAttachments] = useState<File[]>([])
//   const pathname = usePathname()
//   const { handleMessage } = useToast()
//   const userData = useSelector((state: RootState) => state.userData?.userData)
//   const fileInputRef = useRef<HTMLInputElement>(null)
//   useGetAuthUser("User")

//   const handleFileClick = () => {
//     fileInputRef.current?.click()
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files
//     if (files) {
//       const newFiles = Array.from(files)
//       setAttachments(prev => [...prev, ...newFiles])
//     }
//   }

//   const removeFile = (index: number) => {
//     setAttachments(prev => prev.filter((_, i) => i !== index))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     // Basic validation
//     if (!selectedIdea) {
//       handleMessage('error', 'Please select an issue type.')
//       return
//     }

//     if (!bugDescription.trim()) {
//       handleMessage('error', 'Please describe the bug.')
//       return
//     }

//     if (bugDescription.trim().length < 20) {
//       handleMessage('error', 'Message must be at least 20 characters.')
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       if (!userData) {
//         handleMessage('error', 'User data not available. Please log in.')
//         return
//       }

//       const nameParts = userData.fullName?.split(' ') || []
//       const firstName = nameParts[0] || ''
//       const lastName = nameParts.slice(1).join(' ') || ''

//       // Prepare payload for bug report
//       const payload = {
//         firstName,
//         lastName,
//         email: userData.email,
//         message: bugDescription,
//         category: selectedIdea
//       }

//       // Send bug report via API
//       const response: { status: string; message?: string } = await apiClientPublic.post('/feedback/bug-report', payload)

//       // Check if backend returned an error status
//       if (response?.status === 'error') {
//         handleMessage('error', response.message || 'An error occurred while submitting your bug report.')
//         return
//       }

//       handleMessage('success', 'Your bug report has been submitted successfully!')
//       setShowSuccessModal(true)
//       setSelectedIdea("")
//       setBugDescription("")
//       setAttachments([])

//     } catch (error: unknown) {
//       let errorMessage = 'Failed to report bug. Please try again.'
//       const errorType: 'error' | 'warning' = 'error'

//       if (error && typeof error === 'object') {
//         const err = error as {
//           response?: { status?: number; data?: { message?: string; code?: string; status?: string } }
//           message?: string
//         }

//         if (err.response) {
//           const status = err.response.status
//           const data = err.response.data

//           if (status && (status === 400 || status === 422)) {
//             // Validation error
//             errorMessage = data?.message || 'Invalid input. Please check your data.'
//           } else if (status && status >= 500) {
//             // Server error
//             errorMessage = 'Server error. Please try again later.'
//           } else if (status && status >= 400) {
//             // Other client error
//             errorMessage = data?.message || err.message || errorMessage
//           } else {
//             // Unknown error with response
//             errorMessage = data?.message || err.message || errorMessage
//           }
//         } else {
//           // Network error or other error without response
//           if (err.message?.includes('Network') || err.message?.includes('fetch')) {
//             errorMessage = 'Network error. Please check your internet connection.'
//           } else if (err.message) {
//             errorMessage = err.message
//           }
//         }
//       } else if (typeof error === 'string') {
//         errorMessage = error
//       }

//       handleMessage(errorType, errorMessage)
//       console.error('Submission error:', error)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <>
//       <Header hidden={false} />

//       <div className="min-h-screen bg-gray-50 ">
//         <div className="max-w-2xl mx-auto px-4  items-center mb-8 pt-8">
//          <div
//             className={`px-6 py-2 text-center w-40 mx-auto items-center rounded-full text-sm font-medium bg-red-100 text-red-700 c shadow-sm mb-8 `}
//           >
//             Report a bug
//           </div>

//           {/* Navigation Tabs */}
//           <div className="flex justify-center mb-8">
//             <div className="flex bg-purple-100 text-purple-700 rounded-full py-1 px-4 shadow-sm border">
//               <Link
//                 href="/share-feedback"
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
//                   pathname === "/share-feedback"
//                     ? "bg-white text-purple-700"
//                     : "text-gray-800 hover:text-gray-900"
//                 }`}
//               >
//                 Share an idea
//               </Link>
//               <Link
//                 href="/report-bug"
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
//                   pathname === "/report-bug"
//                     ? "bg-white text-purple-700"
//                     : "text-gray-800 hover:text-gray-900"
//                 }`}
//               >
//                 Report a bug
//               </Link>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-4">Report a bug</h1>
//             <p className="text-gray-600 text-lg">
//               Where do you experience this issue? Can&#39;t find the answer you&#39;re looking for?{" "}
//               <a href="#" className="text-purple-600 underline hover:text-purple-700">
//                 Please chat to our friendly team
//               </a>
//             </p>
//           </div>

//           {/* Form */}
//           <div className="bg-white rounded-xl shadow-sm border p-8">
//             <form onSubmit={handleSubmit} className="space-y-8">
//               {/* Select the issue type */}
//               <div>
//                 <Label className="text-base font-medium text-gray-900 mb-4 block">Select the issue type</Label>
//                 <RadioGroup value={selectedIdea} onValueChange={setSelectedIdea} className="grid grid-cols-2 md:grid-cols-3  gap-4">
//                   <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
//                     <RadioGroupItem value="notification" id="notification" />
//                     <Label htmlFor="notification" className="cursor-pointer">
//                       Notification
//                     </Label>
//                   </div>
//                   <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
//                     <RadioGroupItem value="inbox" id="inbox" />
//                     <Label htmlFor="inbox" className="cursor-pointer">
//                       Inbox
//                     </Label>
//                   </div>
//                   <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
//                     <RadioGroupItem value="find-service" id="find-service" />
//                     <Label htmlFor="find-service" className="cursor-pointer">
//                       Find a service
//                     </Label>
//                   </div>
//                   <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
//                     <RadioGroupItem value="fake-account" id="fake-account" />
//                     <Label htmlFor="fake-account" className="cursor-pointer">
//                       Fake account
//                     </Label>
//                   </div>
//                   <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
//                     <RadioGroupItem value="payment" id="payment" />
//                     <Label htmlFor="payment" className="cursor-pointer">
//                       Payment
//                     </Label>
//                   </div>
//                   <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
//                     <RadioGroupItem value="order" id="order" />
//                     <Label htmlFor="order" className="cursor-pointer">
//                       Order
//                     </Label>
//                   </div>
//                 </RadioGroup>
//               </div>

//               {/* Attach a file */}
//               <div>
//                 <Label className="text-base font-medium text-gray-900 mb-4 block">Attach a file</Label>
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//                 <div
//                   onClick={handleFileClick}
//                   className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
//                 >
//                   <Upload className="mx-auto h-8 w-8 text-gray-400 mb-4" />
//                   <div className="text-gray-600">
//                     <span className="font-medium text-gray-900 underline">Click to upload</span> or drag and drop
//                   </div>
//                   <div className="text-sm text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800×400px)</div>
//                 </div>
//                 {attachments.length > 0 && (
//                   <div className="mt-4">
//                     <Label className="text-sm font-medium text-gray-700 mb-2 block">Selected files:</Label>
//                     <div className="space-y-2">
//                       {attachments.map((file, index) => (
//                         <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
//                           <div className="flex items-center space-x-3">
//                             <Upload className="h-4 w-4 text-gray-400" />
//                             <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
//                             <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => removeFile(index)}
//                             className="text-red-500 hover:text-red-700"
//                           >
//                             <X className="h-4 w-4" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Describe the bug */}
//               <div>
//                 <Label htmlFor="bug-description" className="text-base font-medium text-gray-900 mb-4 block">
//                   Describe the bug
//                 </Label>
//                 <Textarea
//                   id="bug-description"
//                   placeholder=""
//                   value={bugDescription}
//                   onChange={(e) => setBugDescription(e.target.value)}
//                   className="min-h-[120px] resize-none"
//                 />
//               </div>

//               {/* Submit Button */}
//               <Button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full bg-black hover:bg-gray-800 text-white py-3 text-base font-medium flex items-center justify-center"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="animate-spin mr-2 h-4 w-4" />
//                     Reporting...
//                   </>
//                 ) : (
//                   "Report bug"
//                 )}
//               </Button>
//             </form>
//           </div>
//         </div>
//       </div>

//       <SuccessModal
//         open={showSuccessModal}
//         onOpenChange={setShowSuccessModal}
//         title="Bug Report Sent!"
//         description="Your bug report has been submitted successfully. Our team will review it shortly."
//       />

//       <Footer/>
//     </>
//   )
// }


const page = () => {
  return (
    <div>page</div>
  )
}

export default page
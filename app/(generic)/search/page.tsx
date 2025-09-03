"use client"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Upload, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/Header1"
import Footer from "@/components/Footer"
import { useState } from "react"
import toast from "react-hot-toast"
import { useCategories } from "@/hooks/useCategories"

export default function SearchPage() {
  // State for form data
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    description: "",
    category: "",
  })

  const { categories } = useCategories()

  const [files, setFiles] = useState<File[]>([])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === "contactNumber") {
      // Allow only numeric input
      const numericValue = value.replace(/[^0-9]/g, "")
      setFormData((prev) => ({ ...prev, [name]: numericValue }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : []
    // Filter for valid image types (SVG, PNG, JPG, GIF)
    const validFiles = selectedFiles.filter((file) =>
      ["image/svg+xml", "image/png", "image/jpeg", "image/gif"].includes(file.type)
    )
    setFiles(validFiles)
  }

  // Handle drag-and-drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    // Filter for valid image types
    const validFiles = droppedFiles.filter((file) =>
      ["image/svg+xml", "image/png", "image/jpeg", "image/gif"].includes(file.type)
    )
    setFiles((prev) => [...prev, ...validFiles])
  }


  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
   
    if (!/^[0-9]+$/.test(formData.contactNumber)) {
      toast("Contact number must be numeric.")
      return
    }

    try {
     
      const response = await fetch("/api/request-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast("Request submitted successfully!")
        setFormData({ fullName: "", contactNumber: "", description: "", category: "" })
      } else {
        toast("Error submitting request.")
      }
    } catch (error) {
      console.error("Submission error:", error)
      toast("An error occurred.")
    }
  }

 
  const similarProducts = [
    {
      id: 1,
      title: "The Green hostel",
      description: "This product is perfect for your balcony or other smaller spaces since it can be easily folded",
      location: "Eleko",
      features: ["One room", "Gate"],
      price: "₦95,232",
      image: "/product1.png",
    },
    {
      id: 2,
      title: "St Andrews Glasgow Green",
      description: "A corner, a nook or even part of a passage can be a well-equipped, comfortable place for a few ...",
      location: "Poly gate",
      features: ["Room & parlor", "24hrs solar"],
      price: "₦595,232",
      image: "/product2.png",
    },
    {
      id: 3,
      title: "St Andrews Glasgow Green",
      description: "A corner, a nook or even part of a passage can be a well-equipped, comfortable place for a few ...",
      location: "Poly gate",
      features: ["Room & parlor", "24hrs solar"],
      price: "₦595,232",
      image: "/product4.png",
    },
    {
      id: 4,
      title: "St Andrews Glasgow Green",
      description: "A corner, a nook or even part of a passage can be a well-equipped, comfortable place for a few ...",
      location: "Poly gate",
      features: ["Room & parlor", "24hrs solar"],
      price: "₦595,232",
      image: "/product2.png",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header hidden={false} />
      <div className="container mx-auto py-6 max-md:px-5">
  
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700">
              Home
            </Link>
            <ChevronRight size={16} />
            <span className="text-gray-700">Search</span>
          </div>
          <div className="flex flex-row gap-0">
            <p className="font-semibold">Search results - Property </p>
            <p className="font-light">(0 result found)</p>
          </div>
        </div>

        <div className="flex flex-col">
          
          <div className="flex flex-col relative w-full">
          
            <div className="flex flex-col items-center justify-center text-center py-1">
              <div className="mb-2 text-purple-600">
                <Image src={"/binocular.png"} width={45} height={45} alt="binocular" />
              </div>
              <h2 className="text-xl font-medium mb-2">No search results for “Property“</h2>
              <div className="text-gray-500 max-w-md space-y-2">
                <p>Ensure all words are spelled correctly</p>
                <p>Try using different or more general keywords</p>
                <p>Remove filters or search for a broader category</p>
              </div>
            </div>

            {/* Request Product Form */}
            <div className="mt-5 bg-white shadow rounded-lg overflow-hidden w-full">
              <div className="flex flex-col md:flex-row w-full justify-between">
                <div className="p-6 md:w-1/2">
                  <h2 className="text-xl font-medium mb-2">Request product/services</h2>
                  <p className="text-gray-500 mb-6">
                    If you can‘t find the product you‘re looking for, please enter the product or service details below.
                  </p>

                  <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                    <div>
                      <label className="block mb-1 text-sm">Full name</label>
                      <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Contact number</label>
                      <Input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        pattern="[0-9]+"
                        title="Contact number must be numeric"
                        className="w-full"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault()
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Image(s)</label>
                      <div
                        className="border border-dashed rounded-md p-4 text-center"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                      >
                        <input
                          type="file"
                          accept="image/svg+xml,image/png,image/jpeg,image/gif"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Upload size={20} className="text-gray-400" />
                            <div className="text-sm">
                              <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                            </div>
                            <div className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 800×400px)</div>
                          </div>
                        </label>
                        {files.length > 0 && (
                          <div className="mt-2 text-sm text-gray-600">
                            <p>Selected files:</p>
                            <ul className="list-disc list-inside">
                              {files.map((file, index) => (
                                <li key={index}>{file.name}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Description</label>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full min-h-[100px]"
                      />
                    </div>
                    <div className="flex w-full justify-center">
                      <Button
                        type="submit"
                        className="flex w-full justify-center max-w-xl md:p-6 items-center bg-[#1F058F] hover:bg-[#2a0bc0] text-white mt-3"
                      >
                        Request product
                      </Button>
                    </div>
                  </form>
                </div>
                <div className="w-full h-auto relative md:w-1/2 p-6 max-sm:hidden">
                  <Image
                    src="/hanger.png"
                    alt="Clothing on hangers"
                    width={600}
                    height={600}
                    className="object-cover h-full w-full rounded-r-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* You might also like these */}
      <div className="mt-8 mb-8 px-4 md:px-0 max-w-7xl mx-auto">
        <h3 className="font-medium text-lg mb-4">You might also like these</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {similarProducts.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden">
              <div className="relative h-[160px] cursor-pointer">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                <button className="absolute top-2 right-2 h-7 w-7 bg-white rounded-full flex items-center justify-center cursor-pointer">
                  <Heart size={14} className="text-gray-500" />
                </button>
              </div>
              <div className="p-3 shadow-sm hover:shadow-xl transition duration-200 cursor-pointer">
                <h4 className="font-medium text-sm">{product.title}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                <div className="flex gap-2 md:gap-1 mt-2 w-full justify-start md:justify-center">
                  <div className="text-xs md:text-[10px] bg-gray-100 px-2 py-1 rounded">{product.location}</div>
                  {product.features.map((feature, index) => (
                    <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="font-medium text-sm mt-2">{product.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
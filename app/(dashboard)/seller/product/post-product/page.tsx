"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import Link from "next/link"
import { Check, ChevronRight, Layers,  Zap } from "lucide-react"
import { apiClientUser } from "@/lib/interceptor"


interface Category {
    _id: string
    name: string
    imageUrl: string
    status: string
}

interface Subcategory {
    _id: string
    name: string
    category: string
    facilities: Facility[]
}

interface Facility {
    _id?: string
    label: string
    description: string
    mandatory: boolean
    filterable: boolean
    isActive: boolean
    dataType: "string" | "number" | "boolean" | "array" | "object"
    dataInputType: "text" | "number" | "boolean" | "array" | "object"
    value?: string
}

export default function ProductPostFlow() {
    const [step, setStep] = useState(1)
    const [categories, setCategories] = useState<Category[]>([])
    const [subcategories, setSubcategories] = useState<Subcategory[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
    const [facilityValues, setFacilityValues] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState({
        categories: true,
        subcategories: false
    })

    // Form data
    const [formData, setFormData] = useState({
        images: [] as string[],
        price: "",
        discountPrice: "",
        description: "",
        overview: "",
        contactInfo: {
            fullName: "",
            phoneNumber: ""
        }
    })

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClientUser.get("/categories")
                console.log(response)
                setCategories(response.data?.total || [])
            } catch (error) {
                console.error("Failed to fetch categories", error)
            } finally {
                setLoading(prev => ({ ...prev, categories: false }))
            }
        }
        fetchCategories()
    }, [])

    // Fetch subcategories when category is selected
    useEffect(() => {
        if (selectedCategory) {
            const fetchSubcategories = async () => {
                try {
                    setLoading(prev => ({ ...prev, subcategories: true }))
                    const response = await apiClientUser.get(`/subcategories/${selectedCategory}`)
                    setSubcategories(response.data?.data || [])
                } catch (error) {
                    console.error("Failed to fetch subcategories", error)
                } finally {
                    setLoading(prev => ({ ...prev, subcategories: false }))
                }
            }
            fetchSubcategories()
        }
    }, [selectedCategory])

    const handleContinue = () => {
        // Validation based on step
        if (step === 1 && !selectedCategory) {
            alert("Please select a category")
            return
        }
        if (step === 2 && !selectedSubcategory) {
            alert("Please select a subcategory")
            return
        }
        setStep(step + 1)
    }

    const handleBack = () => step > 1 && setStep(step - 1)

    const handleFacilityChange = (facilityId: string, value: string) => {
        setFacilityValues(prev => ({
            ...prev,
            [facilityId]: value
        }))
    }

    const getCurrentSubcategory = () => {
        return subcategories.find(sub => sub._id === selectedSubcategory)
    }

    // Step 1: Category Selection
    const renderCategoryStep = () => (
        <>
            <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">Category</h2>
                <p className="text-gray-500 mb-6">Select post category below</p>
            </div>
            <div className="flex flex-col md:flex-row  gap-10 flex-1">
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    {categories.map(cat => (
                        <div
                            key={cat._id}
                            onClick={() => setSelectedCategory(cat._id)}
                            className={`relative rounded-lg overflow-hidden group cursor-pointer border transition ${selectedCategory === cat._id
                                ? "border-[#1F058F] border-2 shadow-lg"
                                : "border-gray-200 hover:shadow-md"
                                }`}
                        >
                            <Image
                                src={cat.imageUrl || "/assets/images/default-category.png"}
                                alt={cat.name}
                                width={400}
                                height={250}
                                className="w-full h-[200px] md:h-[240px] object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 flex items-end p-4">
                                <span className="text-white text-lg font-semibold">{cat.name}</span>
                            </div>
                            {selectedCategory === cat._id && (
                                <div className="absolute top-[-2px] right-[-2px] bg-[#1F058F] rounded-bl-[30px] p-5">
                                    <Check className="text-white w-4 h-4" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {/* Stepper remains same as your original */}
                {/* Right side: Stepper */}
                <div className="w-full md:w-64 flex flex-col">
                    <div className="flex flex-col items-start">
                        <div className="text-gray-400 text-sm mb-2">Step 1 of 3</div>
                        {/* Steps */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-green-400"></div>
                                <div className="text-[17px] font-medium text-gray-900">Category</div>
                            </div>
                            <div className="flex justify-start h-10 w-0.5 bg-[#F5F5F5] ml-2" />
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                                <div className="text-[17px] text-gray-500">Post details</div>
                            </div>
                            <div className="flex justify-start h-10 w-0.5 bg-[#F5F5F5] ml-2" />
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                                <div className="text-[17px] text-gray-500">Other details</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

    // Step 2: Subcategory and Basic Details
    const renderDetailsStep = () => {
        const currentSubcategory = getCurrentSubcategory()
             console.log(currentSubcategory)
        return (
            <>
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold">Post details</h1>
                    <p className="text-gray-500">Enter post details below</p>
                </div>

                <div className="flex flex-col md:flex-row gap-10 flex-1 w-full mt-5">
                    <div className="flex w-full flex-col gap-10">
                        {/* Image upload */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer bg-gray-50">
                            <p className="text-gray-500 mb-2">Click to upload or drag and drop</p>
                            <p className="text-gray-400 text-xs">SVG, PNG, JPG or GIF (max. 800×400px)</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <div className="relative">
                                    <Input
                                        value={categories.find(c => c._id === selectedCategory)?.name || ""}
                                        className="bg-gray-100"
                                        readOnly
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <Check className="h-5 w-5 text-green-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sub-category</label>
                                <Select
                                    value={selectedSubcategory || ""}
                                    onValueChange={setSelectedSubcategory}
                                    disabled={loading.subcategories}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={loading.subcategories ? "Loading..." : "Select sub-category"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subcategories.map(sub => (
                                            <SelectItem key={sub._id} value={sub._id}>{sub.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Regular price</label>
                                <Input
                                    placeholder="Enter price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price <span className="pl-1 font-extralight text-gray-400">(optional)</span></label>
                                <Input
                                    placeholder="NGN ₦"
                                    type="number"
                                    value={formData.discountPrice}
                                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <Textarea
                                placeholder="Enter description"
                                className="min-h-[120px]"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                    {/* Stepper remains same as your original */}
                    {/* Right side: Stepper */}
                    <div className="w-full md:w-64 flex flex-col">
                        <div className="flex flex-col items-start">
                            <div className="text-gray-400 text-sm mb-2">Step 2 of 3</div>

                            {/* Steps */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-green-400"></div>
                                    <div className="text-[17px] font-medium text-gray-900">Category</div>
                                </div>
                                <div className="flex justify-start h-10 w-0.5 bg-[#F5F5F5] ml-2" />
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-green-400"></div>
                                    <div className="text-[17px] font-medium text-gray-900">Post details</div>
                                </div>
                                <div className="flex justify-start h-10 w-0.5 bg-[#F5F5F5] ml-2" />
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                                    <div className="text-[17px] text-gray-500">Other details</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    // Step 3: Facilities and Other Details
    const renderFacilitiesStep = () => {
        const currentSubcategory = getCurrentSubcategory()
        const mandatoryFacilities = currentSubcategory?.facilities.filter(f => f.mandatory) || []
        const optionalFacilities = currentSubcategory?.facilities.filter(f => !f.mandatory) || []

        return (
            <>
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold">Other details</h1>
                    <p className="text-gray-500">Enter other details below</p>
                </div>
                <div className="flex flex-col md:flex-row gap-10 flex-1 w-full mt-5">
                    <div className="flex w-full flex-col gap-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <Textarea
                                    placeholder="Enter description"
                                    className="min-h-[150px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Overview (Optional)</label>
                                <Textarea
                                    placeholder="Enter overview"
                                    className="min-h-[150px]"
                                    value={formData.overview}
                                    onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Facilities Section */}
                        <div>
                            <div className="grid grid-cols-2 gap-4">
                                <h2 className="text-lg font-medium mb-3">Facilities</h2>
                                <h2 className="text-lg font-medium mb-3 max-md:hidden">Details</h2>
                            </div>

                            {/* Mandatory Facilities */}
                            {mandatoryFacilities.length > 0 && (
                                <>
                                    <h3 className="text-sm font-medium mb-2 text-gray-700">Required Fields</h3>
                                    <div className="space-y-4 mb-6">
                                        {mandatoryFacilities.map((facility) => (
                                            <div key={facility._id} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-sm:pb-5">
                                                <Input
                                                    value={facility.label}
                                                    readOnly
                                                    className="bg-gray-100"
                                                />
                                                <Input
                                                    placeholder={facility.description}
                                                    value={facilityValues[facility._id!] || ""}
                                                    onChange={(e) => handleFacilityChange(facility._id!, e.target.value)}
                                                    required
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Optional Facilities */}
                            {optionalFacilities.length > 0 && (
                                <>
                                    <h3 className="text-sm font-medium mb-2 text-gray-700">Optional Fields</h3>
                                    <div className="space-y-4">
                                        {optionalFacilities.map((facility) => (
                                            <div key={facility._id} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-sm:pb-5">
                                                <Input
                                                    value={facility.label}
                                                    readOnly
                                                    className="bg-gray-100"
                                                />
                                                <Input
                                                    placeholder={facility.description}
                                                    value={facilityValues[facility._id!] || ""}
                                                    onChange={(e) => handleFacilityChange(facility._id!, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h2 className="text-lg font-medium mb-3">Contact information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Input
                                        value={formData.contactInfo.fullName}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            contactInfo: {
                                                ...formData.contactInfo,
                                                fullName: e.target.value
                                            }
                                        })}
                                        placeholder="Full name"
                                        required
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="tel"
                                        value={formData.contactInfo.phoneNumber}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            contactInfo: {
                                                ...formData.contactInfo,
                                                phoneNumber: e.target.value
                                            }
                                        })}
                                        placeholder="Phone number"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Stepper remains same as your original */}
                    {/* Right side: Stepper */}
                    <div className="w-full md:w-64 flex flex-col">
                        <div className="flex flex-col items-start">
                            <div className="text-gray-400 text-sm mb-2">Step 3 of 3</div>

                            {/* Steps */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-green-400"></div>
                                    <div className="text-[17px] font-medium text-gray-900">Category</div>
                                </div>
                                <div className="flex justify-start h-10 w-0.5 bg-[#F5F5F5] ml-2" />
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-green-400"></div>
                                    <div className="text-[17px] font-medium text-gray-900">Post details</div>
                                </div>
                                <div className="flex justify-start h-10 w-0.5 bg-[#F5F5F5] ml-2" />
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-green-400"></div>
                                    <div className="text-[17px] font-medium text-gray-900">Other details</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className="flex flex-col w-full min-h-screen mx-auto container bg-white p-6">
            <div className="flex flex-col h-full mx-auto w-full md:pt-3">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-6">
                    {step === 1 && "Post product > Category"}
                    {step === 2 && "Post product > Post details"}
                    {step === 3 && "Post product > Other details"}
                    {step === 4 && "Post product > Plan details"}
                </div>

                {/* Main Content */}
                {step === 1 && renderCategoryStep()}
                {step === 2 && renderDetailsStep()}
                {step === 3 && renderFacilitiesStep()}
                {step === 4 && (
                    <div className="w-full mx-auto p-4 md:p-6">
                        {/* Breadcrumb */}
                        <div className="flex items-center text-sm mb-6">
                            <Link href="/post-product" className="text-gray-500 hover:text-gray-700">
                                Post product
                            </Link>
                            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                            <span className="text-gray-500">...</span>
                            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                            <span className="text-[#1F058F] font-medium">Plan details</span>
                        </div>

                        <h1 className="text-xl font-semibold mb-2">Plan details</h1>
                        <p className="text-gray-600 mb-8">Select your plan</p>

                        {/* Pricing Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Basic Plan */}
                            <div className="border rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-center mb-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                            <Zap className="h-5 w-5 text-[#1F058F]" />
                                        </div>
                                    </div>
                                    <h3 className="text-center text-[#1F058F] font-semibold text-lg mb-2">Basic plan</h3>
                                    <div className="text-center mb-2">
                                        <span className="text-3xl font-bold">₦0.00</span>
                                        <span className="text-gray-500 ml-1">per month</span>
                                    </div>
                                    <p className="text-center text-gray-600 mb-6">Our basic plan to get you started</p>
                                    <Button
                                        variant="outline"
                                        className="w-full border-[#1F058F] text-[#1F058F] hover:bg-[#1F058F] hover:text-white"
                                    >
                                        Get started
                                    </Button>
                                </div>

                                <div className="border-t p-6">
                                    <h4 className="font-medium mb-2">FEATURES</h4>
                                    <p className="text-gray-600 mb-4">
                                        Everything in our <span className="font-medium">free plan</span> plus....
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <div className="mr-2 mt-1 flex-shrink-0">
                                                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-green-600" />
                                                </div>
                                            </div>
                                            <span>Access to basic features</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="mr-2 mt-1 flex-shrink-0">
                                                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-green-600" />
                                                </div>
                                            </div>
                                            <span>Basic reporting and analytics</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="mr-2 mt-1 flex-shrink-0">
                                                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-green-600" />
                                                </div>
                                            </div>
                                            <span>Up to 10 individual users</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="mr-2 mt-1 flex-shrink-0">
                                                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-green-600" />
                                                </div>
                                            </div>
                                            <span>20GB individual data each user</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="mr-2 mt-1 flex-shrink-0">
                                                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-green-600" />
                                                </div>
                                            </div>
                                            <span>Basic chat and email support</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Standard Plan */}
                            <div className="border rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-center mb-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                            <Layers className="h-5 w-5 text-[#1F058F]" />
                                        </div>
                                    </div>
                                    <h3 className="text-center text-[#1F058F] font-semibold text-lg mb-2">Standard plan</h3>
                                    <div className="text-center mb-2">
                                        <span className="text-3xl font-bold">₦500</span>
                                        <span className="text-gray-500 ml-1">per month</span>
                                    </div>
                                    <p className="text-center text-gray-600 mb-6">Our most popular plan</p>
                                    <Button className="w-full bg-[#1F058F] hover:bg-[#2a0bc0]">Get started</Button>
                                </div>

                                <div className="border-t p-6">
                                    <h4 className="font-medium mb-2">FEATURES</h4>
                                    <p className="text-gray-600 mb-4">
                                        Everything in <span className="font-medium">Basic</span> plus....
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <div className="mr-2 mt-1 flex-shrink-0">
                                                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-green-600" />
                                                </div>
                                            </div>
                                            <span>Access to basic features</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="mr-2 mt-1 flex-shrink-0">
                                                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-green-600" />
                                                </div>
                                            </div>
                                            <span>Basic reporting and analytics</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="mr-2 mt-1 flex-shrink-0">
                                                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-green-600" />
                                                </div>
                                            </div>
                                            <span>Up to 10 individual users</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="mr-2 mt-1 flex-shrink-0">
                                                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-green-600" />
                                                </div>
                                            </div>
                                            <span>20GB individual data each user</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="mr-2 mt-1 flex-shrink-0">
                                                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-green-600" />
                                                </div>
                                            </div>
                                            <span>Basic chat and email support</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Premium Plan */}
                            <div className="border rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-center mb-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                            <Layers className="h-5 w-5 text-[#1F058F]" />
                                        </div>
                                    </div>
                                    <h3 className="text-center text-[#1F058F] font-semibold text-lg mb-2">Premium plan</h3>
                                    <div className="text-center mb-2">
                                        <span className="text-3xl font-bold">₦800</span>
                                        <span className="text-gray-500 ml-1">per month</span>
                                    </div>
                                    <p className="text-center text-gray-600 mb-6">Best for large teams</p>
                                    <Button
                                        variant="outline"
                                        className="w-full border-[#1F058F] text-[#1F058F] hover:bg-[#1F058F] hover:text-white"
                                    >
                                        Get started
                                    </Button>
                                </div>

                                <div className="border-t p-6">
                                    <h4 className="font-medium mb-2">FEATURES</h4>
                                    <p className="text-gray-600 mb-4">
                                        Everything in <span className="font-medium">Business</span> plus....
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <div className="mr-2 mt-1 flex-shrink-0">
                                                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-green-600" />
                                                </div>
                                            </div>
                                            <span>Access to basic features</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="mr-2 mt-1 flex-shrink-0">
                                                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-green-600" />
                                                </div>
                                            </div>
                                            <span>Basic reporting and analytics</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="mr-2 mt-1 flex-shrink-0">
                                                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-green-600" />
                                                </div>
                                            </div>
                                            <span>Up to 10 individual users</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="mr-2 mt-1 flex-shrink-0">
                                                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-green-600" />
                                                </div>
                                            </div>
                                            <span>20GB individual data each user</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="mr-2 mt-1 flex-shrink-0">
                                                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-green-600" />
                                                </div>
                                            </div>
                                            <span>Basic chat and email support</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {/* <div className="flex gap-4 justify-end">
                       <Button variant="outline">Back</Button>
                       <Button className="bg-[#1F058F] hover:bg-[#2a0bc0]">Continue</Button>
                     </div> */}
                    </div>
                )}

                {step === 5 && (

                    <div className=" flex flex-col min-h-[80dvh] w-full h-full justify-center items-center align-middle ">
                        <div className="mb-4 flex justify-center">
                            <Image
                                src={'/hourglass.png'}
                                width={80}
                                height={80}
                                alt="box"
                            />
                        </div>

                        <h2 className="text-xl font-semibold mb-2">Post is under review</h2>
                        <p className="text-gray-500 mb-8">Your post is under review will be live upon approval is there’s any issue we will communicate it with you</p>
                        <div className="flex flex-row gap-10">
                            <Button className="bg-[#1F058F] hover:bg-[#2e0a94] text-white px-8 py-2 rounded-full">See Post</Button>
                            <Button className="border border-[#1F058F] hover:bg-[#2e0a94] hover:text-white text-black px-8 py-2 bg-white rounded-full">Go Back Home </Button>
                        </div>
                        <div className="mt-16 text-center text-gray-600 text-sm">
                            <p>For further assistance reach out via our 24/7</p>
                            <p>
                                via email at{" "}
                                <a href="mailto:support@crownlist.com" className="text-[#1F058F]">
                                    support@crownlist.com
                                </a>
                            </p>
                        </div>
                    </div>

                )}

                {/* Action Buttons */}
                <div className={`flex gap-4 mt-10 ${step === 5 ? "hidden" : ''}`}>
                    {step > 1 && (
                        <Button
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8"
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                    )}
                    <Button
                        className="bg-[#1F058F] hover:bg-[#1F058F]/90 px-8"
                        onClick={handleContinue}
                    >
                        {step === 4 ? "Submit" : "Continue"}
                    </Button>
                    <Button
                        variant="outline"
                        className="border-[#1F058F] text-[#1F058F] hover:bg-[#1F058F]/10 px-8"
                        onClick={() => setStep(1)}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    )
}
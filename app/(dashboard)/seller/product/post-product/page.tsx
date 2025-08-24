/* eslint-disable */
"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import Link from "next/link"
import { Check, ChevronRight, Layers, Zap } from "lucide-react"
import { apiClientUser } from "@/lib/interceptor"
import { toast } from "sonner"


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
    // selectType applies when dataType === 'array'
    selectType?: "single" | "multiple"
    value?: string
}

export default function ProductPostFlow() {
    const [step, setStep] = useState(1)
    const [categories, setCategories] = useState<Category[]>([])
    const [subcategories, setSubcategories] = useState<Subcategory[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
    const [facilityValues, setFacilityValues] = useState<Record<string, unknown>>({})
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

    // Uploaded images with primary flag (defer actual upload until submit)
    const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; altText?: string; isPrimary?: boolean; file?: File }>>([])
    const [uploadingImage, setUploadingImage] = useState(false)

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
                    const response = await apiClientUser.get(`/categories/${selectedCategory}`)
                    const list: Subcategory[] = response.data?.subCategories || []
                    setSubcategories(list)
                    console.log("list", response.data)
                    // Auto-select first subcategory if none selected or current is not in list
                    if (!selectedSubcategory || !list.find(s => s._id === selectedSubcategory)) {
                        setSelectedSubcategory(list[0]?._id || null)
                    }
                } catch (error) {
                    console.error("Failed to fetch subcategories", error)
                } finally {
                    setLoading(prev => ({ ...prev, subcategories: false }))
                }
            }
            // Reset dependent state when category changes
            setSelectedSubcategory(null)
            setFacilityValues({})
            fetchSubcategories()
        } else {
            // Clear when no category selected
            setSubcategories([])
            setSelectedSubcategory(null)
            setFacilityValues({})
        }
    }, [selectedCategory])

    // When subcategory changes, clear previous facility inputs
    useEffect(() => {
        setFacilityValues({})
    }, [selectedSubcategory])

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
        if (step === 3) {
            // Validate mandatory facilities (simple non-empty check)
            const current = getCurrentSubcategory()
            const mandatory = current?.facilities.filter(f => f.mandatory) || []
            const missing: string[] = []
            mandatory.forEach(f => {
                const v = facilityValues[f._id!]
                if (f.dataType === 'array') {
                    const arr = Array.isArray(v) ? (v as string[]) : []
                    if (arr.length === 0 || arr.some(x => !String(x).trim())) missing.push(f.label)
                } else if (f.dataType === 'number') {
                    if (v === undefined || v === null || String(v).trim() === '') missing.push(f.label)
                } else if (f.dataType === 'string') {
                    if (!String(v ?? '').trim()) missing.push(f.label)
                } else if (f.dataType === 'boolean') {
                    // boolean can be true/false; consider provided if value is boolean
                    if (typeof v !== 'boolean') missing.push(f.label)
                }
            })
            if (missing.length) {
                toast.error(`Please fill required fields: ${missing.join(', ')}`)
                return
            }
            // Submit on step 3 instead of continuing to step 4
            handleSubmit()
            return
        }
        setStep(step + 1)
    }

    const handleSubmit = async () => {
        try {
            // Prevent submit while uploading images
            if (uploadingImage) {
                toast.error('Please wait for images to finish uploading')
                return
            }

            // Require at least one image
            if (!uploadedImages.length) {
                toast.error('Please upload at least one image before submitting')
                return
            }

            // Compose payload according to API contract
            if (!selectedCategory) {
                toast.error('Category is required')
                return
            }
            if (!selectedSubcategory) {
                toast.error('Subcategory is required')
                return
            }
            // if (!formData.overview || !formData.overview.trim()) {
            //     toast.error('Overview is required')
            //     return
            // }
            if (!formData.description || !formData.description.trim()) {
                toast.error('Description is required')
                return
            }
            if (!formData.price) {
                toast.error('Please provide a price')
                return
            }
            const priceNum = Number(String(formData.price).replace(/,/g, ''))
            const discountNum = formData.discountPrice ? Number(String(formData.discountPrice).replace(/,/g, '')) : undefined
            if (!isFinite(priceNum) || priceNum <= 0) {
                toast.error('Please enter a valid price')
                return
            }
            if (discountNum !== undefined) {
                if (!isFinite(discountNum) || discountNum <= 0) {
                    toast.error('Please enter a valid discount price')
                    return
                }
                if (discountNum >= priceNum) {
                    toast.error('Discount price must be less than the price')
                    return
                }
            }
            const priceObj: Record<string, number> = { currentPrice: priceNum }
            if (discountNum !== undefined) priceObj.discountedPrice = discountNum

            // Upload staged images now (those with a File) to obtain real URLs
            const uploadingToastId = toast.loading('Uploading images...')
            setUploadingImage(true)
            const finalImages: Array<{ url: string; altText?: string; isPrimary?: boolean }> = []
            try {
                for (const img of uploadedImages) {
                    if (img.file) {
                        const realUrl = await uploadImage(img.file)
                        finalImages.push({ url: realUrl, altText: img.altText || '', isPrimary: Boolean(img.isPrimary) })
                    } else {
                        // If already has a real url (previously uploaded), keep it
                        finalImages.push({ url: img.url, altText: img.altText || '', isPrimary: Boolean(img.isPrimary) })
                    }
                }
            } finally {
                setUploadingImage(false)
                toast.dismiss(uploadingToastId)
            }

            // Ensure we still have at least one uploaded image
            if (!finalImages.length) {
                toast.error('Image upload failed. Please try again')
                return
            }
            // Ensure one primary is set
            if (!finalImages.some(i => i.isPrimary)) {
                finalImages[0].isPrimary = true
            }

            // Map facilities to array of { label, value }, normalizing type
            const currentSub = getCurrentSubcategory()
            const facilitiesArr: Array<{ label: string; value: any }> = []
            if (currentSub) {
                for (const f of currentSub.facilities || []) {
                    const raw = (facilityValues as any)[f._id!]
                    if (raw === undefined) continue
                    let value: any = raw
                    if (f.dataType === 'number') value = Number(raw)
                    if (f.dataType === 'array') value = Array.isArray(raw) ? raw : (raw ? [raw] : [])
                    if (f.dataType === 'boolean') value = Boolean(raw)
                    if (f.dataType === 'string') value = String(raw)
                    facilitiesArr.push({ label: f.label, value })
                }
            }

            // If there are mandatory facilities in schema, ensure they are present in facilitiesArr
            const mandatoryInSchema = currentSub?.facilities.filter(f => f.mandatory) || []
            if (mandatoryInSchema.length) {
                const missingMandatory: string[] = []
                for (const m of mandatoryInSchema) {
                    const has = facilitiesArr.some(x => x.label === m.label && (m.dataType !== 'array' ? x.value !== undefined && x.value !== '' : Array.isArray(x.value) && x.value.length))
                    if (!has) missingMandatory.push(m.label)
                }
                if (missingMandatory.length) {
                    toast.error(`Please fill required fields: ${missingMandatory.join(', ')}`)
                    return
                }
            }

            const payload = {
                name: formData.overview || 'Untitled Post',
                description: formData.description,
                images: finalImages,
                category: selectedCategory,
                subCategory: selectedSubcategory,
                facilities: facilitiesArr,
                price: priceObj,
                features: [],
                status: 'reviewing'
            }

            const loadingId = toast.loading('Submitting your product...')
            console.log('Submitting product payload:', payload)
            await apiClientUser.post('/products/create', payload)
            toast.dismiss(loadingId)
            toast.success('Product submitted successfully')
            setStep(5)
        } catch (e: any) {
            const msg = e?.response?.data?.message || e?.message || String(e)
            toast.error(`Submission failed: ${msg}`)
        }
    }

    const handleBack = () => step > 1 && setStep(step - 1)

    const handleFacilityChange = (facilityId: string, value: unknown) => {
        setFacilityValues(prev => ({
            ...prev,
            [facilityId]: value
        }))
    }



    const getCurrentSubcategory = () => {
        return subcategories.find(sub => sub._id === selectedSubcategory)
    }

    // =============================
    // Image Upload Helpers
    // =============================
    const uploadImage = async (file: File) => {
        const fd = new FormData()
        fd.append("file", file)
        fd.append("fileType", "Profile-pics")
        const res = await apiClientUser.post("/users/upload", fd, {
            headers: { "Content-Type": "multipart/form-data" }
        })
        return res?.data?.fileUrl || res?.data?.data?.fileUrl
    }

    const handleFilesSelected = async (files: FileList | null) => {
        if (!files || files.length === 0) return
        // Defer upload until submit; create preview URLs now
        const staged: Array<{ url: string; altText?: string; isPrimary?: boolean; file?: File }> = []
        for (const file of Array.from(files)) {
            const preview = URL.createObjectURL(file)
            staged.push({ url: preview, file })
        }
        setUploadedImages((prev) => {
            const merged = [...prev, ...staged]
            if (!merged.some(i => i.isPrimary) && merged.length > 0) merged[0].isPrimary = true
            return merged
        })
        toast.success('Image(s) added. They will upload on submit.')
    }

    const setPrimaryImage = (index: number) => {
        setUploadedImages(prev => prev.map((img, i) => ({ ...img, isPrimary: i === index })))
    }


    // Helpers for Step 2 image management (used in UI below)
    const removeImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index))
    }

    const updateAltText = (index: number, value: string) => {
        setUploadedImages(prev => prev.map((img, i) => i === index ? { ...img, altText: value } : img))
    }


    // =============================
    // Facility Array Helpers
    // =============================
    const getArrayOptions = (facility: Facility): string[] => {
        const raw = facility.value as any
        if (raw == null) return []
        // Try JSON array first
        try {
            const parsed = JSON.parse(String(raw))
            if (Array.isArray(parsed)) return parsed.map((x) => String(x)).filter(Boolean)
        } catch { }
        // Fallback: comma-separated string
        return String(raw)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
    }

    const getFacilityArrayValue = (facilityId: string): string[] => {
        const v = facilityValues[facilityId]
        return Array.isArray(v) ? (v as string[]) : []
    }

    const toggleMultiOption = (facilityId: string, option: string, checked: boolean) => {
        setFacilityValues((prev) => {
            const current = Array.isArray(prev[facilityId]) ? ([...(prev[facilityId] as string[])]) : []
            const has = current.includes(option)
            let next = current
            if (checked && !has) next = [...current, option]
            if (!checked && has) next = current.filter((x) => x !== option)
            return { ...prev, [facilityId]: next }
        })
    }

    // =============================
    // Number formatting helpers
    // =============================
    const formatNumberInput = (raw: string) => {
        const digits = raw.replace(/\D/g, '')
        if (!digits) return ''
        return Number(digits).toLocaleString()
    }

    const parseFormattedNumber = (val: string) => {
        const n = Number(String(val || '').replace(/,/g, ''))
        return isFinite(n) ? n : 0
    }

    // Step 1: Category Selection
    const renderCategoryStep = () => (
        <>
            <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">Category</h2>
                <p className="text-gray-500 mb-6">Select post category below</p>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between  gap-10 flex-1">
                <div className="order-2 md:order-1 grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <div className="w-full md:w-64 flex flex-col order-1 md:order-2 mx-auto md:mx-0 max-w-sm">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="text-gray-400 text-sm mb-2">Step 1 of 3</div>
                        {/* Steps */}
                        <div className="flex flex-row md:flex-col items-center md:items-start justify-center md:justify-start gap-2">
                            {/* Step 1 */}
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-green-400"></div>
                                <div className="text-sm md:text-[17px] font-medium text-gray-900">Category</div>
                            </div>

                            {/* Connector: horizontal on mobile, vertical on md+ */}
                            <div className="block md:hidden h-0.5 w-10 bg-[#F5F5F5]" />
                            <div className="hidden md:block h-10 w-0.5 bg-[#F5F5F5] ml-2" />

                            {/* Step 2 */}
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                                <div className="text-sm md:text-[17px] text-gray-500">Post details</div>
                            </div>

                            {/* Connector: horizontal on mobile, vertical on md+ */}
                            <div className="block md:hidden h-0.5 w-10 bg-[#F5F5F5]" />
                            <div className="hidden md:block h-10 w-0.5 bg-[#F5F5F5] ml-2" />

                            {/* Step 3 */}
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                                <div className="text-sm md:text-[17px] text-gray-500">Other details</div>
                            </div>
                        </div>
                    </div>

                    {/* Stepper */}

                </div>
            </div>
        </>
    )

    // Step 2: Subcategory and Basic Details
    const renderDetailsStepOld = () => {
        const currentSubcategory = getCurrentSubcategory()
        console.log(currentSubcategory)
        return (
            <>
                <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-2">Category</h2>
                    <p className="text-gray-500 mb-6">Select post category below</p>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between  gap-10 flex-1">
                    <div className="order-2 md:order-1 grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    <div className="w-full md:w-64 flex flex-col order-1 md:order-2 mx-auto md:mx-0 max-w-sm">
                        <div className="flex flex-col items-center md:items-start">
                            <div className="text-gray-400 text-sm mb-2">Step 1 of 3</div>
                            {/* Steps */}
                            <div className="flex flex-row md:flex-col items-center md:items-start justify-center md:justify-start gap-2">
                                {/* Step 1 */}
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-green-400"></div>
                                    <div className="text-sm md:text-[17px] font-medium text-gray-900">Category</div>
                                </div>

                                {/* Connector: horizontal on mobile, vertical on md+ */}
                                <div className="block md:hidden h-0.5 w-10 bg-[#F5F5F5]" />
                                <div className="hidden md:block h-10 w-0.5 bg-[#F5F5F5] ml-2" />

                                {/* Step 2 */}
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                                    <div className="text-sm md:text-[17px] text-gray-500">Post details</div>
                                </div>

                                {/* Connector: horizontal on mobile, vertical on md+ */}
                                <div className="block md:hidden h-0.5 w-10 bg-[#F5F5F5]" />
                                <div className="hidden md:block h-10 w-0.5 bg-[#F5F5F5] ml-2" />

                                {/* Step 3 */}
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                                    <div className="text-sm md:text-[17px] text-gray-500">Other details</div>
                                </div>
                            </div>
                        </div>

                        {/* Stepper */}

                    </div>
                </div>
            </>
        )
    }

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
                        <div className="order-2 md:order-1 flex w-full flex-col gap-10">
                            {/* Image upload */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Product images</label>
                                <div className="border-2 border-dashed rounded-lg p-6 bg-gray-50">
                                    <div className="flex items-center justify-between gap-4 flex-wrap">
                                        <div className="text-sm text-gray-600">
                                            <div className="font-medium">Upload product images</div>
                                            <div className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</div>
                                        </div>
                                        <label className="inline-flex items-center px-4 py-2 bg-[#1F058F] text-white rounded-md cursor-pointer hover:bg-[#1F058F]/90">
                                            <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleFilesSelected(e.target.files)} />
                                            Choose files
                                        </label>
                                    </div>
                                    {uploadingImage && <p className="text-xs text-gray-500 mt-2">Uploading...</p>}
                                </div>
                                {uploadedImages.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {uploadedImages.map((img, idx) => (
                                            <div key={idx} className="border rounded-md p-2 space-y-2">
                                                <img src={img.url} alt={img.altText || `Image ${idx + 1}`} className="w-full h-28 object-cover rounded" />
                                                <div className="flex items-center justify-between gap-2">
                                                    <button type="button" className={`text-xs px-2 py-1 rounded ${img.isPrimary ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`} onClick={() => setPrimaryImage(idx)}>
                                                        {img.isPrimary ? 'Primary' : 'Set primary'}
                                                    </button>
                                                    <button type="button" className="text-xs text-red-600" onClick={() => removeImage(idx)}>Remove</button>
                                                </div>
                                                <Input value={img.altText || ''} onChange={(e) => updateAltText(idx, e.target.value)} placeholder="Alt text (optional)" />
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                        type="text"
                                        inputMode="numeric"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: formatNumberInput(e.target.value) })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price <span className="pl-1 font-extralight text-gray-400">(optional)</span></label>
                                    <Input
                                        placeholder="NGN ₦"
                                        type="text"
                                        inputMode="numeric"
                                        value={formData.discountPrice}
                                        onChange={(e) => setFormData({ ...formData, discountPrice: formatNumberInput(e.target.value) })}
                                        onBlur={() => {
                                            const priceVal = parseFormattedNumber(formData.price)
                                            const discVal = parseFormattedNumber(formData.discountPrice)
                                            if (discVal && priceVal && discVal >= priceVal) {
                                                toast.error('Discount price must be less than the price')
                                                setFormData(prev => ({ ...prev, discountPrice: '' }))
                                            }
                                        }}
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
                        {/* Stepper */}
                        <div className="w-full md:w-64 flex flex-col order-1 md:order-2 mx-auto md:mx-0 max-w-sm">
                            <div className="flex flex-col items-center md:items-start">
                                <div className="text-gray-400 text-sm mb-2">Step 2 of 3</div>

                                {/* Steps */}
                                <div className="flex flex-row md:flex-col items-center md:items-start justify-center md:justify-start gap-2">
                                    {/* Step 1 */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-green-400"></div>
                                        <div className="text-sm md:text-[17px] font-medium text-gray-900">Category</div>
                                    </div>

                                    {/* Connector */}
                                    <div className="block md:hidden h-0.5 w-10 bg-[#F5F5F5]" />
                                    <div className="hidden md:block h-10 w-0.5 bg-[#F5F5F5] ml-2" />

                                    {/* Step 2 */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-green-400"></div>
                                        <div className="text-sm md:text-[17px] font-medium text-gray-900">Post details</div>
                                    </div>

                                    {/* Connector */}
                                    <div className="block md:hidden h-0.5 w-10 bg-[#F5F5F5]" />
                                    <div className="hidden md:block h-10 w-0.5 bg-[#F5F5F5] ml-2" />

                                    {/* Step 3 */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                                        <div className="text-sm md:text-[17px] text-gray-500">Other details</div>
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
                        <div className="order-2 md:order-1 flex w-full flex-col gap-10">
                            <div>
                                {mandatoryFacilities.length > 0 && (
                                    <>
                                        <h3 className="text-sm font-medium mb-2 text-gray-700">Mandatory Fields</h3>
                                        <div className="space-y-4">
                                            {mandatoryFacilities.map((facility) => (
                                                <div key={facility._id} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-sm:pb-5">
                                                    <Input value={facility.label} readOnly className="bg-gray-100" />
                                                    <div>
                                                        {facility.dataType === "boolean" ? (
                                                            <div className="flex items-center gap-3">
                                                                <Switch
                                                                    checked={Boolean(facilityValues[facility._id!])}
                                                                    onCheckedChange={(val) => handleFacilityChange(facility._id!, val)}
                                                                />
                                                                <span className="text-sm text-gray-600">{facility.description}</span>
                                                            </div>
                                                        ) : facility.dataType === "number" ? (
                                                            <Input
                                                                type="number"
                                                                placeholder={facility.description}
                                                                value={(facilityValues[facility._id!] as string) || ""}
                                                                onChange={(e) => handleFacilityChange(facility._id!, e.target.value)}
                                                            />
                                                        ) : facility.dataType === "array" ? (
                                                            <div className="space-y-2">
                                                                {facility.selectType === 'single' ? (
                                                                    <Select
                                                                        value={getFacilityArrayValue(facility._id!)[0] || ""}
                                                                        onValueChange={(val) => handleFacilityChange(facility._id!, val ? [val] : [])}
                                                                    >
                                                                        <SelectTrigger className="w-full">
                                                                            <SelectValue placeholder={facility.description || "Select option"} />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {getArrayOptions(facility).map(opt => (
                                                                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                ) : (
                                                                    <div className="flex flex-wrap gap-3">
                                                                        {getArrayOptions(facility).map(opt => {
                                                                            const checked = getFacilityArrayValue(facility._id!).includes(opt)
                                                                            return (
                                                                                <label key={opt} className="flex items-center gap-2 text-sm">
                                                                                    <Checkbox
                                                                                        checked={checked}
                                                                                        onCheckedChange={(v) => toggleMultiOption(facility._id!, opt, Boolean(v))}
                                                                                    />
                                                                                    <span>{opt}</span>
                                                                                </label>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <Input
                                                                placeholder={facility.description}
                                                                value={(facilityValues[facility._id!] as string) || ""}
                                                                onChange={(e) => handleFacilityChange(facility._id!, e.target.value)}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {optionalFacilities.length > 0 && (
                                    <>
                                        <h3 className="text-sm font-medium mb-2 text-gray-700">Optional Fields</h3>
                                        <div className="space-y-4">
                                            {optionalFacilities.map((facility) => (
                                                <div key={facility._id} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-sm:pb-5">
                                                    <Input value={facility.label} readOnly className="bg-gray-100" />
                                                    <div>
                                                        {facility.dataType === "boolean" ? (
                                                            <div className="flex items-center gap-3">
                                                                <Switch
                                                                    checked={Boolean(facilityValues[facility._id!])}
                                                                    onCheckedChange={(val) => handleFacilityChange(facility._id!, val)}
                                                                />
                                                                <span className="text-sm text-gray-600">{facility.description}</span>
                                                            </div>
                                                        ) : facility.dataType === "number" ? (
                                                            <Input
                                                                type="number"
                                                                placeholder={facility.description}
                                                                value={(facilityValues[facility._id!] as string) || ""}
                                                                onChange={(e) => handleFacilityChange(facility._id!, e.target.value)}
                                                            />
                                                        ) : facility.dataType === "array" ? (
                                                            <div className="space-y-2">
                                                                {facility.selectType === 'single' ? (
                                                                    <Select
                                                                        value={getFacilityArrayValue(facility._id!)[0] || ""}
                                                                        onValueChange={(val) => handleFacilityChange(facility._id!, val ? [val] : [])}
                                                                    >
                                                                        <SelectTrigger className="w-full">
                                                                            <SelectValue placeholder={facility.description || "Select option"} />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {getArrayOptions(facility).map(opt => (
                                                                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                ) : (
                                                                    <div className="flex flex-wrap gap-3">
                                                                        {getArrayOptions(facility).map(opt => {
                                                                            const checked = getFacilityArrayValue(facility._id!).includes(opt)
                                                                            return (
                                                                                <label key={opt} className="flex items-center gap-2 text-sm">
                                                                                    <Checkbox
                                                                                        checked={checked}
                                                                                        onCheckedChange={(v) => toggleMultiOption(facility._id!, opt, Boolean(v))}
                                                                                    />
                                                                                    <span>{opt}</span>
                                                                                </label>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <Input
                                                                placeholder={facility.description}
                                                                value={(facilityValues[facility._id!] as string) || ""}
                                                                onChange={(e) => handleFacilityChange(facility._id!, e.target.value)}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="w-full md:w-64 flex flex-col order-1 md:order-2 mx-auto md:mx-0 max-w-sm">
                            <div className="flex flex-col items-center md:items-start">
                                <div className="text-gray-400 text-sm mb-2">Step 3 of 3</div>
                                <div className="flex flex-row md:flex-col items-center md:items-start justify-center md:justify-start gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-green-400"></div>
                                        <div className="text-sm md:text-[17px] font-medium text-gray-900">Category</div>
                                    </div>
                                    <div className="block md:hidden h-0.5 w-10 bg-[#F5F5F5]" />
                                    <div className="hidden md:block h-10 w-0.5 bg-[#F5F5F5] ml-2" />
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-green-400"></div>
                                        <div className="text-sm md:text-[17px] font-medium text-gray-900">Post details</div>
                                    </div>
                                    <div className="block md:hidden h-0.5 w-10 bg-[#F5F5F5]" />
                                    <div className="hidden md:block h-10 w-0.5 bg-[#F5F5F5] ml-2" />
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-green-400"></div>
                                        <div className="text-sm md:text-[17px] font-medium text-gray-900">Other details</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )
        }

        // Main return for the flow
        return (
            <div className="flex-1">
                <div className="flex flex-col w-full min-h-screen mx-auto bg-white p-6">
                    <div className="flex flex-col h-full mx-auto w-full md:pt-3">
                        {step === 1 && renderCategoryStep()}
                        {step === 2 && renderDetailsStep()}
                        {step === 3 && renderFacilitiesStep()}

                        {step === 5 && (
                            <div className=" flex flex-col min-h-[80dvh] w-full h-full justify-center items-center align-middle ">
                                <div className="mb-4 flex justify-center">
                                    <Image src={'/hourglass.png'} width={80} height={80} alt="box" />
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
                                        <a href="mailto:support@crownlist.com" className="text-[#1F058F]">support@crownlist.com</a>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className={`flex gap-4 mt-10 ${step === 5 ? 'hidden' : ''}`}>
                            {step > 1 && (
                                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8" onClick={handleBack}>
                                    Back
                                </Button>
                            )}
                            <Button className="bg-[#1F058F] hover:bg-[#1F058F]/90 px-8" onClick={handleContinue}>
                                {step === 3 ? 'Submit' : 'Continue'}
                            </Button>
                            <Button variant="outline" className="border-[#1F058F] text-[#1F058F] hover:bg-[#1F058F]/10 px-8" onClick={() => setStep(1)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
 

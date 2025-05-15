/* eslint-disable */
"use client"
import { useState } from "react"
// import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"


const categories = [
    {
        id: 'property', title: "Properties", image: "/assets/images/house2.png", subcategories: [
            { id: "student", name: "Student" },
            { id: "personal", name: "Personal" },
            { id: "office", name: "Office" },
        ]
    },
    {
        id: 'phones-tablets', title: "Phones & Tablets", image: "/assets/images/pandt2.png", subcategories: [
            { id: "mobile", name: "Mobile phone" },
            { id: "accessories", name: "Accessories" },
            { id: "tablets", name: "Tablets" },
            { id: "watches", name: "Smart watches" },
        ]
    },
    {
        id: 'fashion', title: "Fashion", image: "/assets/images/fashion2.png", subcategories: [
            { id: "bags", name: "Bags" },
            { id: "clothes", name: "Clothes" },
            { id: "jewelry", name: "Jewelry" },
            { id: "shoes", name: "Shoes" },
        ]
    },
    {
        id: 'electronics', title: "Electronics", image: "/assets/images/elect2.png", subcategories: [
            { id: "hardware", name: "Hardware" },
            { id: "monitors", name: "Monitors" },
            { id: "laptops", name: "Laptops" },
            { id: "headphones", name: "Headphones" },
            { id: "music", name: "Music equipment" },
            { id: "cameras", name: "Cameras" },
        ]
    },
]
export default function ProductPostFlow() {
    const [step, setStep] = useState(1)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedSubCategory, setSelectedSubCategory] = useState<any>([])
    const [selectedFSubCategory, setSelectedFSubCategory] = useState<any>()
    const [contactInfo, setContactInfo] = useState({
        fullName: "Jimoh Adesina",
        phoneNumber: "+234"
    })

    const handleContinue = () => {
        if (step === 1 && !selectedCategory) {
            alert("Please select a category")
            return
        }
        setStep(step + 1)
    }
    const handleBu = (cat: any) => {
        setSelectedCategory(cat.id)
        setSelectedSubCategory(cat.subcategories)
        console.log(selectedSubCategory)
        console.log(selectedSubCategory[0].id)
    }
    const handleBack = () => step > 1 && setStep(step - 1)

    return (
        <div className="flex flex-col w-full min-h-screen bg-white p-6">
            <div className=" flex flex-col h-full mx-auto w-full">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-6">
                    {step === 1 && (
                        //  {/* Breadcrumb */}
                        <div className="text-sm text-gray-500 mb-6">
                            Post product <span className="text-[#1F058F] font-medium px-2"> &gt;<span className="pl-2"> Post details</span></span>
                        </div>
                    )}
                    {step === 2 && (
                        //  {/* Breadcrumb */}
                        <div className="text-sm text-gray-500 mb-6">
                            Post product <span className="text-[#1F058F] font-medium px-2"> &gt;<span className="pl-2"> Post details</span></span>
                        </div>)}
                    {step === 3 && (
                        //  {/* Breadcrumb */}
                        <div className="text-sm text-gray-500 mb-6">
                            Post product <span className="text-[#1F058F] font-medium px-2"> &gt; ... &gt;<span className="pl-2"> other details</span></span>
                        </div>)}
                </div>


                {/* Main Content */}
                {step === 1 && (
                    <>
                        <div className="flex-1">
                            <h2 className="text-2xl font-semibold mb-2">Category</h2>
                            <p className="text-gray-500 mb-6">Select post category below</p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-10 flex-1">
                            {/* Left side: Categories */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {categories.map((cat) => {
                                    const isSelected = selectedCategory === cat.id;
                                    return (
                                        <div
                                            key={cat.id}
                                            onClick={() => handleBu(cat)}
                                            className={`relative rounded-lg overflow-hidden group cursor-pointer border transition ${isSelected
                                                ? "border-[#1F058F] border-2 shadow-lg"
                                                : "border-gray-200 hover:shadow-md"
                                                }`}
                                        >
                                            <Image
                                                src={cat.image}
                                                alt={cat.title}
                                                width={400}
                                                height={2500}
                                                className="w-full h-[200px] md:h-[240px] object-cover"
                                            />

                                            {/* Dark overlay */}
                                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 flex items-end p-4">
                                                <span className="text-white text-lg font-semibold">{cat.title}</span>
                                            </div>

                                            {/* Top right checkmark if selected */}
                                            {isSelected && (
                                                <div className="absolute top-[-2px] right-[-2px]  bg-[#1F058F] rounded-bl-[30px] p-5">
                                                    <Check className="text-white w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
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
                )}

                {step === 2 && (
                    <>
                        <div className="flex-1">
                            <h1 className="text-2xl font-semibold">Post details</h1>
                            <p className="text-gray-500">Enter post details below</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-10 flex-1 w-full mt-5">
                            <div className="flex w-full flex-col gap-10">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer bg-gray-50">
                                    <p className="text-gray-500 mb-2">Click to upload or drag and drop</p>
                                    <p className="text-gray-400 text-xs">SVG, PNG, JPG or GIF (max. 800×400px)</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <div className="relative">
                                            <Input
                                                value={categories.find(c => c.id === selectedCategory)?.title || ""}
                                                className="bg-gray-100"
                                                readOnly
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <Check className="h-5 w-5 text-green-500" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 w-full ">Sub-category</label>
                                        <Select

                                            value={selectedFSubCategory}
                                            onValueChange={setSelectedFSubCategory}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select sub-category" className="w-full" />
                                            </SelectTrigger>
                                            <SelectContent className="flex w-full">
                                                {selectedSubCategory.map((sub: any) => (
                                                    <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Regular price</label>
                                        <Input placeholder="Enter price" type="number" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price <span className="pl-1 font-extralight text-gray-400">(optional)</span></label>
                                        <Input placeholder="NGN ₦" type="number" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <Textarea placeholder="Enter description" className="min-h-[120px]" />
                                </div>
                            </div>
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
                )}

                {step === 3 && (
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
                                        <Textarea placeholder="Enter description" className="min-h-[150px]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Overview (Optional)</label>
                                        <Textarea placeholder="Enter overview" className="min-h-[150px]" />
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-lg font-medium mb-3">Facilities</h2>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((_, i) => (
                                            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input placeholder="Name" />
                                                <Input placeholder="Description" />
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="mt-4 text-[#1F058F] border-[#1F058F] hover:bg-[#1F058F]/10"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add overview tab
                                    </Button>
                                </div>

                                <div>
                                    <h2 className="text-lg font-medium mb-3">Contact information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Input
                                                value={contactInfo.fullName}
                                                onChange={(e) => setContactInfo({ ...contactInfo, fullName: e.target.value })}
                                                placeholder="Full name"
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                type="number"
                                                value={contactInfo.phoneNumber}
                                                onChange={(e) => setContactInfo({ ...contactInfo, phoneNumber: e.target.value })}
                                                placeholder="Phone number"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                )}

                {step === 4 && (

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

                {/* Stepper */}
                {/* <div className="flex justify-center items-center mt-8 mb-6 gap-2">
                    {[1, 2, 3].map((stepNum) => (
                        <div
                            key={stepNum}
                            className={`w-2 h-2 rounded-full ${stepNum < step ? "bg-green-500" :
                                stepNum === step ? "bg-[#1F058F]" : "bg-gray-300"
                                }`}
                        />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">Step {step} of 3</span>
                </div> */}

                {/* Action Buttons */}
                <div className={`flex gap-4 mt-10 ${step === 4 ? "hidden" : ''}`}>
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
                        {step === 3 ? "Submit" : "Continue"}
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
        </div >
    )
}
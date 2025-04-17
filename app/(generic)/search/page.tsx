import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/Header1"
import Footer from "@/components/Footer"

export default function SearchPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Header */}
            <Header hidden={false} />
            <div className="container mx-auto  py-6 max-md:px-5">
                {/* Breadcrumb */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 ">
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

                <div className="flex flex-col ">
                    {/* Left Sidebar */}
                    {/* <div className="w-full md:w-[280px] shrink-0">
                        {/* <h1 className="text-xl font-medium mb-6">Property</h1> 


                    </div> */}

                    {/* Main Content */}
                    <div className="flex flex-col relative w-full">
                  
                        {/* No Results */}
                        <div className="flex flex-col items-center justify-center text-center py-1">
                            <div className="mb-2 text-purple-600">
                                <Image
                                    src={"/binocular.png"}
                                    width={45}
                                    height={45}
                                    alt="binocular"
                                />
                            </div>
                            <h2 className="text-xl font-medium mb-2">No search results for &ldquo;Property&ldquo;</h2>
                            <div className="text-gray-500 max-w-md space-y-2">
                                <p>Ensure all words are spelled correctly</p>
                                <p>Try using different or more general keywords</p>
                                <p>Remove filters or search for a broader category</p>
                            </div>
                        </div>

                        {/* Request Product Form */}
                        <div className="mt-5 bg-white shadow  rounded-lg overflow-hidden w-full">
                            <div className="flex flex-col md:flex-row w-full justify-between">
                                <div className="p-6 md:w-1/2">
                                    <h2 className="text-xl font-medium mb-2">Request product/services</h2>
                                    <p className="text-gray-500 mb-6">
                                        If you can&lsquo;t find the product you&lsquo;re looking for, please enter the product or service details below.
                                    </p>

                                    <form className="flex flex-col gap-2 ">
                                        <div>
                                            <label className="block mb-1 text-sm">Full name</label>
                                            <Input className="w-full" />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm">Contact number</label>
                                            <Input className="w-full" />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm">Image(s)</label>
                                            <div className="border border-dashed rounded-md p-4 text-center">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <Upload size={20} className="text-gray-400" />
                                                    <div className="text-sm">
                                                        <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                                                    </div>
                                                    <div className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 800×400px)</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm">Description</label>
                                            <Textarea className="w-full min-h-[100px]" />
                                        </div>
                                        <div className="flex w-full justify-center">
                                            <Button className="flex w-full justify-center max-w-xl md:p-6 items-center bg-[#1F058F] hover:bg-[#2a0bc0] text-white mt-3  ">
                                                Request product</Button>
                                        </div>
                                    </form>
                                </div>
                                <div className="w-full h-auto relative md:w-1/2 p-6 ">
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
            <Footer />
        </div>
    )
}

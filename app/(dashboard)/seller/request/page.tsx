import { AlignJustify, ChevronDown, LayoutGrid,  SlidersHorizontal } from "lucide-react"
import Image from "next/image"

export default function AnalyticsPage() {
    return (
        <div className="p-4 md:p-6 flex flex-col w-full  h-full">
            <div className=" w-full mx-auto">
                <div className="flex  flex-row  justify-between mx-auto items-center align-middle">
                    <div>
                        <h1 className="text-2xl font-bold mb-1 justify-start flex ">Request</h1>
                        <p className="text-gray-600 mb-12">Keep track and manage your product request</p>
                   </div>
                   <div className=" flex flex-row  gap-7  items-center align-middle pr-5 max-md:hidden">
                    <div className="flex flex-row gap-2 items-center border-r-2 px-5 ">
                        <LayoutGrid size={18} />
                        <button className="flex ">
                            Category
                        </button>
                    </div>
                    <div className="flex flex-row gap-2 items-center border-r-2 px-5">
                        <SlidersHorizontal size={18}/>
                        <span>Sort by:</span>
                        <button className="flex ">
                            <ChevronDown size={14} />
                        </button>
                    </div>
                    <div className="flex flex-row gap-6 items-center ">
                        <button className="flex bg-[#EDE9FF]">
                            <LayoutGrid size={20} color="#1F058F" />
                        </button>
                        <button className="flex ">
                            <AlignJustify size={20} />
                        </button>
                    </div>

                   </div>
                </div>
                <div className=" flex flex-col h-full  justify-center items-center ">
                    <div className="mb-4 flex justify-center">
                        <Image
                            src={'/box.png'}
                            width={80}
                            height={80}
                            alt="box"
                        />
                    </div>

                    <h2 className="text-xl font-semibold mb-2">No product request</h2>
                    <p className="text-gray-500 mb-3">There&lsquo;s currently no product request to display</p>

                    <div className="mt-2 text-center text-gray-600 text-sm">
                        <p>For further assistance reach out via our 24/7</p>
                        <p>
                            via email at{" "}
                            <a href="mailto:support@crownlist.com" className="text-[#1F058F]">
                                support@crownlist.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

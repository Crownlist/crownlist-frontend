import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function DashboardPage() {
    return (
        <div className="p-4 md:p-6">
            {/* Total Product Banner */}
            <div className="bg-[#1F058F] text-white p-6 rounded-lg mb-6 md:mb-12 flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-medium">Total product</h2>
                    <p className="text-4xl font-bold mt-1">0</p>
                </div>
                <Button className="bg-white text-[#1a0066] hover:bg-gray-100 justify-start h-full">Add product</Button>
            </div>

            {/* Stats Cards */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-600 font-medium">Avg impression</h3>
          <p className="text-3xl font-bold mt-1">0.00</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-600 font-medium">Free plan</h3>
          <p className="text-3xl font-bold mt-1">0.00</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-600 font-medium">Promoted product</h3>
          <p className="text-3xl font-bold mt-1">0.00</p>
        </div>
               </div> */}
            {/* Stats Cards */}
            <div className="mb-8 md:mb-12">
                {/* Mobile - Horizontal Scroll */}
                <div className="md:hidden flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
                    <div className="bg-white p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                        <h3 className="text-gray-600 font-medium">Avg impression</h3>
                        <p className="text-3xl font-bold mt-1">0.00</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                        <h3 className="text-gray-600 font-medium">Free plan</h3>
                        <p className="text-3xl font-bold mt-1">0.00</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                        <h3 className="text-gray-600 font-medium">Promoted product</h3>
                        <p className="text-3xl font-bold mt-1">0.00</p>
                    </div>
                </div>

                {/* Desktop - Grid */}
                <div className="hidden md:grid grid-cols-3 gap-6 md:gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-gray-600 font-medium">Avg impression</h3>
                        <p className="text-3xl font-bold mt-1">0.00</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-gray-600 font-medium">Free plan</h3>
                        <p className="text-3xl font-bold mt-1">0.00</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-gray-600 font-medium">Promoted product</h3>
                        <p className="text-3xl font-bold mt-1">0.00</p>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center w-full">
                <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col w-full  items-center justify-center text-center max-w-3xl">
                    <div className=" mb-4">
                        <Image
                            src={'/box.png'}
                            width={80}
                            height={80}
                            alt="box"
                        />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No post product</h3>
                    <p className="text-gray-500 mb-6">You currently have no post product to display</p>
                    <Button className="bg-[#1F058F] hover:bg-[#2e0a94] text-white">Post product</Button>
                </div>
            </div>
            {/* Support Info */}
            <div className="mt-8 text-center text-gray-600">
                <p>For further assistance reach out via our 24/7</p>
                <p>
                    via email at{" "}
                    <a href="mailto:support@crownlist.com" className="text-[#1a0066]">
                        support@crownlist.com
                    </a>
                </p>
            </div>
        </div>
    )
}

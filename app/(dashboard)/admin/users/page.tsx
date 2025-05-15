import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function UsersPage() {
    return (
        <div className="p-4 md:p-6 flex flex-col w-full  h-full">
            <div className=" w-full mx-auto">
                <div className="flex w-full justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold mb-1 justify-start flex ">Users</h1>
                        <p className="text-gray-600 mb-12">Keep track and manage users</p>
                    </div>
                    <Link href={'/seller/users'}>
                        <Button className="bg-[#1F058F] hover:bg-[#2e0a94] text-white px-8 py-2 rounded-full">Add Users</Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="mb-2 md:mb-3">
                    {/* Mobile - Horizontal Scroll */}
                    <div className="md:hidden flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                            <h3 className=" hover:text-white font-medium">Total Users</h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0</p>
                        </div>

                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                            <h3 className=" hover:text-white font-medium">Active Users</h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0</p>
                        </div>

                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                            <h3 className=" hover:text-white font-medium">Inactive Users</h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0</p>
                        </div>

                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                            <h3 className=" hover:text-white font-medium">Blocked Users </h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0</p>
                        </div>

                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                            <h3 className=" hover:text-white font-medium">Flag Users</h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0</p>
                        </div>
                    </div>

                    {/* Desktop - Grid */}
                    <div className="hidden md:grid grid-cols-5 gap-6 md:gap-8">
                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
                            <h3 className="  font-medium">Total Users</h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0</p>
                        </div>

                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
                            <h3 className=" hover:text-white font-medium">Active Users</h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0</p>
                        </div>

                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
                            <h3 className=" hover:text-white font-medium">Inactive Users</h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0</p>
                        </div>

                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
                            <h3 className=" hover:text-white font-medium">Blocked Users </h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0</p>
                        </div>

                        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
                            <h3 className=" hover:text-white font-medium">Flag Users</h3>
                            <p className="text-3xl font-bold hover:text-white mt-1">0</p>
                        </div>
                    </div>
                </div>

                <div className=" flex flex-col h-full  justify-center items-center">
                    <div className="mb-4 flex justify-center">
                        <Image
                            src={'/userr.png'}
                            width={80}
                            height={80}
                            alt="box"
                        />
                    </div>

                    <h2 className="text-xl font-semibold mb-2">No users</h2>
                    <p className="text-gray-500 mb-8">You currently have no user to display</p>
                </div>
            </div>
        </div>
    )
}

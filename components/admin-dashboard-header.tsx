"use client"

import Link from "next/link"
import { Bell, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

export default function DashboardHeader() {
    return (
        <header className="bg-white text-black shadow py-3 px-4 md:px-6 w-full sticky inset-0 z-[999]">
            <div className="flex items-center justify-between max-sm:justify-end">
                <div className="flex max-sm:hidden items-center gap-4 md:gap-8">
                    <Link href="/" className="flex items-center">
                        <div className=" p-2 rounded">
                            <Image
                                src={'/newlogo.jpg'}
                                alt='fixorshublogo'
                                width={101}
                                height={26}
                            />
                        </div>
                    </Link>
                </div>
                <div className="hidden md:flex flex-1 max-w-xl relative w-full">
                        <Input
                            type="text"
                            placeholder="Search"
                            className="w-full bg-white px-5 ps-10 text-black rounded-l-full rounded-r-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                          <Search size={16} color="#141414" className="absolute top-1/2 -translate-y-1/2 left-4" />
                        <Button className="bg-[#1F058F] hover:bg-[#3b0bc0] text-white rounded-l-none rounded-r-full">Search</Button>
                    </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-white">
                        <Bell className="h-5 w-5" />
                    </Button>

                    <div className="hidden md:flex items-center gap-2 px-3 py-1 border border-gray-600 rounded-full">
                        <div className="rounded-full">
                            <Image
                                src={'/dash.png'}
                                width={25}
                                height={25}
                                alt="dash"
                            />
                        </div>
                        <span className="text-sm">Basic plan</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border border-gray-600">
                            <AvatarImage src="/profile.png" alt="User" />
                            <AvatarFallback>JA</AvatarFallback>
                        </Avatar>
                        <div className="hidden md:block">
                            <div className="flex items-center">
                                <span className="text-sm font-medium">Jimoh Adesina</span>
                                <ChevronDown className="h-4 w-4 ml-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

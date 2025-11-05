

"use client"

import Link from "next/link"
import { Bell, ChevronDown, Search, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useGetAuthUser } from "@/lib/useGetAuthUser"
import { useGetSubscription } from "@/lib/useGetSubscription"
import LogoutModal from "./logout-modal"
import { useState } from "react"

export default function DashboardHeader() {
    // const { userData } = useSelector((state: RootState) => state.userData);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false)

    const {  data } = useGetAuthUser("User");
    const { subscriptionData } = useGetSubscription();
    const userData = data?.data.loggedInAccount

    console.log('disp', data)

    const handleLogoutClick = () => {
        setLogoutModalOpen(true)
    }

    const handleCloseLogoutModal = () => {
        setLogoutModalOpen(false)
    }
    return (
        <header className="bg-[#141414] text-white py-3 px-4 md:px-6 w-full sticky inset-0 z-[999]">
            <div className="flex items-center justify-between max-sm:justify-end">
                <div className="flex max-sm:hidden items-center gap-4 md:gap-8">
                    <Link href="/" className="flex items-center">
                        <div className=" p-2 rounded">
                            <Image
                                src={'/logofooter.jpg'}
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
                        <span className="text-sm">
                          {subscriptionData?.data?.subscription?.subscriptionPlanName || "Basic plan"}
                        </span>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
                            <Avatar className="h-8 w-8 border border-gray-600">
                                <AvatarImage src={ userData?.profilePicture ||"/profile.png"} alt="User" />
                                <AvatarFallback>JA</AvatarFallback>
                            </Avatar>
                            <div className="hidden md:block">
                                <div className="flex items-center">
                                    <span className="text-sm font-medium">{userData?.fullName}</span>
                                    <ChevronDown className="h-4 w-4 ml-1" />
                                </div>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48 mt-2">
                            <DropdownMenuItem onClick={handleLogoutClick} className="cursor-pointer">
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <LogoutModal open={logoutModalOpen} handleClose={handleCloseLogoutModal} />
        </header>
    )
}

"use client"

import React, { useState } from 'react'
import { CustomSidebarTrigger, SidebarTrigger } from './ui/cu-sidebar'
import Link from 'next/link'
import Image from 'next/image'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { useGetAuthUser } from '@/lib/useGetAuthUser'
import { LogOut } from 'lucide-react'
import LogoutModal from './logout-modal'

const BuyerHeader = () => {
    const [logoutModalOpen, setLogoutModalOpen] = useState(false)
    const {  data } = useGetAuthUser("User");
    const userData = data?.data.loggedInAccount

    const handleLogoutClick = () => {
        setLogoutModalOpen(true)
    }

    const handleCloseLogoutModal = () => {
        setLogoutModalOpen(false)
    }

    return (
        <>
            <header className=' flex items-center justify-between border-b px-3 py-2 bg-white sticky inset-0 z-[999]'>
                <div className='flex items-center gap-2'>
                    <SidebarTrigger className='hidden md:inline-flex' />
                    <h5 className='hidden text-2xl font-semibold md:block'>Buyer</h5>
                    <Link href='/'>
                        <Image
                            src={userData?.profilePicture || "/profile.png"}
                            alt='fixorshublogo'
                            width={36}
                            height={36}
                            className='md:hidden'
                        />

                    </Link>
                </div>
                <div className='hidden items-center gap-4 md:flex'>
                    <div className='flex items-center gap-1'>
                        <DropdownMenu >
                            <DropdownMenuTrigger className="flex  items-center gap-1 focus:outline-none">
                                <Image
                                    src={userData?.profilePicture || "/profile.png"}// Replace with actual image path
                                    width={30}
                                    height={30}
                                    alt="Profile"
                                    className="rounded-full"
                                />
                                <span className="text-sm font-medium">{userData?.fullName}</span>
                                {/* {openChev ? <ChevronUp size={16} /> : <ChevronDown size={16} />} */}
                                {/* <ChevronDown size={16} /> */}
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-48 mt-2">
                                {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                                {/* <DropdownMenuSeparator /> */}
                                {/* {navItems.map((item, id) => (
                        <DropdownMenuItem key={id}>
                          <Link href={item.link}>
                            {item.title}
                          </Link>
                        </DropdownMenuItem>
                      ))} */}
                                <DropdownMenuItem onClick={handleLogoutClick} className="cursor-pointer">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <CustomSidebarTrigger />
            </header>
            <LogoutModal open={logoutModalOpen} handleClose={handleCloseLogoutModal} />
        </>
    )
}

export default BuyerHeader
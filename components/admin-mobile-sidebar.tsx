"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, Home, Package, MessageSquare, Settings, LogOut, Crown, Puzzle, Database, List } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import LogoutModal from "./logout-modal"
import { useState } from "react"

interface MobileSidebarProps {
    isOpen: boolean
    onClose: () => void
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            {/* Mobile sidebar */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out pt-16 md:hidden",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <div className="absolute top-4 right-4">
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-7 w-7" />
                    </Button>
                </div>
                <div className="flex sm:hidden absolute top-4 left-4">
                    <Link href="/" className="flex items-center">
                        <div className="rounded">
                            <Image
                                src={'/newlogo.jpg'}
                                alt='fixorshublogo'
                                width={101}
                                height={26}
                            />
                        </div>
                    </Link>
                </div>
                <nav className="p-4 space-y-2 my-5">
                    <Link
                        href="/admin/dashboard"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:text-primary font-semibold text-black",
                            pathname.includes("/admin/dashboard") 
                                ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F] font-medium" : "text-gray-700 hover:bg-gray-100" 
                               
                        )}
                        onClick={onClose}
                    >
                        <Home className="h-5 w-5" />
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        href="/admin/listings"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:text-primary font-semibold text-black",
                            pathname.includes("/admin/listings") 
                                ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F] font-medium" : "text-gray-700 hover:bg-gray-100" 
                               
                        )}
                        onClick={onClose}
                    >
                        <List className="h-5 w-5" />
                        <span>Listings</span>
                    </Link>

                    <Link
                        href="/admin/categories"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:text-primary font-semibold text-black",
                            pathname.includes("/admin/categories") 
                                ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F] font-medium" : "text-gray-700 hover:bg-gray-100" 
                               
                        )}
                        onClick={onClose}
                    >
                        <Package className="h-5 w-5" />
                        <span>Categories</span>
                    </Link>

                    <Link
                        href="/admin/users"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:text-primary font-semibold text-black",
                            pathname.includes("/admin/users") 
                                ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F] font-medium" : "text-gray-700 hover:bg-gray-100" 
                               
                        )}
                        onClick={onClose}
                    >
                        <Package className="h-5 w-5" />
                        <span>Users</span>
                    </Link>

                    <Link
                        href="/admin/messages"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:text-primary font-semibold text-black",
                            pathname.includes("/admin/messages") 
                                ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F] font-medium" : "text-gray-700 hover:bg-gray-100" 
                               
                        )}
                        onClick={onClose}
                    >
                        <MessageSquare className="h-5 w-5" />
                        <span>Messages</span>
                    </Link>

                    <Link
                        href="/admin/subscriptions"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:text-primary font-semibold text-black",
                            pathname.includes("/admin/subscriptions") 
                                ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F] font-medium" : "text-gray-700 hover:bg-gray-100" 
                               
                        )}
                        onClick={onClose}
                    >
                        <Crown className="h-5 w-5" />
                        <span>Subscription Plans</span>
                    </Link>

                    <Link
                        href="/admin/addon-services"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:text-primary font-semibold text-black",
                            pathname.includes("/admin/addon-services") 
                                ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F] font-medium" : "text-gray-700 hover:bg-gray-100" 
                               
                        )}
                        onClick={onClose}
                    >
                        <Puzzle className="h-5 w-5" />
                        <span>Add-on Services</span>
                    </Link>

                    <Link
                        href="/admin/resources"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:text-primary font-semibold text-black",
                            pathname.includes("/admin/resources") 
                                ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F] font-medium" : "text-gray-700 hover:bg-gray-100" 
                               
                        )}
                        onClick={onClose}
                    >
                        <Database className="h-5 w-5" />
                        <span>Resources</span>
                    </Link>

                    {/* <Link
                        href="/admin/analytics"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:text-primary font-semibold text-black",
                            pathname.includes("/admin/analytics") 
                                ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F] font-medium" : "text-gray-700 hover:bg-gray-100" 
                               
                        )}
                        onClick={onClose}
                    >
                        <PieChart className="h-5 w-5" />
                        <span>Analytics</span>
                    </Link> */}

                    <Link
                        href="/admin/settings"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:text-primary font-semibold text-black",
                            pathname.includes("/admin/settings") 
                                ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F] font-medium" : "text-gray-700 hover:bg-gray-100" 
                               
                        )}
                        onClick={onClose}
                    >
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                    </Link>
                </nav>

                <div className="absolute bottom-8 w-full px-4">
                    <button
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
                        onClick={onClose}
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
            <LogoutModal open={open} handleClose={handleClose} />
            {/* Overlay */}
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose}></div>}
        </>
    )
}
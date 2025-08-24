"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, Home, Package, MessageSquare, PieChart, Settings, LogOut, CreditCard } from "lucide-react"

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
                        href="/seller/dashboard"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:text-primary font-semibold text-black",
                            pathname.includes("/seller/dashboard")
                                ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F] font-medium" : "text-gray-700 hover:bg-gray-100"

                        )}
                        onClick={onClose}
                    >
                        <Home className="h-5 w-5" />
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        href="/seller/request"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:text-primary font-semibold text-black",
                            pathname.includes("/seller/request")
                                ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F] font-medium" : "text-gray-700 hover:bg-gray-100"

                        )}
                        onClick={onClose}
                    >
                        <Package className="h-5 w-5" />
                        <span>Request</span>
                    </Link>

                    <Link
                        href="/seller/product"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:text-primary font-semibold text-black",
                            pathname.includes("/seller/product")
                                ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F] font-medium" : "text-gray-700 hover:bg-gray-100"

                        )}
                        onClick={onClose}
                    >
                        <Package className="h-5 w-5" />
                        <span>Product</span>
                    </Link>

                    <Link
                        href="/seller/subscription"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:text-primary font-semibold text-black",
                            pathname.includes("/seller/subscription")
                                ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F] font-medium" : "text-gray-700 hover:bg-gray-100"

                        )}
                        onClick={onClose}
                    >
                        <CreditCard className="h-5 w-5" />
                        <span>Subscription</span>
                    </Link>

                    <Link
                        href="/seller/messages"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:text-primary font-semibold text-black",
                            pathname.includes("/seller/messages")
                                ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F] font-medium" : "text-gray-700 hover:bg-gray-100"

                        )}
                        onClick={onClose}
                    >
                        <MessageSquare className="h-5 w-5" />
                        <span>Messages</span>
                    </Link>

                    <Link
                        href="/seller/analytics"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:text-primary font-semibold text-black",
                            pathname.includes("/seller/analytics")
                                ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F] font-medium" : "text-gray-700 hover:bg-gray-100"

                        )}
                        onClick={onClose}
                    >
                        <PieChart className="h-5 w-5" />
                        <span>Analytics</span>
                    </Link>

                    <Link
                        href="/seller/settings/profile"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:text-primary font-semibold text-black",
                            pathname.includes("/seller/settings")
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
                        onClick={() => setOpen(true)}
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </div>

                <LogoutModal open={open} handleClose={handleClose} />
            </div>
            {/* Overlay */}
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose}></div>}
        </>
    )
}
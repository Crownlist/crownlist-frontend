"use client"

import { useState } from "react"
import Link from "next/link"
import { X, Home, Package, MessageSquare, PieChart, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface MobileSidebarProps {
    isOpen: boolean
    onClose: () => void
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
    const [activeTab, setActiveTab] = useState("dashboard")

    const handleNavClick = (tab: string) => {
        setActiveTab(tab)
        onClose()
    }

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
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <div className="flex sm:hidden absolute top-4 left-4">
                        <Link href="/" className="flex items-center">
                            <div className="  rounded">
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
                        href="/dashboard"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                            activeTab === "dashboard" ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
                        )}
                        onClick={() => handleNavClick("dashboard")}
                    >
                        <Home className="h-5 w-5" />
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        href="/product"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                            activeTab === "product" ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
                        )}
                        onClick={() => handleNavClick("product")}
                    >
                        <Package className="h-5 w-5" />
                        <span>Product</span>
                    </Link>

                    <Link
                        href="/messages"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                            activeTab === "messages" ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
                        )}
                        onClick={() => handleNavClick("messages")}
                    >
                        <MessageSquare className="h-5 w-5" />
                        <span>Messages</span>
                    </Link>

                    <Link
                        href="/analytics"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                            activeTab === "analytics" ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
                        )}
                        onClick={() => handleNavClick("analytics")}
                    >
                        <PieChart className="h-5 w-5" />
                        <span>Analytics</span>
                    </Link>

                    <Link
                        href="/settings"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                            activeTab === "settings" ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
                        )}
                        onClick={() => handleNavClick("settings")}
                    >
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                    </Link>
                </nav>

                <div className="absolute bottom-8 w-full px-4">
                    <Link
                        href="/logout"
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                        onClick={onClose}
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </Link>
                </div>
            </div>

            {/* Overlay */}
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose}></div>}
        </>
    )
}


"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { MoreVertical, Send } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Message = {
    id: string
    content: string
    sender: string
    timestamp: string
    isUser?: boolean
}

type Conversation = {
    id: string
    name: string
    avatar: string
    lastMessage: string
    time: string
    isAdmin?: boolean
    isActive?: boolean
    unread?: boolean
}

export default function MessagingInterface() {
    // Update the initial active conversation to match the screenshot
    const [activeConversation, setActiveConversation] = useState("crownlist")
    const [messageInput, setMessageInput] = useState("")
    const [showMobileConversation, setShowMobileConversation] = useState(false)
    // Initialize with the first conversation's details
    const [activeConversationDetails, setActiveConversationDetails] = useState({
        name: "Crownlist Escrows",
        avatar: "/profile.png",
        isActive: false,
    })

    const conversations: Conversation[] = [
        {
            id: "crownlist",
            name: "Crownlist Escrows",
            avatar: "/profile.png",
            lastMessage: "Hey Olivia, Katherine sent me over the latest doc. I just have a quick question about the...",
            time: "5min ago",
            isAdmin: true,
            unread: true,
        },
        {
            id: "oyekings",
            name: "Oyekings properties",
            avatar: "/profile.png",
            lastMessage: "You: Sure thing, I'll have a look today. They're looking great!",
            time: "20min ago",
            isActive: true,
        },
        {
            id: "savannah",
            name: "Savannah Nguyen",
            avatar: "/profile.png",
            lastMessage: "I've just published the site again. Looks like it fixed it. How weird! I'll keep an eye on it...",
            time: "1hr ago",
            unread: true,
        },
    ]

    // Update the messages object to include empty conversations
 const messages: Record<string, Message[]> = {
        oyekings: [
            {
                id: "1",
                content: "No rush though — we still have to wait for Larry",
                sender: "Oyekings Properties",
                timestamp: "Thursday 11:44am",
            },
            {
                id: "2",
                content: "Hey Olivia, can you please review the latest design when you can?",
                sender: "Oyekings Properties",
                timestamp: "Today 11:44am",
            },
            {
                id: "3",
                content: "Hey Olivia, can you please review the latest design when you can?",
                sender: "Oyekings Properties",
                timestamp: "Today 11:44am",
            },
            {
                id: "4",
                content: "Hey Olivia, can you please review the latest design when you can?",
                sender: "Oyekings Properties",
                timestamp: "Today 11:44am",
            },
            {
                id: "5",
                content: "Sure thing, I'll have a look today. They're looking great!",
                sender: "You",
                timestamp: "Just now",
                isUser: true,
            },
            {
                id: "6",
                content: "...",
                sender: "Oyekings Properties",
                timestamp: "Just now",
            },
        ],
        crownlist: [], // Empty conversation
        savannah: [], // Empty conversation
    }

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            // In a real app, you would add the message to the messages array
            // and send it to the server
            setMessageInput("")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handleConversationClick = (id: string) => {
        setActiveConversation(id)
        setShowMobileConversation(true)

        // Get the conversation details for the header
        const selectedConversation = conversations.find((conv) => conv.id === id)
        if (selectedConversation) {
            setActiveConversationDetails({
                name: selectedConversation.name,
                avatar: selectedConversation.avatar,
                isActive: selectedConversation.isActive || false,
            })
        }
    }

    const handleBackToList = () => {
        setShowMobileConversation(false)
    }

    return (
        <div className="flex w-full max-h-[calc(100dvh-150px)] md:max-h-[calc(100dvh-110px)] overflow-hidden  mx-auto bg-white shadow-sm">
            {/* Conversation List - hidden on mobile when conversation is active */}
            <div
                className={cn(
                    " border-r w-full lg:w-[360px] border-gray-200 flex flex-col",
                    showMobileConversation ? "hidden lg:flex" : "flex",
                )}
            >
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-semibold">Messages</h1>
                </div>
                <div className=" overflow-y-auto ">
                    {conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            className={cn(
                                "flex items-start p-4 hover:bg-gray-50 cursor-pointer relative w-[]",
                                conversation.unread &&
                                "before:absolute before:left-1 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-black before:rounded-full",
                            )}
                            onClick={() => handleConversationClick(conversation.id)}
                        >
                            <div className="relative mr-3">
                                <Image
                                    src={conversation.avatar || "/placeholder.svg"}
                                    alt={conversation.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                {conversation.isActive && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center">
                                        <h3 className="font-medium text-sm truncate">{conversation.name}</h3>
                                        {conversation.isAdmin && (
                                            <span className="ml-2 px-2 py-0.5 text-xs bg-black text-white rounded-full">Admin</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500">{conversation.time}</span>
                                </div>
                                <p className="text-sm text-gray-600 ">{conversation.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Conversation Detail - shown on mobile when conversation is active */}
            <div className={cn("flex-1 flex flex-col", !showMobileConversation ? "hidden lg:flex" : "flex")}>
                {activeConversation && (
                    <>
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <div className="flex items-center">
                                {showMobileConversation && (
                                    <button className="mr-2 lg:hidden text-gray-500" onClick={handleBackToList}>
                                        &larr;
                                    </button>
                                )}
                                <div className="relative mr-3">
                                    <Image
                                        src={activeConversationDetails.avatar}
                                        alt={activeConversationDetails.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                    {activeConversationDetails.isActive && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="font-semibold">{activeConversationDetails.name}</h2>
                                    <div className="flex gap-2 items-center text-sm text-gray-500">
                                        <div className="flex flex-row items-center">
                                            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            081 0000 0000
                                        </div>
                                        <div className="flex flex-row items-center">
                                            <svg className="w-4 h-4 mx-1 max-sm:hidden" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span className="max-sm:hidden"> {activeConversationDetails.name.replace(/\s+/g, "")}@joelist.com.ng</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 rounded-full hover:bg-gray-100">
                                        <MoreVertical className="h-5 w-5 text-gray-500" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem>See profile</DropdownMenuItem>
                                    <DropdownMenuItem>Report</DropdownMenuItem>
                                    <DropdownMenuItem>Crownlist Escrow</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages[activeConversation]?.length > 0 ? (
                                messages[activeConversation].map((message) => (
                                    <div
                                        key={message.id}
                                        className={cn("flex flex-col max-w-[80%]", message.isUser ? "ml-auto items-end" : "mr-auto")}
                                    >
                                        {!message.isUser && (
                                            <div className="flex items-center mb-1">
                                                <Image
                                                    src="/profile.png"
                                                    alt="Oyekings Properties"
                                                    width={24}
                                                    height={24}
                                                    className="rounded-full mr-2"
                                                />
                                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                            </div>
                                        )}
                                        <div className={cn("p-3 rounded-lg", message.isUser ? "bg-black text-white" : "bg-gray-100")}>
                                            {message.content}
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1">{message.timestamp}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <div className="flex w-full justify-center mb-4">
                                        {/* <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="65" cy="40" r="35" fill="#FFC107" />
                                            <circle cx="35" cy="60" r="35" fill="#FFA000" />
                                            <path
                                                d="M65 50a5 5 0 110-10 5 5 0 010 10zM50 50a5 5 0 110-10 5 5 0 010 10zM35 50a5 5 0 110-10 5 5 0 010 10z"
                                                fill="white"
                                            />
                                        </svg> */}
                                        <Image
                                            src='/nomessage.png'
                                            width={98}
                                            height={98}
                                            alt='message'
                                            className="flex"
                                        />
                                    </div>
                                    <h3 className="text-xl font-medium mb-2">No message</h3>
                                    <p className="text-gray-500 text-center">You currently have no message to display</p>
                                </div>
                            )}
                            <div className="h-4"></div> {/* Extra space at the bottom */}
                        </div>

                        <div className="p-4 border-t border-gray-200">
                            <div className="flex items-center">
                                <Textarea
                                    placeholder="Send a message"
                                    className="flex-1 resize-none border-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    rows={1}
                                />
                                <Button
                                    variant="default"
                                    size="icon"
                                    className="ml-2 bg-[#1F058F] hover:bg-[#2a0bc0] h-10 w-10"
                                    onClick={handleSendMessage}
                                >
                                    <Send className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

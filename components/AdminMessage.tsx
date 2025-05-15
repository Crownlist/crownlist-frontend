"use client"

import { useState } from "react"
import Image from "next/image"
import { MoreVertical, Phone, Mail } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  isActive?: boolean
  unread?: boolean
}

export default function AdminMessage() {
  const [activeTab, setActiveTab] = useState("report")
  const [activeConversation, setActiveConversation] = useState("oyekings")
  const [messageInput, setMessageInput] = useState("")

  // Conversation data
  const conversations: Conversation[] = [
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
      isActive: true,
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

  const handleConversationClick = (id: string) => {
    setActiveConversation(id)
  }

  return (
    <div className="flex w-full max-h-[calc(100dvh-150px)] md:max-h-[calc(100dvh-110px)] overflow-hidden  mx-auto bg-white shadow-sm">
      {/* Left sidebar - Conversations */}
      <div className="w-full md:w-[360px] border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Tabs defaultValue="messages" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-[#f0eeff] p-1 rounded-full w-full h-auto">
              <TabsTrigger
                value="messages"
                className="rounded-full px-6 py-2 flex-1 data-[state=active]:bg-white data-[state=active]:text-[#1a0066] data-[state=active]:shadow-sm"
              >
                Messages
              </TabsTrigger>
              <TabsTrigger
                value="report"
                className="rounded-full px-6 py-2 flex-1 data-[state=active]:bg-white data-[state=active]:text-[#1a0066] data-[state=active]:shadow-sm"
              >
                Report
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                "flex items-start p-4 hover:bg-gray-50 cursor-pointer relative",
                activeConversation === conversation.id && "bg-gray-50",
                conversation.unread &&
                "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-black before:rounded-full",
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
                  <h3 className="font-medium text-sm truncate">{conversation.name}</h3>
                  <span className="text-xs text-gray-500">{conversation.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Message content or Report */}
      <div className="hidden md:flex flex-1 flex-col">
        {activeTab === "messages" ? (
          <>
            {/* Message header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="relative mr-3">
                  <Image
                    src="/profile.png"
                    alt="Oyekings Properties"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h2 className="font-semibold">Oyekings Properties</h2>
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="w-4 h-4 mr-1" />
                    081 0000 0000
                    <Mail className="w-4 h-4 mx-1 ml-2" />
                    Oyekings@joelist.com.ng
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
                  <DropdownMenuItem>Resolved</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Message content would go here */}
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
            {/* Message input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-end">
                <Textarea
                  placeholder="Send a message"
                  className="flex-1 resize-none border-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  rows={1}
                />
                <Button variant="default" size="icon" className="ml-2 bg-black hover:bg-gray-800 h-10 w-10">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Report header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="relative mr-3">
                  <Image
                    src="/profile.png"
                    alt="Oyekings Properties"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h2 className="font-semibold">Oyekings Properties</h2>
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="w-4 h-4 mr-1" />
                    081 0000 0000
                    <Mail className="w-4 h-4 mx-1 ml-2" />
                    Oyekings@joelist.com.ng
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
                  <DropdownMenuItem>Resolved</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Empty report state */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className=" text-amber-400">
                <Image src={'/nomessage.png'} alt="img" width={40} height={40} className="object-cover" />
              </div>
              <h3 className="text-xl font-medium mb-2">No report</h3>
              <p className="text-gray-500">You currently have no report to display</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

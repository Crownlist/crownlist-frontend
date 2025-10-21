/* eslint-disable */
"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { MoreVertical, Send } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useChat } from "@/notifications/chat-context"
import { useSocket } from "@/hooks/useSocket"
import { Conversation, Message, SendMessagePayload, ReceiveMessageEvent, SentMessageEvent, UpdateChatListEvent, NotificationEvent } from "@/types/chat"
import { toast } from "sonner"
import { obfuscateToken } from "@/constants/encryptData"
import { fetchUserChats } from "@/lib/chat-api"
import { playMessageSound } from "@/lib/notification-sound"
import EmojiPicker from "./EmojiPicker"

// Get auth token - replace this with your actual auth implementation
const getAuthToken = (): string | null => {
    // First try user token (leoKey)
    if (typeof window !== 'undefined') {
        try {
            const userToken = localStorage.getItem("leoKey");
            if (userToken) {
                return obfuscateToken(false, userToken as string);
            }

            // Try admin token (orionKey)
            const adminToken = localStorage.getItem("orionKey");
            if (adminToken) {
                return obfuscateToken(false, adminToken as string);
            }

            // Debug: Log what auth state we have
            console.log('🔍 Token debug:', {
                hasLeoKey: !!localStorage.getItem("leoKey"),
                hasOrionKey: !!localStorage.getItem("orionKey"),
                allKeys: Object.keys(localStorage).filter(key =>
                    ['leoKey', 'orionKey', 'leo', 'leojwt'].includes(key)
                )
            });
        } catch (error) {
            console.error("❌ Error getting auth token:", error);
        }
    }
    return null;
};

export default function MessagingInterface() {
    const [messageInput, setMessageInput] = useState("")
    const [showMobileConversation, setShowMobileConversation] = useState(false)
    const [userProfile, setUserProfile] = useState<{id: string; name: string} | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const searchParams = useSearchParams()

    const { state, actions } = useChat()
    const authToken = getAuthToken()
    const { isConnected, sendMessage, on, off } = useSocket(authToken || undefined)

    // Loading state for initial conversations fetch
    const [isConversationsLoading, setIsConversationsLoading] = useState(true)

    // Simulate initial data loading (replace with real API call later)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsConversationsLoading(false);
        }, 1500); // Show loading for 1.5 seconds to demonstrate

        return () => clearTimeout(timer);
    }, []);

    // Load conversations from API on mount
    useEffect(() => {
        if (userProfile?.id) {
            console.log('🔄 Loading conversations for user:', userProfile.id);

            // Set loading state
            setIsConversationsLoading(true);

            // Load conversations from API
            fetchUserChats().then((conversations: any[]) => {
                console.log('✅ Loaded conversations from API:', conversations.length, 'items');

                // Add conversations to state - this will populate the chat list
                conversations.forEach((conv: any) => {
                    actions.addConversation(conv);
                });

                // Update loading state after processing all conversations
                setTimeout(() => {
                    setIsConversationsLoading(false);
                    console.log('🎉 Finished loading conversations. Current state:', state.conversations);
                }, 500);
            })
            .catch((error: any) => {
                console.error('❌ Failed to load conversations:', error);
                setIsConversationsLoading(false);
            });
        }
    }, [userProfile?.id, actions, state.conversations.length]);

    // Auto-load messages for active conversation if conversation exists but no messages
    useEffect(() => {
        if (state.activeConversationId && userProfile?.id) {
            const existingMessages = state.messages[state.activeConversationId] || [];
            console.log(`🔍 Checking messages for active conversation ${state.activeConversationId}:`, existingMessages.length, 'messages');

            // If we have a conversation but no messages, try loading from API
            if (existingMessages.length === 0) {
                console.log('📨 Auto-loading messages for active conversation:', state.activeConversationId);

                import('@/lib/chat-api').then(({ fetchChatMessages }) => {
                    fetchChatMessages(state.activeConversationId!).then((response) => {
                        console.log('📨 Auto-loaded messages for active conversation:', response.messages?.length, 'messages');

                        if (response.messages && response.messages.length > 0) {
                            // **MERGE: Always merge, never replace messages**
                            const mergedMessages = [...existingMessages]; // Start with existing (usually empty)
                            let addedCount = 0;

                            // Add any new messages that aren't already in local state
                            response.messages.forEach((msg: any) => {
                                const messageExists = existingMessages.find(m => m.id === msg.id);
                                if (!messageExists) {
                                    // Transform API message to our Message interface
                                    const transformedMessage = {
                                        id: msg.id,
                                        content: msg.content,
                                        sender: msg.sender,
                                        senderId: msg.sender,
                                        recipientId: msg.recipientId || '',
                                        timestamp: msg.createdAt,
                                        createdAt: msg.createdAt,
                                        isRead: msg.isRead || false,
                                        isUser: msg.sender === userProfile.id, // **Proper isUser detection**
                                        chat_id: msg.chat_id || state.activeConversationId,
                                    };
                                    mergedMessages.push(transformedMessage);
                                    addedCount++;
                                }
                            });

                            console.log('🔄 Auto-merged messages - Added:', addedCount, 'Total after merge:', mergedMessages.length);

                            // Sort by timestamp
                            mergedMessages.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

                            // Set merged messages for this conversation
                            actions.setMessages(state.activeConversationId!, mergedMessages);
                            console.log('✅ Auto-loaded and merged messages for conversation:', state.activeConversationId!, mergedMessages.length, 'messages');
                        }
                    }).catch((error) => {
                        console.error('❌ Failed to auto-load messages for conversation:', state.activeConversationId, error);
                        // Don't clear existing messages on error - keep what we have
                    });
                });
            }
        }
    }, [state.activeConversationId, userProfile?.id, state.messages, actions]);

    // Get user info from auth system
    useEffect(() => {
        // Replace this with your actual user fetching logic
        if (typeof window !== 'undefined') {
            const userId = localStorage.getItem("leo");
            const userName = localStorage.getItem("leoName") || "You"; // Try to get name too

            // 🔍 DEBUG: Log all relevant localStorage keys
            const debugLocalStorage = {
                leo: localStorage.getItem("leo"),
                leoName: localStorage.getItem("leoName"),
                leojwt: localStorage.getItem("leojwt"),
                orionKey: localStorage.getItem("orionKey"),
                leoKey: localStorage.getItem("leoKey"),
            };
            console.log('🔍 localStorage debug for user profile:', debugLocalStorage);

            if (userId) {
                console.log('👤 Setting user profile:', { id: userId, name: userName, idType: typeof userId });
                setUserProfile({ id: userId, name: userName });
            } else {
                console.log('❌ No user ID found in localStorage');
            }
        }
    }, []);

    // Handle auto-conversation creation from product page
    useEffect(() => {
        const sellerId = searchParams.get('sellerId');
        const sellerName = searchParams.get('sellerName');
        const sellerAvatar = searchParams.get('sellerAvatar');

        if (sellerId && sellerName && userProfile && !isConversationsLoading) {
            // Check if conversation already exists
            const existingConversation = state.conversations.find(
                conv => conv.recipientId === sellerId
            );

            console.log('🔍 Auto-conversation check:', {
                sellerId,
                sellerName,
                existingConversation: !!existingConversation,
                currentConversationsCount: state.conversations.length,
                currentActiveConv: state.activeConversationId
            });

            if (!existingConversation) {
                // 🔥 STEP 1: Create chat via REST API first
                console.log('📡 Creating chat via backend API:', [userProfile.id, sellerId]);

                import('@/lib/chat-api').then(({ createChat }) => {
                    createChat([userProfile.id, sellerId])
                        .then((chatResult) => {
                            console.log('✅ Backend chat created:', chatResult);

                            const newConversation: Conversation = {
                                id: chatResult.chatId, // Use real backend ID
                                recipientId: sellerId,
                                name: sellerName,
                                avatar: sellerAvatar || "/profile.png",
                                lastMessage: "Start a conversation about this product...",
                                time: "just now",
                                onlineStatus: true,
                                isAdmin: false,
                            };

                            console.log('🏗️ Adding conversation with backend ID:', newConversation);
                            actions.addConversation(newConversation);

                            // Use setTimeout to ensure state updates happen after current render cycle
                            setTimeout(() => {
                                console.log('🔄 Setting active conversation for local chat:', newConversation.id);

                                actions.setActiveConversation(newConversation.id);
                                console.log('✅ Active conversation set to:', newConversation.id);

                                setShowMobileConversation((window as any).innerWidth < 1024);

                                console.log('✅ Auto-created and activated conversation with seller:', sellerName, {
                                    conversationId: newConversation.id,
                                });

                                // Clear URL params after setting up conversation
                                if (typeof window !== 'undefined') {
                                    const url = new URL(window.location.href);
                                    url.searchParams.delete('sellerId');
                                    url.searchParams.delete('sellerName');
                                    url.searchParams.delete('sellerAvatar');
                                    url.searchParams.delete('productId');
                                    url.searchParams.delete('productName');
                                    window.history.replaceState({}, '', url.pathname + url.search);
                                }
                            }, 10);
                        })
                        .catch((createChatError: any) => {
                            console.error('❌ Failed to create chat via API:', createChatError);
                            // Fall back to local creation
                            console.log('🔄 Falling back to local conversation creation');

                            const newConversation: Conversation = {
                                id: `local_${userProfile.id}_${sellerId}_${Date.now()}`,
                                recipientId: sellerId,
                                name: sellerName,
                                avatar: sellerAvatar || "/profile.png",
                                lastMessage: "Start a conversation about this product...",
                                time: "just now",
                                onlineStatus: true,
                                isAdmin: false,
                            };

                            console.log('🏗️ Adding local conversation due to API failure:', newConversation);
                            actions.addConversation(newConversation);

                            setTimeout(() => {
                                actions.setActiveConversation(newConversation.id);
                                setShowMobileConversation((window as any).innerWidth < 1024);

                                if (typeof window !== 'undefined') {
                                    const url = new URL(window.location.href);
                                    url.searchParams.delete('sellerId');
                                    url.searchParams.delete('sellerName');
                                    url.searchParams.delete('sellerAvatar');
                                    url.searchParams.delete('productId');
                                    url.searchParams.delete('productName');
                                    window.history.replaceState({}, '', url.pathname + url.search);
                                }
                            }, 10);
                        });
                }).catch((importError) => {
                    console.error('❌ Failed to import createChat:', importError);
                });
            } else {
                // Conversation exists, just switch to it
                console.log('🔄 Using existing conversation:', existingConversation.id);
                actions.setActiveConversation(existingConversation.id);
                setShowMobileConversation(window.innerWidth < 1024);

                console.log('✅ Switched to existing conversation with seller:', sellerName, {
                    conversationId: existingConversation.id,
                    currentActive: state.activeConversationId
                });
            }
        }
    }, [searchParams, userProfile, isConversationsLoading, state.conversations, actions]);

    // Socket event listeners - use useCallback to prevent duplicate listener creation
    const handleReceiveMessage = useCallback((data: ReceiveMessageEvent) => {
        console.log("📨 Received message in chat component:", data, "userProfile:", userProfile);

        // **🔥 CRITICIAL FIX: Use real backend chat_id if available, otherwise use active conversation**
        let chatIdForMessage = data.chat_id;
        if (!chatIdForMessage && state.activeConversation?.id) {
            chatIdForMessage = state.activeConversation.id;
            console.log("⚠️ No chat_id in message, using active conversation:", chatIdForMessage);
        }

        const message: Message = {
            ...data,
            id: `received_${Date.now()}_${Math.random()}_${data.sender}_${data.createdAt}`,
            senderId: data.sender,
            recipientId: userProfile?.id || "",
            timestamp: new Date(data.createdAt).toISOString(),
            createdAt: new Date(data.createdAt).toISOString(),
            chat_id: chatIdForMessage, // **FORCE the chat_id for proper conversation identification**
            sender: data.senderName || data.sender, // **FIX: Use senderName if available, fallback to sender ID**
            isUser: data.sender === userProfile?.id, // **FIX: Proper isUser detection for received messages**
            isRead: data.isRead,
        };

        console.log("🔄 Adding received message to state:", {
            message,
            isUser: message.isUser,
            currentActiveConversation: state.activeConversationId,
            conversations: state.conversations.map(c => c.id)
        });

        actions.receiveMessage(message);
        // Update chat list - for received messages, the 'user' field should be the other participant in the conversation
        actions.updateChatList({
            user: message.isUser ? message.recipientId : data.sender,
            lastMessage: data.content,
            timestamp: new Date(data.createdAt),
            onlineStatus: true,
        });

        // Play notification sound for incoming messages (only if not active chat tab)
        if (typeof window !== 'undefined' && document.hidden) {
            playMessageSound();
        }
    }, [userProfile?.id, state.activeConversation?.id, state.conversations, actions]);

    const handleSentMessage = useCallback((data: SentMessageEvent) => {
        console.log("📤 Sent message confirmation:", data);
        const message: Message = {
            ...data,
            id: `sent_${Date.now()}_${Math.random()}`,
            senderId: userProfile?.id || "",
            recipientId: data.sender, // The recipient
            timestamp: new Date(data.createdAt).toISOString(),
            createdAt: new Date(data.createdAt).toISOString(),
            isUser: true,
            isRead: data.isRead,
        };
        actions.sentMessage(message);
    }, [userProfile?.id, actions]);

    const handleUpdateChatList = useCallback((data: UpdateChatListEvent) => {
        console.log("🔄 Chat list update:", data);
        actions.updateChatList(data);
    }, [actions]);

    const handleNotification = useCallback((data: NotificationEvent) => {
        console.log("🔔 Notification:", data);
        actions.handleNotification(data);
        // Show toast for new messages if not in active conversation
        if (!showMobileConversation) {
            toast.info(data.title, {
                description: data.content,
                duration: 4000,
            });
        }
    }, [showMobileConversation, actions]);

    useEffect(() => {
        if (isConnected) {
            // Clean up any existing listeners first
            off('receiveMessage');
            off('sentMessage');
            off('updateChatList');
            off('notification');

            // Add new listeners
            on('receiveMessage', handleReceiveMessage);
            on('sentMessage', handleSentMessage);
            on('updateChatList', handleUpdateChatList);
            on('notification', handleNotification);
        }

        return () => {
            // Clean up listeners when component unmounts or dependencies change
            if (isConnected) {
                off('receiveMessage');
                off('sentMessage');
                off('updateChatList');
                off('notification');
            }
        };
    }, [isConnected, on, off, handleReceiveMessage, handleSentMessage, handleUpdateChatList, handleNotification]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [state.messages, state.activeConversationId]);

    const handleSendMessage = () => {
        const currentConv = state.conversations.find(conv => conv.id === state.activeConversationId);

        // Debug logging
        // console.log('📝 Attempting to send message:', {
        //     hasMessageInput: !!messageInput.trim(),
        //     currentConvId: state.activeConversationId,
        //     foundConversation: !!currentConv,
        //     hasUserProfile: !!userProfile,
        //     isConnected: isConnected,
        //     userProfile
        // });

        if (messageInput.trim() && currentConv && userProfile) {
            const payload: SendMessagePayload = {
                from: userProfile.id,
                to: currentConv.recipientId,
                content: messageInput.trim(), // 🔧 FIXED: Backend expects "content" not "message"
                senderName: userProfile.name || "You",
                chat_id: currentConv.id,
            };

            // console.log('📤 Sending message payload:', payload);

            try {
                sendMessage(payload);
                const optimisticMessage: Message = {
                    id: `optimistic_${Date.now()}`,
                    content: messageInput.trim(),
                    sender: userProfile.name || "You",
                    senderId: userProfile.id,
                    recipientId: currentConv.recipientId,
                    timestamp: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    isRead: false,
                    isUser: true,
                    chat_id: currentConv.id,
                };
                actions.sentMessage(optimisticMessage);
                setMessageInput("");
                console.log('✅ Message sent successfully');
            } catch (error) {
                console.error("❌ Failed to send message:", error);
                toast.error("Failed to send message. Please try again.");
            }
        } else {
            console.log('❌ Cannot send message - missing requirements:', {
                messageInput: messageInput.trim(),
                conversationId: state.activeConversationId,
                conversation: !!currentConv,
                userProfile: !!userProfile
            });
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handleConversationClick = (id: string) => {
        console.log('🖱️ Clicking conversation:', id, 'Available conversations:', state.conversations.map(c => c.id));
        actions.setActiveConversation(id);
        console.log('🔄 After setActiveConversation, activeConversationId:', state.activeConversationId);
        setShowMobileConversation(true);

        // Only try to load messages from API if we have a REAL chat ID (not a local_ prefix)
        console.log('🔧 Checking conversation ID type for:', id);
        if (id.startsWith('local_')) {
            console.log('⚠️ Local conversation clicked - no API call needed');
            // For local conversations, just keep existing messages (optimistic updates)
        } else {
            console.log('🔧 Real chat ID - loading messages from API for:', id);
            console.log('🔧 FetchChatMessages STARTING for ID:', id);

        import('@/lib/chat-api').then(({ fetchChatMessages }) => {
            console.log('🔧 Imported fetchChatMessages function successfully');

            fetchChatMessages(id)
                .then((response) => {
                    // Add loaded messages to state
                    if (response.messages && response.messages.length > 0) {
                        // **FIX: Always merge messages, never replace!**
                        const existingMessages = state.messages[id] || [];
                  
                        const mergedMessages = [...existingMessages]; // Start with existing
                        let addedCount = 0;

                        // Add any new messages that aren't already in local state
                        response.messages.forEach((msg: any) => {
                            const messageExists = existingMessages.find(m => m.id === msg.id);
                            if (!messageExists) {
                                // Transform API message to our Message interface
                                const transformedMessage = {
                                    id: msg.id,
                                    content: msg.content,
                                    sender: msg.sender, // This might need to be resolved to a name
                                    senderId: msg.sender,
                                    recipientId: msg.recipientId || '',
                                    timestamp: msg.createdAt,
                                    createdAt: msg.createdAt,
                                    isRead: msg.isRead || false,
                                    isUser: msg.sender === userProfile?.id, // **FIX: Proper isUser detection**
                                    chat_id: msg.chat_id || id,
                                };
                                mergedMessages.push(transformedMessage);
                                addedCount++;
                            }
                        });

                        console.log('🔄 Merged messages - Added:', addedCount, 'Total after merge:', mergedMessages.length);

                        // Sort by timestamp to maintain order
                        mergedMessages.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

                        // Set merged messages for this conversation
                        actions.setMessages(id, mergedMessages);
                        console.log('✅ Messages merged successfully for conversation:', id, mergedMessages.length, 'total messages');
                    } else {
                        console.log('ℹ️ No messages to load from API for conversation:', id);
                    }
                })
                .catch((error: any) => {
                    console.error('❌ API CALL FAILED:', error);
                    console.error('❌ Error details:', {
                        message: error.message,
                        response: error.response?.data,
                        status: error.response?.status,
                        url: error.config?.url
                    });
                });
        }).catch((importError) => {
            console.error('❌ FAILED TO IMPORT fetchChatMessages:', importError);
        });
        }  // Close the else block

        // Mark messages as read when opening conversation
        const messages = state.messages[id] || [];
        const unreadCount = state.unreadCounts[id] || 0;
        if (unreadCount > 0) {
            actions.markMessagesRead(id, messages.slice(-unreadCount).map(m => m.id));
        }
    }

    const handleBackToList = () => {
        setShowMobileConversation(false);
        actions.setActiveConversation(null);
    }

    // Get current conversation messages - FIX: Use activeConversationId as key, not "conversations"
let currentMessages: Message[] = [];

    // METHOD 1: Try using activeConversation.id (this is populated)
    if (state.activeConversation?.id) {
        console.log("  🔧 FIX: Using activeConversation.id:", state.activeConversation.id)
        currentMessages = state.messages[state.activeConversation.id] || [];
        console.log("  🔧 Found messages with activeConversation.id:", currentMessages.length, "messages")
    }

    // FALLBACK: Try activeConversationId as key
    if (currentMessages.length === 0 && state.activeConversationId) {
        // console.log("  🔧 FALLBACK: Using activeConversationId:", state.activeConversationId)
        currentMessages = state.messages[state.activeConversationId] || [];
        // console.log("  🔧 Found messages with activeConversationId:", currentMessages.length, "messages")
    }

    // LAST RESORT: If still no messages but we have an active conversation, try finding by recipient
    if (currentMessages.length === 0 && state.activeConversation?.recipientId) {
        // console.log("  - LAST RESORT: Looking for messages with recipient:", state.activeConversation.recipientId)
        const messageKeys = Object.keys(state.messages);
        const potentialKey = messageKeys.find(key => key.includes(state.activeConversation!.recipientId));
        if (potentialKey) {
            // console.log("  - Found potential key:", potentialKey)
            currentMessages = state.messages[potentialKey] || [];
            // console.log("  - Got messages from potential key:", currentMessages.length)
            // console.log("  - currentMessages:", currentMessages)
        }
    }
    // Force find the active conversation from state
    const activeConv = state.conversations.find(conv => conv.id === state.activeConversationId);
    // console.log('🎯 UI Render Debug:', {
    //     activeConversationId: state.activeConversationId,
    //     activeConversationObject: !!state.activeConversation,
    //     foundConversation: !!activeConv,
    //     conversationsCount: state.conversations.length,
    //     activeConvName: activeConv?.name,
    //     showMobileConversation
    // });

    return (
        <div className="flex w-full max-h-[calc(100dvh-5px)] md:max-h-[calc(100dvh-110px)] overflow-hidden  sm:mx-auto bg-white shadow-sm">
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
                    {isConversationsLoading ? (
                        <div className="flex flex-col space-y-4 p-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div key={index} className="flex items-start p-4 animate-pulse">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                                        </div>
                                        <div className="h-3 bg-gray-200 rounded w-full max-w-xs"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : state.conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-12 px-4">
                            <div className="flex w-full justify-center mb-4">
                                <Image
                                    src="/nomessage.png"
                                    width={64}
                                    height={64}
                                    alt="no conversations"
                                    className="opacity-50"
                                />
                            </div>
                            <h3 className="text-lg font-medium mb-2 text-gray-700">
                                No conversations yet ({isConversationsLoading ? 'Loading...' : 'Empty'})
                            </h3>
                            <p className="text-gray-500 text-center text-sm">
                                Loading: {isConversationsLoading ? 'Yes' : 'No'} | 
                                Conversations: {state.conversations.length} | 
                                API Call: {userProfile?.id ? '✅' : '❌'}
                            </p>
                        </div>
                    ) : (
                        state.conversations.map((conversation: Conversation) => (
                            <div
                                key={conversation.id}
                                className={cn(
                                    "flex items-start p-4 hover:bg-gray-50 cursor-pointer relative w-[]",
                                    state.unreadCounts[conversation.id] &&
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
                                    {conversation.onlineStatus && (
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
                                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Conversation Detail - shown on mobile when conversation is active */}
            <div className={cn("flex-1 flex flex-col", !showMobileConversation ? "hidden lg:flex" : "flex")}>
                {/* Force render active conversation even if state.activeConversation is undefined */}
                {(state.activeConversation || activeConv) && (
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
                                        src={(state.activeConversation || activeConv)?.avatar || "/profile.png"}
                                        alt={(state.activeConversation || activeConv)?.name || "Unknown"}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                    {(state.activeConversation || activeConv)?.onlineStatus && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="font-semibold">{(state.activeConversation || activeConv)?.name}</h2>
                                    {/* <div className="flex gap-2 items-center text-sm text-gray-500">
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
                                            <span className="max-sm:hidden"> {(state.activeConversation || activeConv)?.name?.replace(/\s+/g, "")}@joelist.com.ng</span>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 rounded-full hover:bg-gray-100">
                                        <MoreVertical className="h-5 w-5 text-gray-500" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    {/* <DropdownMenuItem>See profile</DropdownMenuItem>
                                    <DropdownMenuItem>Report</DropdownMenuItem> */}
                                    <DropdownMenuItem>Crownlist Escrow</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {currentMessages.length > 0 ?
                            (
                                currentMessages.map((message: Message) => {
                                    return (
                                        <div
                                            key={message.id}
                                            className={cn("flex max-w-[80%]", message.isUser ? "ml-auto justify-end" : "mr-auto justify-start")}
                                        >
                                            {/* {!message.isUser && (
                                                <div className="flex flex-col items-center mr-2 mt-1">
                                                    <Image
                                                        src="/avater.png"
                                                        alt={message.sender}
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full border-2 border-gray-200"
                                                    />
                                                </div>
                                            )} */}
                                            <div className="flex flex-col">
                                                {!message.isUser && (
                                                    <div className="flex items-center mb-1 ml-2">
                                                        <span className="text-xs font-medium text-gray-700 mr-2">{message.sender}</span>
                                                    </div>
                                                )}
                                                <div
                                                    className={cn(
                                                        "px-4 py-2 max-w-full break-words",
                                                        message.isUser
                                                            ? "bg-[#1F058F] text-white rounded-l-2xl rounded-tr-2xl rounded-br-md"
                                                            : "bg-gray-100 text-gray-800 rounded-r-2xl rounded-tl-2xl rounded-bl-md",
                                                        "shadow-sm"
                                                    )}
                                                >
                                                    <span className="text-sm leading-relaxed whitespace-pre-wrap">
                                                        {message.content}
                                                    </span>
                                                </div>
                                                <span className={cn("text-xs text-gray-500 mt-1", message.isUser ? "text-right mr-2" : "text-left ml-2")}>
                                                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
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
                                    <h3 className="text-xl font-medium mb-2">No messages</h3>
                                    <p className="text-gray-500 text-center">You currently have no messages to display</p>
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-4"></div>
                        </div>

                        <div className="p-2 sm:p-4 border-t border-gray-200">
                            <div className="flex items-end gap-2">
                                <EmojiPicker
                                    onEmojiSelect={(emoji) => setMessageInput(prev => prev + emoji)}
                                />
                                <Textarea
                                    placeholder="Send a message"
                                    className="flex-1 resize-none border-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[40px] max-h-[120px]"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    rows={1}
                                />
                                <Button
                                    variant="default"
                                    size="icon"
                                    className="bg-[#1F058F] hover:bg-[#2a0bc0] h-10 w-10 shrink-0"
                                    onClick={handleSendMessage}
                                    disabled={!messageInput.trim()}
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

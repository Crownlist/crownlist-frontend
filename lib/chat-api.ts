// Chat API utilities for fetching conversations and messages
// Updated to match the actual backend endpoints you provided
/* eslint-disable */
import { apiClientUser } from './interceptor';
import { Message, ConversationApiResponse, MessagesApiResponse } from '@/types/chat';

export interface FetchConversationsParams {
  userId: string;
  limit?: number;
  offset?: number;
}

export interface FetchMessagesParams {
  conversationId: string;
  limit?: number;
  offset?: number;
}

// API endpoints - Updated to match your actual endpoints
const CHAT_API_ENDPOINTS = {
  createChat: '/chats',           // POST /chats - Create new chat
  conversations: '/chats',        // GET /chats - Get all user chats
  chatById: '/chats',             // GET /chats/:chatId - Get chat by ID
  messages: '/chat/messages',
  markRead: '/chat/mark-read',
};

// Create a new chat with participants - matches your API
export const createChat = async (participants: string[]) => {
  console.log('🔍 DEBUG createChat - Input:', { participants });
  console.log('🔍 DEBUG createChat - API endpoint:', CHAT_API_ENDPOINTS.createChat);

  try {
    const response = await apiClientUser.post(CHAT_API_ENDPOINTS.createChat, {
      participants,
    });

    console.log('🔍 DEBUG createChat - Raw response:', response);
    console.log('🔍 DEBUG createChat - Response data:', response?.data);
    console.log('🔍 DEBUG createChat - Response data.data:', response?.data?.data);
    console.log('🔍 DEBUG createChat - Response data.data.data:', response?.data?.data?.data);

    const chatId = response?.data?.data?.data?._id;
    console.log('🔍 DEBUG createChat - Extracted chatId:', chatId);

    // Double check we have the chat ID
    if (!chatId) {
      console.error('❌ createChat - No chat ID found in response. Full response:', JSON.stringify(response?.data, null, 2));
      throw new Error('Chat ID not found in API response');
    }

    const result = {
      chatId: chatId,
      participants: response?.data?.data?.data?.participants,
      createdAt: response?.data?.data?.data?.createdAt,
    };

    console.log('✅ Chat created via API - Final result:', result);
    return result;
  } catch (error: any) {
    console.error('❌ Failed to create chat - Full error:', error);
    console.error('❌ Failed to create chat - Error response:', error?.response?.data);
    throw error;
  }
};

// Fetch user conversations - matches your API
export const fetchUserChats = async () => {
  try {
    const response = await apiClientUser.get(CHAT_API_ENDPOINTS.conversations);

    // Transform response to match ChatProvider expectations
    const chats = response?.data?.chats || [];

    const transformedChats = chats.map((chat: any) => ({
      id: chat.chat_id,
      recipientId: chat.user?._id,
      name: chat.user?.fullName || "Unknown User",
      avatar: chat.user?.profilePicture || "/profile.png",
      lastMessage: "Start a conversation",
      time: "Just now",
      onlineStatus: chat.onlineStatus || false,
      isAdmin: false,
      unreadCount: chat.unreadCount || 0,
    }));

    return transformedChats;
  } catch (error) {
    console.error('Failed to fetch user chats:', error);
    throw error;
  }
};

// Fetch messages for a conversation - matches your API
export const fetchChatMessages = async (chatId: string) => {
  try {
    const response = await apiClientUser.get(`${CHAT_API_ENDPOINTS.chatById}/${chatId}`);

    console.log('🔍 fetchChatMessages - Full response:', response);
    console.log('🔍 fetchChatMessages - response.data:', response?.data);
    console.log('🔍 fetchChatMessages - response.data.data:', response?.data?.data);

    // FIXED: Wrong response structure - it's response.data.chat, not response.data.data.chat
    const chatData = response?.data?.chat;

    console.log('🔍 fetchChatMessages - chatData:', chatData);
    console.log('🔍 fetchChatMessages - chatData.messages:', chatData?.messages);

    // Transform messages to match our Message interface
    const transformedMessages = (chatData?.messages || []).map((msg: any) => ({
      id: msg._id,
      content: msg.content,
      sender: msg.sender, // This will be a user ID, we'll need to resolve to name
      senderId: msg.sender,
      recipientId: '', // Will be filled by chat logic
      timestamp: msg.createdAt,
      createdAt: msg.createdAt,
      isRead: msg.isRead || false,
      isUser: false, // Will be determined by chat component
      chat_id: chatId,
    }));

    console.log('✅ Chat messages loaded:', chatId, transformedMessages.length, 'messages');
    return {
      messages: transformedMessages,
      chatId,
      participants: chatData?.participants || [],
    };
  } catch (error) {
    console.error('❌ Failed to fetch chat messages:', chatId, error);
    throw error;
  }
};

// Fetch messages for a conversation
export const fetchConversationMessages = async (
  params: FetchMessagesParams
): Promise<MessagesApiResponse> => {
  const response = await apiClientUser.get(CHAT_API_ENDPOINTS.messages, {
    params: {
      conversationId: params.conversationId,
      limit: params.limit || 50,
      offset: params.offset || 0,
    },
  });

  return {
    messages: response.data.messages || [],
    conversationId: params.conversationId,
    hasMore: response.data.hasMore || false,
  };
};

// Mark messages as read
export const markMessagesAsRead = async (
  conversationId: string,
  messageIds: string[]
): Promise<void> => {
  await apiClientUser.post(CHAT_API_ENDPOINTS.markRead, {
    conversationId,
    messageIds,
  });
};

// Send message (alternative to Socket.IO for cases where WebSocket is not available)
export const sendMessageAPI = async (
  from: string,
  to: string,
  message: string,
  chat_id?: string
): Promise<Message> => {
  const response = await apiClientUser.post('/chat/send', {
    from,
    to,
    message,
    chat_id,
  });

  return response.data.message;
};

// Helper function to check if user is online (used for initial conversation setup)
export const checkUserOnlineStatus = async (userId: string): Promise<boolean> => {
  try {
    const response = await apiClientUser.get(`/chat/user-online/${userId}`);
    return response.data.isOnline || false;
  } catch {
    return false;
  }
};

// Get unread message count for user
export const getUnreadMessageCount = async (): Promise<number> => {
  try {
    const response = await apiClientUser.get('/chat/unread-count');
    return response.data.unreadCount || 0;
  } catch {
    return 0;
  }
};

// Refresh JWT token if needed (fallback auth)
export const refreshChatAuth = async (): Promise<string> => {
  const response = await apiClientUser.post('/auth/refresh-token', {
    accountType: 'User',
  });

  return response.data.accessToken;
};

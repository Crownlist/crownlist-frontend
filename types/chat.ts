// Chat-related type definitions for Socket.IO integration

export interface Message {
  id: string;
  content: string;
  sender: string;
  senderId: string;
  recipientId: string;
  timestamp: string;
  createdAt: string;
  isRead: boolean;
  chat_id?: string;
  isUser?: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  isAdmin?: boolean;
  isActive?: boolean;
  unread?: boolean;
  onlineStatus?: boolean;
  recipientId: string;
  senderId?: string;
}

export interface ReceiveMessageEvent {
  sender: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  chat_id?: string;
  senderName?: string;
}

export interface SentMessageEvent {
  sender: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

export interface UpdateChatListEvent {
  user: string;
  lastMessage: string;
  timestamp: Date;
  onlineStatus?: boolean; // Keep for compatibility
  OnlineStatus?: boolean; // Handle backend capitalization
}

export interface NotificationEvent {
  userId: string;
  title: string;
  notificationType: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  chat_id?: string;
}

export interface SendMessagePayload {
  from: string;
  to: string;
  content: string; // 🔧 FIXED: Backend expects "content" not "message"
  senderName: string;
  chat_id?: string;
}

// Socket.IO event types
export type SocketEventType =
  | 'connect'
  | 'disconnect'
  | 'connect_error'
  | 'receiveMessage'
  | 'sentMessage'
  | 'updateChatList'
  | 'notification'
  | 'sendMessage';

export interface SocketState {
  isConnected: boolean;
  isConnecting: boolean;
  currentUserId: string | null;
  lastError: string | null;
}

// API types for initial data fetching
export interface ConversationApiResponse {
  conversations: Conversation[];
  userId: string;
}

export interface MessagesApiResponse {
  messages: Message[];
  conversationId: string;
  hasMore: boolean;
}

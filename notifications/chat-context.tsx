"use client"

import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import {
  Conversation,
  Message,
  ReceiveMessageEvent,
  UpdateChatListEvent,
  NotificationEvent,
  SentMessageEvent
} from '@/types/chat';

// Chat state interface
export interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activeConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  unreadCounts: Record<string, number>;
  onlineUsers: Set<string>;
  lastFetchTime: number;
  activeConversation: Conversation | null;
}

// Chat actions
export type ChatAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'SET_ACTIVE_CONVERSATION'; payload: string | null }
  | { type: 'ADD_CONVERSATION'; payload: Conversation }
  | { type: 'UPDATE_CONVERSATION'; payload: { id: string; updates: Partial<Conversation> } }
  | { type: 'SET_MESSAGES'; payload: { conversationId: string; messages: Message[] } }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'RECEIVE_MESSAGE'; payload: Message }
  | { type: 'SENT_MESSAGE'; payload: Message }
  | { type: 'UPDATE_CHATS_LIST'; payload: UpdateChatListEvent }
  | { type: 'HANDLE_NOTIFICATION'; payload: NotificationEvent }
  | { type: 'SET_ONLINE_STATUS'; payload: { userId: string; isOnline: boolean } }
  | { type: 'MARK_MESSAGES_READ'; payload: { conversationId: string; messageIds: string[] } }
  | { type: 'INCREMENT_UNREAD'; payload: string }
  | { type: 'DECREMENT_UNREAD'; payload: string };

// Persistence keys for localStorage
const CHAT_PERSISTENCE_KEY = 'crownlist_chat_state';

// Initial chat state
const initialState: ChatState = {
  conversations: [],
  messages: {},
  activeConversationId: null,
  activeConversation: null,
  isLoading: false,
  error: null,
  unreadCounts: {},
  onlineUsers: new Set(),
  lastFetchTime: 0,
};

// Helper function to load persisted chat state
function loadPersistedChatState(): Partial<ChatState> {
  try {
    const persisted = localStorage.getItem(CHAT_PERSISTENCE_KEY);
    if (persisted) {
      const parsedState = JSON.parse(persisted);

      // Convert onlineUsers back to Set
      if (parsedState.onlineUsers && Array.isArray(parsedState.onlineUsers)) {
        parsedState.onlineUsers = new Set(parsedState.onlineUsers);
      } else {
        parsedState.onlineUsers = new Set();
      }

      console.log('💾 Loaded persisted chat state:', parsedState);
      return parsedState;
    }
  } catch (error) {
    console.error('❌ Failed to load persisted chat state:', error);
  }
  return {};
}

// Helper function to persist chat state
function persistChatState(state: ChatState) {
  try {
    // Convert Set to array for JSON serialization
    const stateToPersist = {
      ...state,
      onlineUsers: Array.from(state.onlineUsers),
      // Don't persist loading and error states
      isLoading: false,
      error: null,
    };

    localStorage.setItem(CHAT_PERSISTENCE_KEY, JSON.stringify(stateToPersist));
  } catch (error) {
    console.error('❌ Failed to persist chat state:', error);
  }
}

// Chat reducer
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };

    case 'SET_ACTIVE_CONVERSATION':
      console.log("SET_ACTIVE_CONVERSATION", action.payload)
      const activeConversation = state.conversations.find(c => c.id === action.payload) || null;
      return {
        ...state,
        activeConversationId: action.payload,
        activeConversation: activeConversation
      };

    case 'ADD_CONVERSATION':
      console.log('📝 ADD_CONVERSATION:', action.payload);
      // Check if conversation already exists by recipientId to prevent duplicates
      const existingIndex = state.conversations.findIndex(c => c.recipientId === action.payload.recipientId);
      if (existingIndex >= 0) {
        console.log('🔄 UPDATING existing conversation at index:', existingIndex);
        const updatedConversations = [...state.conversations];
        updatedConversations[existingIndex] = action.payload;
        const newActiveConversation = action.payload.id === state.activeConversationId ? action.payload : state.activeConversation;
        return { ...state, conversations: updatedConversations, activeConversation: newActiveConversation };
      }
      console.log('➕ ADDING new conversation, total will be:', state.conversations.length + 1);
      const newConversations = [action.payload, ...state.conversations];
      const newActiveConv = action.payload.id === state.activeConversationId ? action.payload : state.activeConversation;
      return { ...state, conversations: newConversations, activeConversation: newActiveConv };

    case 'UPDATE_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === action.payload.id
            ? { ...conv, ...action.payload.updates }
            : conv
        ),
      };

    case 'SET_MESSAGES':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.conversationId]: action.payload.messages,
        },
      };

    case 'ADD_MESSAGE':
      const conversationId = getConversationIdFromMessage(action.payload);
      return {
        ...state,
        messages: {
          ...state.messages,
          [conversationId]: [...(state.messages[conversationId] || []), action.payload],
        },
      };

    case 'RECEIVE_MESSAGE':
      console.log("🔔 RECEIVE_MESSAGE triggered:", action.payload);
      console.log("🔔 Current activeConversationId:", state.activeConversationId);

      const receiveConvId = getConversationIdFromMessage(action.payload);
      console.log("🔔 Generated conversationId:", receiveConvId);
      console.log("🔔 Message chat_id field:", action.payload.chat_id);

      const updatedMessages = {
        ...state.messages,
        [receiveConvId]: [...(state.messages[receiveConvId] || []), action.payload],
      };

      const newUnreadCounts = { ...state.unreadCounts };
      if (state.activeConversationId !== receiveConvId) {
        console.log("🔔 Incrementing unread count for conversation:", receiveConvId);
        newUnreadCounts[receiveConvId] = (newUnreadCounts[receiveConvId] || 0) + 1;
      } else {
        console.log("🔔 Message is for active conversation, no unread increment");
      }

      console.log("🔔 Updated messages for", receiveConvId, ":", updatedMessages[receiveConvId]?.length, "messages");
      return {
        ...state,
        messages: updatedMessages,
        unreadCounts: newUnreadCounts,
      };

    case 'SENT_MESSAGE':
      const sentConvId = getConversationIdFromMessage(action.payload);
      return {
        ...state,
        messages: {
          ...state.messages,
          [sentConvId]: [...(state.messages[sentConvId] || []), action.payload],
        },
      };

    case 'UPDATE_CHATS_LIST':
      console.log('🔄 UPDATE_CHATS_LIST:', action.payload);
      // Handle case-insensitive field names from backend (OnlineStatus vs onlineStatus)
      const onlineStatus = action.payload.onlineStatus ?? action.payload.OnlineStatus ?? false;

      return {
        ...state,
        conversations: (() => {
          const updatedConversations = state.conversations.map(conv => {
            if (conv.recipientId === action.payload.user) {
              return {
                ...conv,
                lastMessage: action.payload.lastMessage,
                time: formatTimestamp(action.payload.timestamp),
                onlineStatus: onlineStatus,
              };
            }
            return conv;
          });

          // MOVE THE UPDATED CONVERSATION TO THE TOP OF THE LIST
          const updatedConvIndex = updatedConversations.findIndex(conv => conv.recipientId === action.payload.user);
          if (updatedConvIndex > 0) {
            const [updatedConv] = updatedConversations.splice(updatedConvIndex, 1);
            updatedConversations.unshift(updatedConv);
            console.log('🔝 Moved conversation to top of list:', updatedConv.name);
          }

          return updatedConversations;
        })(),
      };

    case 'HANDLE_NOTIFICATION':
      // Mark as unread if not active conversation
      const notificationConversationId = action.payload.chat_id || action.payload.userId;
      const newUnreadFromNotification = { ...state.unreadCounts };
      if (state.activeConversationId !== notificationConversationId) {
        newUnreadFromNotification[notificationConversationId] =
          (newUnreadFromNotification[notificationConversationId] || 0) + 1;
      }
      return {
        ...state,
        unreadCounts: newUnreadFromNotification,
      };

    case 'SET_ONLINE_STATUS':
      const newOnlineUsers = new Set(state.onlineUsers);
      if (action.payload.isOnline) {
        newOnlineUsers.add(action.payload.userId);
      } else {
        newOnlineUsers.delete(action.payload.userId);
      }
      return {
        ...state,
        onlineUsers: newOnlineUsers,
        conversations: state.conversations.map(conv =>
          conv.recipientId === action.payload.userId
            ? { ...conv, onlineStatus: action.payload.isOnline }
            : conv
        ),
      };

    case 'MARK_MESSAGES_READ':
      const updatedUnreadCounts = { ...state.unreadCounts };
      if (updatedUnreadCounts[action.payload.conversationId]) {
        delete updatedUnreadCounts[action.payload.conversationId];
      }
      return {
        ...state,
        unreadCounts: updatedUnreadCounts,
      };

    case 'INCREMENT_UNREAD':
      return {
        ...state,
        unreadCounts: {
          ...state.unreadCounts,
          [action.payload]: (state.unreadCounts[action.payload] || 0) + 1,
        },
      };

    case 'DECREMENT_UNREAD':
      const decrementedUnread = { ...state.unreadCounts };
      if (decrementedUnread[action.payload] > 1) {
        decrementedUnread[action.payload] -= 1;
      } else {
        delete decrementedUnread[action.payload];
      }
      return { ...state, unreadCounts: decrementedUnread };

    default:
      return state;
  }
}

// Helper functions
function getConversationIdFromMessage(message: Message): string {
  // Generate conversation ID based on sender and recipient
  return message.chat_id || `${message.senderId}-${message.recipientId}`;
}

function formatTimestamp(date: Date | string): string {
  const now = new Date();
  const messageTime = new Date(date);
  const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}min ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return messageTime.toLocaleDateString();
}

// Context definition
interface ChatContextValue {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  actions: {
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setConversations: (conversations: Conversation[]) => void;
    setActiveConversation: (id: string | null) => void;
    addConversation: (conversation: Conversation) => void;
    updateConversation: (id: string, updates: Partial<Conversation>) => void;
    setMessages: (conversationId: string, messages: Message[]) => void;
    addMessage: (message: Message) => void;
    receiveMessage: (message: Message) => void;
    sentMessage: (message: Message) => void;
    updateChatList: (event: UpdateChatListEvent) => void;
    handleNotification: (notification: NotificationEvent) => void;
    setOnlineStatus: (userId: string, isOnline: boolean) => void;
    markMessagesRead: (conversationId: string, messageIds: string[]) => void;
    incrementUnread: (conversationId: string) => void;
    decrementUnread: (conversationId: string) => void;
  };
  totalUnreadCount: number;
  activeConversation: Conversation | null;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

// Provider component
interface ChatProviderProps {
  children: React.ReactNode;
  initialConversations?: Conversation[];
}

export function ChatProvider({ children, initialConversations = [] }: ChatProviderProps) {
  // Load persisted state on initialization
  const persistedState = loadPersistedChatState();
  const finalInitialState = {
    ...initialState,
    ...persistedState,
    conversations: [...(initialConversations || []), ...(persistedState.conversations || [])],
  };

  const [state, dispatch] = useReducer(chatReducer, finalInitialState);

  // Action creators
  const actions = useMemo(() => ({
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    setConversations: (conversations: Conversation[]) =>
      dispatch({ type: 'SET_CONVERSATIONS', payload: conversations }),
    setActiveConversation: (id: string | null) =>
      dispatch(
        { type: 'SET_ACTIVE_CONVERSATION', payload: id }),
    addConversation: (conversation: Conversation) =>
      dispatch({ type: 'ADD_CONVERSATION', payload: conversation }),
    updateConversation: (id: string, updates: Partial<Conversation>) =>
      dispatch({ type: 'UPDATE_CONVERSATION', payload: { id, updates } }),
    setMessages: (conversationId: string, messages: Message[]) =>
      dispatch({ type: 'SET_MESSAGES', payload: { conversationId, messages } }),
    addMessage: (message: Message) => dispatch({ type: 'ADD_MESSAGE', payload: message }),
    receiveMessage: (message: Message) => dispatch({ type: 'RECEIVE_MESSAGE', payload: message }),
    sentMessage: (message: Message) => dispatch({ type: 'SENT_MESSAGE', payload: message }),
    updateChatList: (event: UpdateChatListEvent) =>
      dispatch({ type: 'UPDATE_CHATS_LIST', payload: event }),
    handleNotification: (notification: NotificationEvent) =>
      dispatch({ type: 'HANDLE_NOTIFICATION', payload: notification }),
    setOnlineStatus: (userId: string, isOnline: boolean) =>
      dispatch({ type: 'SET_ONLINE_STATUS', payload: { userId, isOnline } }),
    markMessagesRead: (conversationId: string, messageIds: string[]) =>
      dispatch({ type: 'MARK_MESSAGES_READ', payload: { conversationId, messageIds } }),
    incrementUnread: (conversationId: string) =>
      dispatch({ type: 'INCREMENT_UNREAD', payload: conversationId }),
    decrementUnread: (conversationId: string) =>
      dispatch({ type: 'DECREMENT_UNREAD', payload: conversationId }),
  }), []);

  // Computed values
  const totalUnreadCount = useMemo(() =>
    Object.values(state.unreadCounts).reduce((sum, count) => sum + count, 0),
    [state.unreadCounts]
  );

  const activeConversation = useMemo(() =>
    state.conversations.find(conv => conv.id === state.activeConversationId) || null,
    [state.conversations, state.activeConversationId]
  );

  // Auto-persist state changes
  useEffect(() => {
    persistChatState(state);
  }, [state]);

  const value: ChatContextValue = useMemo(() => ({
    state,
    dispatch,
    actions,
    totalUnreadCount,
    activeConversation,
  }), [state, dispatch, actions, totalUnreadCount, activeConversation]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

// Hook to use chat context
export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

// Helper hooks
export function useActiveConversation() {
  const { activeConversation, state } = useChat();
  const messages = state.messages[activeConversation?.id || ''] || [];
  return { activeConversation, messages };
}

export function useConversation(conversationId: string) {
  const { state, actions } = useChat();
  const conversation = state.conversations.find(conv => conv.id === conversationId);
  const messages = state.messages[conversationId] || [];
  const unreadCount = state.unreadCounts[conversationId] || 0;

  return {
    conversation,
    messages,
    unreadCount,
    isActive: state.activeConversationId === conversationId,
    markAsRead: () => {
      if (unreadCount > 0) {
        actions.markMessagesRead(conversationId, messages.slice(-unreadCount).map(m => m.id));
      }
    },
  };
}

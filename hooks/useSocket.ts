"use client"

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  SocketState,
  ReceiveMessageEvent,
  SentMessageEvent,
  UpdateChatListEvent,
  SendMessagePayload,
  SocketEventType
} from '@/types/chat';

export interface UseSocketReturn extends SocketState {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
  emit: (event: SocketEventType, data: any) => void;
  on: (event: SocketEventType, callback: (...args: any[]) => void) => void;
  off: (event: SocketEventType, callback?: (...args: any[]) => void) => void;
  sendMessage: (payload: SendMessagePayload) => void;
}

export function useSocket(token?: string, serverUrl: string = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:8000' : 'http://localhost:8000'): UseSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<SocketState>({
    isConnected: false,
    isConnecting: false,
    currentUserId: null,
    lastError: null,
  });

  // Get user ID from auth state - you'll need to integrate with your auth system
  const getUserId = useCallback((): string | null => {
    // This is a placeholder - replace with your actual auth logic
    // For example, from localStorage, context, or JWT decode
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || null;
      } catch {
        return null;
      }
    }
    return null;
  }, [token]);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    setState(prev => ({ ...prev, isConnecting: true, lastError: null }));

    // Split serverUrl to separate base URL and potential path
    const urlParts = serverUrl.replace(/^https?:\/\//, '').split('/');
    const baseUrl = urlParts[0];
    const path = urlParts.length > 1 ? '/' + urlParts.slice(1).join('/') : '';

    socketRef.current = io(`https://${baseUrl}`, {
      path: path || '/socket.io',
      transports: ['websocket'],
      auth: { token },
      autoConnect: true,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('🎉 Connected to WebSocket server');
      setState(prev => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        currentUserId: getUserId(),
        lastError: null,
      }));
    });

    socket.on('disconnect', (reason) => {
      console.log('👋 Disconnected from WebSocket server:', reason);
      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
      }));
    });

    socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error.message);
      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        lastError: error.message,
      }));
    });

    socket.on('receiveMessage', (data: ReceiveMessageEvent) => {
      console.log('📨 Received message:', data);
      // Event emission will be handled by the component using this hook
    });

    socket.on('sentMessage', (data: SentMessageEvent) => {
      console.log('📤 Sent message confirmation:', data);
      // Event emission will be handled by the component using this hook
    });

    socket.on('updateChatList', (data: UpdateChatListEvent) => {
      console.log('🔄 Chat list update:', data);
      // Event emission will be handled by the component using this hook
    });

    socket.on('notification', (data: any) => {
      console.log('🔔 Notification received:', data);
      // Event emission will be handled by the component using this hook
    });

  }, [token, getUserId, serverUrl]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log('🔌 Disconnecting from WebSocket server');
      socketRef.current.disconnect();
      socketRef.current = null;
      setState({
        isConnected: false,
        isConnecting: false,
        currentUserId: null,
        lastError: null,
      });
    }
  }, []);

  const emit = useCallback((event: SocketEventType, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('⚠️ Cannot emit event - socket not connected');
    }
  }, []);

  const on = useCallback((event: SocketEventType, callback: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event as any, callback as any);
    }
  }, []);

  const off = useCallback((event: SocketEventType, callback?: (...args: any[]) => void) => {
    if (socketRef.current) {
      if (callback) {
        socketRef.current.off(event as any, callback as any);
      } else {
        socketRef.current.off(event as any);
      }
    }
  }, []);

  const sendMessage = useCallback((payload: SendMessagePayload) => {
    console.log("payload", payload)
    emit('sendMessage', {
      from: payload.from,
      to: payload.to,
      content: payload.content, // 🔧 FIXED: Backend expects "content" not "message"
      senderName: payload.senderName,
      chat_id: payload.chat_id || 'default_chat_id',
    });
  }, [emit]);

  // Auto-connect on mount if token is provided
  useEffect(() => {
    if (token) {
      console.log('🌐 Attempting to connect to Socket.IO server...');
      console.log('🔑 Token available:', !!token);
      console.log('🔌 Socket ref current:', !!socketRef.current);
      console.log('🔌 Socket connected:', socketRef.current?.connected);

      if (!socketRef.current) {
        connect();
      } else if (!socketRef.current.connected) {
        console.log('🔄 Socket exists but not connected, attempting to reconnect...');
        socketRef.current.connect();
      }
    } else {
      console.log('❌ No token available for Socket.IO connection');
    }

    return () => {
      // Don't disconnect on unmount to keep persistent connection
      // disconnect();
    };
  }, [token, connect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return {
    ...state,
    socket: socketRef.current,
    connect,
    disconnect,
    emit,
    on,
    off,
    sendMessage,
  };
}

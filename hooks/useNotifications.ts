"use client"

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiClientUser } from '@/lib/interceptor';
import { GetNotificationsRes, Notification, GetNotificationRes } from '@/types/general';
import { useSocket } from '@/hooks/useSocket';
import { playMessageSound } from '@/lib/notification-sound';

// Get all notifications
const getNotifications = async (): Promise<GetNotificationsRes> => {
  return await apiClientUser.get('/notifications');
};

// Get single notification
const getNotification = async (notificationId: string): Promise<GetNotificationRes> => {
  return await apiClientUser.get(`/notifications/one?notificationId=${notificationId}`);
};

// Mark notification as read
const markAsRead = async (notificationId: string): Promise<any> => {
  return await apiClientUser.patch(`/notifications/one?notificationId=${notificationId}`, { isRead: true });
};

// Mark all notifications as read
const markAllAsRead = async (): Promise<any> => {
  return await apiClientUser.patch('/notifications/mark-all-read');
};

export function useNotifications() {
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();

  // Get all notifications query
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery('notifications', getNotifications, {
    onSuccess: (response) => {
      setLocalNotifications(response.data.notifications);
    },
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation(markAsRead, {
    onSuccess: (response, notificationId) => {
      setLocalNotifications(prev =>
        prev.map(notification =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      queryClient.invalidateQueries('notifications');
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation(
    markAllAsRead,
    {
      onSuccess: () => {
        setLocalNotifications(prev =>
          prev.map(notification => ({ ...notification, isRead: true }))
        );
        queryClient.invalidateQueries('notifications');
      },
    }
  );

  // Socket listener for real-time notifications
  useEffect(() => {
    if (socket && isConnected) {
      const handleNewNotification = (notification: Notification) => {
        console.log('🔔 New notification received:', notification);

        // Check notification settings before playing sound
        const settings = localStorage.getItem('notificationSettings');
        const notificationSettings = settings ? JSON.parse(settings) : { soundEnabled: true };
        const shouldPlaySound = notificationSettings.soundEnabled !== false;

        if (shouldPlaySound) {
          playMessageSound();
        }

        // Add to local state
        setLocalNotifications(prev => [notification, ...prev]);

        // Invalidate cache
        queryClient.invalidateQueries('notifications');
      };

      socket.on('notification', handleNewNotification);

      return () => {
        socket.off('notification', handleNewNotification);
      };
    }
  }, [socket, isConnected, queryClient]);

  return {
    notifications: localNotifications,
    isLoading,
    isError,
    error,
    refetch,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isLoading,
    isMarkingAllAsRead: markAllAsReadMutation.isLoading,
  };
}

// Hook for single notification
export function useNotification(notificationId: string) {
  return useQuery(
    ['notification', notificationId],
    () => getNotification(notificationId),
    {
      enabled: !!notificationId,
    }
  );
}

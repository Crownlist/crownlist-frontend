"use client"

import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationItem from './NotificationItem';
import CustomLoader from '@/components/CustomLoader';

export default function NotificationList() {
  const {
    notifications,
    isLoading,
    isError,
    error,
    markAsRead,
    markAllAsRead,
    isMarkingAllAsRead,
    refetch
  } = useNotifications();

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    if (notifications.length > 0) {
      markAllAsRead();
    }
  };

  const hasUnreadNotifications = notifications.some(notification => !notification.isRead);

  if (isLoading) {
    return (
      <div className="w-full px-4 py-4 mb-0">
        <main className="w-full max-w-2xl mx-auto max-h-full">
          <CustomLoader text="Loading notifications..." />
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full px-4 py-4 mb-0">
        <main className="w-full max-w-2xl mx-auto max-h-full text-center">
          <div className="max-w-md mx-auto">
            <p className="text-red-500 mb-4">
              Error loading notifications: {(error as Error)?.message || 'Unknown error'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-4 mb-0">
      <main className="w-full max-w-2xl mx-auto max-h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          {hasUnreadNotifications && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAllAsRead}
              className="underline cursor-pointer text-sm text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isMarkingAllAsRead ? 'Marking...' : 'Mark all as read'}
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No notifications to display</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onClick={handleNotificationClick}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

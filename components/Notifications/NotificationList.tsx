"use client"

import React, { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationItem from './NotificationItem';
import NotificationDetailsModal from './NotificationDetailsModal';
import CustomLoader from '@/components/CustomLoader';

export default function NotificationList() {
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
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

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const handleViewDetails = (notificationId: string) => {
    setSelectedNotificationId(notificationId);
  };

  const handleCloseDetails = () => {
    setSelectedNotificationId(null);
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
              className="px-4 py-2 bg-[#1F058F] text-white rounded hover:bg-[#2a0bc0]"
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
              className="underline cursor-pointer text-sm text-[#1F058F] disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isMarkingAllAsRead ? 'Marking...' : 'Mark all as read'}
            </button>
          )}
        </div>

        {notifications && notifications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No notifications to display</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        <NotificationDetailsModal
          notificationId={selectedNotificationId}
          isOpen={!!selectedNotificationId}
          onClose={handleCloseDetails}
        />
      </main>
    </div>
  );
}

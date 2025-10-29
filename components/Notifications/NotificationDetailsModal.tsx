"use client"

import React from 'react';
import { useNotification } from '@/hooks/useNotifications';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  formatNotificationTime,
  getNotificationBellIcon,
  getNotificationIcon,
} from '@/lib/notification-utils';
import Image from 'next/image';
import CustomLoader from '@/components/CustomLoader';

interface NotificationDetailsModalProps {
  notificationId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDetailsModal({ notificationId, isOpen, onClose }: NotificationDetailsModalProps) {
  const { data, isLoading, isError, error } = useNotification(notificationId || '');

  const notification = data?.data?.notification;

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg z-500000">
          <CustomLoader text="Loading notification details..." />
        </DialogContent>
      </Dialog>
    );
  }

  if (isError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg z-50000">
          <div className="text-center">
            <p className="text-red-500 mb-4">
              Error loading notification: {(error as Error)?.message || 'Unknown error'}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!notification) {
    return null;
  }

  const bellIcon = getNotificationBellIcon(notification.isRead);
  const typeIcon = getNotificationIcon(notification.notificationType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg z-50000000">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image
              src={bellIcon}
              alt="Notification"
              width={24}
              height={24}
            />
            {notification.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-lg" role="img" aria-label={notification.notificationType}>
              {typeIcon}
            </span>
            <span className="font-medium capitalize">
              {notification.notificationType.replace('_', ' ').toLowerCase()}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{formatNotificationTime(notification.createdAt)}</span>
            <span className={`px-2 py-1 rounded text-xs ${
              notification.isRead
                ? 'bg-gray-100 text-gray-600'
                : 'bg-blue-100 text-blue-600'
            }`}>
              {notification.isRead ? 'Read' : 'Unread'}
            </span>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {notification.content}
            </p>
          </div>

          {notification.metadata && Object.keys(notification.metadata).length > 0 && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Information</h4>
              <div className="text-xs text-gray-600 space-y-1">
                {Object.entries(notification.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key}:</span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

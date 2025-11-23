"use client"

import React from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Notification } from '@/types/general';
import {
  formatNotificationTime,
  getNotificationBellIcon,
  getNotificationIcon,
  truncateNotificationContent,
  isHtmlContent,
  truncateHtmlContent
} from '@/lib/notification-utils';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (notificationId: string) => void;
  onViewDetails: (notificationId: string) => void;
}

export default function NotificationItem({ notification, onMarkAsRead, onViewDetails }: NotificationItemProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();

    // If it's a NEW_MESSAGE notification with a chat_id, navigate to messages page
    if (notification.notificationType === 'NEW_MESSAGE' && notification.chat_id) {
      const currentPath = pathname;
      let messagesPath = '/messages';
      if (currentPath.includes('/buyer/')) {
        messagesPath = '/buyer/messages';
      } else if (currentPath.includes('/seller/')) {
        messagesPath = '/seller/messages';
      }
      router.push(`${messagesPath}?chat_id=${notification.chat_id}`);
      return;
    }

    // Otherwise, open the details modal
    onViewDetails(notification._id);
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    onMarkAsRead(notification._id);
  };

  const bellIcon = getNotificationBellIcon(notification.isRead);
  const typeIcon = getNotificationIcon(notification.notificationType);

  return (
    <div className={`flex flex-col sm:flex-row gap-3 p-3 border rounded-md w-full mb-0 cursor-pointer transition-colors ${
      notification.isRead
        ? 'bg-gray-50 hover:bg-gray-100 border-gray-200'
        : 'bg-white hover:bg-gray-50 border-gray-300'
    }`}>
      <div className="flex items-start gap-3 flex-1">
        <Image
          src={bellIcon}
          alt="Notification"
          width={20}
          height={20}
          className="flex-shrink-0 mt-1"
        />
        <div className="flex-1" onClick={handleViewDetails}>
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2">
              <span className="text-lg" role="img" aria-label={notification.notificationType}>
                {typeIcon}
              </span>
              <h3 className={`text-base font-semibold ${
                notification.isRead ? 'text-gray-600' : 'text-black'
              }`}>
                {notification.title}
              </h3>
            </div>
            <p className="text-xs text-gray-500 whitespace-nowrap ml-2">
              {formatNotificationTime(notification.createdAt)}
            </p>
          </div>
          {isHtmlContent(notification.content) ? (
            <div
              className={`text-sm leading-relaxed line-clamp-2 ${
                notification.isRead ? 'text-gray-500' : 'text-gray-600'
              }`}
              dangerouslySetInnerHTML={{ __html: truncateHtmlContent(notification.content) }}
            />
          ) : (
            <p className={`text-sm ${
              notification.isRead ? 'text-gray-500' : 'text-gray-600'
            }`}>
              {truncateNotificationContent(notification.content)}
            </p>
          )}
        </div>
      </div>
      {!notification.isRead && (
        <div className="flex items-center justify-end">
          <button
            onClick={handleMarkAsRead}
            className="px-3 py-1 text-xs bg-[#1F058F] text-white rounded hover:bg-[#2a0bc0] transition-colors"
          >
            Mark as read
          </button>
        </div>
      )}
    </div>
  );
}

"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Notification } from '@/types/general';
import {
  formatNotificationTime,
  getNotificationBellIcon,
  getNotificationIcon,
  truncateNotificationContent
} from '@/lib/notification-utils';

interface NotificationItemProps {
  notification: Notification;
  onClick: (notificationId: string) => void;
}

export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const router = useRouter();

  const handleClick = () => {
    onClick(notification._id);

    // Determine where to navigate based on notification type and content
    let targetUrl = '#';

    switch (notification.notificationType) {
      case 'NEW_MESSAGE':
        if (notification.chat_id) {
          targetUrl = `/buyer/messages?chat=${notification.chat_id}`;
        } else {
          targetUrl = '/buyer/messages';
        }
        break;
      case 'ORDER_UPDATE':
        if (notification.order_id) {
          targetUrl = `/buyer/orders?id=${notification.order_id}`;
        } else {
          targetUrl = '/buyer/orders';
        }
        break;
      case 'PRODUCT_APPROVED':
      case 'PRODUCT_REJECTED':
        if (notification.product_id) {
          targetUrl = `/buyer/products?id=${notification.product_id}`;
        } else {
          targetUrl = '/buyer/products';
        }
        break;
      case 'PAYMENT_SUCCESS':
      case 'PAYMENT_FAILED':
        if (notification.order_id) {
          targetUrl = `/buyer/payments?id=${notification.order_id}`;
        } else {
          targetUrl = '/buyer/payments';
        }
        break;
      case 'OFFER_RECEIVED':
      case 'OFFER_ACCEPTED':
      case 'OFFER_DECLINED':
        if (notification.product_id) {
          targetUrl = `/buyer/products?id=${notification.product_id}`;
        } else {
          targetUrl = '/buyer/products';
        }
        break;
      case 'ACCOUNT_UPDATE':
        targetUrl = '/buyer/profile';
        break;
      default:
        // Stay on current page for other notification types
        return;
    }

    if (targetUrl !== '#') {
      router.push(targetUrl);
    }
  };

  const bellIcon = getNotificationBellIcon(notification.isRead);
  const typeIcon = getNotificationIcon(notification.notificationType);

  return (
    <Link href="#" onClick={handleClick} className="block">
      <div className={`flex flex-col sm:flex-row gap-3 p-3 border rounded-md w-full mb-0 cursor-pointer transition-colors ${
        notification.isRead
          ? 'bg-gray-50 hover:bg-gray-100 border-gray-200'
          : 'bg-white hover:bg-gray-50 border-gray-300'
      }`}>
        <div className="flex items-start gap-3">
          <Image
            src={bellIcon}
            alt="Notification"
            width={20}
            height={20}
            className="flex-shrink-0 mt-1"
          />
          <div className="flex-1">
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
            <p className={`text-sm ${
              notification.isRead ? 'text-gray-500' : 'text-gray-600'
            }`}>
              {truncateNotificationContent(notification.content)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

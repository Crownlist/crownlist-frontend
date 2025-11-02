// Utility functions for notifications

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

/**
 * Formats notification timestamp into human-readable relative time
 * @param dateString - ISO date string
 * @returns Human-readable string like "Just now", "5 minutes ago", etc.
 */
export function formatNotificationTime(dateString: string): string {
  const date = dayjs(dateString);
  const now = dayjs();
  const diffMinutes = now.diff(date, 'minute');
  const diffHours = now.diff(date, 'hour');
  const diffDays = now.diff(date, 'day');

  if (diffMinutes < 1) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}min ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.format('MMM DD');
  }
}

/**
 * Gets the appropriate bell icon based on notification read status
 * @param isRead - Whether the notification has been read
 * @returns Path to the bell SVG icon
 */
export function getNotificationBellIcon(isRead: boolean): string {
  return isRead ? '/white-bell.svg' : '/black-bell.svg';
}

/**
 * Gets notification icon based on notification type
 * @param notificationType - Type of notification
 * @returns Icon name or path
 */
export function getNotificationIcon(notificationType: string): string {
  switch (notificationType) {
    case 'NEW_MESSAGE':
      return '💬'; // Message icon
    case 'SYSTEM':
      return 'ℹ️'; // Info icon
    case 'WARNING':
      return '⚠️'; // Warning icon
    case 'SUCCESS':
    case 'PAYMENT_SUCCESS':
    case 'PRODUCT_APPROVED':
    case 'OFFER_ACCEPTED':
      return '✅'; // Success icon
    case 'PAYMENT_FAILED':
    case 'PRODUCT_REJECTED':
    case 'OFFER_DECLINED':
      return '❌'; // Failure/error icon
    case 'ORDER_UPDATE':
      return '📦'; // Package icon
    case 'OFFER_RECEIVED':
      return '💰'; // Money icon
    case 'ACCOUNT_UPDATE':
      return '👤'; // User icon
    case 'SECURITY_ALERT':
      return '🔒'; // Lock icon
    case 'PROMOTION':
      return '🏷️'; // Tag icon
    default:
      return '🔔'; // Default bell icon
  }
}

/**
 * Checks if content contains HTML tags
 * @param content - Content to check
 * @returns True if content contains HTML
 */
export function isHtmlContent(content: string): boolean {
  const htmlRegex = /<[^>]*>/;
  return htmlRegex.test(content);
}

/**
 * Strips HTML tags from content for plain text display
 * @param content - HTML content
 * @returns Plain text content
 */
export function stripHtmlTags(content: string): string {
  return content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Truncates notification content for display in list
 * @param content - Full notification content
 * @param maxLength - Maximum length (default 100)
 * @returns Truncated content (plain text for HTML content, original for plain text)
 */
export function truncateNotificationContent(content: string, maxLength: number = 100): string {
  // Strip HTML tags first if content contains HTML
  const plainText = isHtmlContent(content) ? stripHtmlTags(content) : content;

  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + '...';
}

/**
 * Truncates HTML content while preserving basic structure
 * @param htmlContent - HTML content to truncate
 * @param maxLength - Maximum plain text length (default 100)
 * @returns Truncated HTML content
 */
export function truncateHtmlContent(htmlContent: string, maxLength: number = 100): string {
  const plainText = stripHtmlTags(htmlContent);

  if (plainText.length <= maxLength) return htmlContent;

  // Find the position in plain text and map back to HTML
  const truncatedPlain = plainText.substring(0, maxLength);
  const truncatedHtml = htmlContent.substring(0, htmlContent.length * (truncatedPlain.length / plainText.length));

  // Try to close any open tags
  const openTags = [];
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  let match;

  while ((match = tagRegex.exec(truncatedHtml)) !== null) {
    const tag = match[0];
    const tagName = match[1];

    if (tag.startsWith('</')) {
      // Closing tag
      if (openTags.length > 0 && openTags[openTags.length - 1] === tagName) {
        openTags.pop();
      }
    } else if (!tag.endsWith('/>') && !['br', 'img', 'hr', 'input', 'meta', 'link'].includes(tagName.toLowerCase())) {
      // Opening tag (not self-closing)
      openTags.push(tagName);
    }
  }

  let result = truncatedHtml + '...';

  // Close any remaining open tags
  while (openTags.length > 0) {
    const tagName = openTags.pop();
    result += `</${tagName}>`;
  }

  return result;
}

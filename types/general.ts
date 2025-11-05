import { AdminSignin } from "./admin/auth";

export interface GetUserRes {
    status: string;
    data: {
      data: any;
      loggedInAccount: AdminSignin;
      message: string;
    };
  }

  export interface UserProfileProps {
    phoneNumber: string;
    lastname: string;
    firstname: string;
    address: string;
    city: string;
    country: string;
  }

  // Subscription Types
  export interface SubscriptionPlanLimit {
    subCategory: string;
    limit: number;
    _id: string;
  }

  export interface SubscriptionPlan {
    _id: string;
    name: string;
    description: string;
    features: string[];
    listingLimit: SubscriptionPlanLimit[];
    amount: number;
    billing_cycle: string;
    paystack_plan_code: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }

  export interface Subscription {
    _id: string;
    sellerId: any; // Extend if needed, for now using any to match sample
    __v: number;
    addOnSubscriptions: any[]; // Extend if needed
    createdAt: string;
    expiresAt: string;
    paidAt: string;
    paystack_plan_code: string;
    status: string;
    subscriptionPlanId: SubscriptionPlan;
    subscriptionPlanName: string;
    updatedAt: string;
  }

  export interface GetSubscriptionRes {
    status: string;
    data: {
      subscription: Subscription;
      message: string;
    };
  }

  // Notification Types
  export type NotificationType =
    | 'NEW_MESSAGE'
    | 'SYSTEM'
    | 'ORDER_UPDATE'
    | 'PAYMENT_SUCCESS'
    | 'PAYMENT_FAILED'
    | 'PRODUCT_APPROVED'
    | 'PRODUCT_REJECTED'
    | 'OFFER_RECEIVED'
    | 'OFFER_ACCEPTED'
    | 'OFFER_DECLINED'
    | 'ACCOUNT_UPDATE'
    | 'SECURITY_ALERT'
    | 'PROMOTION'
    | 'WARNING';

  export interface Notification {
    _id: string;
    userId: string;
    title: string;
    content: string;
    notificationType: NotificationType;
    isRead: boolean;
    chat_id?: string;
    product_id?: string;
    order_id?: string;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
    __v?: number;
  }

  export interface GetNotificationsRes {
    status: string;
    data: {
      notifications: Notification[];
      message?: string;
    };
    meta: {
      page: number;
      limit: number;
      startDate: string;
      endDate: string;
    };
  }

  export interface GetNotificationRes {
    status: string;
    data: {
      notification: Notification;
      message?: string;
    };
  }

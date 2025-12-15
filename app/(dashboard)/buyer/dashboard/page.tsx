/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bookmark, Bell, Package, User, MessageSquare } from "lucide-react";
import { useLikedProducts } from "@/hooks/useLikedProducts";
import { useProductRequests } from "@/lib/useProductRequests";
import { useNotifications } from "@/hooks/useNotifications";

export default function BuyerDashboardPage() {
  const { products: savedProducts, loading: savedLoading } = useLikedProducts();

  const { data: requestsData, isLoading: requestsLoading } = useProductRequests(
    {
      userType: "buyer",
      page: 1,
      limit: 1,
    }
  );

  const requestsTotal = requestsData?.data?.pagination?.total || 0;

  const { notifications, isLoading: notificationsLoading } = useNotifications();
  const unreadNotifications = (notifications || []).filter(
    (n: any) => !n.isRead
  ).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="rounded-lg overflow-hidden mb-6 shadow-md bg-linear-to-r from-[#1F058F] to-[#2a0bc0] text-white p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">
              Welcome back 👋
            </h1>
            <p className="mt-1 text-sm opacity-90">
              Here are your quick actions and recent activity to help you get
              moving.
            </p>
          </div>

          <div className="flex gap-3">
            <Button asChild>
              <Link href="/buyer/saved" className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" /> Saved
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link
                href="/buyer/request"
                className="flex items-center gap-2 text-white"
              >
                <Package className="h-4 w-4" /> New Request
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Link href="/buyer/saved" className="block">
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Saved</p>
                  <p className="text-xl font-semibold">
                    {savedLoading ? "—" : savedProducts.length}
                  </p>
                </div>
                <Bookmark className="h-6 w-6 text-[#1F058F]" />
              </div>
            </div>
          </Link>

          <Link href="/buyer/request" className="block">
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Requests</p>
                  <p className="text-xl font-semibold">
                    {requestsLoading ? "—" : requestsTotal}
                  </p>
                </div>
                <Package className="h-6 w-6 text-[#1F058F]" />
              </div>
            </div>
          </Link>

          <Link href="/buyer/notifications" className="block">
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Notifications</p>
                  <p className="text-xl font-semibold">
                    {notificationsLoading ? "—" : unreadNotifications}
                  </p>
                </div>
                <Bell className="h-6 w-6 text-[#1F058F]" />
              </div>
            </div>
          </Link>

          <Link href="/buyer/profile" className="block">
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Profile</p>
                  <p className="text-xl font-semibold">Complete your profile</p>
                </div>
                <User className="h-6 w-6 text-[#1F058F]" />
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick actions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link href="/buyer/saved">
                  <div className="border border-gray-200 rounded-lg p-3 text-center hover:shadow-md cursor-pointer">
                    <Bookmark className="mx-auto h-5 w-5 text-[#1F058F] mb-2" />
                    <div className="text-sm font-medium">Saved</div>
                  </div>
                </Link>
                <Link href="/buyer/request">
                  <div className="border border-gray-200 rounded-lg p-3 text-center hover:shadow-md cursor-pointer">
                    <Package className="mx-auto h-5 w-5 text-[#1F058F] mb-2" />
                    <div className="text-sm font-medium">Request</div>
                  </div>
                </Link>
                <Link href="/buyer/messages">
                  <div className="border border-gray-200 rounded-lg p-3 text-center hover:shadow-md cursor-pointer">
                    <MessageSquare className="mx-auto h-5 w-5 text-[#1F058F] mb-2" />
                    <div className="text-sm font-medium">Messages</div>
                  </div>
                </Link>
                <Link href="/buyer/profile">
                  <div className="border border-gray-200 rounded-lg p-3 text-center hover:shadow-md cursor-pointer">
                    <User className="mx-auto h-5 w-5 text-[#1F058F] mb-2" />
                    <div className="text-sm font-medium">Profile</div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">Recent activity</h2>
              <div className="text-sm text-gray-500">
                No recent activity yet. Your actions will appear here.
              </div>
            </div>
          </div>

          {/* Right column */}
          <aside className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-sm text-gray-500">Tips</h3>
              <ul className="mt-2 text-sm space-y-2 text-gray-700">
                <li>• Save items you like to revisit them later.</li>
                <li>• Use requests to let sellers know what you need.</li>
                <li>• Complete your profile to increase trust with sellers.</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-sm text-gray-500">Recommended</h3>
              <div className="mt-3 text-sm text-gray-700">
                Browse categories or check trending items from the home page.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

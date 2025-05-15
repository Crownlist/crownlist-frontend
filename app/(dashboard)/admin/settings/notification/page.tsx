"use client"

import { useState } from "react"
import Link from "next/link"
import { RadioGroup} from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function AdminNotificationSettingsPage() {
  const [customerNotification, setCustomerNotification] = useState("list-updates")
  const [adminNotification, setAdminNotification] = useState("")

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Tabs */}
      <div className="bg-[#f0eeff] rounded-full p-1 inline-flex mb-8">
        <Link
          href="/admin/settings/profile"
          className="px-6 py-2 rounded-full text-gray-700 font-medium hover:bg-gray-50"
        >
          Profile
        </Link>
        <Link
          href="/admin/settings/notification"
          className="px-6 py-2 rounded-full bg-white text-[#1a0066] font-medium shadow-sm"
        >
          Notification
        </Link>
        <Link href="/admin/settings/team" className="px-6 py-2 rounded-full text-gray-700 font-medium hover:bg-gray-50">
          Team
        </Link>
      </div>

      {/* Notification Settings */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-1">Notification</h2>
        <p className="text-gray-600 mb-8">Manage your notification</p>

        {/* Customer Notifications */}
        <div className="mb-10">
          <h3 className="text-base text-gray-700 mb-4">Customer notifications</h3>

          <RadioGroup value={customerNotification} onValueChange={setCustomerNotification} className="space-y-6">
            <div className="flex items-start space-x-3">
              {/* <RadioGroupItem value="list-updates" id="list-updates" className="mt-1 " /> */}
              <Switch id="list-updates"  className="mt-1 " />
              <div>
                <Label htmlFor="list-updates" className="font-medium">
                  List updates
                </Label>
                <p className="text-sm text-gray-600 mt-1">Receive alerts for new list, cancelled list and pending</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              {/* <RadioGroupItem value="customer-messages" id="customer-messages" className="mt-1" /> */}
              <Switch id="customer-messages"  className="mt-1 " />
              <div>
                <Label htmlFor="customer-messages" className="font-medium">
                  Customer messages
                </Label>
                <p className="text-sm text-gray-600 mt-1">Alerts for direct messages or inquiries from customers</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              {/* <RadioGroupItem value="review-alerts" id="review-alerts" className="mt-1" /> */}
              <Switch id="review-alerts"  className="mt-1 " />
              <div>
                <Label htmlFor="review-alerts" className="font-medium">
                  Review alerts
                </Label>
                <p className="text-sm text-gray-600 mt-1">Notifications when customers leaves reviews or feedback</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              {/* <RadioGroupItem value="customer-activity" id="customer-activity" className="mt-1" /> */}
              <Switch id="customer-activity"  className="mt-1 " />
              <div>
                <Label htmlFor="customer-activity" className="font-medium">
                  Customer activity
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Stay informed about new customer registrations or updates to customer profiles
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Admin Notifications */}
        <div>
          <h3 className="text-base text-gray-700 mb-4">Admin notifications</h3>

          <RadioGroup value={adminNotification} onValueChange={setAdminNotification} className="space-y-6">
            <div className="flex items-start space-x-3">
              {/* <RadioGroupItem value="suspicious-activity" id="suspicious-activity" className="mt-1" /> */}
              <Switch id="list-updates"  className="mt-1 " />
              <div>
                <Label htmlFor="suspicious-activity" className="font-medium">
                  Suspicious activity
                </Label>
                <p className="text-sm text-gray-600 mt-1">Alerts for failed logins or unusual admin activity</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              {/* <RadioGroupItem value="password-changes" id="password-changes" className="mt-1" /> */}
              <Switch id="list-updates"  className="mt-1 " />
              <div>
                <Label htmlFor="password-changes" className="font-medium">
                  Password changes
                </Label>
                <p className="text-sm text-gray-600 mt-1">Get notified of changes to admin passwords</p>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}

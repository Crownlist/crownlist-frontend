"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, ChevronLeft, ChevronRight, Download, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BillingsSettingsPage() {
  // Mock data for billing history
  const billingHistory = [
    { id: "Basic_plan_#1234", amount: "₦0.00", date: "Jan 19,2025", time: "06:41 AM", status: "Paid" },
    { id: "Basic_plan_#1232", amount: "₦0.00", date: "Jan 19,2025", time: "06:41 AM", status: "Paid" },
    { id: "Basic_plan_#1231", amount: "₦0.00", date: "Jan 19,2025", time: "06:41 AM", status: "Paid" },
    { id: "Basic_plan_#1230", amount: "₦0.00", date: "Jan 19,2025", time: "06:41 AM", status: "Paid" },
  ]

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Tabs */}
      <div className="border rounded-lg mb-8 border-[#1F058F]">
        <div className="flex">
          <Link href="/seller/settings/profile" className="px-6 py-4  text-gray-700  hover:bg-gray-50 rounded-l-lg font-medium">
            Profile
          </Link>
          <Link href="/seller/settings/billings" className="px-6 py-4  text-white bg-[#1F058F]">
            Billings
          </Link>
        </div>
      </div>

      {/* Billing Section */}
      <div className="mb-10">
        <h2 className="text-lg font-medium mb-1">Billing</h2>
        <p className="text-gray-600 mb-6">Manage your billing and payment</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subscription Plan Card */}
          <div className="border rounded-lg p-6">
            <div className="flex flex-col">
              <div className="mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mb-4">
                <Image src="/layer.png" alt="Visa" width={18} height={12} />
                </div>
                <h3 className="text-xl font-semibold">Basic plan</h3>
                <div className="flex items-baseline mt-1">
                  <span className="text-lg font-bold">₦1,000</span>
                  <span className="text-gray-500 ml-1">monthly</span>
                </div>
                <p className="text-gray-500 mt-1">Limited post and reach</p>
              </div>
              <div className="mt-auto pt-4 border-t">
                <Link
                  href="/settings/upgrade"
                  className="flex items-center justify-end text-[#1F058F] font-medium hover:underline"
                >
                   <Link
                  href="/seller/settings/pricing"
                  className="flex items-center justify-end text-[#1F058F] font-medium hover:underline"
                >
                  Upgrade plan
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>

                </Link>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Payment method</h3>
            <div className="border rounded-lg p-4">
              <div className="flex items-start">
                <div className="mr-3">
                  <Image src="/visa.png" alt="Visa" width={48} height={32} />
                </div>
                <div>
                  <p className="font-medium">Visa ending in 1234</p>
                  <p className="text-gray-500 text-sm">Expiry 06/2024</p>
                  <div className="flex items-center mt-2 text-gray-500 text-sm">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>billing@crownlist.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History Section */}
      <div>
        <h2 className="text-lg font-medium mb-6">Billing history</h2>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F5F5] ">
              <tr className="text-left items-center">
                <th className="py-4 font-medium">
                  <Checkbox />
                </th>
                <th className="py-4 font-medium">Invoice</th>
                <th className="py-4 font-medium">Amount</th>
                <th className="py-4 font-medium">Date</th>
                <th className="py-4 font-medium">Status</th>
                <th className="py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((invoice) => (
                <tr key={invoice.id} className="border-t">
                  <td className="py-4">
                    <Checkbox />
                  </td>
                  <td className="py-4">{invoice.id}</td>
                  <td className="py-4">{invoice.amount}</td>
                  <td className="py-4">
                    {invoice.date} <span className="text-gray-500">{invoice.time}</span>
                  </td>
                  <td className="py-4">
                    <span className="text-green-500">{invoice.status}</span>
                  </td>
                  <td className="py-4">
                    <Button variant="ghost" size="icon">
                      <Download className="h-5 w-5 text-gray-400" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button variant="outline" size="sm" className="px-3 py-1 h-8 bg-gray-100">
              1
            </Button>
            <Button variant="outline" size="sm" className="px-3 py-1 h-8">
              2
            </Button>
            <Button variant="outline" size="sm" className="px-3 py-1 h-8">
              3
            </Button>
            <span>...</span>
            <Button variant="outline" size="sm" className="px-3 py-1 h-8">
              8
            </Button>
            <Button variant="outline" size="sm" className="px-3 py-1 h-8">
              9
            </Button>
            <Button variant="outline" size="sm" className="px-3 py-1 h-8">
              10
            </Button>
            <Button variant="outline" size="sm">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="flex items-center">
            <span className="mr-2">Showing</span>
            <Select defaultValue="4">
              <SelectTrigger className="w-16 h-8">
                <SelectValue placeholder="4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="ml-2">of 50</span>
          </div>
        </div>
      </div>
    </div>
  )
}

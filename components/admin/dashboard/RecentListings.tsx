import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { DashboardData } from "@/types/admin-dashboard";

interface RecentListingsProps {
  dashboardData: DashboardData | null;
  activeDropdown: string | null;
  toggleDropdown: (id: string) => void;
  openStatusModal: (listingId: string, currentStatus: string) => void;
}

const RecentListings = ({
  dashboardData,
  activeDropdown,
  toggleDropdown,
  openStatusModal,
}: RecentListingsProps) => {
  if (!dashboardData?.recentListings?.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {/* Desktop Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 p-4 text-sm font-medium bg-gray-50 border-b">
        <div className="col-span-5">Details</div>
        <div className="col-span-2">User</div>
        <div className="col-span-2">Plan</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1">Actions</div>
      </div>

      <div className="divide-y">
        {dashboardData.recentListings.slice(0, 5).map((listing) => {
          return (
            <div key={listing.id}>
              {/* Desktop Table Row */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                <div className="col-span-5 flex items-center space-x-3">
                  <Link href={`/admin/dashboard/${listing.id}`}>
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={listing.details.primaryImage || "/placeholder.svg"}
                        alt={listing.details.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  <div>
                    <p className="font-medium text-sm">
                      {listing.details.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {listing.details.category}
                    </p>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={listing.user.profilePicture}
                        alt={listing.user.name}
                      />
                      <AvatarFallback>
                        {listing.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{listing.user.name}</span>
                  </div>
                  {listing.user.accountType === "Seller" && (
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                      >
                        Seller
                      </Badge>
                      <Link href={`/admin/users/${listing.user.customId}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-6 px-2 text-[#1a0066] hover:bg-[#1a0066]/10"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                <div className="col-span-2">
                  <Badge
                    variant={
                      listing.plan.type.includes("Premium")
                        ? "default"
                        : "outline"
                    }
                    className={`text-xs ${
                      listing.plan.type.includes("Free") ? "bg-gray-100" : ""
                    }`}
                  >
                    {listing.plan.type}
                  </Badge>
                </div>

                <div className="col-span-2">
                  <Badge
                    variant={
                      listing.status.value === "live"
                        ? "default"
                        : listing.status.value === "reviewing"
                        ? "secondary"
                        : "destructive"
                    }
                    className="text-xs"
                  >
                    {listing.status.label}
                  </Badge>
                </div>

                <div className="col-span-1 flex justify-end">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleDropdown(listing.id)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    {activeDropdown === listing.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10 border">
                        <div className="py-1">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              window.location.href = `/admin/dashboard/${listing.id}`;
                            }}
                          >
                            See details
                          </button>
                          <button
                            onClick={() =>
                              openStatusModal(
                                listing.id,
                                listing.status.value.toLowerCase()
                              )
                            }
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Update Status
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Card Layout */}
              <div className="md:hidden p-4 hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  <Link href={`/admin/dashboard/${listing.id}`}>
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={listing.details.primaryImage || "/placeholder.svg"}
                        alt={listing.details.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {listing.details.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {listing.details.category}
                        </p>
                      </div>
                      <div className="relative ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleDropdown(listing.id)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        {activeDropdown === listing.id && (
                          <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10 border">
                            <div className="py-1">
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                  window.location.href = `/admin/dashboard/${listing.id}`;
                                }}
                              >
                                See details
                              </button>
                              <button
                                onClick={() =>
                                  openStatusModal(
                                    listing.id,
                                    listing.status.value.toLowerCase()
                                  )
                                }
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Update Status
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={listing.user.profilePicture}
                              alt={listing.user.name}
                            />
                            <AvatarFallback className="text-xs">
                              {listing.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-600">
                            {listing.user.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              listing.plan.type.includes("Premium")
                                ? "default"
                                : "outline"
                            }
                            className={`text-xs ${
                              listing.plan.type.includes("Free")
                                ? "bg-gray-100"
                                : ""
                            }`}
                          >
                            {listing.plan.type}
                          </Badge>
                          <Badge
                            variant={
                              listing.status.value === "live"
                                ? "default"
                                : listing.status.value === "reviewing"
                                ? "secondary"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {listing.status.label}
                          </Badge>
                        </div>
                      </div>
                      {listing.user.accountType === "Seller" && (
                        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                          >
                            Seller
                          </Badge>
                          <Link href={`/admin/users/${listing.user.customId}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-6 px-2 text-[#1a0066] hover:bg-[#1a0066]/10"
                            >
                              View Details
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentListings;

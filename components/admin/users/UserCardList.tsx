import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { User } from "@/types/user/user";

interface UserCardListProps {
  users: User[];
}

export function UserCardList({ users }: UserCardListProps) {
  return (
    <div className="md:hidden space-y-4 p-4">
      {users.map((user) => (
        <div key={user._id} className="bg-gray-50 rounded-lg p-4 border">
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarImage src={user.profilePicture} alt={user.fullName} />
              <AvatarFallback>
                {user.fullName
                  .split(" ")
                  .map((n) => n[0] || "")
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {user.fullName || "Unknown"}
              </div>
              <div className="text-sm text-gray-500 mb-1">
                {user.isVerified ? "Verified" : "Not Verified"}
              </div>
              <div className="text-sm text-gray-600 truncate">
                {user.email || "N/A"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Account Type
              </div>
              <Badge
                variant={user.accountType === "Seller" ? "default" : "outline"}
                className={`mt-1 text-xs ${
                  user.accountType === "Admin"
                    ? "bg-purple-100 text-purple-800"
                    : ""
                }`}
              >
                {user.accountType || "User"}
              </Badge>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Subscription
              </div>
              <Badge
                variant={
                  user.subscriptionStatus === "active" ? "default" : "outline"
                }
                className={`mt-1 text-xs ${
                  user.subscriptionStatus === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {(user.subscriptionStatus || "inactive")
                  .charAt(0)
                  .toUpperCase() +
                  (user.subscriptionStatus || "inactive").slice(1)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Joined:{" "}
              {user.createdAt
                ? format(new Date(user.createdAt), "MMM d, yyyy")
                : "N/A"}
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/users/${user._id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-1"
                >
                  View
                </Button>
              </Link>
              {user.accountType === "Seller" && (
                <Link href={`/admin/users/${user._id}/seller-products`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs px-3 py-1 text-[#1F058F] hover:bg-[#1F058F]/10"
                  >
                    Products
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

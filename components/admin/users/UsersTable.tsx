import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { User } from "@/types/user/user";

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto w-full">
      <Table className="min-w-[800px] w-full">
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Account Type</TableHead>
            <TableHead>Subscription Status</TableHead>
            <TableHead>Joined Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user.profilePicture}
                      alt={user.fullName}
                    />
                    <AvatarFallback>
                      {user.fullName
                        .split(" ")
                        .map((n) => n[0] || "")
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {user.fullName || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.isVerified ? "Verified" : "Not Verified"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.email || "N/A"}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    user.accountType === "Seller" ? "default" : "outline"
                  }
                  className={
                    user.accountType === "Admin"
                      ? "bg-purple-100 text-purple-800"
                      : ""
                  }
                >
                  {user.accountType || "User"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    user.subscriptionStatus === "active" ? "default" : "outline"
                  }
                  className={
                    user.subscriptionStatus === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {(user.subscriptionStatus || "inactive")
                    .charAt(0)
                    .toUpperCase() +
                    (user.subscriptionStatus || "inactive").slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {user.createdAt
                  ? format(new Date(user.createdAt), "MMM d, yyyy")
                  : "N/A"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/users/${user._id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                  {user.accountType === "Seller" && (
                    <Link href={`/admin/users/${user._id}/seller-products`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#1F058F] hover:bg-[#1F058F]/10"
                      >
                        View Products
                      </Button>
                    </Link>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

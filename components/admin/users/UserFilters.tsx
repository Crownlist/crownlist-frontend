import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  accountTypeFilter: string;
  setAccountTypeFilter: (value: string) => void;
  verificationFilter: string;
  setVerificationFilter: (value: string) => void;
  subscriptionFilter: string;
  setSubscriptionFilter: (value: string) => void;
  authMethodFilter: string;
  setAuthMethodFilter: (value: string) => void;
  suspendedFilter: string;
  setSuspendedFilter: (value: string) => void;
  totalUsers: number;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  setCurrentPage: (value: number) => void;
}

export function UserFilters({
  searchTerm,
  setSearchTerm,
  accountTypeFilter,
  setAccountTypeFilter,
  verificationFilter,
  setVerificationFilter,
  subscriptionFilter,
  setSubscriptionFilter,
  authMethodFilter,
  setAuthMethodFilter,
  suspendedFilter,
  setSuspendedFilter,
  totalUsers,
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage,
}: UserFiltersProps) {
  const hasActiveFilters =
    searchTerm ||
    accountTypeFilter !== "all" ||
    verificationFilter !== "all" ||
    subscriptionFilter !== "all" ||
    authMethodFilter !== "all" ||
    suspendedFilter !== "all";

  const clearAllFilters = () => {
    setSearchTerm("");
    setAccountTypeFilter("all");
    setVerificationFilter("all");
    setSubscriptionFilter("all");
    setAuthMethodFilter("all");
    setSuspendedFilter("all");
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 w-full"
            placeholder="Search by name, email, or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Select
            value={accountTypeFilter}
            onValueChange={setAccountTypeFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Account Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="User">User</SelectItem>
              <SelectItem value="Seller">Seller</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={verificationFilter}
            onValueChange={setVerificationFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Verification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="true">Verified</SelectItem>
              <SelectItem value="false">Not Verified</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={subscriptionFilter}
            onValueChange={setSubscriptionFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Subscription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subscriptions</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={authMethodFilter} onValueChange={setAuthMethodFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Auth Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="Form">Email/Password</SelectItem>
              <SelectItem value="Google">Google</SelectItem>
            </SelectContent>
          </Select>

          <Select value={suspendedFilter} onValueChange={setSuspendedFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Account Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              <SelectItem value="false">Active</SelectItem>
              <SelectItem value="true">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters & Results Info */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t">
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchTerm}
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1 hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            )}
            {accountTypeFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Type: {accountTypeFilter}
                <button
                  onClick={() => setAccountTypeFilter("all")}
                  className="ml-1 hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            )}
            {verificationFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {verificationFilter === "true" ? "Verified" : "Not Verified"}
                <button
                  onClick={() => setVerificationFilter("all")}
                  className="ml-1 hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            )}
            {subscriptionFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Subscription: {subscriptionFilter}
                <button
                  onClick={() => setSubscriptionFilter("all")}
                  className="ml-1 hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            )}
            {authMethodFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Auth: {authMethodFilter}
                <button
                  onClick={() => setAuthMethodFilter("all")}
                  className="ml-1 hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            )}
            {suspendedFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {suspendedFilter === "true" ? "Suspended" : "Active"}
                <button
                  onClick={() => setSuspendedFilter("all")}
                  className="ml-1 hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            )}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-6 text-xs"
              >
                Clear all
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {totalUsers} {totalUsers === 1 ? "result" : "results"}
            </span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-24 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="20">20 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
                <SelectItem value="100">100 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

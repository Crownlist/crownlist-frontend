"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { StatCard } from "@/components/admin/users/StatCard";
import { UserFilters } from "@/components/admin/users/UserFilters";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { UserCardList } from "@/components/admin/users/UserCardList";
import { PaginationControls } from "@/components/admin/users/PaginationControls";
import { EmptyUsersState } from "@/components/admin/users/EmptyUsersState";
import { useUsersData } from "@/hooks/useUsersData";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>("all");
  const [authMethodFilter, setAuthMethodFilter] = useState<string>("all");
  const [suspendedFilter, setSuspendedFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch users data with pagination and server-side filtering
  const { data, isLoading, error, refetch, isFetching } = useUsersData({
    currentPage,
    itemsPerPage,
    searchTerm: debouncedSearchTerm,
    accountTypeFilter,
    verificationFilter,
    subscriptionFilter,
    authMethodFilter,
    suspendedFilter,
  });

  // Reset to page 1 when search term or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearchTerm,
    accountTypeFilter,
    verificationFilter,
    subscriptionFilter,
    authMethodFilter,
    suspendedFilter,
  ]);

  // Calculate total pages from total users and items per page
  const users = data?.data?.users || [];
  const totalUsers = data?.data?.totalUsers || 0;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const hasNextPage = currentPage < totalPages;

  // Calculate stats
  const activeUsers = data?.data?.stats?.activeUsers || 0;
  const inactiveUsers = data?.data?.stats?.inactiveUsers || 0;
  const sellerUsers = data?.data?.stats?.sellers || 0;
  const regularUsers = data?.data?.stats?.regularUsers || 0;

  // Only show full page loading on the very first load (no data at all)
  const isInitialLoading = isLoading && !data && !isFetching;

  const hasActiveFilters = Boolean(
    searchTerm ||
      accountTypeFilter !== "all" ||
      verificationFilter !== "all" ||
      subscriptionFilter !== "all" ||
      authMethodFilter !== "all" ||
      suspendedFilter !== "all"
  );

  const clearAllFilters = () => {
    setSearchTerm("");
    setAccountTypeFilter("all");
    setVerificationFilter("all");
    setSubscriptionFilter("all");
    setAuthMethodFilter("all");
    setSuspendedFilter("all");
  };

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-[#1F058F]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading users: {error.message}</p>
        <Button onClick={() => refetch()} className="mt-4" variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 flex flex-col w-full h-full bg-gray-50">
      <div className="w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Users Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and track all users in the system
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="w-fit"
            disabled={isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon="👥"
            color="blue"
          />
          <StatCard
            title="Active Users"
            value={activeUsers}
            icon="✓"
            color="green"
          />
          <StatCard
            title="Inactive Users"
            value={inactiveUsers}
            icon="○"
            color="gray"
          />
          <StatCard
            title="Sellers"
            value={sellerUsers}
            icon="🏪"
            color="purple"
          />
          <StatCard
            title="Regular Users"
            value={regularUsers}
            icon="👤"
            color="orange"
          />
        </div>

        {/* Filters Section */}
        <UserFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          accountTypeFilter={accountTypeFilter}
          setAccountTypeFilter={setAccountTypeFilter}
          verificationFilter={verificationFilter}
          setVerificationFilter={setVerificationFilter}
          subscriptionFilter={subscriptionFilter}
          setSubscriptionFilter={setSubscriptionFilter}
          authMethodFilter={authMethodFilter}
          setAuthMethodFilter={setAuthMethodFilter}
          suspendedFilter={suspendedFilter}
          setSuspendedFilter={setSuspendedFilter}
          totalUsers={totalUsers}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          setCurrentPage={setCurrentPage}
        />

        {/* Users Table/Cards */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Users List
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Showing{" "}
                  {Math.min((currentPage - 1) * itemsPerPage + 1, totalUsers)}{" "}
                  to {Math.min(currentPage * itemsPerPage, totalUsers)} of{" "}
                  {totalUsers} users
                </p>
              </div>
              {isFetching && (
                <RefreshCw className="h-5 w-5 animate-spin text-[#1F058F]" />
              )}
            </div>
          </div>

          <div className="relative min-h-[400px]">
            {isFetching && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 animate-spin text-[#1F058F]" />
                  <span className="text-sm font-medium">Loading users...</span>
                </div>
              </div>
            )}
            {users.length > 0 ? (
              <>
                <UsersTable users={users} />
                <UserCardList users={users} />
              </>
            ) : (
              <EmptyUsersState
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearAllFilters}
              />
            )}
          </div>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            isFetching={isFetching}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

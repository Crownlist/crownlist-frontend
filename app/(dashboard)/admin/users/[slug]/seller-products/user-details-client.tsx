/*eslint-disable*/
'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Mail, Phone, Calendar, Check, X, Clock, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { apiClientAdmin } from "@/lib/interceptor";
import { format } from "date-fns";
import { toast } from "sonner";
import { SellerProducts } from "./seller-products";

type UserDetails = {
  subscriptionStatus: string;
  _id: string;
  fullName: string;
  email: string;
  userCustomId: string;
  authMethod: string;
  accountType: string;
  profilePicture: string;
  isVerified: boolean;
  isAdmin: boolean;
  finishTourGuide: boolean;
  createdAt: string;
  id: string;
  phone?: string;
};

export default function UserDetailsClient({ userId }: { userId: string }) {
  const [showBlockModal, setShowBlockModal] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<UserDetails>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await apiClientAdmin.get(`/users/${userId}`);
      return response.data.data;
    },
  });

  const blockUserMutation = useMutation({
    mutationFn: async (blockDecision: boolean) => {
      const response = await apiClientAdmin.patch('/users', {
        userId,
        blockDecision
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Block User API Response:', data); // Admin notification via console
      toast.success(data.data.message || `User ${data.data?.isBlocked ? 'blocked' : 'unblocked'} successfully`);
      setShowBlockModal(false);
      // Invalidate the user query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
    onError: (error: any) => {
      console.error('Block User API Error:', error.response?.data || error); // Admin notification via console
      toast.error(`Failed to block user: ${error?.response?.data?.message || error?.message || 'Unknown error'}`);
      setShowBlockModal(false);
    }
  });

  const handleBlockUser = () => {
    setShowBlockModal(false);
    // toast.loading("Blocking user...", { id: "block-user" });
    blockUserMutation.mutate(true);
  };

  const openBlockModal = () => {
    setShowBlockModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load user details. Please try again later.
      </div>
    );
  }

  const user = data;
  const joinDate = new Date(user.createdAt);
  const formattedJoinDate = format(joinDate, 'MMM d, yyyy');
  const joinTimeAgo = format(joinDate, 'h:mm a');

  return (
    <div className="p-4 md:p-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-6">
        <Link href="/admin/users" className="text-[#1a0066] hover:underline">
          Users
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <span className="text-gray-600">{user.fullName}</span>
      </div>

      {/* User Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
            <Image
              src={user.profilePicture || "/default-avatar.png"}
              alt={user.fullName}
              width={96}
              height={96}
              className="w-full h-full object-cover"
              priority
            />
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1">
              {user.isVerified ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{user.fullName}</h1>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </div>
                {user.phone && (
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <Phone className="h-4 w-4 mr-2" />
                    {user.phone}
                  </div>
                )}
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined {formattedJoinDate}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={user.accountType === 'Admin' ? 'default' : 'outline'}>
                  {user.accountType}
                </Badge>
                <Badge variant={user.isVerified ? 'default' : 'secondary'}>
                  {user.isVerified ? 'Verified' : 'Unverified'}
                </Badge>
                <Badge variant={user.subscriptionStatus === 'active' ? 'default' : 'outline'}>
                  {user.subscriptionStatus === 'active' ? 'Subscribed' : 'Not Subscribed'}
                </Badge>
                {user.isVerified &&
                  <Button
                    size="sm"
                    onClick={openBlockModal}
                    disabled={blockUserMutation.isPending}
                    className="ml-2 bg-red-600"
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    {blockUserMutation.isPending ? 'Blocking...' : 'Block User'}
                  </Button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 max-w-md mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          {/* <TabsTrigger value="documents">Documents</TabsTrigger> */}
          {user.accountType === 'Seller' && (
            <TabsTrigger value="products">Products</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="font-medium">{user.userCustomId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Authentication Method</p>
                <p className="font-medium">{user.authMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Status</p>
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-2 ${user.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span>{user.isVerified ? 'Active' : 'Pending Verification'}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{formattedJoinDate} at {joinTimeAgo}</span>
                </div>
              </div>
            </div>
          </div>

          {user.accountType === 'Seller' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Seller Information</h3>
                <Button variant="outline" size="sm">View Store</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-sm text-gray-500">Total Products</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-sm text-gray-500">Average Rating</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold">98%</p>
                  <p className="text-sm text-gray-500">Completion</p>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Account Created</p>
                  <p className="text-sm text-gray-500">{formattedJoinDate} at {joinTimeAgo}</p>
                </div>
              </div>
              <div className="text-center py-4 text-gray-500">
                No recent activity to show
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium mb-4">Account Settings</h3>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Email Verification</p>
                    <p className="text-sm text-gray-500">
                      {user.isVerified
                        ? 'Your email is verified'
                        : 'Please verify your email address'}
                    </p>
                  </div>
                  <Button variant={user.isVerified ? 'outline' : 'default'} size="sm">
                    {user.isVerified ? 'Verified' : 'Verify Email'}
                  </Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Documents</h3>
              <Button variant="outline" size="sm">Upload Document</Button>
            </div>
            <div className="text-center py-8 text-gray-500">
              <p>No documents uploaded yet</p>
              <p className="text-sm mt-2">Upload documents to verify your identity</p>
            </div>
          </div>
        </TabsContent>

        {user.accountType === 'Seller' && (
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Seller ' s Products</CardTitle>
                <CardDescription>Manage products listed by this seller</CardDescription>
              </CardHeader>
              <CardContent>
                <SellerProducts />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <ConfirmationModal
        open={showBlockModal}
        onOpenChange={setShowBlockModal}
        title="Block User"
        description={`Are you sure you want to block ${user.fullName}? This will prevent them from accessing their account.`}
        confirmText="Block User"
        cancelText="Cancel"
        onConfirm={handleBlockUser}
        variant="destructive"
      />
    </div>
  );
}

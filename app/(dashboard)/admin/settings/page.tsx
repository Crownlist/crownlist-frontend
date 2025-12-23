/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { Loader2, RotateCcw, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiClientAdmin } from "@/lib/interceptor";
import { ConfirmationModal } from "@/components/ConfirmationModal";

interface SettingsSection {
  notifications: {
    listUpdates: boolean;
    customerMessages: boolean;
    reviewAlerts: boolean;
    customerActivity: boolean;
    suspiciousActivity: boolean;
    passwordChanges: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
  };
  privacy: {
    profileVisibility: string;
    showEmail: boolean;
    showPhoneNumber: boolean;
    showLocation: boolean;
    allowDirectMessages: boolean;
    allowReviews: boolean;
  };
  general: {
    language: string;
    timezone: string;
    currency: string;
    theme: string;
    autoSave: boolean;
    tourGuideCompleted: boolean;
  };
}

interface Settings extends SettingsSection {
  userId: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<Settings | null>(null);

  // Confirmation modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [resetType, setResetType] = useState<
    "notifications" | "privacy" | "general" | "all"
  >("notifications");

  // Password state
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // Fetch settings
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await apiClientAdmin.get("/settings");
      console.log("settings", res);
      const data = res?.data?.data?.settings || res?.data?.settings;
      setSettings(data);
    } catch (error: any) {
      console.error("Failed to fetch settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  // Handle settings section update (notifications, privacy, general)
  const handleSectionUpdate = async (section: keyof SettingsSection) => {
    if (!settings) return;
    try {
      setUpdating(true);
      await apiClientAdmin.patch(`/settings/${section}`, settings[section]);
      toast.success(
        `${
          section.charAt(0).toUpperCase() + section.slice(1)
        } settings updated successfully`
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || `Failed to update ${section} settings`
      );
      fetchSettings(); // Revert on error
    } finally {
      setUpdating(false);
    }
  };

  // Open confirmation modal for reset
  const openResetConfirmation = (
    settingsType: "notifications" | "privacy" | "general" | "all"
  ) => {
    setResetType(settingsType);
    setConfirmModalOpen(true);
  };

  // Handle reset settings after confirmation
  const handleResetSettings = async () => {
    setConfirmModalOpen(false);
    try {
      setResetting(true);
      await apiClientAdmin.post("/settings/reset", { settingsType: resetType });
      toast.success(
        `${
          resetType === "all"
            ? "All"
            : resetType.charAt(0).toUpperCase() + resetType.slice(1)
        } settings reset successfully`
      );
      await fetchSettings();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to reset settings");
    } finally {
      setResetting(false);
    }
  };

  // Handle individual field update (optimistic update)
  const handleFieldUpdate = (
    section: keyof SettingsSection,
    field: string,
    value: any
  ) => {
    if (!settings) return;
    const updatedSettings = {
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    };
    setSettings(updatedSettings);
  };

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password form submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setShowPasswordConfirm(true);
  };

  // Handle confirmed password submission
  const handleConfirmedPasswordSubmit = async () => {
    setShowPasswordConfirm(false);
    setIsPasswordLoading(true);

    try {
      await apiClientAdmin.patch("/users/password", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Password change error:", error);
      toast.error("Failed to update password. Please try again.");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Tabs */}
      <div className="bg-[#f0eeff] rounded-full p-1 inline-flex mb-8 flex-wrap gap-1">
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            activeTab === "notifications"
              ? "bg-white text-[#1a0066] shadow-sm"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab("privacy")}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            activeTab === "privacy"
              ? "bg-white text-[#1a0066] shadow-sm"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          Privacy
        </button>
        <button
          onClick={() => setActiveTab("general")}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            activeTab === "general"
              ? "bg-white text-[#1a0066] shadow-sm"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            activeTab === "security"
              ? "bg-white text-[#1a0066] shadow-sm"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          Security
        </button>
      </div>

      {/* Notifications Tab */}
      {activeTab === "notifications" && settings && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-medium mb-1">Notifications</h2>
            <p className="text-gray-600 mb-8">
              Manage your notification preferences
            </p>

            <div className="space-y-6">
              <h3 className="text-base font-medium text-gray-700 mb-4">
                Customer notifications
              </h3>

              <div className="flex items-start space-x-3">
                <Switch
                  checked={settings.notifications.listUpdates}
                  onCheckedChange={(val) =>
                    handleFieldUpdate("notifications", "listUpdates", val)
                  }
                />
                <div>
                  <Label className="font-medium">List updates</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Receive alerts for new list, cancelled list and pending
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Switch
                  checked={settings.notifications.customerMessages}
                  onCheckedChange={(val) =>
                    handleFieldUpdate("notifications", "customerMessages", val)
                  }
                />
                <div>
                  <Label className="font-medium">Customer messages</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Alerts for direct messages or inquiries from customers
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Switch
                  checked={settings.notifications.reviewAlerts}
                  onCheckedChange={(val) =>
                    handleFieldUpdate("notifications", "reviewAlerts", val)
                  }
                />
                <div>
                  <Label className="font-medium">Review alerts</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Notifications when customers leave reviews or feedback
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Switch
                  checked={settings.notifications.customerActivity}
                  onCheckedChange={(val) =>
                    handleFieldUpdate("notifications", "customerActivity", val)
                  }
                />
                <div>
                  <Label className="font-medium">Customer activity</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Stay informed about new customer registrations or updates to
                    customer profiles
                  </p>
                </div>
              </div>

              <h3 className="text-base font-medium text-gray-700 mb-4 mt-8">
                Admin notifications
              </h3>

              <div className="flex items-start space-x-3">
                <Switch
                  checked={settings.notifications.suspiciousActivity}
                  onCheckedChange={(val) =>
                    handleFieldUpdate(
                      "notifications",
                      "suspiciousActivity",
                      val
                    )
                  }
                />
                <div>
                  <Label className="font-medium">Suspicious activity</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Alerts for failed logins or unusual admin activity
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Switch
                  checked={settings.notifications.passwordChanges}
                  onCheckedChange={(val) =>
                    handleFieldUpdate("notifications", "passwordChanges", val)
                  }
                />
                <div>
                  <Label className="font-medium">Password changes</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Get notified of changes to admin passwords
                  </p>
                </div>
              </div>

              <h3 className="text-base font-medium text-gray-700 mb-4 mt-8">
                Notification channels
              </h3>

              <div className="flex items-start space-x-3">
                <Switch
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(val) =>
                    handleFieldUpdate(
                      "notifications",
                      "emailNotifications",
                      val
                    )
                  }
                />
                <div>
                  <Label className="font-medium">Email notifications</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Receive notifications via email
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Switch
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(val) =>
                    handleFieldUpdate("notifications", "pushNotifications", val)
                  }
                />
                <div>
                  <Label className="font-medium">Push notifications</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Receive push notifications in browser
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Switch
                  checked={settings.notifications.smsNotifications}
                  onCheckedChange={(val) =>
                    handleFieldUpdate("notifications", "smsNotifications", val)
                  }
                />
                <div>
                  <Label className="font-medium">SMS notifications</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Receive notifications via SMS
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t">
              <Button
                onClick={() => handleSectionUpdate("notifications")}
                className="bg-[#1a0066] hover:bg-[#2a0bc0]"
                disabled={updating || resetting}
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => openResetConfirmation("notifications")}
                disabled={updating || resetting}
              >
                {resetting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset to Default
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Tab */}
      {activeTab === "privacy" && settings && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-medium mb-1">Privacy</h2>
            <p className="text-gray-600 mb-8">Manage your privacy settings</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile visibility
                </label>
                <Select
                  value={settings.privacy.profileVisibility}
                  onValueChange={(val) =>
                    handleFieldUpdate("privacy", "profileVisibility", val)
                  }
                >
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-start space-x-3">
                <Switch
                  checked={settings.privacy.showEmail}
                  onCheckedChange={(val) =>
                    handleFieldUpdate("privacy", "showEmail", val)
                  }
                />
                <div>
                  <Label className="font-medium">Show email</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Display your email address on your profile
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Switch
                  checked={settings.privacy.showPhoneNumber}
                  onCheckedChange={(val) =>
                    handleFieldUpdate("privacy", "showPhoneNumber", val)
                  }
                />
                <div>
                  <Label className="font-medium">Show phone number</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Display your phone number on your profile
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Switch
                  checked={settings.privacy.showLocation}
                  onCheckedChange={(val) =>
                    handleFieldUpdate("privacy", "showLocation", val)
                  }
                />
                <div>
                  <Label className="font-medium">Show location</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Display your location on your profile
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Switch
                  checked={settings.privacy.allowDirectMessages}
                  onCheckedChange={(val) =>
                    handleFieldUpdate("privacy", "allowDirectMessages", val)
                  }
                />
                <div>
                  <Label className="font-medium">Allow direct messages</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Allow users to send you direct messages
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Switch
                  checked={settings.privacy.allowReviews}
                  onCheckedChange={(val) =>
                    handleFieldUpdate("privacy", "allowReviews", val)
                  }
                />
                <div>
                  <Label className="font-medium">Allow reviews</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Allow users to leave reviews on your profile
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t">
              <Button
                onClick={() => handleSectionUpdate("privacy")}
                className="bg-[#1a0066] hover:bg-[#2a0bc0]"
                disabled={updating || resetting}
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => openResetConfirmation("privacy")}
                disabled={updating || resetting}
              >
                {resetting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset to Default
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* General Tab */}
      {activeTab === "general" && settings && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-medium mb-1">General</h2>
            <p className="text-gray-600 mb-8">
              Manage your general preferences
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <Select
                  value={settings.general.language}
                  onValueChange={(val) =>
                    handleFieldUpdate("general", "language", val)
                  }
                >
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <Select
                  value={settings.general.timezone}
                  onValueChange={(val) =>
                    handleFieldUpdate("general", "timezone", val)
                  }
                >
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">
                      Eastern Time
                    </SelectItem>
                    <SelectItem value="America/Los_Angeles">
                      Pacific Time
                    </SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Africa/Lagos">Lagos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <Select
                  value={settings.general.currency}
                  onValueChange={(val) =>
                    handleFieldUpdate("general", "currency", val)
                  }
                >
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="NGN">NGN (₦)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <Select
                  value={settings.general.theme}
                  onValueChange={(val) =>
                    handleFieldUpdate("general", "theme", val)
                  }
                >
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-start space-x-3">
                <Switch
                  checked={settings.general.autoSave}
                  onCheckedChange={(val) =>
                    handleFieldUpdate("general", "autoSave", val)
                  }
                />
                <div>
                  <Label className="font-medium">Auto-save</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Automatically save your work
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Switch
                  checked={settings.general.tourGuideCompleted}
                  onCheckedChange={(val) =>
                    handleFieldUpdate("general", "tourGuideCompleted", val)
                  }
                />
                <div>
                  <Label className="font-medium">Tour guide completed</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Mark the tour guide as completed
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t">
              <Button
                onClick={() => handleSectionUpdate("general")}
                className="bg-[#1a0066] hover:bg-[#2a0bc0]"
                disabled={updating || resetting}
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => openResetConfirmation("general")}
                disabled={updating || resetting}
              >
                {resetting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset to Default
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-medium mb-1">Security</h2>
            <p className="text-gray-600 mb-8">
              Manage your account security settings
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Change Password
                </h3>
                <form
                  onSubmit={handlePasswordSubmit}
                  className="space-y-4 max-w-md"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showOldPassword ? "text" : "password"}
                        name="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showOldPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="bg-[#1a0066] hover:bg-[#2a0bc0] w-full"
                    disabled={isPasswordLoading}
                  >
                    {isPasswordLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        title="Reset Settings"
        description={`Are you sure you want to reset ${
          resetType === "all" ? "all" : resetType
        } settings to default? This action cannot be undone.`}
        confirmText="Reset"
        cancelText="Cancel"
        onConfirm={handleResetSettings}
        variant="destructive"
      />

      {/* Password Change Confirmation Modal */}
      <ConfirmationModal
        open={showPasswordConfirm}
        onOpenChange={setShowPasswordConfirm}
        title="Change Password"
        description="Are you sure you want to change your password? This action will log you out of all other devices."
        confirmText="Change Password"
        cancelText="Cancel"
        onConfirm={handleConfirmedPasswordSubmit}
        variant="default"
      />
    </div>
  );
}

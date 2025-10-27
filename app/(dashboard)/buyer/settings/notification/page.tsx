"use client"

import React, { useState, useEffect } from 'react';
import { Bell, Volume2, VolumeX, Mail, MessageCircle } from 'lucide-react';

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState({
    soundEnabled: true,
    pushEnabled: true,
    emailEnabled: true,
    messageNotifications: true,
    orderNotifications: true,
    paymentNotifications: true,
    productNotifications: true,
    securityNotifications: true,
    promotionNotifications: false,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  const handleToggle = (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  return (
    <div className="w-full px-4 py-4 mb-0">
      <main className="w-full max-w-2xl mx-auto max-h-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell size={24} />
            Notification Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Manage how you receive notifications and what types of notifications you want to see.
          </p>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.soundEnabled ? <Volume2 size={20} className="text-blue-600" /> : <VolumeX size={20} className="text-gray-400" />}
                  <div>
                    <p className="font-medium">Sound Notifications</p>
                    <p className="text-sm text-gray-500">Play sound when receiving notifications</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={() => handleToggle('soundEnabled')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-blue-600" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-500">Receive browser push notifications</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pushEnabled}
                    onChange={() => handleToggle('pushEnabled')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-blue-600" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailEnabled}
                    onChange={() => handleToggle('emailEnabled')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Notification Types */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageCircle size={20} className="text-blue-600" />
                  <div>
                    <p className="font-medium">Messages</p>
                    <p className="text-sm text-gray-500">New messages from sellers/buyers</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.messageNotifications}
                    onChange={() => handleToggle('messageNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">📦</div>
                  <div>
                    <p className="font-medium">Order Updates</p>
                    <p className="text-sm text-gray-500">Status updates on your orders</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.orderNotifications}
                    onChange={() => handleToggle('orderNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-green-600 flex items-center justify-center text-white text-xs font-bold">💰</div>
                  <div>
                    <p className="font-medium">Payment Notifications</p>
                    <p className="text-sm text-gray-500">Payment confirmations and failures</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.paymentNotifications}
                    onChange={() => handleToggle('paymentNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-purple-600 flex items-center justify-center text-white text-xs font-bold">🏷️</div>
                  <div>
                    <p className="font-medium">Product Updates</p>
                    <p className="text-sm text-gray-500">Product approvals and rejections</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.productNotifications}
                    onChange={() => handleToggle('productNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-red-600 flex items-center justify-center text-white text-xs font-bold">🔒</div>
                  <div>
                    <p className="font-medium">Security Alerts</p>
                    <p className="text-sm text-gray-500">Security-related notifications</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.securityNotifications}
                    onChange={() => handleToggle('securityNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-orange-600 flex items-center justify-center text-white text-xs font-bold">🏷️</div>
                  <div>
                    <p className="font-medium">Promotional</p>
                    <p className="text-sm text-gray-500">Promotional offers and updates</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.promotionNotifications}
                    onChange={() => handleToggle('promotionNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

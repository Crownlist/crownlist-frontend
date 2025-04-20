"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/custom-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { countries } from "@/constants/countries";
import { nigerianStates, State } from "../../constants/states";
import { Eye, EyeOff } from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  address: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  countryCode: string;
}

export default function ProfilePage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    country: "Nigeria",
    state: "",
    address: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    countryCode: "",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      toast({
        title: "Success",
        description: "Profile image uploaded successfully",
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      formData.oldPassword ||
      formData.newPassword ||
      formData.confirmPassword
    ) {
      if (
        !formData.oldPassword ||
        !formData.newPassword ||
        !formData.confirmPassword
      ) {
        toast({
          title: "Error",
          description: "Please fill in all password fields",
        });

        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "New password and confirm password do not match",
        });
        console.log("Please fill in all password fields");
        return;
      }
    }
    // Proceed with API call
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      country: "Nigeria",
      state: "",
      address: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      countryCode: "",
    });
    setProfileImage(null);
    toast({
      title: "Cancelled",
      description: "Changes discarded",
    });
  };

  useEffect(() => {
    const selectedCountry = countries.find((c) => c.name === formData.country);
    setFormData((prev) => ({
      ...prev,
      state: "", // Reset state
      countryCode: selectedCountry?.code || "",
    }));
  }, [formData.country]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Profile Details</h2>
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-20 h-20 mb-4">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-[#E63946] text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl">
                    {formData.fullName.charAt(0) || "F"}
                  </div>
                )}
              </div>
              <label className="flex items-center border p-2 gap-2 rounded-2xl cursor-pointer hover:bg-gray-50">
                <Image src="/cloud.png" alt="cloud" width={20} height={20} />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Jimoh Adesina"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="sample@gmail.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <select
                    id="countryCode"
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="absolute left-0 top-0 h-full bg-transparent border-r border-gray-300 px-2 text-sm focus:outline-none"
                    style={{ width: "100px" }}
                  >
                    {countries.map((country: (typeof countries)[number]) => (
                      <option
                        key={`${country.code}-${country.name}`}
                        value={country.code}
                      >
                        {country.code}
                      </option>
                    ))}
                  </select>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="081 000 0000"
                    className="pl-28"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                >
                  {countries.map((country: (typeof countries)[number]) => (
                    <option
                      key={`${country.code}-${country.name}`}
                      value={country.name}
                    >
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                >
                  {nigerianStates.map((state: State) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Security</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Old Password</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    name="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    value={formData.oldPassword}
                    onChange={handleChange}
                    placeholder="Enter old password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              type="submit"
              className="bg-black text-white py-2 px-10 rounded-full"
            >
              Update
            </Button>
            <Button
              type="button"
              variant="outline"
              className="py-2 px-10 rounded-full"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

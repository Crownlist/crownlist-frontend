import { redirect } from "next/navigation"

export default function SettingsPage() {
  // Redirect to the profile tab by default
  redirect("/seller/settings/profile")
}

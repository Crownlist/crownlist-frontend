import type React from "react"
import ClientLayout from "./client-layout"
import "../../globals.css"
import UserLayout from "@/client/user-layout"


export const metadata = {
  title: 'Seller | Dashboard'
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserLayout>
      <ClientLayout>{children}</ClientLayout>
    </UserLayout>
  )
}

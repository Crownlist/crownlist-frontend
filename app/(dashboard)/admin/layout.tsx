import type React from "react"
import ClientLayout from "./client-layout"
import "../../globals.css"
import AdminLayout from "../../../client/admin-layount"


export const metadata = {
  title: 'Seller | Dashboard'
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminLayout>
        <ClientLayout>{children}</ClientLayout>
    </AdminLayout>
  )
}

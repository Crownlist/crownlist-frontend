import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "../components/ui/sonner"
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Crownlist",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      className={`${inter.variable} antialiased`}
      >
        {children}
        <Toaster/>
      </body>
    </html>
  );
}

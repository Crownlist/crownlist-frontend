import type React from "react"
import "../globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Head from "next/head"
// import ChatBot from "@/components/Home/ChatBot"
import NextTopLoader from 'nextjs-toploader'
import ChatBot from "@/components/Home/ChatBot"
import BottomNav from "@/components/BottomNav"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Crownlist - Buy and Sell Locally",
  description: "Find great deals on furniture, clothes, electronics, and more near you.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Head>
        <meta name="theme-color" content="#1F058F" />
        <meta name="msapplication-navbutton-color" content="#1F058F" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#1F058F" />
      </Head>
      <body className={inter.className}>
      <NextTopLoader color='#1F058F' showSpinner={false} />
      {/* <Toaster position="top-center" /> */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <ChatBot />
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  )
}

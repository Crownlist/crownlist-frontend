
import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import Wrapper from "@/client/wrapper"
// import BottomNav from "@/components/BottomNav"
import ReactQueryProvider from "@/providers/ReactQueryProvider"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import TawktoChat from "@/components/TawktoChat"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://crownlist.store'),
  title: "Crownlist - Buy and Sell Locally",
  description: "Find great deals on furniture, clothes, electronics, and more near you.",
  openGraph: {
    title: "Crownlist - Buy and Sell Locally",
    description: "Find great deals on furniture, clothes, electronics, and more near you.",
    images: [
      {
        url: "/newlogo2.jpg",
        width: 1200,
        height: 630,
        alt: "Crownlist - Buy and Sell Locally",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crownlist - Buy and Sell Locally",
    description: "Find great deals on furniture, clothes, electronics, and more near you.",
    images: ["/newlogo2.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <ReactQueryProvider>
            <Wrapper>{children}</Wrapper>
            {/* <ChatBot /> */}
            {/* <BottomNav/> */}
          </ReactQueryProvider>
          <TawktoChat />
          <Analytics />
          <SpeedInsights />
      </body>
    </html>
  )
}

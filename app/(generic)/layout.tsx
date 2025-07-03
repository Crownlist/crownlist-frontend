import type React from "react"
import "../globals.css"
import { Inter } from "next/font/google"
import Head from "next/head"
import ChatBot from "@/components/Home/ChatBot"
import Wrapper from "@/client/wrapper"

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
         <Wrapper> {children} </Wrapper>
          <ChatBot />
      </body>
    </html>
  )
}

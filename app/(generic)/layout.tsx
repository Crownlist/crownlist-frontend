import type React from "react"
import "../globals.css"
// import ChatBot from "@/components/Home/ChatBot"
import Wrapper from "@/client/wrapper"

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
    <Wrapper> {children} </Wrapper>
  )
}

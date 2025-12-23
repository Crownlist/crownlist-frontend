import type React from "react";
import "../globals.css";
// import ChatBot from "@/components/Home/ChatBot"
import Wrapper from "@/client/wrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Wrapper> {children} </Wrapper>;
}

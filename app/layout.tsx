import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "../components/ui/sonner"

const interSans = localFont({
  src: "./font/Inter_24pt-Medium.ttf",
  variable: "--font-inter-sans",
});

const interMono = localFont({
  src: "./font/Inter_24pt-Regular.ttf",
  variable: "--font-inter-mono",
});



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
        className={`${interSans.variable} ${interMono.variable} antialiased`}
      >
        {children}
        <Toaster/>
      </body>
    </html>
  );
}

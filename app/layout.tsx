import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "../components/ui/sonner";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
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
      <body className={`${inter.variable} antialiased`}>
        <main className="flex flex-col min-h-screen">
          <Header />

          <div className="flex-grow min-h-screen">{children}</div>

          <Footer />
        </main>
        <Toaster />
      </body>
    </html>
  );
}

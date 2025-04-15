import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Head from "next/head"
import ChatBot from "../components/Home/ChatBot"
import NextTopLoader from 'nextjs-toploader'

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
        </ThemeProvider>
      </body>
    </html>
  )
}

// import type { Metadata } from "next";
// import "./globals.css";
// import { Toaster } from "../components/ui/sonner";
// import { Inter } from "next/font/google";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: "Crownlist",
//   description: "",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={`${inter.variable} antialiased`}>
//         <main className="flex flex-col min-h-screen">
//           <Header />

//           <div className="flex-grow min-h-screen">{children}</div>

//           <Footer />
//         </main>
//         <Toaster />
//       </body>
//     </html>
//   );
// }

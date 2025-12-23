import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import Wrapper from "@/client/wrapper";
// import BottomNav from "@/components/BottomNav"
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
// import TawktoChat from "@/components/TawktoChat";
import SetVh from "@/components/SetVh";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://crownlist.store"),
  title:
    "Crownlist - Your Free Trusted Marketplace | Sell It, Find It, Enjoy It",
  description:
    "Connect with local sellers and discover exactly what you've been searching for. Buy and sell phones, tablets, electronics, fashion, property and more. Free to use, safe and secure marketplace.",
  keywords: [
    "buy and sell",
    "marketplace",
    "local marketplace",
    "electronics",
    "phones",
    "tablets",
    "fashion",
    "property",
    "trusted marketplace",
    "escrow system",
    "local sellers",
    "trusted buyer",
  ],
  authors: [{ name: "Crownlist" }],
  creator: "Crownlist",
  publisher: "Crownlist",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  openGraph: {
    title:
      "Crownlist - Your Free Trusted Marketplace | Sell It, Find It, Enjoy It",
    description:
      "Connect with local sellers and discover exactly what you've been searching for. Buy and sell phones, tablets, electronics, fashion, property and more. Free, safe, and secure.",
    url: "https://crownlist.store",
    siteName: "Crownlist",
    images: [
      {
        url: "/newlogo2.jpg",
        width: 1200,
        height: 630,
        alt: "Crownlist - Your Free Trusted Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crownlist - Your Free Trusted Marketplace",
    description:
      "Connect with local sellers. Buy and sell phones, tablets, electronics, fashion, property and more.",
    images: ["/newlogo2.jpg"],
    creator: "@crownlist",
  },
  verification: {
    google: "google-site-verification",
  },
  alternates: {
    canonical: "https://crownlist.store",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body className={inter.className}>
        <ReactQueryProvider>
          <Wrapper>{children}</Wrapper>
          <SetVh />
          {/* <ChatBot /> */}
          {/* <BottomNav/> */}
        </ReactQueryProvider>
        {/* <TawktoChat /> */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

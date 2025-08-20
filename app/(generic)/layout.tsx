import type React from "react"
import "../globals.css"
// import ChatBot from "@/components/Home/ChatBot"
import Wrapper from "@/client/wrapper"
import Script from "next/script";

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
    <>
    <Wrapper> {children} </Wrapper>
      {/* Tawk.to Live Chat Script */}
        <Script id="tawk-script" strategy="afterInteractive">
          {`
            var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
            (function(){
              var s1 = document.createElement("script"),
                  s0 = document.getElementsByTagName("script")[0];
              s1.async = true;
              s1.src = 'https://embed.tawk.to/68a20642b25b86192ad78266/1j2segtok';
              s1.charset = 'UTF-8';
              s1.setAttribute('crossorigin', '*');
              s0.parentNode.insertBefore(s1, s0);
            })();
          `}
        </Script>
{/*     <ChatBot /> */}
    </>
  )
}

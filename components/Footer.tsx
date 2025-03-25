import Image from "next/image"
import Link from "next/link"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Twitter, Linkedin, Instagram, Facebook, MapPin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Newsletter Section */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/fotter1.png"
            alt="Background"
            fill
            className="object-cover brightness-[0.85] shadow  shadow-black"
          />
        </div>

        <div className="relative z-10 max-w-[85%] mx-auto py-12 md:py-20 flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="max-w-xs">
            <h2 className="text-3xl font-bold text-white">Sign up for news and special offers</h2>
          </div>

          <div className="max-w-md">
            <p className="text-white mb-4">
              Get the latest cars, car news, buying tips and updates straight to your inbox. Sign up to our newsletter
              now.
            </p>
            <div className="flex">
              <Input
                type="email"
                placeholder="Enter your email"
                className="rounded-l-full rounded-r-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-white"
              />
              <Button className="rounded-r-full rounded-l-none bg-[#3B0DF2] hover:bg-[#2E0ABF] text-white border-0">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-black text-white py-8">
        <div className="max-w-[85%] mx-auto ">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-8">
            {/* Logo and Tagline */}
            <div className="md:col-span-1">
              <Image src="/assets/icons/Logo.svg" width={30} height={30} alt="Joelist Logo" />
              <p className="mt-4 text-sm text-gray-400">Joelist your number one product listing company</p>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    About us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Contact us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Safety
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact and Social */}
            <div>
              <h3 className="font-medium mb-4">Contact us</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin size={16} />
                  <span>Kwara, Nigeria</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Mail size={16} />
                  <span>info@joelist.com.ng</span>
                </div>
              </div>

              <h3 className="font-medium mt-6 mb-2">Socials</h3>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter size={20} />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin size={20} />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram size={20} />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook size={20} />
                </Link>
              </div>
            </div>
          </div>

          {/* Large Watermark Text */}
          {/* <div className="relative py-12">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <span className="text-[120px] md:text-[180px] font-bold tracking-tighter">Crownlist</span>
            </div> */}
          <div className="bg-black text-white py-8 md:py-12 md:m-3  border-t border-gray-800 relative h-full w-full">
            <Image src={"/fottertext.png"} alt={'footer'} fill className="object-fill" />
          </div>
        

        {/* Copyright and Payment Methods */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-800">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">©2025 Joelist. All rights reserved.</p>

          <div className="flex space-x-3">
            {/* <Image
                src="/placeholder.svg?height=24&width=24"
                width={24}
                height={24}
                alt="YouTube"
                className="grayscale"
              /> */}
            <Image
              src="/icons/apple-pay.svg"
              width={24}
              height={24}
              alt="Apple Pay"
            // className="grayscale"
            />
            <Image
              src="/icons/google-pay.svg"
              width={24}
              height={24}
              alt="Google Pay"
            // className="grayscale"
            />
            <Image
              src="/icons/shop-pay.svg"
              width={24}
              height={24}
              alt="Shop Pay"
            // className="grayscale"
            />
            <Image
              src="/icons/mastercard.svg"
              width={24}
              height={24}
              alt="Mastercard"
            // className="grayscale"
            />
            <Image
              src="/icons/visa.svg"
              width={24}
              height={24}
              alt="Visa"
            // className="grayscale"
            />
          </div>
        </div>
      </div>
    </div>
    </footer >
  )
}


// // import { Search } from "lucide-react";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";

// const Footer = () => {
//   return (
//     <footer
//       className="min-h-[580px] bg-[#141414] bg-center bg-cover h-full w-full bg-no-repeat relative"
//       style={{
//         backgroundImage: "url(/assets/images/fashion-clothing-hangers.png)",
//       }}
//     >
//       <div className="w-full h-full bg-linear-to-b from-[rgb(20,20,20,0.5)] to-[rgb(20,20,20)] z-50 absolute top-0 left-0 text-white flex flex-col justify-end pb-24">
//         <div className="w-full max-w-[85%] mx-auto flex justify-between items-center gap-64">
//           <h4 className="text-[48px] leading-[57px] max-w-[40%]">
//             Sign up for news and special offers
//           </h4>

//           <div className="max-w-[482px]">
//             <p className="text-lg font-normal mt-5">
//               Get the latest cars, car news, buying tips and updates straight to
//               your inbox. Sign up to our newsletter now.
//             </p>

//             <div className="w-full h-10 flex items-start relative mt-7">
//               <Input
//                 type="email"
//                 className="border border-[#D6D6D6] bg-white text-black rounded w-full max-w-[470px] rounded-tl-[99px] rounded-bl-[99px] py-3 px-5 h-full placeholder:text-[#141414]"
//                 placeholder="Enter your email"
//               />

//               <Button
//                 size="sm"
//                 className="bg-[#1F058F] text-white py-3 px-5 rounded-tr-[99px] rounded-br-[99px] rounded-tl-0 rounded-bl-0 text-sm flex justify-between items-center h-full"
//               >
//                 Subscribe
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

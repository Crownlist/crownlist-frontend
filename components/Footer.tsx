"use client";

/*eslint-disable*/

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Instagram,
  Facebook,
  MapPin,
  Mail,
  AlertCircle,
  Send,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Footer() {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.userData);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handlePostAdClick = () => {
    if (!userData) {
      setModalMessage(
        "Please log in to post an ad. Only sellers can post products on our platform."
      );
      setModalOpen(true);
    } else if (userData.accountType !== "Seller") {
      setModalMessage(
        "Only sellers can post ads. Please switch to a seller account or contact support for assistance."
      );
      setModalOpen(true);
    } else {
      router.push("/seller/product/post-product");
    }
  };

  return (
    <footer className="w-full z-10">
      {/* Newsletter Section */}
      {/* <div className="relative w-full bg-[#1F058F]">
       <div className='container mx-auto'>
        <div className="flex flex-row w-full justify-between sm:justify-evenly md:gap-18 p-5 text-white align-middle items-center  ">
           <div className="flex align-middle font-semibold">Have something to sell?</div>
            <Link href={'/seller/dashboard'}>
           <Button className="flex align-middle rounded-full bg-transparent   hover:bg-[#2a0bc0] text-white border-2 border-white">Post ads..</Button>
           </Link>
        </div>
        </div>
      </div> */}

      <div className="mt-0 w-full px-6 pb-6 container">
        <div className="flex flex-col md:flex-row w-full justify-between  bg-white  shadow-xl rounded-md overflow-hidden  ">
          <div className="p-6 md:w-1/2 md:flex md:flex-col md:justify-center">
            <h2 className="text-2xl font-medium ">Got Something to Sell?</h2>
            <h2 className="text-2xl font-medium mb-2">Post It Here!</h2>
            <p className="text-gray-500 mb-6 max-w-lg">
              Reach thousands of potential buyers in your area and get your item
              seen today! posting an ad takes just a few seconds
            </p>
            <div className="flex w-full max-sm:justify-center align-middle">
              <Button
                onClick={handlePostAdClick}
                className="flex justify-center bg-[#1F058F] rounded-full items-center px-12"
              >
                Post Your ad now
              </Button>
            </div>
          </div>
          <div className="w-full h-auto relative md:w-1/2 hidden sm:block">
            <Image
              src="/hanger.png"
              alt="Clothing on hangers"
              width={600}
              height={600}
              className="object-contain h-full w-full rounded-r-md"
            />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-black text-white py-8 max-sm:px-2">
        <div className="container mx-auto max-md:px-3 ">
          <div className="flex flex-col justify-between gap-2 border-b border-[#FFFFFF40] pb-4 md:flex-row">
            <div>
              <h6 className="mb-0 font-semibold text-white">
                Join our newsletter
              </h6>
              <span className="text-sm text-white">
                We'll send you a nice letter once per week. No spam.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Input
                placeholder="Enter your email"
                type="email"
                className=" bg-gray-800 border-gray-700 text-white sm:min-w-[300px]"
              />
              <Button className="rounded-r-full rounded-l-full  bg-[#1F058F] hover:bg-[#2a0bc0] text-white border-0">
                Subscribe
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pb-8 mt-3 ">
            {/* Logo and Tagline */}
            <div className="md:col-span-1">
              <Image
                src="/logofooter.jpg"
                width={120}
                height={120}
                alt="crownlist Logo"
                className="max-sm:hidden"
              />
              <Image
                src="/logofooter.jpg"
                width={100}
                height={100}
                alt="crownlist Logo"
                className="sm:hidden"
              />
              <p className="mt-4 text-sm text-gray-400">
                Crownlist your free trusted marketplace
              </p>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about-us"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/faq"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/safety"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Safety
                  </Link>
                </li>
                <li>
                  <Link
                    href="/share-feedback"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Share feedback
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/terms-and-conditions"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy and Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact and Social */}
            <div>
              <h3 className="font-medium mb-4">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin size={16} />
                  <span>Kwara, Nigeria</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Mail size={16} />
                  <span className="text-xs sm:text-sm">
                    crownliststore@gmail.com
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium  mb-4">Socials</h3>
              <div className="flex flex-wrap gap-4 align-middle items-center">
                <Link
                  href="https://www.facebook.com/share/1GDX5ybABh/"
                  target="blank"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Facebook size={20} />
                </Link>
                <Link
                  href="https://wa.me/2349063301718"
                  target="blank"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Image
                    src="/whatsapp.svg"
                    alt="WhatsApp"
                    width={20}
                    height={20}
                    className="min-w-5"
                  />
                </Link>
                <Link
                  href="https://www.instagram.com/crownlistltd?igsh=dGsyZDdpcHp5aDdl"
                  target="blank"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram size={20} />
                </Link>
                <Link
                  href="https://www.tiktok.com/@crownlist.store?_r=1&_t=ZM-91eKDIG9uA8"
                  target="blank"
                  className="text-gray-400 hover:text-white transition-colors mt-[-1]"
                >
                  <Image
                    src="/tikk.svg"
                    alt="TikTok"
                    width={25}
                    height={25}
                    className="min-w-[25px]"
                  />
                </Link>
                <Link
                  href="https://t.me/crownliststore"
                  target="blank"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Send size={20} />
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
            <Image
              src={"/fottertext.png"}
              alt={"footer"}
              fill
              className="object-cover"
            />
          </div>

          {/* Copyright and Payment Methods */}
          <div className=" items-center pt-6 border-t border-gray-800">
            <p className="text-sm text-center text-gray-500 mb-2 md:mb-0">
              ©2025 Crownlist. All rights reserved.
            </p>
            <p className="text-base text-center text-white">
              Company Reg. No: 8453568
            </p>
          </div>
        </div>
      </div>

      {/* Modal for login/seller check */}
      <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="w-12 h-12 text-orange-500 mb-4" />
              <AlertDialogTitle className="text-lg">
                Access Restricted
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-600 mt-2">
                {modalMessage}
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center">
            <AlertDialogAction
              onClick={() => setModalOpen(false)}
              className="bg-[#1a0066] hover:bg-[#2a0bc0] px-6"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </footer>
  );
}

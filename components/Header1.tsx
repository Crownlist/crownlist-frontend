/* eslint-disable */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  AlignJustify,
  ChevronDown,
  ChevronUp,
  Facebook,
  Instagram,
  Send,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CategoryModal from "./Home/CategoryModal";
import { useGetAuthUser } from "@/lib/useGetAuthUser";
import { useCategories } from "@/hooks/useCategories";
import LogoutModal from "./logout-modal";
import { useScrollNavigation } from "@/hooks/useScrollNavigation";

interface props {
  hidden: boolean;
}
const Header = ({ hidden }: props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [openChev, setOpenChev] = useState(false);
  const [openCat, setOpenCat] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // Scroll navigation hook for global navbar
  const { isNavbarVisible, scrollPosition } = useScrollNavigation(2000);

  // Fetch categories data
  const { categories, loading: categoriesLoading } = useCategories();

  // new implementation
  const { isLoading, data } = useGetAuthUser("User");
  const userData: any = data?.data.loggedInAccount;

  useEffect(() => {
    // Check if either userData or adminData exists
    if (userData) {
      console.log("api", userData, isLoading);
      setIsLoggedIn(true);
    } else {
      // If both are null, the user is logged out
      setIsLoggedIn(false);
    }
  }, [userData]);

  const notificationRoute =
    userData?.accountType === "User"
      ? "/buyer/notification"
      : "/seller/notification";
  const messagesRoute =
    userData?.accountType === "User" ? "/buyer/messages" : "/seller/messages";
  const savedRoute =
    userData?.accountType === "User" ? "/buyer/saved" : "/seller/saved";
  const dashboardRoute =
    userData?.accountType === "User" ? "/buyer/dashboard" : "/seller/dashboard";

  const navItems = [
    //{ title: "Profile", link: '/buyer/profile' },
    { title: "Notification", link: notificationRoute },
    { title: "Messages", link: messagesRoute },
    ...(userData?.accountType === "User"
      ? [{ title: "Saved", link: savedRoute }]
      : []),
    {
      title: "Dashboard",
      link: dashboardRoute,
    },
  ];

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleCloseLogoutModal = () => {
    setLogoutModalOpen(false);
  };

  // console.log(pathname)
  const handleLogin = (e: any) => {
    e.preventDefault();
    router.push("/auth/login");
  };

  const handleSignUp = (e: any) => {
    e.preventDefault();
    router.push("/auth/signup");
  };
  const handleCat = (e: any) => {
    e.preventDefault();
    // router.push("/category")
    setOpenCat(true);
  };

  return (
    <nav
      className={`bg-white sticky inset-0 z-[999] shadow-sm transition-transform duration-300 ${
        isNavbarVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container w-full mx-auto flex items-center justify-between gap-2">
        {/* Mobile Menu */}

        <div
          className={`fixed inset-y-0 left-0 z-40 w-full max-w-sm bg-white shadow-sm transform transition-transform duration-300 ease-in-out 
            ${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            } md:hidden h-screen overflow-y-auto`}
        >
          <div className="h-full flex flex-col  gap-3">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-3 ">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Image src="/newlogo.jpg" width={100} height={100} alt="Logo" />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X
                  className="h-5 w-5"
                  size={100} // Increase the size
                  strokeWidth={2}
                  style={{ width: "30px", height: "110px" }} // Override viewBox issue
                />
              </Button>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col w-full  justify-start items-start gap-2 space-y-4 mb-6 p-6 pt-0">
              <Accordion type="single" collapsible className="w-full">
                {categoriesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-2">
                        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : (
                  categories.map((cat, idx) => {
                    const subcategories = cat.subCategories || [];
                    const hasSubcategories = subcategories.length > 0;

                    return (
                      <AccordionItem
                        key={cat._id}
                        value={`cat-${idx}`}
                        className="border-b border-[#F5F5F5]"
                      >
                        <AccordionTrigger disabled={!hasSubcategories}>
                          <div className="flex items-center gap-3">
                            <Image
                              src={cat.imageUrl || "/placeholder.svg"}
                              width={25}
                              height={25}
                              alt={cat.name}
                              className="rounded-md"
                            />
                            <span className="text-sm font-medium">
                              {cat.name}
                            </span>
                          </div>

                          {/* <div className="ml-auto text-xs text-gray-500">
                            {!hasSubcategories ? (
                              <span className="text-gray-400">Coming soon</span>
                            ) : (
                              <span>8,238 posts</span>
                            )}
                          </div> */}
                        </AccordionTrigger>

                        {hasSubcategories && (
                          <AccordionContent className="pl-6 transition-all duration-300 ease-in-out overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                            >
                              {subcategories.map((sub, subIdx) => (
                                <AccordionItem
                                  key={sub._id}
                                  value={`sub-${idx}-${subIdx}`}
                                  className="border-b border-dashed border-gray-200"
                                >
                                  <AccordionTrigger className="py-2 px-2 text-left text-sm text-gray-700 hover:text-black">
                                    {sub.name}
                                  </AccordionTrigger>
                                  <AccordionContent className="text-sm text-gray-500 px-2 py-2">
                                    <Link
                                      href={`/${cat.slug}/${sub.slug}`}
                                      className="hover:underline text-blue-600"
                                    >
                                      View all posts in {sub.name}
                                    </Link>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </AccordionContent>
                        )}
                      </AccordionItem>
                    );
                  })
                )}
              </Accordion>

              {/* <Link href='/seller/post-product'
                className={` rounded-none shadow-none flex w-full text-start border-transparent border-2 border-b-[#F5F5F5] items-start py-3`}
              >
                <div className="flex flex-row gap-2 align-middle items-center">
                  <div className="flex items-center">
                    <Image src={'/post.svg'} width={15} height={15} alt="'svg" />
                  </div>
                  <div className="flex align-middle items-center"> Post Product</div>
                </div>
              </Link> */}

              {/* Auth Buttons on mobile */}
              {isLoggedIn && (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full border-transparent border-2 border-b-[#F5F5F5]"
                  onValueChange={(value) => setOpenChev(value === "profile")}
                >
                  <AccordionItem value="profile" className="border-none">
                    <AccordionTrigger className="flex items-center gap-2  hover:no-underline">
                      <div className="flex flex-row gap-3 items-center">
                        <div className="flex">
                          <Image
                            src={
                              typeof userData?.profilePicture === "string"
                                ? userData.profilePicture
                                : "/profile.png"
                            }
                            width={30}
                            height={30}
                            alt="Profile"
                            className="rounded-full"
                          />
                        </div>
                        <span className="text-sm font-medium flex">
                          {userData?.fullName}
                        </span>
                      </div>
                      {/* {openChev ? <ChevronUp size={16} /> : <ChevronDown size={16} />} */}
                    </AccordionTrigger>

                    <AccordionContent className="pl-10 pt-1 space-y-2">
                      {navItems.map((item, id) => (
                        <Link
                          key={id}
                          href={item.link}
                          className="block text-sm text-gray-700 hover:text-green-700 transition"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </AccordionContent>
                    <AccordionContent
                      className="pl-10  space-y-2"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogoutClick();
                      }}
                    >
                      Logout
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>

            {/* Contact & Social Links on mobile */}
            <div className="mt-auto space-y-3">
              {!isLoggedIn && (
                <div className="flex flex-col gap-5 mb-10 p-6">
                  <div>
                    If you already have an account, click{" "}
                    <span>
                      <Link href="/auth/login" className="text-[#1F058F]">
                        {" "}
                        Login
                      </Link>
                    </span>{" "}
                    to access your profile. If you’re a new user, click{" "}
                    <span>
                      <Link href="/auth/signup" className="text-[#1F058F]">
                        {" "}
                        Sign Up
                      </Link>
                    </span>{" "}
                    to create an account.
                  </div>
                  <div className="flex flex-row gap-4">
                    <Button
                      size="sm"
                      className="border-none px-2 py-3 rounded-[99px] bg-[#1F058F] hover:bg-[#2a0bc0] text-white font-medium w-[90px]"
                      variant="outline"
                      onClick={handleLogin}
                    >
                      Login
                    </Button>

                    <Button
                      size="sm"
                      className="px-2 py-3 rounded-[99px] bg-white hover:bg-[#2a0bc0]  w-[90px] font-medium"
                      variant="outline"
                      onClick={handleSignUp}
                    >
                      Sign up
                    </Button>
                  </div>
                </div>
              )}
              <div className="bg-[#FAFAFA] p-6 w-full">
                <div className="flex flex-row gap-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/gmail.svg"
                      width={20}
                      height={20}
                      alt="Gmail"
                    />
                    <small className="text-[#131416] text-xs">
                      crownliststore@gmail.com
                    </small>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/maps.svg"
                      width={20}
                      height={20}
                      alt="Google Maps"
                    />
                    <small className="text-[#131416] text-xs">
                      Kwara, Nigeria
                    </small>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <Link
                    href="https://www.tiktok.com/@crownlist.store?_r=1&_t=ZM-91eKDIG9uA8"
                    target="blank"
                  >
                    <Image
                      src="/tikk.svg"
                      alt="TikTok"
                      width={25}
                      height={25}
                      className="min-w-[25px]"
                    />
                  </Link>
                  <Link href="https://wa.me/2349063301718" target="blank">
                    <Image
                      src="/whatsapp.svg"
                      alt="WhatsApp"
                      width={25}
                      height={25}
                      className="min-w-5"
                    />
                  </Link>
                  <Link href="#">
                    <Instagram size={20} />
                  </Link>
                  <Link
                    href="https://www.facebook.com/share/1GDX5ybABh/"
                    target="blank"
                  >
                    <Facebook size={20} />
                  </Link>

                  <Link
                    href="https://t.me/crownliststore"
                    target="blank"
                    className="text-gray-800 hover:text-white transition-colors"
                  >
                    <Send size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay when mobile menu is open */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        )}

        {/* Original Header with Responsive Classes */}
        <div className=" mx-auto py-1 pt-2 w-full">
          <div className="  bg-white max-md:container ">
            <div className="  flex  justify-between items-center w-full gap-10 ">
              <div className="w-full py-2 md:pt-1 md:pb-1 flex max-sm:flex-row-reverse items-center justify-between md:gap-8">
                {/* Mobile Menu Toggle Button */}
                <Button
                  variant="ghost"
                  className="md:hidden  flex items-center justify-center  pl-3"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <div className="w-10 h-10 flex items-center justify-center">
                    <AlignJustify
                      size={100} // Increase the size
                      strokeWidth={2}
                      style={{ width: "30px", height: "110px" }} // Override viewBox issue
                    />
                  </div>
                </Button>

                <Link href="/" className="max-md:pr-3 max-sm:mt-1 h-fit">
                  <Image
                    src="/newlogo.jpg"
                    width={100}
                    height={50}
                    alt="Logo"
                  />
                </Link>
              </div>

              {hidden && (
                <div className="hidden md:flex gap-3 w-full  justify-center items-center">
                  <Button
                    size="sm"
                    className="border-none w-full shadow-none px-2 py-3 rounded-[99px] text-crown-black font-medium relative"
                    variant="outline"
                    onClick={handleCat}
                  >
                    <div className="flex flex-row gap-1 align-middle ">
                      <div className="flex items-center">
                        <Image
                          src={"/pp.svg"}
                          width={15}
                          height={15}
                          alt="'svg"
                        />
                      </div>
                      <div className="flex align-middle"> Category</div>
                    </div>
                  </Button>

                  {/* <Link href={'/seller/product/post-product'}>
                    <Button
                      size="sm"
                      className="border-none shadow-none px-2 py-3 rounded-[99px] text-[#141414] font-medium"
                      variant="outline"
                    >
                      <div className="flex flex-row gap-1 align-middle">
                        <div className="flex items-center">
                          <Image src={'/post.svg'} width={15} height={15} alt="'svg" />
                        </div>
                        <div className="flex align-middle"> Post Product</div>
                      </div>
                    </Button>
                  </Link> */}
                </div>
              )}

              <div className="hidden md:flex items-center gap-3 w-full  justify-end">
                {!hidden && (
                  <div className="hidden md:flex items-start gap-1 justify-center">
                    <Button
                      size="sm"
                      className={`${
                        pathname == "/category"
                          ? "border-2  border-b-crown-black border-x-transparent border-t-transparent"
                          : "border-none"
                      }  shadow-none px-2 py-1 rounded-none text-crown-black font-medium `}
                      variant="outline"
                      onClick={handleCat}
                    >
                      <div className="flex flex-row gap-1 align-middle items-center">
                        <div className="flex items-center">
                          <Image
                            src={"/pp.svg"}
                            width={20}
                            height={20}
                            alt="'svg"
                          />
                        </div>
                        <div className="flex align-middle text-sm font-medium">
                          {" "}
                          Category
                        </div>
                      </div>
                    </Button>
                    {/* <Link href="/seller/product/post-product">
                      <Button
                        size="sm"
                        className={`${pathname == '/cwwategory' ? 'border-b-gray-950' : 'border-none'}  shadow-none px-2 py-3 rounded-[99px] text-[#141414] font-medium `}
                        variant="outline"
                      >
                        <div className="flex flex-row gap-1 align-middle items-center">
                          <div className="flex items-center">
                            <Image src={'/post.svg'} width={20} height={20} alt="'svg" />
                          </div>
                          <div className="flex align-middle text-sm font-medium"> Post Product</div>
                        </div>
                      </Button>
                    </Link> */}
                  </div>
                )}
                {isLoggedIn ? (
                  <DropdownMenu onOpenChange={setOpenChev}>
                    <DropdownMenuTrigger className="flex cursor-pointer bg-white items-center gap-2 focus:outline-none">
                      <Image
                        src={
                          typeof userData?.profilePicture === "string"
                            ? userData.profilePicture
                            : "/profile.png"
                        }
                        width={30}
                        height={30}
                        alt="Profile"
                        className="max-w-[30px] max-h-[30px] rounded-full"
                      />
                      <span className="text-sm font-medium flex items-center align-middle">
                        {userData?.fullName}
                      </span>
                      {openChev ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-48 mt-2">
                      {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                      {/* <DropdownMenuSeparator /> */}
                      {navItems.map((item, id) => (
                        <DropdownMenuItem key={id} className="w-full">
                          <Link href={item.link} className="w-full">
                            {item.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem onClick={handleLogoutClick}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2 ">
                    <Button
                      size="sm"
                      className="border-none px-2 py-3 rounded-[99px] text-[#141414] font-medium"
                      variant="outline"
                      onClick={handleLogin}
                    >
                      Login
                    </Button>

                    <Button
                      size="sm"
                      className="px-2 py-3 rounded-[99px] text-[#141414] font-medium"
                      variant="outline"
                      onClick={handleSignUp}
                    >
                      Sign up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* category modal */}
        <CategoryModal isOpen={openCat} onClose={() => setOpenCat(false)} />
        <LogoutModal
          open={logoutModalOpen}
          handleClose={handleCloseLogoutModal}
        />
      </div>
    </nav>
  );
};

export default Header;

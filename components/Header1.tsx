/* eslint-disable */
"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Input } from "./ui/custom-input"
import { Button } from "./ui/button"
import { AlignJustify, Check, ChevronDown, ChevronsUpDownIcon, ChevronUp, Menu, Search, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { countries } from "@/constants/countries"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import CategoryModal from "./Home/CategoryModal"


interface props {
  hidden: boolean
}
const Header = ({ hidden }: props) => {
  const isLoggedIn = true
  const [search, setSearch] = useState("")
  const [searchCountry, setSearchCountry] = useState("")
  const [value, setValue] = useState("")
  const [open, setOpen] = useState(false)
  const [filteredCountries, setFilteredCountries] = useState(countries)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [openChev, setOpenChev] = useState(false)
  const [openCat, setOpenCat] = useState(false)

  const categories = [
    {
      name: "Phones & Tablets",
      icon: "/video.png",
      hot: true,
      subcategories: [
        { name: "Mobile phone", href: "/category/phone-tablets?subcategory=mobile" },
        { name: "Accessories", href: "/category/phone-tablets?subcategory=accessories" },
        { name: "Tablets", href: "/category/phone-tablets?subcategory=tablets" },
        { name: "Smart watches", href: "/category/phone-tablets?subcategory=watches" },
      ],
    },
    {
      name: "Electronics",
      icon: "/lab-scale.png",
      hot: true,
      subcategories: [
        { name: "Hardware", href: "/category/electronics?subcategory=hardware" },
        { name: "Monitors", href: "/category/electronics?subcategory=monitors" },
        { name: "Laptops", href: "/category/electronics?subcategory=laptops" },
        { name: "Headphones", href: "/category/electronics?subcategory=headphones" },
        { name: "Music equipment", href: "/category/electronics?subcategory=music" },
        { name: "Cameras", href: "/category/electronics?subcategory=cameras" },
      ],
    },
    {
      name: "Properties",
      icon: "/protection.png",
      hot: true,
      subcategories: [
        { name: "Student", href: "/category/property?subcategory=student" },
        { name: "Personal", href: "/category/property?subcategory=personal" },
        { name: "Office", href: "/category/property?subcategory=office" },
      ],
    },
    {
      name: "Fashion",
      icon: "/dress.png",
      subcategories: [
        { name: "Bags", href: "/category/fashion?subcategory=bags" },
        { name: "Clothes", href: "/category/fashion?subcategory=clothes" },
        { name: "Jewelry", href: "/category/fashion?subcategory=jewelry" },
        { name: "Shoes", href: "/category/fashion?subcategory=shoes" },
      ],
    },
    {
      name: "Cars",
      icon: "/car.png",
      isComingSoon: true,
      subcategories: [],
    },
    {
      name: "Jobs",
      icon: "/new-job.png",
      isComingSoon: true,
      subcategories: [],
    },
    {
      name: "Services",
      icon: "/service.png",
      isComingSoon: true,
      subcategories: [],
    },
    {
      name: "Sneakers",
      icon: "/car.png",
      isComingSoon: true,
      subcategories: [],
    },
  ]

  const navItems = [
    //{ title: "Profile", link: '/buyer/profile' },
    { title: "Notification", link: '/buyer/notification' },
    { title: "Messages", link: '/buyer/messages' },
    { title: "Saved", link: '/buyer/saved' },
    { title: "Sellers hub", link: '/' },
    { title: "User hub", link: '/' },
    { title: "Logout", link: "/" },
  ]

  const handleSearch = () => {
    if (search == '' || searchCountry == "") {
      router.push('/search')
    }
    else {
      router.push('/search/kwara')
    }
  }

  // console.log(pathname)
  const handleLogin = (e: any) => {
    e.preventDefault();
    router.push("/auth/login")
  }

  const handleSignUp = (e: any) => {
    e.preventDefault()
    router.push('/auth/signup')
  }
  const handleCat = (e: any) => {
    e.preventDefault();
    // router.push("/category")
    setOpenCat(true)
  }

  // Filter countries based on search input
  useEffect(() => {
    if (searchCountry) {
      setFilteredCountries(countries.filter((country) => country.name.toLowerCase().includes(search.toLowerCase())))
    } else {
      setFilteredCountries(countries)
    }
  }, [searchCountry])

  return (
    <nav className="bg-white sticky inset-0 z-[999] shadow-sm ">
      <div className='container w-full mx-auto flex items-center justify-between gap-2'>
        {/* Mobile Menu */}

        <div
          className={`fixed inset-y-0 left-0 z-40 w-full max-w-sm bg-white shadow-sm transform transition-transform duration-300 ease-in-out 
    ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:hidden h-screen overflow-y-auto`}
        >
          <div className="h-full flex flex-col  gap-3">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 p-6">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Image src="/newlogo.jpg" width={100} height={100} alt="Logo" />
              </Link>
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5"
                  size={100} // Increase the size 
                  strokeWidth={2}
                  style={{ width: "30px", height: "110px" }} // Override viewBox issue
                />
              </Button>
            </div>

            {/* Search Input on mobile */}
            <div className="px-6">
              <div className="flex w-full h-10 min-w-[100%] items-start relative ">
                <Input
                  className="border border-[#D6D6D6] rounded w-full max-w-[470px] rounded-tl-[99px] rounded-bl-[99px] py-3 px-3 ps-10 h-full placeholder:text-[#141414]"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <Search size={16} color="#141414" className="absolute top-3 left-4" />

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      // aria-expanded={open}
                      className=" h-full rounded-none border-[#D6D6D6] border-l-0 justify-between"
                    >
                      {value ? countries.find((country) => country.name === value)?.name : "Select."}
                      <ChevronsUpDownIcon className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-2  z-[999] ">
                    <div className="mb-2">
                      <Input
                        placeholder="Search country..."
                        value={searchCountry}
                        onChange={(e) => setSearchCountry(e.target.value)}
                        className="h-9"
                      />
                    </div>

                    <div className="max-h-[300px] overflow-y-auto">
                      {filteredCountries.length === 0 ? (
                        <div className="py-2 text-center text-sm text-muted-foreground">No country found.</div>
                      ) : (
                        <div className="space-y-1">
                          {filteredCountries.map((country, index) => (
                            <div
                              key={index}
                              className={cn(
                                "flex items-center px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-muted",
                                value === country.name && "bg-muted",
                              )}
                              onClick={() => {
                                const newValue = country.name === value ? "" : country.name
                                setValue(newValue)
                                setSearchCountry(newValue)
                                setOpen(false)
                                // setSearch("hahahah")
                              }}
                            >
                              <Image
                                src={country.flag || "/placeholder.svg"}
                                alt={country.name}
                                width={24}
                                height={24}
                                className="mr-2"
                              />
                              <span>{country.name}</span>
                              {value === country.name && <Check className="ml-auto h-4 w-4" />}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

                <Button
                  size="sm"
                  className="bg-[#1F058F] hover:bg-[#2a0bc0] text-white py-3 px-5 rounded-tr-[99px] rounded-br-[99px] rounded-tl-0 rounded-bl-0 text-sm flex justify-between items-center h-full"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </div>
            {/* Navigation Links */}
            <div className="flex flex-col w-full  justify-start items-start gap-2 space-y-4 mb-6 mt-4  p-6">

              <Accordion type="single" collapsible className="w-full">
                {categories.map((cat, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`cat-${idx}`}
                    className="border-b border-[#F5F5F5]"
                  >
                    <AccordionTrigger disabled={cat.isComingSoon}>
                      <div className="flex items-center gap-3">
                        <Image
                          src={cat.icon}
                          width={25}
                          height={25}
                          alt={cat.name}
                          className="rounded-md"
                        />
                        <span className="text-sm font-medium">{cat.name}</span>
                        {/* {cat.hot && (
                          <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                            HOT
                          </span>
                        )} */}
                      </div>

                      <div className="ml-auto text-xs text-gray-500">
                        {cat.isComingSoon ? (
                          <span className="text-gray-400">Coming soon</span>
                        ) : (
                          <span>8,238 posts</span>
                        )}
                      </div>
                    </AccordionTrigger>

                    {!cat.isComingSoon && cat.subcategories.length > 0 && (
                      <AccordionContent className="pl-6 transition-all duration-300 ease-in-out overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                        <Accordion type="single" collapsible className="w-full">
                          {cat.subcategories.map((sub, subIdx) => (
                            <AccordionItem
                              key={subIdx}
                              value={`sub-${idx}-${subIdx}`}
                              className="border-b border-dashed border-gray-200"
                            >
                              <AccordionTrigger className="py-2 px-2 text-left text-sm text-gray-700 hover:text-black">
                                {sub.name}
                              </AccordionTrigger>
                              <AccordionContent className="text-sm text-gray-500 px-2 py-2">
                                <Link
                                  href={sub.href}
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
                ))}
              </Accordion>

              <Link href='/'
                className={` rounded-none shadow-none flex w-full text-start border-transparent border-2 border-b-[#F5F5F5] items-start py-3`}
              >
                <div className="flex flex-row gap-2 align-middle items-center">
                  <div className="flex items-center">
                    <Image src={'/post.svg'} width={15} height={15} alt="'svg" />
                  </div>
                  <div className="flex align-middle items-center"> Post Product</div>
                </div>
              </Link>

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
                      <div className='flex flex-row gap-3 items-center'>
                        <div className='flex'>
                          <Image
                            src="/profile.png"
                            width={30}
                            height={30}
                            alt="Profile"
                            className="rounded-full"
                          />
                        </div>
                        <span className="text-sm font-medium flex">Jimoh Adesina</span>
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
                  </AccordionItem>
                </Accordion>
              )}
            </div>


            {/* Contact & Social Links on mobile */}
            <div className="mt-auto space-y-3">
              {!isLoggedIn && (
                <div className="flex flex-col gap-5 mb-10 p-6">
                  <div>
                    If you already have an account, click <span>
                      <Link href='/auth/login'
                        className="text-[#2a0bc0]"> Login</Link>
                    </span> to access your profile. If you’re a new user, click <span>
                      <Link href='/auth/signup'
                        className="text-[#2a0bc0]"> Sign Up</Link>
                    </span> to create an account.
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

                    <Button size="sm" className="px-2 py-3 rounded-[99px] bg-white hover:bg-[#2a0bc0]  w-[90px] font-medium" variant="outline"
                      onClick={handleSignUp}
                    >
                      Sign up
                    </Button>
                  </div>
                </div>
              )}
              <div className='bg-[#FAFAFA] p-6 w-full'>
                <div className="flex flex-row gap-3">
                  <div className="flex items-center gap-2">
                    <Image src="/icons/gmail.svg" width={20} height={20} alt="Gmail" />
                    <small className="text-[#131416] text-xs">Info@joelist.com.ng</small>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image src="/icons/maps.svg" width={20} height={20} alt="Google Maps" />
                    <small className="text-[#131416] text-xs">Kwara, Nigeria</small>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <Link href="#">
                    <Image src="/icons/twitter.svg" width={24} height={24} alt="Twitter" />
                  </Link>
                  <Link href="#">
                    <Image src="/icons/linkedin.svg" width={24} height={24} alt="LinkedIn" />
                  </Link>
                  <Link href="#">
                    <Image src="/icons/instagram.svg" width={24} height={24} alt="Instagram" />
                  </Link>
                  <Link href="#">
                    <Image src="/icons/facebook.svg" width={24} height={24} alt="Facebook" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay when mobile menu is open */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
        )}


        {/* Original Header with Responsive Classes */}
        <div className=" mx-auto py-1 pt-2 w-full">
          <div className="hidden md:flex  justify-between w-full">
            <div className="flex items-center gap-7">
              <div className="flex items-center gap-1.5">
                <Image src="/icons/gmail.svg" width={24} height={24} alt="Gmail" />
                <small className="text-[#131416] text-sm">Info@joelist.com.ng</small>
              </div>

              <div className="flex items-center gap-1.5">
                <Image src="/icons/maps.svg" width={24} height={24} alt="Google Maps" />
                <small className="text-[#131416] text-sm">Kwara, Nigeria</small>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <Link href="#">
                <Image src="/icons/twitter.svg" width={24} height={24} alt="Twitter" />
              </Link>

              <Link href="#">
                <Image src="/icons/linkedin.svg" width={24} height={24} alt="LinkedIn" />
              </Link>

              <Link href="#">
                <Image src="/icons/instagram.svg" width={24} height={24} alt="Instagram" />
              </Link>

              <Link href="#">
                <Image src="/icons/facebook.svg" width={24} height={24} alt="Facebook" />
              </Link>
            </div>
          </div>
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

                <Link href="/" className="max-md:pr-3 max-sm:mt-1">
                  <Image src="/newlogo.jpg" width={100} height={100} alt="Logo" />
                </Link>

                {!hidden &&
                  <div className="hidden md:flex w-full h-10 items-start relative">
                    <Input
                      className="border border-[#D6D6D6] rounded w-full xl:max-w-[470px] rounded-tl-[99px] rounded-bl-[99px] py-3 px-1 xl:px-10 ps-10 h-full placeholder:text-[#141414]"
                      placeholder="Search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />

                    <Search size={16} color="#141414" className="absolute top-3 left-4" />

                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="xl:w-[150px] h-full rounded-none border-[#D6D6D6] border-l-0 justify-between"
                        >
                          <div className='hidden xl:flex'>
                            {value ? countries.find((country) => country.name === value)?.name : "Select country..."}
                          </div>
                          <div className='hidden max-xl:flex'>
                            {value ? countries.find((country) => country.name === value)?.name : "Select.."}
                          </div>
                          <ChevronsUpDownIcon className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-2">
                        <div className="mb-2">
                          <Input
                            placeholder="Search country..."
                            value={searchCountry}
                            onChange={(e) => setSearchCountry(e.target.value)}
                            className="h-9"
                          />
                        </div>

                        <div className="max-h-[300px] overflow-y-auto">
                          {filteredCountries.length === 0 ? (
                            <div className="py-2 text-center text-sm text-muted-foreground">No country found.</div>
                          ) : (
                            <div className="space-y-1">
                              {filteredCountries.map((country, index) => (
                                <div
                                  key={index}
                                  className={cn(
                                    "flex items-center px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-muted",
                                    value === country.name && "bg-muted",
                                  )}
                                  onClick={() => {
                                    const newValue = country.name === value ? "" : country.name
                                    setValue(newValue)
                                    setSearchCountry(newValue)
                                    setOpen(false)
                                    // setSearch("hahahah")
                                  }}
                                >
                                  <Image
                                    src={country.flag || "/placeholder.svg"}
                                    alt={country.name}
                                    width={24}
                                    height={24}
                                    className="mr-2"
                                  />
                                  <span>{country.name}</span>
                                  {value === country.name && <Check className="ml-auto h-4 w-4" />}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Button
                      size="sm"
                      className="bg-[#1F058F] hover:bg-[#2a0bc0] text-white py-3 px-5 rounded-tr-[99px] rounded-br-[99px] rounded-tl-0 rounded-bl-0 text-sm flex justify-between items-center h-full"
                      onClick={handleSearch}
                    >
                      Search
                    </Button>
                  </div>}
              </div>

              {hidden &&
                <div className="hidden md:flex items-center gap-3 w-full" >

                  <Button
                    size="sm"
                    className="border-none shadow-none px-2 py-3 rounded-[99px] text-[#141414] font-medium relative"
                    variant="outline"
                    onClick={handleCat}
                  >
                    <div className="flex flex-row gap-1 align-middle">
                      <div className="flex items-center">
                        <Image src={'/pp.svg'} width={15} height={15} alt="'svg" />
                      </div>
                      <div className="flex align-middle"> Category</div>
                    </div>
                  </Button>
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

                </div>}

              <div className="hidden md:flex items-center gap-3 w-full  justify-end">

                {!hidden &&
                  <div className="hidden md:flex items-start gap-1 justify-center" >

                    <Button
                      size="sm"
                      className={`${pathname == '/category' ? 'border-2  border-b-[#141414] border-x-transparent border-t-transparent' : 'border-none'}  shadow-none px-2 py-1 rounded-none text-[#141414] font-medium `}
                      variant="outline"
                      onClick={handleCat}
                    >
                      <div className="flex flex-row gap-1 align-middle items-center">
                        <div className="flex items-center">
                          <Image src={'/pp.svg'} width={20} height={20} alt="'svg" />
                        </div>
                        <div className="flex align-middle text-sm font-medium"> Category</div>
                      </div>
                    </Button>
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

                  </div>
                }
                {isLoggedIn ? (
                  <DropdownMenu onOpenChange={setOpenChev}>
                    <DropdownMenuTrigger className="flex  items-center gap-2 focus:outline-none">
                      <Image
                        src="/profile.png" // Replace with actual image path
                        width={30}
                        height={30}
                        alt="Profile"
                        className="rounded-full"
                      />
                      <span className="text-sm font-medium">Jimoh Adesina</span>
                      {openChev ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-48 mt-2">
                      {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                      {/* <DropdownMenuSeparator /> */}
                      {navItems.map((item, id) => (
                        <DropdownMenuItem key={id}>
                          <Link href={item.link}>
                            {item.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
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

                    <Button size="sm" className="px-2 py-3 rounded-[99px] text-[#141414] font-medium" variant="outline"
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
      </div>
    </nav>
  )
}

export default Header



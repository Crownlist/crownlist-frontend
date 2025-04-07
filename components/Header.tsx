/* eslint-disable */
"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Input } from "./ui/custom-input"
import { Button } from "./ui/button"
import { AlignJustify, Check, ChevronsUpDownIcon, Menu, Search, X } from "lucide-react"
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


interface props {
  hidden: boolean
}
const Header = ({ hidden }: props) => {
  const isLoggedIn = false
  const [search, setSearch] = useState("")
  const [value, setValue] = useState("")
  const [open, setOpen] = useState(false)
  const [filteredCountries, setFilteredCountries] = useState(countries)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()


  const handleSearch = () =>{
    if(search == '' || value == ""){
      router.push('/search')
    }
    else{
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
  const handleCat = (e :any) =>{
    e.preventDefault();
    router.push("/category")
  }

  // Filter countries based on search input
  useEffect(() => {
    if (search) {
      setFilteredCountries(countries.filter((country) => country.name.toLowerCase().includes(search.toLowerCase())))
    } else {
      setFilteredCountries(countries)
    }
  }, [search])

  return (
    <nav className="bg-white sticky inset-0 z-[999] shadow-sm ">
      <div className='container mx-auto flex items-center justify-between gap-2'>
        {/* Mobile Menu */}

        <div
          className={`fixed inset-y-0 left-0 z-40 w-full max-w-sm bg-white shadow-sm transform transition-transform duration-300 ease-in-out 
    ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:hidden h-screen overflow-y-auto`}
        >
          <div className="h-full flex flex-col p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Image src="/assets/icons/Logo.svg" width={40} height={40} alt="Logo" />
              </Link>
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5"
                  size={100} // Increase the size 
                  strokeWidth={2}
                  style={{ width: "30px", height: "110px" }} // Override viewBox issue
                />
              </Button>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
              <Input
                className="border border-[#D6D6D6] rounded w-full py-2 px-4 ps-9 placeholder:text-[#141414] text-sm"
                placeholder="Search"
              />
              <Search size={16} color="#141414" className="absolute top-2.5 left-3" />
            </div>

            {/* Navigation Links */}
            <div className="space-y-4 mb-6">
              <Link href="/category" className="block text-[#141414] font-medium text-sm" onClick={() => setMobileMenuOpen(false)}>
                Category
              </Link>
              <Link href="#" className="block text-[#141414] font-medium text-[10px]" onClick={() => setMobileMenuOpen(false)}>
                Post Product
              </Link>
            </div>

            {/* Auth Buttons */}
            {!isLoggedIn && (
              <div className="flex flex-col gap-3 mb-8">
                <Button
                  size="sm"
                  className="border-none px-4 py-3 rounded-full text-[#141414] font-medium w-full"
                  variant="outline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  className="px-4 py-3 rounded-full text-[#141414] font-medium w-full"
                  variant="outline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Button>
              </div>
            )}

            {/* Contact & Social Links */}
            <div className="mt-auto space-y-3">
              <div className="flex items-center gap-2">
                <Image src="/assets/icons/gmail.svg" width={20} height={20} alt="Gmail" />
                <small className="text-[#131416] text-xs">Info@joelist.com.ng</small>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/assets/icons/google-maps.svg" width={20} height={20} alt="Google Maps" />
                <small className="text-[#131416] text-xs">Kwara, Nigeria</small>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <Link href="#">
                  <Image src="/assets/icons/twitter.svg" width={24} height={24} alt="Twitter" />
                </Link>
                <Link href="#">
                  <Image src="/assets/icons/linkedin.svg" width={24} height={24} alt="LinkedIn" />
                </Link>
                <Link href="#">
                  <Image src="/assets/icons/instagram.svg" width={24} height={24} alt="Instagram" />
                </Link>
                <Link href="#">
                  <Image src="/assets/icons/facebook.svg" width={24} height={24} alt="Facebook" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay when mobile menu is open */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
        )}


        {/* Original Header with Responsive Classes */}
        <div className=" mx-auto py-1 w-full">
          <div className="hidden md:flex  justify-between w-full">
            <div className="flex items-center gap-7">
              <div className="flex items-center gap-1.5">
                <Image src="/assets/icons/gmail.svg" width={24} height={24} alt="Gmail" />
                <small className="text-[#131416] text-sm">Info@joelist.com.ng</small>
              </div>

              <div className="flex items-center gap-1.5">
                <Image src="/assets/icons/google-maps.svg" width={24} height={24} alt="Google Maps" />
                <small className="text-[#131416] text-sm">Kwara, Nigeria</small>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <Link href="#">
                <Image src="/assets/icons/twitter.svg" width={24} height={24} alt="Twitter" />
              </Link>

              <Link href="#">
                <Image src="/assets/icons/linkedin.svg" width={24} height={24} alt="LinkedIn" />
              </Link>

              <Link href="#">
                <Image src="/assets/icons/instagram.svg" width={24} height={24} alt="Instagram" />
              </Link>

              <Link href="#">
                <Image src="/assets/icons/Facebook.svg" width={24} height={24} alt="Facebook" />
              </Link>
            </div>
          </div>
          <div className="  bg-white max-md:container ">
            <div className="  flex justify-between items-center w-full gap-10 ">
              <div className="w-full py-2 md:pt-2 md:pb-1 flex items-center justify-between md:gap-8">
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

                <Link href="/" className="pr-3">
                  <Image src="/assets/icons/Logo.svg" width={40} height={40} alt="Facebook" />
                </Link>

                {!hidden && <div className="hidden md:flex w-full h-10 min-w-[560px] items-start relative">
                  <Input
                    className="border border-[#D6D6D6] rounded w-full max-w-[470px] rounded-tl-[99px] rounded-bl-[99px] py-3 px-5 ps-10 h-full placeholder:text-[#141414]"
                    placeholder="Search"
                  />

                  <Search size={16} color="#141414" className="absolute top-3 left-4" />

                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[150px] h-full rounded-none border-[#D6D6D6] border-l-0 justify-between"
                      >
                        {value ? countries.find((country) => country.name === value)?.name : "Select country..."}
                        <ChevronsUpDownIcon className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-2">
                      <div className="mb-2">
                        <Input
                          placeholder="Search country..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
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
                                  setOpen(false)
                                  setSearch("hahahah")
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
                    className="border-none shadow-none px-2 py-3 rounded-[99px] text-[#141414] font-medium"
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

              <div className="hidden md:flex items-center gap-3">

                {!hidden &&
                  <div className="hidden md:flex items-start gap-1 justify-center" >

                    <Button
                      size="sm"
                      className={`${pathname == '/category' ? 'border-2  border-b-[#141414] border-x-transparent border-t-transparent' : 'border-none'}  shadow-none px-2 py-1 rounded-none text-[#141414] font-medium `}
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
                      className={`${pathname == '/cwwategory' ? 'border-b-gray-950' : 'border-none'}  shadow-none px-2 py-3 rounded-[99px] text-[#141414] font-medium `}
                      variant="outline"
                    >
                      <div className="flex flex-row gap-1 align-middle">
                        <div className="flex items-center">
                          <Image src={'/post.svg'} width={15} height={15} alt="'svg" />
                        </div>
                        <div className="flex align-middle"> Post Product</div>
                      </div>
                    </Button>

                  </div>
                }
                {isLoggedIn ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger>Category</DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem>Billing</DropdownMenuItem>
                      <DropdownMenuItem>Team</DropdownMenuItem>
                      <DropdownMenuItem>Subscription</DropdownMenuItem>
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
      </div>
    </nav>
  )
}

export default Header


{/* <div
        className={`fixed inset-y-0 left-0 z-40 w-[80%] max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}
      >
        <div className="h-full flex flex-col p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Image src="/assets/icons/Logo.svg" width={40} height={40} alt="Logo" />
            </Link>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative mb-4">
              <Input
                className="border border-[#D6D6D6] rounded w-full py-2 px-4 ps-9 placeholder:text-[#141414] text-sm"
                placeholder="Search"
              />
              <Search size={16} color="#141414" className="absolute top-2.5 left-3" />
            </div>

            <div className="space-y-4">
              <Link
                href="#"
                className="block text-[#141414] font-medium text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Category
              </Link>
              <Link
                href="#"
                className="block text-[#141414] font-medium text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Post Product
              </Link>
            </div>
          </div>

          {!isLoggedIn && (
            <div className="flex flex-col gap-3 mb-8">
              <Button
                size="sm"
                className="border-none px-2 py-3 rounded-[99px] text-[#141414] font-medium w-full"
                variant="outline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Button>

              <Button
                size="sm"
                className="px-2 py-3 rounded-[99px] text-[#141414] font-medium w-full"
                variant="outline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign up
              </Button>
            </div>
          )}

          <div className="mt-auto">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1.5">
                <Image src="/assets/icons/gmail.svg" width={20} height={20} alt="Gmail" />
                <small className="text-[#131416] text-xs">Info@joelist.com.ng</small>
              </div>

              <div className="flex items-center gap-1.5">
                <Image src="/assets/icons/google-maps.svg" width={20} height={20} alt="Google Maps" />
                <small className="text-[#131416] text-xs">Kwara, Nigeria</small>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <Link href="#">
                  <Image src="/assets/icons/twitter.svg" width={20} height={20} alt="Twitter" />
                </Link>
                <Link href="#">
                  <Image src="/assets/icons/linkedin.svg" width={20} height={20} alt="LinkedIn" />
                </Link>
                <Link href="#">
                  <Image src="/assets/icons/instagram.svg" width={20} height={20} alt="Instagram" />
                </Link>
                <Link href="#">
                  <Image src="/assets/icons/facebook.svg" width={20} height={20} alt="Facebook" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div> */}
{/* Overlay when mobile menu is open */ }
{/* {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )} */}
{/* Mobile Menu */ }

// /* eslint-disable */
// "use client"

// import Image from "next/image"
// import Link from "next/link"
// import { useState, useEffect } from "react"
// import { Input } from "./ui/custom-input"
// import { Button } from "./ui/button"
// import { Check, ChevronsUpDownIcon, Search } from "lucide-react"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { countries } from "@/constants/countries"
// import { cn } from "@/lib/utils"

// const Header = () => {
//   const isLoggedIn = false
//   const [search, setSearch] = useState("")
//   const [value, setValue] = useState("")
//   const [open, setOpen] = useState(false)
//   const [filteredCountries, setFilteredCountries] = useState(countries)

//   // Filter countries based on search input
//   useEffect(() => {
//     if (search) {
//       setFilteredCountries(countries.filter((country) => country.name.toLowerCase().includes(search.toLowerCase())))
//     } else {
//       setFilteredCountries(countries)
//     }
//   }, [search])

//   return (
//     <header>
//       <div className="max-w-[85%] mx-auto py-3 w-full">
//         <div className="flex justify-between w-full">
//           <div className="flex items-center gap-7">
//             <div className="flex items-center gap-1.5">
//               <Image src="/assets/icons/gmail.svg" width={24} height={24} alt="Gmail" />
//               <small className="text-[#131416] text-sm">Info@joelist.com.ng</small>
//             </div>

//             <div className="flex items-center gap-1.5">
//               <Image src="/assets/icons/google-maps.svg" width={24} height={24} alt="Google Maps" />
//               <small className="text-[#131416] text-sm">Kwara, Nigeria</small>
//             </div>
//           </div>

//           <div className="flex items-center gap-5">
//             <Link href="#">
//               <Image src="/assets/icons/twitter.svg" width={24} height={24} alt="Twitter" />
//             </Link>

//             <Link href="#">
//               <Image src="/assets/icons/linkedin.svg" width={24} height={24} alt="LinkedIn" />
//             </Link>

//             <Link href="#">
//               <Image src="/assets/icons/instagram.svg" width={24} height={24} alt="Instagram" />
//             </Link>

//             <Link href="#">
//               <Image src="/assets/icons/facebook.svg" width={24} height={24} alt="Facebook" />
//             </Link>
//           </div>
//         </div>

//         <div className="flex justify-between items-center w-full gap-10">
//           <div className="pt-6 pb-3 flex items-center gap-8">
//             <Link href="/">
//               <Image src="/assets/icons/Logo.svg" width={48} height={48} alt="Facebook" />
//             </Link>

//             <div className="w-full h-10 min-w-[560px] flex items-start relative">
//               <Input
//                 className="border border-[#D6D6D6] rounded w-full max-w-[470px] rounded-tl-[99px] rounded-bl-[99px] py-3 px-5 ps-10 h-full placeholder:text-[#141414]"
//                 placeholder="Search"
//               />

//               <Search size={16} color="#141414" className="absolute top-3 left-4" />

//               <Popover open={open} onOpenChange={setOpen}>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     role="combobox"
//                     aria-expanded={open}
//                     className="w-[150px] h-full rounded-none border-[#D6D6D6] border-l-0 justify-between"
//                   >
//                     {value ? countries.find((country) => country.name === value)?.name : "Select country..."}
//                     <ChevronsUpDownIcon className="opacity-50" />
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-[200px] p-2">
//                   <div className="mb-2">
//                     <Input
//                       placeholder="Search country..."
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)}
//                       className="h-9"
//                     />
//                   </div>

//                   <div className="max-h-[300px] overflow-y-auto">
//                     {filteredCountries.length === 0 ? (
//                       <div className="py-2 text-center text-sm text-muted-foreground">No country found.</div>
//                     ) : (
//                       <div className="space-y-1">
//                         {filteredCountries.map((country, index) => (
//                           <div
//                             key={index}
//                             className={cn(
//                               "flex items-center px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-muted",
//                               value === country.name && "bg-muted",
//                             )}
//                             onClick={() => {
//                               const newValue = country.name === value ? "" : country.name
//                               setValue(newValue)
//                               setOpen(false)
//                               setSearch("")
//                             }}
//                           >
//                             <Image
//                               src={country.flag || "/placeholder.svg"}
//                               alt={country.name}
//                               width={24}
//                               height={24}
//                               className="mr-2"
//                             />
//                             <span>{country.name}</span>
//                             {value === country.name && <Check className="ml-auto h-4 w-4" />}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </PopoverContent>
//               </Popover>

//               <Button
//                 size="sm"
//                 className="bg-[#141414] text-white py-3 px-5 rounded-tr-[99px] rounded-br-[99px] rounded-tl-0 rounded-bl-0 text-sm flex justify-between items-center h-full"
//               >
//                 Search
//               </Button>
//             </div>
//           </div>

//           <div className="flex items-center gap-5">
//             <small className="text-[#141414] font-medium text-sm">Category</small>

//             <small className="text-[#141414] font-medium text-sm">Post Product</small>

//             {isLoggedIn ? (
//               <DropdownMenu>
//                 <DropdownMenuTrigger>Category</DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                   <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem>Profile</DropdownMenuItem>
//                   <DropdownMenuItem>Billing</DropdownMenuItem>
//                   <DropdownMenuItem>Team</DropdownMenuItem>
//                   <DropdownMenuItem>Subscription</DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             ) : (
//               <div className="flex items-center gap-5">
//                 <Button
//                   size="sm"
//                   className="border-none px-2 py-3 rounded-[99px] text-[#141414] font-medium"
//                   variant="outline"
//                 >
//                   Login
//                 </Button>

//                 <Button size="sm" className="px-2 py-3 rounded-[99px] text-[#141414] font-medium" variant="outline">
//                   Sign up
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }

// export default Header



// // <Command>
// //                     <CommandInput
// //                       placeholder="Search country..."
// //                       className="h-9"
// //                     />
// //                     <CommandList>
// //                       <CommandEmpty>No country found.</CommandEmpty>
// //                       <CommandGroup>
// //                         {countries.map((country, index) => (
// //                           <CommandItem
// //                             key={index}
// //                             value={country.name}
// //                             onSelect={(currentValue: any) => {
// //                               setValue(
// //                                 currentValue === value ? "" : currentValue
// //                               );
// //                               setSelectedCountry(
// //                                 value
// //                                   ? countries.find(
// //                                       (country) => country.name === value
// //                                     )?.flag
// //                                   : countries[0].flag
// //                               );
// //                               setOpen(false);
// //                             }}
// //                           >
// //                             <Image
// //                               src={country?.flag}
// //                               alt={country.name}
// //                               width={24}
// //                               height={24}
// //                               className="mr-1"
// //                             />
// //                             {country.name}
// //                             <Check
// //                               className={cn(
// //                                 "ml-auto",
// //                                 value === country.name
// //                                   ? "opacity-100"
// //                                   : "opacity-0"
// //                               )}
// //                             />
// //                           </CommandItem>
// //                         ))}
// //                       </CommandGroup>
// //                     </CommandList>
// //                   </Command>
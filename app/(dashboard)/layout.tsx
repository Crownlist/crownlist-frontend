// "use client"
import {
    CustomSidebarTrigger,
    SidebarCustomer,
    SidebarInset,
    SidebarTrigger
  } from '@/components/ui/cu-sidebar'
  import {  ChevronDown, } from 'lucide-react'
  import Image from 'next/image'
  import { AppSidebar } from '@/components/cu-app-sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import Link from 'next/link'
// import { useState } from 'react'
  
  export const metadata = {
    title: 'Customer | Dashboard'
  }
  
  export default function Layout({ children }: { children: React.ReactNode }) {
    // const [openChev, setOpenChev] = useState(false)

    const navItems = [
        // { title: "Home", link: '/' },
        // // { title: "Messages", link: '/messages' },
        // // { title: "Saved", link: '/saved' },
        // // { title: "Sellers hub", link: '/' },
        // // { title: "User hub", link: '/' },
        // // { title: "Logout", link: "/" },
      ]
    return (
      <SidebarCustomer>
        <AppSidebar />
        <SidebarInset>
          <header className=' flex items-center justify-between border-b px-3 py-2 bg-white sticky inset-0 z-[999]'>
            <div className='flex items-center gap-2'>
              <SidebarTrigger className='hidden md:inline-flex' />
              <h5 className='hidden text-2xl font-semibold md:block'>Customer</h5>
              <Image
                src={'/newlogo.jpg'}
                alt='fixorshublogo'
                width={101}
                height={36}
                className='md:hidden'
              />
            </div>
            <div className='hidden items-center gap-4 md:flex'>
              {/* <div className='flex items-center gap-1'>
                <Avatar>
                  <AvatarImage src='/Avatar.png' />
                  <AvatarFallback>OR</AvatarFallback>
                </Avatar>
                <div className='hidden flex-col gap-1 md:flex'>
                  <span className='text-sm font-semibold text-[black]'>
                    Olivia Rhye
                  </span>
                  <span className='text-xs text-[#2B2B2B]'>
                    olivia@untitledui.com
                  </span>
                </div>
              </div> */}
              <div className='flex items-center gap-1'>
              <DropdownMenu >
                    <DropdownMenuTrigger className="flex  items-center gap-1 focus:outline-none">
                      <Image
                        src="/profile.png" // Replace with actual image path
                        width={30}
                        height={30}
                        alt="Profile"
                        className="rounded-full"
                      />
                      <span className="text-sm font-medium">Jimoh Adesina</span>
                      {/* {openChev ? <ChevronUp size={16} /> : <ChevronDown size={16} />} */}
                      {/* <ChevronDown size={16} /> */}
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-48 mt-2">
                      {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                      {/* <DropdownMenuSeparator /> */}
                      {/* {navItems.map((item, id) => (
                        <DropdownMenuItem key={id}>
                          <Link href={item.link}>
                            {item.title}
                          </Link>
                        </DropdownMenuItem>
                      ))} */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
            </div>
            <CustomSidebarTrigger />
          </header>
          {/* <div className='h-full w-auto flex'> */}
          {children}
          {/* </div> */}
         
        </SidebarInset>
      </SidebarCustomer>
    )
  }
  
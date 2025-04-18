'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/cu-sidebar'
import {
  User,
  Bookmark,
  Send,
  Mail,
  MessageCircleMore,
  LogOut,
  UserRoundPen
 
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Menu items.
const items = [

  {
    title: 'Profile',
    url: '/buyer/profile',
    icon:  UserRoundPen
  },


  {
    title: 'Notification',
    url: '/buyer/notification',
    icon: Mail
  },
  {
    title: 'Messages',
    url: '/buyer/messages',
    icon: MessageCircleMore
  },
  {
    title: 'Saved',
    url: '/buyer/saved',
    icon: Bookmark
  },
  {
    title: 'Sellers hub',
    url: '/buyer/sellers-hub',
    icon: Send
  },
  {
    title: 'User hub',
    url: '/buyer/users-hub',
    icon: User
  },
  // {
  //   title: 'Logout',
  //   url: '/buyer/logout',
  //   icon: Lock
  // }
]

export function AppSidebar() {
  const pathname = usePathname()
  const { toggleSidebar, isMobile } = useSidebar()

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader className='px-3 py-4 max-sm:hidden'>
        <Image
          src={'/newlogo.jpg'}
          alt='fixorshublogo'
          width={121}
          height={36}
        />
      </SidebarHeader>
      <SidebarContent className='mt-4 px-2 max-sm:mt-20'>
        <SidebarMenu className='space-y-2'>
          {items.map(item => (
            <SidebarMenuItem
              key={item.title}
              onClick={() => (isMobile ? toggleSidebar() : null)}
            >
              <SidebarMenuButton
                asChild
                className={`hover:text-primary font-semibold text-black  ${pathname.includes(item.url) ? 'text-[#2B2B2B]  bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
              >
                <Link href={item.url}>
                  <item.icon size={16} />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem className=''>
            <SidebarMenuButton
              asChild
              className={`hover:text-primary font-semibold text-black`}
            >
              <Link href='#'>
                <LogOut size={16} />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

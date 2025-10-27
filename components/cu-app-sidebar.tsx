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
  UserRoundPen,
  Shield,
  Settings

} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutModal from './logout-modal'
import { useState } from 'react'
import Image from 'next/image'
import { useNotifications } from '@/hooks/useNotifications'

// Menu items.
const items = [

  {
    title: 'Profile',
    url: '/buyer/profile',
    icon:  UserRoundPen
  },
  {
    title: 'Escrow',
    url: '/buyer/escrow',
    icon: Shield
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
    title: 'Settings',
    url: '/buyer/settings/notification',
    icon: Settings
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
  const [open, setOpen] = useState(false)
  const { toggleSidebar, isMobile } = useSidebar()
  const { notifications } = useNotifications()

  const unreadCount = notifications.filter(notification => !notification.isRead).length

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader className='px-3 my-1 z-5000 max-sm:hidden '>
        <Link href='/' >
        <Image
          src='/newlogo.jpg'
          alt='crownlistlogo'
          width={121}
          height={36}
        />
        
        </Link>
      </SidebarHeader>
      <SidebarContent className='mt-10 px-2 max-sm:mt-20'>
        <SidebarMenu className='space-y-2'>
          {items.map(item => (
            <SidebarMenuItem
              key={item.title}
              onClick={() => (isMobile ? toggleSidebar() : null)}
            >
              <SidebarMenuButton
                asChild
                className={`hover:text-primary font-semibold text-black relative ${pathname.includes(item.url) ? 'text-[#2B2B2B] bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
              >
                <Link href={item.url} className="flex items-center">
                  <item.icon size={16} />
                  <span>{item.title}</span>
                  {item.url === '/buyer/notification' && unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem className=''>
            <SidebarMenuButton
              asChild
              className={`hover:text-primary font-semibold text-black`}
            >
              <button onClick={() => setOpen(true)}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
      <LogoutModal open={open} handleClose={handleClose} />

    </Sidebar>
  )
}

// "use client"
import {
    SidebarCustomer,
    SidebarInset,
  } from '@/components/ui/cu-sidebar'
  import { AppSidebar } from '@/components/cu-app-sidebar'
import BottomNav from '@/components/BottomNav'
import BuyerLayout from '@/client/buyer-layout'
import BuyerHeader from '@/components/BuyerHeader'
  export const metadata = {
    title: 'Buyer | Dashboard'
  }
  
  export default function Layout({ children }: { children: React.ReactNode }) {
    
    return (
      <BuyerLayout>
      <SidebarCustomer>
        <AppSidebar />
        <SidebarInset>
         <BuyerHeader/>
          {/* <div className='h-full w-auto flex'> */}
          {children}
          {/* </div> */}
         
        </SidebarInset>
        <BottomNav/>
      </SidebarCustomer>
      </BuyerLayout>
    )
  }
  
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Home,
  MessageSquare,
  Bell,
  Search,
  ShoppingBag,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Category', path: '/category', icon: Home },
  { name: 'Contact', path: '/contact', icon: MessageSquare },
  { name: 'Notification', path: '/notification', icon: Bell },
  { name: 'Product', path: '/product', icon: ShoppingBag },
  { name: 'Search', path: '/search', icon: Search },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className={cn(
              'flex flex-col items-center gap-1 h-full',
              pathname === item.path ? 'text-blue-600' : 'text-gray-600'
            )}
            onClick={() => router.push(item.path)}
            aria-label={`Navigate to ${item.name}`}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs">{item.name}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}
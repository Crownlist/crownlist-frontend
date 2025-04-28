'use client'

import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const NotFound = () => {
  return (
    <div className='bg-background flex min-h-screen w-full flex-col items-center justify-center'>
      <div className='container max-w-md space-y-8 px-4 py-8 text-center'>
        <div className='relative'>
          <div className='from-[#1F058F] to-[#1F058F]/40 absolute inset-0 -z-10 rounded-full bg-gradient-to-br opacity-30 blur-xl'></div>
          <div className='bg-[#1F058F]/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full'>
            <AlertTriangle size={36} className='text-primary animate-pulse' />
          </div>
        </div>

        <div className='space-y-2'>
          <h1 className='text-6xl font-bold tracking-tighter'>404</h1>
          <h2 className='text-foreground text-2xl font-medium tracking-tight'>
            Page not found
          </h2>
          <p className='text-muted-foreground mx-auto max-w-sm'>
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        <div className='pt-4'>
          <Button asChild size='lg' className='bg-[#1F058F]'>
            <Link href='/' className='relative z-20'>
              Return to Home
            </Link>
          </Button>
        </div>

        <div className='pointer-events-none absolute bottom-0 left-0 h-1/2 w-full'>
          <div className='from-background/5 absolute inset-0 bg-gradient-to-t to-transparent'></div>
        </div>
      </div>
    </div>
  )
}

export default NotFound

// components/ChatBot.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const ChatBot = () => {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip */}
      {hovered && (
        <div className="mb-2 px-3 py-1 text-xs bg-black text-white rounded shadow-md transition-all duration-200">
          24/7 Support
        </div>
      )}

      {/* Floating Button */}
      <Link href={'/'} target='blank' >
      <button
        className="bg-white text-white p-3 rounded-full shadow-lg hover:bg-gray-200 transition" 
      >
       
        <Image
           src='/whatsapp.svg'
           width={35}
           height={35}
           alt='chatBot'
        />
      </button>
      </Link>
    </div>
  )
}

export default ChatBot

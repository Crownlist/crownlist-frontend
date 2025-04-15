"use client"
import Chat from "./Chat"

export default function Message() {

  return (
    <div className="flex flex-col w-full h-full md:flex-row bg-white">
      {/* Main Content */}
      <main
       className=" flex h-full w-full  md:px-6 "
       >
       <Chat/>
      </main>
    </div>
  )
}

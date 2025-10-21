/* eslint-disable */
"use client"

import React, { useState } from 'react'
import EmojiPickerReact from 'emoji-picker-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Smile } from "lucide-react"

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  disabled?: boolean
}

export default function EmojiPicker({ onEmojiSelect, disabled = false }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleEmojiClick = (emojiData: any) => {
    onEmojiSelect(emojiData.emoji)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 hover:bg-gray-100"
          disabled={disabled}
          aria-label="Open emoji picker"
        >
          <Smile className="h-5 w-5 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" side="top">
        <EmojiPickerReact
          onEmojiClick={handleEmojiClick}
          autoFocusSearch={false}
          searchDisabled={false}
          skinTonesDisabled={true}
          previewConfig={{
            showPreview: false
          }}
          width={350}
          height={400}
        />
      </PopoverContent>
    </Popover>
  )
}

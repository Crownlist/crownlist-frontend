"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import Image from "next/image";

interface JoinChannelsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function JoinChannelsModal({
  open,
  onOpenChange,
}: JoinChannelsModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex flex-col items-center text-center">
            <AlertDialogTitle className="text-lg">
              Join Our Community Channels
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-600 mt-2">
              Get updates, deals, and support on WhatsApp or Telegram.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <Link
            href="https://whatsapp.com/channel/0029Vb7EUHO8vd1WEu5n2i3N"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50 transition"
            onClick={() => onOpenChange(false)}
          >
            <Image
              src="/icons/whatsapp.svg"
              alt="WhatsApp"
              width={28}
              height={28}
            />
            <div className="flex flex-col">
              <span className="font-medium">Join on WhatsApp</span>
              <span className="text-xs text-gray-500">
                Official Crownlist channel
              </span>
            </div>
          </Link>

          <Link
            href="https://t.me/CrownlistBuyAndSell"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50 transition"
            onClick={() => onOpenChange(false)}
          >
            <Image
              src="/icons/telegram.svg"
              alt="Telegram"
              width={28}
              height={28}
            />
            <div className="flex flex-col">
              <span className="font-medium">Join on Telegram</span>
              <span className="text-xs text-gray-500">
                Official Crownlist group
              </span>
            </div>
          </Link>
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogAction
            onClick={() => onOpenChange(false)}
            className="bg-[#1a0066] hover:bg-[#2a0bc0] px-6"
          >
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

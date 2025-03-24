/* eslint-disable */
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface SectionHeaderProps {
  title: string
}

export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-3">
      <h2 className="font-bold text-base">{title}</h2>
      <Link href="#" className="text-xs text-blue-600 flex items-center">
        View all <ChevronRight className="h-3 w-3 ml-0.5" />
      </Link>
    </div>
  )
}


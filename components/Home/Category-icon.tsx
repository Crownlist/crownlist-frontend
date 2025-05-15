// /* eslint-disable */
import type { ReactNode } from "react"

interface CategoryIconProps {
  icon: ReactNode
  label: string
  color?: string
}

export default function CategoryIcon({ icon, label, color = "bg-blue-100" }: CategoryIconProps) {
  return (
    <div className="flex flex-col items-center">
      <div className={`${color} w-10 h-10 rounded-full flex items-center justify-center mb-1`}>{icon}</div>
      <span className="text-xs">{label}</span>
    </div>
  )
}


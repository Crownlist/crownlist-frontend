"use client"

import { Grid2X2, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  showViewToggle?: boolean
  onViewChange?: (view: "grid" | "list") => void
  currentView?: "grid" | "list"
}

export default function SectionHeader({
  title,
  showViewToggle = true,
  onViewChange,
  currentView = "grid",
}: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>

      {showViewToggle && (
        <div className="flex items-center space-x-1 border rounded-md overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8 rounded-none", currentView === "grid" ? "bg-muted" : "hover:bg-transparent")}
            onClick={() => onViewChange?.("grid")}
            aria-label="Grid view"
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8 rounded-none", currentView === "list" ? "bg-muted" : "hover:bg-transparent")}
            onClick={() => onViewChange?.("list")}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}


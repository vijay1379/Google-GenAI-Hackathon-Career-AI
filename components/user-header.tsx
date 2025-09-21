"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { Trophy } from "lucide-react"
import { useRouter } from "next/navigation"

export function UserHeader() {
  const { user, profile } = useAuth()
  const router = useRouter()
  // Add client-side only rendering state
  const [isMounted, setIsMounted] = useState(false)
  
  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Use auth context data
  const displayName = profile?.name || user?.user_metadata?.name || ""

  // Mock experience points
  const experiencePoints = 1250

  const getUserInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Only render after client-side mount to prevent hydration mismatch
  if (!isMounted) {
    return null; // Return empty during server-side rendering
  }
  
  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
      {/* Experience Counter */}
      <div className="hidden sm:flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
        <Trophy className="w-4 h-4 text-yellow-500" />
        <div className="text-sm">
          <span className="font-medium">{experiencePoints} XP</span>
          <span className="text-muted-foreground ml-1">• {displayName}</span>
        </div>
      </div>

      {/* Profile Button */}
      <div className="relative">
        <button 
          type="button" 
          className="h-10 w-10 rounded-full border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center"
          onClick={() => router.push('/settings')}
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {getUserInitials(displayName)}
            </AvatarFallback>
          </Avatar>
        </button>
      </div>

    </div>
  )
}
"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

// Dynamically import UserHeader to avoid potential SSR issues
const UserHeader = dynamic(() => import("@/components/user-header").then(mod => ({ default: mod.UserHeader })), {
  ssr: false,
  loading: () => null
})

interface SidebarContextType {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out relative overflow-visible",
            "md:ml-64", // Default expanded width (w-64)
            isCollapsed && "md:ml-16", // Collapsed width (w-16)
          )}
        >
          <div className="p-6">{children}</div>
          <UserHeader />
        </main>
      </div>
    </SidebarContext.Provider>
  )
}

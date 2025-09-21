"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useSidebar } from "@/components/app-layout"
import {
  LayoutDashboard,
  FileText,
  Users,
  Newspaper,
  Settings,
  Menu,
  X,
  Target,
  TrendingUp,
  Trophy,
  Presentation as PresentationChart,
  LogOut,
  MapPin,
  CalendarDays,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Share2,
  BookOpen,
} from "lucide-react"

const navigation = {
  main: [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Learning Path",
      href: "/learning",
      icon: MapPin,
    },
    {
      name: "Study Planner",
      href: "/schedule",
      icon: CalendarDays,
    },
    {
      name: "Resume Lab",
      href: "/resume",
      icon: FileText,
    },
    {
      name: "Hackathons",
      href: "/hackathons",
      icon: Trophy,
    },
    {
      name: "Student Resources",
      href: "/resources",
      icon: BookOpen,
    },
    {
      name: "Practice Hub",
      href: "/practice",
      icon: PresentationChart,
    },
    {
      name: "Mentorship",
      href: "/mentorship",
      icon: Users,
    },
    {
      name: "Job Search",
      href: "/jobs",
      icon: Briefcase,
    },
    {
      name: "Social",
      href: "/social",
      icon: Share2,
    },
    {
      name: "Tech News",
      href: "/news",
      icon: Newspaper,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ],
}

export function Sidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebar()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { logout } = useAuth()
  // Add client-side only rendering state
  const [isMounted, setIsMounted] = useState(false)
  
  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const renderNavItem = (item: any) => {
    const isActive = pathname === item.href
    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-foreground hover:bg-accent hover:text-accent-foreground",
          isCollapsed && "justify-center px-2",
        )}
        onClick={() => setIsMobileOpen(false)}
        title={isCollapsed ? item.name : undefined}
      >
        <item.icon className={cn("w-4 h-4 flex-shrink-0", isCollapsed && "w-5 h-5")} />
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <div className="truncate">{item.name}</div>
          </div>
        )}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {item.name}
          </div>
        )}
      </Link>
    )
  }

  // Only render interactive elements after client-side mount
  return (
    <>
      {/* Mobile menu button - Only render on client side */}
      {isMounted && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-background border-r transform transition-all duration-300 ease-in-out md:translate-x-0",
          isCollapsed ? "w-16" : "w-64", // Reduced expanded width from w-72 to w-64
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0", // Reduced mobile width
        )}
      >
        <div className="flex flex-col h-full">
          <div
            className={cn("flex items-center px-4 py-3 border-b", isCollapsed ? "justify-center" : "justify-between")} // Reduced padding from py-4 to py-3
          >
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                  {" "}
                  {/* Reduced logo size from w-8 h-8 to w-7 h-7 */}
                  <Target className="w-4 h-4 text-primary-foreground" /> {/* Reduced icon size */}
                </div>
                <div>
                  <h1 className="font-semibold text-sm">CareerAI</h1> {/* Reduced font size */}
                  <p className="text-xs text-muted-foreground">Skills Advisor</p>
                </div>
              </div>
            )}

            {isCollapsed && (
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                {" "}
                {/* Reduced size */}
                <Target className="w-4 h-4 text-primary-foreground" /> {/* Reduced icon size */}
              </div>
            )}

            {/* Only render collapse button on client */}
            {isMounted && (
              <Button
                variant="ghost"
                size="icon"
                className={cn("hidden md:flex", isCollapsed && "w-7 h-7")} // Reduced button size
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}{" "}
                {/* Reduced icon size */}
              </Button>
            )}
          </div>

          <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-hidden">{navigation.main.map(renderNavItem)}</nav>

          {!isCollapsed && (
            <div className="px-4 pb-3">
              {" "}
              {/* Reduced padding */}
              <Card className="p-3 bg-accent">
                {" "}
                {/* Reduced padding from p-4 to p-3 */}
                <div className="space-y-2">
                  {" "}
                  {/* Reduced spacing */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Daily Streak</span>
                    <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs">
                      {" "}
                      {/* Added text-xs */}7 days
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-primary" /> {/* Reduced icon size */}
                    <span className="text-xs text-muted-foreground">Keep it up!</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <div className={cn("px-3 pb-3", isCollapsed && "px-2")}>
            {" "}
            {/* Reduced padding */}
            {/* Only render logout button on client */}
            {isMounted && (
              <button
                type="button"
                className={cn(
                  "w-full text-muted-foreground hover:text-foreground text-sm inline-flex items-center rounded-md transition-all", // Added text-sm
                  isCollapsed ? "justify-center px-2" : "justify-start gap-2 px-4 py-2", // Reduced gap
                  "h-9 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50" // Ghost button styles
                )}
                onClick={logout}
                title={isCollapsed ? "Sign Out" : undefined}
              >
                <LogOut className="w-4 h-4" /> {/* Reduced icon size */}
                {!isCollapsed && "Sign Out"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}
    </>
  )
}

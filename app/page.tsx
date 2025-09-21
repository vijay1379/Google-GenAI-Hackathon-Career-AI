"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authCookies } from "@/lib/auth-cookies"

export default function HomePage() {
  const router = useRouter()
  
  useEffect(() => {
    // Check if user is authenticated using cookies
    const isAuthenticated = authCookies.isLikelyAuthenticated()
    const hasProfile = authCookies.hasCompleteProfile()
    
    if (isAuthenticated) {
      // User is logged in
      if (hasProfile) {
        // User has complete profile, go to dashboard
        router.replace("/dashboard")
      } else {
        // User needs to complete onboarding
        router.replace("/onboarding")
      }
    } else {
      // User is not logged in, go to landing page
      router.replace("/landing")
    }
  }, [router])

  // Show simple loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

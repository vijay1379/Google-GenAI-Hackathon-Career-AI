"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { OnboardingFlow } from "@/components/onboarding-flow"

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user?.isAuthenticated) {
      router.push("/auth/login")
      return
    }

    // Check if user has already completed onboarding
    const onboardingData = localStorage.getItem("onboardingData")
    if (onboardingData) {
      router.push("/dashboard")
      return
    }

    setIsLoading(false)
  }, [user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <OnboardingFlow />
    </div>
  )
}
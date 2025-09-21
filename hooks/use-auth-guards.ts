"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authCookies } from "@/lib/auth-cookies"

/**
 * Hook to redirect to login if user is not authenticated
 */
export function useRequireAuth() {
  const router = useRouter()
  
  useEffect(() => {
    const isAuthenticated = authCookies.isLikelyAuthenticated()
    
    if (!isAuthenticated) {
      router.replace("/auth/login")
    }
  }, [router])
}

/**
 * Hook to redirect to onboarding if user doesn't have complete profile
 */
export function useRequireProfile() {
  const router = useRouter()
  
  useEffect(() => {
    const isAuthenticated = authCookies.isLikelyAuthenticated()
    const hasProfile = authCookies.hasCompleteProfile()
    
    if (!isAuthenticated) {
      router.replace("/auth/login")
    } else if (!hasProfile) {
      router.replace("/onboarding")
    }
  }, [router])
}

/**
 * Hook to redirect to dashboard if user is already authenticated
 */
export function useRedirectIfAuthenticated() {
  const router = useRouter()
  
  useEffect(() => {
    const isAuthenticated = authCookies.isLikelyAuthenticated()
    const hasProfile = authCookies.hasCompleteProfile()
    
    if (isAuthenticated) {
      if (hasProfile) {
        router.replace("/dashboard")
      } else {
        router.replace("/onboarding")
      }
    }
  }, [router])
}
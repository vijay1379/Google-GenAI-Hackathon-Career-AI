"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/database/types"
import { authCookies } from "@/lib/auth-cookies"

interface AuthUser extends User {
  profile?: Profile
  isAuthenticated: boolean
}

interface AuthContextType {
  user: AuthUser | null
  profile: Profile | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).single()

      if (error) {
        console.error("Error fetching profile:", error)
        return null
      }

      // Store profile in cookies
      authCookies.setProfile({
        id: data.user_id,
        name: data.name,
        email: data.email,
        college_id: data.college_id,
        current_year: data.current_year
      })
      
      return data
    } catch (error) {
      console.error("Error fetching profile:", error)
      return null
    }
  }

  const refreshProfile = async () => {
    try {
      if (user?.id) {
        const profileData = await fetchProfile(user.id)
        setProfile(profileData)
      } else {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id)
          setProfile(profileData)
          setUser({ ...session.user, isAuthenticated: true })
        }
      }
    } catch (error) {
      console.error("Error refreshing profile:", error)
    }
  }

  useEffect(() => {
    // Initialize auth state from cookies
    const cookieAuth = authCookies.getAuthState()
    const cookieProfile = authCookies.getProfile()
    
    if (cookieAuth?.isAuthenticated && cookieAuth.userId) {
      setUser({
        id: cookieAuth.userId,
        email: cookieAuth.email || '',
        isAuthenticated: true
      } as AuthUser)
    }
    
    if (cookieProfile) {
      setProfile({
        user_id: cookieProfile.id || '',
        name: cookieProfile.name || '',
        email: cookieProfile.email || '',
        college_id: cookieProfile.college_id || '',
        current_year: cookieProfile.current_year || ''
      } as Profile)
    }

    // Get current session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const userWithAuth = { ...session.user, isAuthenticated: true }
        setUser(userWithAuth)
        
        // Store auth state in cookies
        authCookies.setAuthState({
          isAuthenticated: true,
          userId: session.user.id,
          email: session.user.email
        })
        
        // Fetch profile if not already loaded
        if (!cookieProfile) {
          const profileData = await fetchProfile(session.user.id)
          setProfile(profileData)
        }
      } else {
        // No session, clear cookies
        authCookies.clearAll()
        setUser(null)
        setProfile(null)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userWithAuth = { ...session.user, isAuthenticated: true }
        setUser(userWithAuth)
        
        // Store auth state in cookies
        authCookies.setAuthState({
          isAuthenticated: true,
          userId: session.user.id,
          email: session.user.email
        })
        
        // Fetch profile
        const profileData = await fetchProfile(session.user.id)
        setProfile(profileData)
      } else {
        setUser(null)
        setProfile(null)
        authCookies.clearAll()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        const profileData = await fetchProfile(data.user.id)

        if (profileData && profileData.college_id && profileData.current_year) {
          router.push("/dashboard")
        } else {
          router.push("/onboarding")
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) throw error

      if (data.user && !data.user.email_confirmed_at) {
        // Store verification flag in sessionStorage
        sessionStorage.setItem('showVerificationToast', 'true')
        sessionStorage.setItem('verificationEmail', email)
        router.push("/auth/login")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Clear cookies first
      authCookies.clearAll()
      
      // Sign out from Supabase
      await supabase.auth.signOut()
      
      // Clear state
      setUser(null)
      setProfile(null)
      
      // Redirect to landing
      router.push("/landing")
    } catch (error) {
      console.error("Logout error:", error)
      // Even if there's an error, clear local state and redirect
      authCookies.clearAll()
      setUser(null)
      setProfile(null)
      router.push("/landing")
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, login, signup, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
import Cookies from 'js-cookie'

const AUTH_COOKIE_NAME = 'auth_state'
const PROFILE_COOKIE_NAME = 'user_profile'
const COOKIE_EXPIRES = 7 // 7 days

export interface AuthCookieData {
  isAuthenticated: boolean
  userId?: string
  email?: string
  lastUpdated: number
}

export interface ProfileCookieData {
  id?: string
  name?: string
  email?: string
  college_id?: string
  current_year?: string
  is_verified?: boolean
  lastUpdated: number
}

// Helper to safely check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

// Safe execution wrapper for browser-only code
const safeClientExecution = <T>(fn: () => T, defaultValue: T): T => {
  if (!isBrowser) return defaultValue
  try {
    return fn()
  } catch (error) {
    console.error('Error in client-side execution:', error)
    return defaultValue
  }
}

export const authCookies = {
  // Set auth state in cookie
  setAuthState: (data: Partial<AuthCookieData>) => {
    safeClientExecution(() => {
      const cookieData: AuthCookieData = {
        isAuthenticated: data.isAuthenticated || false,
        userId: data.userId,
        email: data.email,
        lastUpdated: Date.now()
      }
      Cookies.set(AUTH_COOKIE_NAME, JSON.stringify(cookieData), { 
        expires: COOKIE_EXPIRES,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    }, undefined)
  },

  // Get auth state from cookie
  getAuthState: (): AuthCookieData | null => {
    return safeClientExecution(() => {
      const cookieData = Cookies.get(AUTH_COOKIE_NAME)
      if (!cookieData) return null
      
      const parsed = JSON.parse(cookieData)
      
      // Check if cookie is expired (older than 24 hours for auth state)
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours
      if (Date.now() - parsed.lastUpdated > maxAge) {
        authCookies.clearAuthState()
        return null
      }
      
      return parsed
    }, null)
  },

  // Set user profile in cookie
  setProfile: (profile: Partial<ProfileCookieData>) => {
    safeClientExecution(() => {
      const cookieData: ProfileCookieData = {
        ...profile,
        lastUpdated: Date.now()
      }
      Cookies.set(PROFILE_COOKIE_NAME, JSON.stringify(cookieData), { 
        expires: COOKIE_EXPIRES,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    }, undefined)
  },

  // Get user profile from cookie
  getProfile: (): ProfileCookieData | null => {
    return safeClientExecution(() => {
      const cookieData = Cookies.get(PROFILE_COOKIE_NAME)
      if (!cookieData) return null
      
      const parsed = JSON.parse(cookieData)
      
      // Profile cookies can be valid for longer (up to 7 days)
      const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days
      if (Date.now() - parsed.lastUpdated > maxAge) {
        authCookies.clearProfile()
        return null
      }
      
      return parsed
    }, null)
  },

  // Clear auth state cookie
  clearAuthState: () => {
    safeClientExecution(() => {
      Cookies.remove(AUTH_COOKIE_NAME)
    }, undefined)
  },

  // Clear profile cookie
  clearProfile: () => {
    safeClientExecution(() => {
      Cookies.remove(PROFILE_COOKIE_NAME)
    }, undefined)
  },

  // Clear all auth cookies
  clearAll: () => {
    safeClientExecution(() => {
      authCookies.clearAuthState()
      authCookies.clearProfile()
    }, undefined)
  },

  // Check if user appears to be authenticated based on cookie
  isLikelyAuthenticated: (): boolean => {
    return safeClientExecution(() => {
      const authState = authCookies.getAuthState()
      return authState?.isAuthenticated === true && !!authState.userId
    }, false)
  },

  // Check if profile appears to be complete based on cookie
  hasCompleteProfile: (): boolean => {
    return safeClientExecution(() => {
      const profile = authCookies.getProfile()
      return !!(profile?.college_id && profile?.current_year)
    }, false)
  }
}
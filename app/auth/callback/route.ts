import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { profileService } from '@/lib/database/services'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => 
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    
    try {
      // Exchange code for session to verify the email
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) throw error
      
      if (data.user) {
        // Use the safe profile creation service
        let profile = await profileService.getProfile(data.user.id)
        
        if (!profile) {
          // Create profile using the service
          profile = await profileService.createProfile(data.user.id, {
            name: data.user.user_metadata?.name || '',
            email: data.user.email || ''
          })
          
          if (!profile) {
            console.error('Failed to create profile for user:', data.user.id)
            return NextResponse.redirect(new URL('/auth/error?message=profile-creation-failed', request.url))
          }
        } else {
          // Update verification status if profile exists
          await profileService.updateProfile(data.user.id, { is_verified: true })
        }
        
        // Redirect to onboarding
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
      
    } catch (error) {
      console.error('Error verifying email:', error)
      return NextResponse.redirect(new URL('/auth/login?message=verification-error', request.url))
    }
  }

  // If no code, redirect to signup
  return NextResponse.redirect(new URL('/auth/signup', request.url))
}
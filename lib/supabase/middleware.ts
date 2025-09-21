import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getUser() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/landing", "/auth/login", "/auth/signup", "/auth/error", "/auth/sign-up-success"]
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/auth")

  // Check if user is authenticated
  if (!user && !isPublicRoute) {
    // Redirect unauthenticated users to login
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(url)
  }

  // If user is authenticated, check if they need onboarding
  if (user && !isPublicRoute && pathname !== "/onboarding") {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("college_id, current_year")
        .eq("user_id", user.id)
        .single()

      // If profile is incomplete, redirect to onboarding
      if (!profile?.college_id || !profile?.current_year) {
        const url = request.nextUrl.clone()
        url.pathname = "/onboarding"
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error("Error checking profile:", error)
      // If there's an error fetching profile, allow the request to continue
      // The error will be handled by the page components
    }
  }

  // If authenticated user tries to access auth pages, redirect to dashboard
  if (user && (pathname.startsWith("/auth") || pathname === "/" || pathname === "/landing")) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}

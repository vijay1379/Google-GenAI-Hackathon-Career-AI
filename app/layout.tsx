import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { AuthWrapper } from "@/components/auth-wrapper"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI Career & Skills Advisor",
  description: "Personalized AI career guidance and skill development companion for students",

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <AuthWrapper>
            <Suspense fallback={null}>{children}</Suspense>
          </AuthWrapper>
        </AuthProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}

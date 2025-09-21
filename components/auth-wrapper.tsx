"use client"

import React from "react"

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  // Simply render children without any loading states
  // Individual pages will handle their own auth requirements using hooks
  return <>{children}</>
}
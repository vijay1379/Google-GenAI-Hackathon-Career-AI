"use client"

import { AppLayout } from "@/components/app-layout"
import { DashboardContent } from "@/components/dashboard-content"
import { useRequireProfile } from "@/hooks/use-auth-guards"

export default function DashboardPage() {
  // This will redirect to login or onboarding if needed
  useRequireProfile()
  
  return (
    <AppLayout>
      <DashboardContent />
    </AppLayout>
  )
}

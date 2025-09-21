"use client"

import { AppLayout } from "@/components/app-layout"
import { LearningHub } from "@/components/learning-hub"
import { useRequireProfile } from "@/hooks/use-auth-guards"

export default function LearningPage() {
  useRequireProfile()
  
  return (
    <AppLayout>
      <LearningHub />
    </AppLayout>
  )
}

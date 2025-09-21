"use client"

import { AppLayout } from "@/components/app-layout"
import { MentorshipHub } from "@/components/mentorship-hub"
import { useRequireProfile } from "@/hooks/use-auth-guards"

export default function MentorshipPage() {
  useRequireProfile()
  
  return (
    <AppLayout>
      <MentorshipHub />
    </AppLayout>
  )
}

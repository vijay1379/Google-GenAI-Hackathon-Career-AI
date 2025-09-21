"use client"

import { AppLayout } from "@/components/app-layout"
import { TechNews } from "@/components/tech-news"
import { useRequireProfile } from "@/hooks/use-auth-guards"

export default function NewsPage() {
  useRequireProfile()
  
  return (
    <AppLayout>
      <TechNews />
    </AppLayout>
  )
}

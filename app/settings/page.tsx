"use client"

import { AppLayout } from "@/components/app-layout"
import { SettingsPanel } from "@/components/settings-panel"
import { useRequireProfile } from "@/hooks/use-auth-guards"

export default function SettingsPage() {
  useRequireProfile()
  
  return (
    <AppLayout>
      <SettingsPanel />
    </AppLayout>
  )
}

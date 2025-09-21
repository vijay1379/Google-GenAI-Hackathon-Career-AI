"use client"

import { AppLayout } from "@/components/app-layout"
import { ResumeAnalyzer } from "@/components/resume-analyzer"
import { useRequireProfile } from "@/hooks/use-auth-guards"

export default function ResumePage() {
  useRequireProfile()
  
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">AI Resume Analyzer</h1>
            <p className="text-lg text-muted-foreground">
              Upload your resume and job details to get AI-powered feedback and optimization suggestions
            </p>
          </div>
          <ResumeAnalyzer />
        </div>
      </div>
    </AppLayout>
  )
}

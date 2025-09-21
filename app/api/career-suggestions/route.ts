import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { aiService, profileService, skillsService, interestsService } from "@/lib/database/services"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userSkills, userInterests, currentYear, college } = await request.json()
    const profile = await profileService.getProfile(user.id)
    const existingSkills = await skillsService.getUserSkills(user.id)
    const existingInterests = await interestsService.getUserInterests(user.id)

    const finalSkills = userSkills || existingSkills.map(s => s.skill_name)
    const finalInterests = userInterests || existingInterests.map(i => i.interest_name)

    const mockCareerPaths = [
      {
        title: "Full-Stack Developer",
        description: "Build end-to-end web applications",
        match: 92,
        skills: ["React", "Node.js", "TypeScript"],
        timeToComplete: "8-12 months",
        averageSalary: "₹8-15 LPA",
        demandLevel: "High",
        roadmap: ["Learn React", "Master Node.js", "Build projects"]
      }
    ]

    await aiService.saveInteraction(user.id, "career_suggestions", 
      JSON.stringify({ finalSkills, finalInterests }), 
      JSON.stringify(mockCareerPaths), 
      { model: "fallback" }
    )

    return NextResponse.json({ suggestions: mockCareerPaths })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const previousSuggestions = await aiService.getUserInteractions(user.id, "career_suggestions")
    return NextResponse.json({ previousSuggestions })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

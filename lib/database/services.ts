import { createClient } from "@/lib/supabase/client"
import type {
  Profile,
  Skill,
  Interest,
  AIInteraction,
  Job,
  Hackathon,
  ScheduleEvent,
  LearningResource,
  PracticeSession,
  ActivityFeed,
} from "./types"

const supabase = createClient()

// Profile Services
export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).single()

    if (error) {
      console.error("Error fetching profile:", error)
      return null
    }

    return data
  },

  async createProfile(userId: string, userData: { name?: string; email?: string }): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          user_id: userId,
          name: userData.name || '',
          email: userData.email || '',
          is_verified: true
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating profile:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error creating profile:", error)
      return null
    }
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase.from("profiles").update(updates).eq("user_id", userId).select().single()

    if (error) {
      console.error("Error updating profile:", error)
      return null
    }

    return data
  },

  async completeOnboarding(
    userId: string,
    onboardingData: {
      name?: string
      email?: string
      college_id: string
      current_year: string
      career_goals?: string
      skills: string[]
      interests: string[]
    },
  ): Promise<boolean> {
    try {
      console.log("🚀 Starting completeOnboarding for user:", userId)
      console.log("📦 Onboarding data received:", onboardingData)

      // First, check if profile exists
      console.log("🔍 Checking if profile exists...")
      let existingProfile = await this.getProfile(userId)
      console.log("👤 Existing profile:", existingProfile)
      
      // Prepare profile data
      const profileData: any = {
        user_id: userId,
        college_id: onboardingData.college_id,
        current_year: onboardingData.current_year,
        career_goals: onboardingData.career_goals,
        is_verified: true,
      }

      // Include name and email if provided
      if (onboardingData.name) {
        profileData.name = onboardingData.name
      }
      if (onboardingData.email) {
        profileData.email = onboardingData.email
      }

      console.log("💾 Profile data to save:", profileData)

      // Create or update profile
      if (existingProfile) {
        console.log("🔄 Updating existing profile...")
        // Update existing profile
        const { data: updateResult, error: profileError } = await supabase
          .from("profiles")
          .update(profileData)
          .eq("user_id", userId)
          .select()

        if (profileError) {
          console.error("❌ Profile update error:", profileError)
          throw profileError
        }
        console.log("✅ Profile updated successfully:", updateResult)
      } else {
        console.log("➕ Creating new profile...")
        // Create new profile
        const { data: insertResult, error: profileError } = await supabase
          .from("profiles")
          .insert(profileData)
          .select()

        if (profileError) {
          console.error("❌ Profile creation error:", profileError)
          throw profileError
        }
        console.log("✅ Profile created successfully:", insertResult)
      }

      // Clear existing skills and interests for this user first
      console.log("🧹 Clearing existing skills and interests...")
      await supabase.from("skills").delete().eq("user_id", userId)
      await supabase.from("interests").delete().eq("user_id", userId)

      // Insert skills
      if (onboardingData.skills.length > 0) {
        console.log("🔧 Inserting skills:", onboardingData.skills)
        const skillsData = onboardingData.skills.map((skill) => ({
          user_id: userId,
          skill_name: skill,
          proficiency_level: "beginner" as const,
        }))

        const { data: skillsResult, error: skillsError } = await supabase
          .from("skills")
          .insert(skillsData)
          .select()

        if (skillsError) {
          console.error("❌ Skills insert error:", skillsError)
          throw skillsError
        }
        console.log("✅ Skills inserted successfully:", skillsResult)
      }

      // Insert interests
      if (onboardingData.interests.length > 0) {
        console.log("💡 Inserting interests:", onboardingData.interests)
        const interestsData = onboardingData.interests.map((interest) => ({
          user_id: userId,
          interest_name: interest,
        }))

        const { data: interestsResult, error: interestsError } = await supabase
          .from("interests")
          .insert(interestsData)
          .select()

        if (interestsError) {
          console.error("❌ Interests insert error:", interestsError)
          throw interestsError
        }
        console.log("✅ Interests inserted successfully:", interestsResult)
      }

      console.log("🎉 Onboarding completed successfully!")
      return true
    } catch (error) {
      console.error("💥 Error completing onboarding:", error)
      return false
    }
  },
}

// Skills Services
export const skillsService = {
  async getUserSkills(userId: string): Promise<Skill[]> {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching skills:", error)
      return []
    }

    return data || []
  },

  async addSkill(
    userId: string,
    skillName: string,
    proficiencyLevel: "beginner" | "intermediate" | "advanced" = "beginner",
  ): Promise<Skill | null> {
    const { data, error } = await supabase
      .from("skills")
      .insert({
        user_id: userId,
        skill_name: skillName,
        proficiency_level: proficiencyLevel,
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding skill:", error)
      return null
    }

    return data
  },

  async updateSkill(skillId: string, updates: Partial<Skill>): Promise<Skill | null> {
    const { data, error } = await supabase.from("skills").update(updates).eq("id", skillId).select().single()

    if (error) {
      console.error("Error updating skill:", error)
      return null
    }

    return data
  },

  async deleteSkill(skillId: string): Promise<boolean> {
    const { error } = await supabase.from("skills").delete().eq("id", skillId)

    if (error) {
      console.error("Error deleting skill:", error)
      return false
    }

    return true
  },
}

// Interests Services
export const interestsService = {
  async getUserInterests(userId: string): Promise<Interest[]> {
    const { data, error } = await supabase
      .from("interests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching interests:", error)
      return []
    }

    return data || []
  },

  async addInterest(userId: string, interestName: string): Promise<Interest | null> {
    const { data, error } = await supabase
      .from("interests")
      .insert({
        user_id: userId,
        interest_name: interestName,
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding interest:", error)
      return null
    }

    return data
  },

  async deleteInterest(interestId: string): Promise<boolean> {
    const { error } = await supabase.from("interests").delete().eq("id", interestId)

    if (error) {
      console.error("Error deleting interest:", error)
      return false
    }

    return true
  },
}

// AI Interactions Services
export const aiService = {
  async saveInteraction(
    userId: string,
    interactionType: string,
    prompt: string,
    response: string,
    metadata: Record<string, any> = {},
  ): Promise<AIInteraction | null> {
    const { data, error } = await supabase
      .from("ai_interactions")
      .insert({
        user_id: userId,
        interaction_type: interactionType,
        prompt,
        response,
        metadata,
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving AI interaction:", error)
      return null
    }

    return data
  },

  async getUserInteractions(userId: string, interactionType?: string): Promise<AIInteraction[]> {
    let query = supabase.from("ai_interactions").select("*").eq("user_id", userId)

    if (interactionType) {
      query = query.eq("interaction_type", interactionType)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching AI interactions:", error)
      return []
    }

    return data || []
  },

  async getConversationHistory(userId: string, limit: number = 10): Promise<AIInteraction[]> {
    const { data, error } = await supabase
      .from("ai_interactions")
      .select("*")
      .eq("user_id", userId)
      .eq("interaction_type", "chat")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching conversation history:", error)
      return []
    }

    return (data || []).reverse() // Return in chronological order for chat display
  },

  async deleteInteraction(interactionId: string): Promise<boolean> {
    const { error } = await supabase
      .from("ai_interactions")
      .delete()
      .eq("id", interactionId)

    if (error) {
      console.error("Error deleting AI interaction:", error)
      return false
    }

    return true
  },
}

// Jobs Services
export const jobsService = {
  async getUserJobs(userId: string): Promise<Job[]> {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching jobs:", error)
      return []
    }

    return data || []
  },

  async saveJob(
    userId: string,
    jobData: Omit<Job, "id" | "user_id" | "created_at" | "updated_at">,
  ): Promise<Job | null> {
    const { data, error } = await supabase
      .from("jobs")
      .insert({
        user_id: userId,
        ...jobData,
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving job:", error)
      return null
    }

    return data
  },

  async updateJobStatus(jobId: string, status: Job["status"]): Promise<Job | null> {
    const { data, error } = await supabase.from("jobs").update({ status }).eq("id", jobId).select().single()

    if (error) {
      console.error("Error updating job status:", error)
      return null
    }

    return data
  },

  async deleteJob(jobId: string): Promise<boolean> {
    const { error } = await supabase.from("jobs").delete().eq("id", jobId)

    if (error) {
      console.error("Error deleting job:", error)
      return false
    }

    return true
  },
}

// Hackathons Services
export const hackathonsService = {
  async getUserHackathons(userId: string): Promise<Hackathon[]> {
    const { data, error } = await supabase
      .from("hackathons")
      .select("*")
      .eq("user_id", userId)
      .order("start_date", { ascending: false })

    if (error) {
      console.error("Error fetching hackathons:", error)
      return []
    }

    return data || []
  },

  async saveHackathon(
    userId: string,
    hackathonData: Omit<Hackathon, "id" | "user_id" | "created_at" | "updated_at">,
  ): Promise<Hackathon | null> {
    const { data, error } = await supabase
      .from("hackathons")
      .insert({
        user_id: userId,
        ...hackathonData,
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving hackathon:", error)
      return null
    }

    return data
  },

  async updateHackathonStatus(hackathonId: string, status: Hackathon["status"]): Promise<Hackathon | null> {
    const { data, error } = await supabase.from("hackathons").update({ status }).eq("id", hackathonId).select().single()

    if (error) {
      console.error("Error updating hackathon status:", error)
      return null
    }

    return data
  },

  async deleteHackathon(hackathonId: string): Promise<boolean> {
    const { error } = await supabase.from("hackathons").delete().eq("id", hackathonId)

    if (error) {
      console.error("Error deleting hackathon:", error)
      return false
    }

    return true
  },
}

// Schedule Services
export const scheduleService = {
  async getUserEvents(userId: string, startDate?: string, endDate?: string): Promise<ScheduleEvent[]> {
    let query = supabase.from("schedule_events").select("*").eq("user_id", userId)

    if (startDate) {
      query = query.gte("start_time", startDate)
    }

    if (endDate) {
      query = query.lte("start_time", endDate)
    }

    const { data, error } = await query.order("start_time", { ascending: true })

    if (error) {
      console.error("Error fetching schedule events:", error)
      return []
    }

    return data || []
  },

  async createEvent(
    userId: string,
    eventData: Omit<ScheduleEvent, "id" | "user_id" | "created_at" | "updated_at">,
  ): Promise<ScheduleEvent | null> {
    const { data, error } = await supabase
      .from("schedule_events")
      .insert({
        user_id: userId,
        ...eventData,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating event:", error)
      return null
    }

    return data
  },

  async updateEvent(eventId: string, updates: Partial<ScheduleEvent>): Promise<ScheduleEvent | null> {
    const { data, error } = await supabase.from("schedule_events").update(updates).eq("id", eventId).select().single()

    if (error) {
      console.error("Error updating event:", error)
      return null
    }

    return data
  },

  async deleteEvent(eventId: string): Promise<boolean> {
    const { error } = await supabase.from("schedule_events").delete().eq("id", eventId)

    if (error) {
      console.error("Error deleting event:", error)
      return false
    }

    return true
  },
}

// Learning Resources Services
export const learningService = {
  async getUserResources(userId: string): Promise<LearningResource[]> {
    const { data, error } = await supabase
      .from("learning_resources")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching learning resources:", error)
      return []
    }

    return data || []
  },

  async saveResource(
    userId: string,
    resourceData: Omit<LearningResource, "id" | "user_id" | "created_at" | "updated_at">,
  ): Promise<LearningResource | null> {
    const { data, error } = await supabase
      .from("learning_resources")
      .insert({
        user_id: userId,
        ...resourceData,
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving learning resource:", error)
      return null
    }

    return data
  },

  async updateProgress(
    resourceId: string,
    progressPercentage: number,
    status?: LearningResource["status"],
  ): Promise<LearningResource | null> {
    const updates: Partial<LearningResource> = { progress_percentage: progressPercentage }
    if (status) updates.status = status

    const { data, error } = await supabase
      .from("learning_resources")
      .update(updates)
      .eq("id", resourceId)
      .select()
      .single()

    if (error) {
      console.error("Error updating learning progress:", error)
      return null
    }

    return data
  },
}

// Practice Sessions Services
export const practiceService = {
  async getUserSessions(userId: string): Promise<PracticeSession[]> {
    const { data, error } = await supabase
      .from("practice_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching practice sessions:", error)
      return []
    }

    return data || []
  },

  async saveSession(
    userId: string,
    sessionData: Omit<PracticeSession, "id" | "user_id" | "created_at">,
  ): Promise<PracticeSession | null> {
    const { data, error } = await supabase
      .from("practice_sessions")
      .insert({
        user_id: userId,
        ...sessionData,
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving practice session:", error)
      return null
    }

    return data
  },
}

// Activity Feed Services
export const activityService = {
  async getUserActivity(userId: string): Promise<ActivityFeed[]> {
    const { data, error } = await supabase
      .from("activity_feed")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Error fetching user activity:", error)
      return []
    }

    return data || []
  },

  async getPublicActivity(): Promise<ActivityFeed[]> {
    const { data, error } = await supabase
      .from("activity_feed")
      .select(`
        *,
        profiles!inner(name)
      `)
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      console.error("Error fetching public activity:", error)
      return []
    }

    return data || []
  },

  async addActivity(
    userId: string,
    activityData: Omit<ActivityFeed, "id" | "user_id" | "created_at">,
  ): Promise<ActivityFeed | null> {
    const { data, error } = await supabase
      .from("activity_feed")
      .insert({
        user_id: userId,
        ...activityData,
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding activity:", error)
      return null
    }

    return data
  },
}

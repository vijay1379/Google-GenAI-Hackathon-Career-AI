// Database types for TypeScript support
export interface Profile {
  user_id: string
  name: string
  email: string
  college_id?: string
  current_year?: string
  career_goals?: string
  is_verified?: boolean
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  user_id: string
  skill_name: string
  proficiency_level: "beginner" | "intermediate" | "advanced"
  created_at: string
}

export interface Interest {
  id: string
  user_id: string
  interest_name: string
  created_at: string
}

export interface AIInteraction {
  id: string
  user_id: string
  interaction_type: string
  prompt: string
  response: string
  metadata: Record<string, any>
  created_at: string
}

export interface Job {
  id: string
  user_id: string
  title: string
  company: string
  location?: string
  description?: string
  requirements?: string[]
  salary_range?: string
  job_url?: string
  status: "saved" | "applied" | "interviewing" | "rejected" | "offered"
  source: "manual" | "api" | "scraped"
  created_at: string
  updated_at: string
}

export interface Hackathon {
  id: string
  user_id: string
  name: string
  description?: string
  start_date?: string
  end_date?: string
  location?: string
  registration_url?: string
  status: "interested" | "registered" | "participating" | "completed"
  created_at: string
  updated_at: string
}

export interface ScheduleEvent {
  id: string
  user_id: string
  title: string
  description?: string
  event_type: string
  start_time: string
  end_time?: string
  location?: string
  is_all_day: boolean
  reminder_minutes: number
  created_at: string
  updated_at: string
}

export interface LearningResource {
  id: string
  user_id: string
  title: string
  description?: string
  resource_type: string
  url?: string
  skill_category?: string
  difficulty_level?: string
  estimated_duration?: string
  status: "saved" | "in_progress" | "completed"
  progress_percentage: number
  created_at: string
  updated_at: string
}

export interface PracticeSession {
  id: string
  user_id: string
  session_type: string
  topic: string
  difficulty?: string
  duration_minutes?: number
  score?: number
  feedback?: string
  ai_generated_content: Record<string, any>
  created_at: string
}

export interface SocialConnection {
  id: string
  user_id: string
  connected_user_id: string
  connection_type: "peer" | "mentor" | "mentee"
  status: "pending" | "accepted" | "blocked"
  created_at: string
}

export interface ActivityFeed {
  id: string
  user_id: string
  activity_type: string
  title: string
  description?: string
  metadata: Record<string, any>
  is_public: boolean
  created_at: string
}

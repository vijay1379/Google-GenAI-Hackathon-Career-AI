"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Target, Award, TrendingUp, Clock, CheckCircle, Star, Loader2, RefreshCw, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { learningService, profileService, skillsService, interestsService } from "@/lib/database/services"

interface LearningRoadmap {
  id: number
  dbId?: string // Database ID
  title: string
  skills: string[]
  duration: string
  description: string
  level: string
  rating: number
  students: number
  matchPercentage: number
  detailedDescription: string
  sampleTasks: string[]
  category?: string
  difficulty?: string
  modules?: any[]
}

export function LearningHub() {
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null)
  const [roadmaps, setRoadmaps] = useState<LearningRoadmap[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [acceptedRoadmaps, setAcceptedRoadmaps] = useState<Set<number>>(new Set())
  const [userStats, setUserStats] = useState({
    level: "Level 1",
    completedModules: 0,
    weeklyHours: 0
  })

  const supabase = createClient()

  const stats = [
    {
      title: "Current Level",
      value: userStats.level,
      subtitle: "Based on progress",
      icon: Target,
    },
    {
      title: "Completed",
      value: userStats.completedModules.toString(),
      subtitle: "Learning modules",
      icon: Award,
    },
    {
      title: "This Week",
      value: `${userStats.weeklyHours}h`,
      subtitle: "Study time",
      icon: TrendingUp,
    },
  ]

  const loadUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get completed learning resources count
      const resources = await learningService.getUserResources(user.id)
      const completedCount = resources.filter((r: any) => r.status === 'completed').length
      
      // Calculate level based on completed modules
      const level = Math.floor(completedCount / 5) + 1
      
      // Calculate weekly hours (mock calculation)
      const weeklyHours = Math.min(completedCount * 2.5, 40)

      setUserStats({
        level: `Level ${level}`,
        completedModules: completedCount,
        weeklyHours: parseFloat(weeklyHours.toFixed(1))
      })
    } catch (error) {
      console.error('Error loading user stats:', error)
    }
  }

  // Fetch user profile, skills, interests, and generate learning paths using Gemini
  async function handleGeneratePath() {
    setIsGenerating(true)
    setRoadmaps([])
    try {
      await generateNewPaths()
    } catch (err) {
      setRoadmaps([])
      console.error('Error generating path:', err)
      alert('Failed to generate learning paths. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Delete previous paths and generate new ones
  async function handleRefresh() {
    setIsGenerating(true)
    setRoadmaps([])
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')
      
      // Delete existing accepted career paths first
      const { error: deleteAcceptedError } = await supabase
        .from('accepted_career_paths')
        .delete()
        .eq('user_id', user.id)
      if (deleteAcceptedError) {
        console.error('Error deleting accepted paths:', deleteAcceptedError)
        throw deleteAcceptedError
      }
      
      // Delete existing career paths
      const { error: deleteError } = await supabase.from('career_paths').delete().eq('user_id', user.id)
      if (deleteError) {
        console.error('Error deleting paths:', deleteError)
        throw deleteError
      }
      
      // Clear accepted roadmaps set
      setAcceptedRoadmaps(new Set())
      
      // Generate new paths
      await generateNewPaths()
      
    } catch (err) {
      setRoadmaps([])
      console.error('Error refreshing paths:', err)
      alert('Failed to refresh learning paths. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Separate function for generating new paths (used by both generate and refresh)
  async function generateNewPaths() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')

      // Fetch user profile
      const profile = await profileService.getProfile(user.id)
      const skills = await skillsService.getUserSkills(user.id)
      const interests = await interestsService.getUserInterests(user.id)

      const finalSkills = skills.map((s: any) => s.skill_name)
      const finalInterests = interests.map((i: any) => i.interest_name)
      const finalCareerGoal = profile?.career_goals || ''
      const currentYear = profile?.current_year || ''
      const college = profile?.college_id || ''

      // Compose prompt
      const prompt = `As an AI learning advisor for Indian tech students, analyze the following student profile and suggest 3-4 most suitable learning paths:\n\n    Student Profile:\n    - Current Skills: ${finalSkills.join(", ")}\n    - Interests: ${finalInterests.join(", ")}\n    - Career Goal: ${finalCareerGoal}\n    - Academic Year: ${currentYear}\n    - College: ${college}\n\n    Based on this EXISTING user data, provide personalized learning recommendations that will help them:\n    1. Build on their current skills\n    2. Explore their stated interests\n    3. Achieve their career goals\n    4. Advance from their current academic level\n\n    For each learning path, provide:\n    1. Course/Path title\n    2. Brief description (1-2 sentences)\n    3. Category (Programming, Data Science, Web Development, etc.)\n    4. Difficulty level (Beginner/Intermediate/Advanced)\n    5. Duration estimate\n    6. Best provider/platform\n    7. Learning URL (if available)\n    8. Skills gained (4-5 key skills)\n    9. Match percentage (based on current skills/interests)\n    10.  modules/topics related to that from the range of the estimated duration \n\n    Format the response as a JSON array with this structure:\n    {\n      "title": "Course Title",\n      "description": "Brief description",\n      "level": "Difficulty Level",\n      "duration": "X weeks/months",\n      "skills": ["skill1", "skill2", ...],\n      "match": 85,\n      "modules": ["Module 1", "Module 2", ...] \n    }\n\nexamples like this \n{\n          title: "Full Stack Web Development",\n          skills: ["React", "Node.js", "MongoDB", "Express"],\n          duration: "6 months",\n          description: "Master modern web development with React and Node.js",\n          level: "Intermediate",\n          match: 85,\n          description:\n            "This comprehensive roadmap will take you from intermediate to advanced full-stack development.",\n          modules: ["Set up React development environment", "Build REST API", "Connect to database",.....],\n        },\n    Focus on practical, career-relevant learning paths that build upon the user's existing skills and interests from their profile.`

      // Check if API key is available
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (!apiKey) {
        throw new Error('Gemini API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.')
      }

      // Call Gemini API
      const geminiResponse = await fetch( "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey
        },
        body: JSON.stringify({ 
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      })
      
      if (!geminiResponse.ok) {
        throw new Error(`Gemini API error: ${geminiResponse.status}`)
      }
      
      const geminiData = await geminiResponse.json()
      let learningPaths = []
      
      try {
        // Extract text from Gemini response structure
        const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || geminiData.text || ''
        console.log('Gemini response text:', responseText)
        
        // Remove markdown code blocks if present
        const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        
        learningPaths = JSON.parse(cleanedText)
        console.log('Parsed learning paths:', learningPaths)
      } catch (e) {
        console.error('Error parsing Gemini response:', e)
        learningPaths = []
      }

      // Save to career_paths table
      if (learningPaths.length > 0) {
        const rawGemini = JSON.stringify(geminiData)
        const insertData = learningPaths.map((path: any) => ({
          user_id: user.id,
          title: path.title,
          description: path.description,
          category: path.category,
          level: path.level,
          duration: path.duration,
          provider: path.best_provider || path.provider || '',
          url: path.learning_url || path.url || '',
          skills: path.skills || [],
          match: path.match || 0,
          modules: path.modules || [],
          raw_response: rawGemini
        }))
        
        const { error: insertError } = await supabase.from('career_paths').insert(insertData)
        if (insertError) {
          console.error('Error inserting learning paths:', insertError)
          throw insertError
        }
      }

      // Fetch and display the newly generated paths
      await fetchCareerPaths()
      
    } catch (error) {
      console.error('Error generating new paths:', error)
      throw error
    }
  }

  // Fetch career paths from DB
  async function fetchCareerPaths() {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')
      const { data, error } = await supabase.from('career_paths').select('*').eq('user_id', user.id)
      if (error) throw error
      setRoadmaps((data || []).map((path: any, idx: number) => ({
        id: idx + 1,
        dbId: path.id, // Store the actual database ID
        title: path.title,
        skills: path.skills || [],
        duration: path.duration || '',
        description: path.description,
        level: path.level || '',
        rating: 4.5,
        students: 1000,
        matchPercentage: path.match || 0,
        detailedDescription: path.description,
        sampleTasks: (path.modules || []).slice(0, 5),
        category: path.category,
        modules: path.modules
      })))
    } catch (err) {
      setRoadmaps([])
      console.error('Error fetching career paths:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUserStats()
    fetchCareerPaths() // Load existing roadmaps on mount
  }, [])

  const handleAcceptRoadmap = async (roadmap: LearningRoadmap) => {
    if (!supabase || acceptedRoadmaps.has(roadmap.id)) return
    
    try {
      setAcceptedRoadmaps(prev => new Set(prev).add(roadmap.id))
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')
      
      // Use the database ID directly if available
      let careerPathId = roadmap.dbId
      
      if (!careerPathId) {
        // Fallback: Find the career_path row by title and user
        const { data: paths, error: fetchError } = await supabase
          .from('career_paths')
          .select('id')
          .eq('user_id', user.id)
          .eq('title', roadmap.title)
          .limit(1)
        
        if (fetchError || !paths || !paths[0]) {
          throw fetchError || new Error('Path not found in database')
        }
        careerPathId = paths[0].id
      }
      
      console.log('Saving to accepted_career_paths:', { user_id: user.id, career_path_id: careerPathId })
      
      // Save to accepted_career_paths
      const { data: insertedData, error: insertError } = await supabase
        .from('accepted_career_paths')
        .insert({
          user_id: user.id,
          career_path_id: careerPathId
        })
        .select()
      
      if (insertError) {
        throw insertError
      }
      
      console.log('Successfully saved to accepted_career_paths:', insertedData)
      
      // Update user stats
      setUserStats(prev => ({
        ...prev,
        completedModules: prev.completedModules + 1
      }))
      
    } catch (error) {
      console.error('Error accepting roadmap:', error)
      // Remove from accepted roadmaps if save failed
      setAcceptedRoadmaps(prev => {
        const newSet = new Set(prev)
        newSet.delete(roadmap.id)
        return newSet
      })
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`Failed to accept roadmap: ${errorMessage}`)
    }
  }

  const refreshRoadmaps = () => {
    handleRefresh()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-balance">Learning Plan</h1>
        <p className="text-muted-foreground text-pretty">Track your progress and discover new learning paths</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Generated Roadmaps</h2>
          <p className="text-muted-foreground">Choose a learning path that matches your goals</p>
        </div>
        <div className="flex items-center gap-4 py-4">
          <Button variant="outline" size="sm" onClick={refreshRoadmaps} disabled={isGenerating}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="lg" onClick={handleGeneratePath} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Generating Path...
              </>
            ) : (
              'Generate Path'
            )}
          </Button>
        </div>
        
        {/* Display generated roadmaps */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">Loading roadmaps...</p>
            </div>
          </div>
        ) : roadmaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmaps.map((roadmap) => (
              <Card key={roadmap.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{roadmap.title}</CardTitle>
                      <CardDescription>{roadmap.description}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="outline">{roadmap.level}</Badge>
                      <div className="flex items-center gap-2">
                        <div className="relative w-12 h-12">
                          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeDasharray={`${roadmap.matchPercentage}, 100`}
                              className="text-primary"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-muted-foreground/20"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold">{roadmap.matchPercentage}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {roadmap.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {roadmap.rating}
                    </div>
                    <span>{roadmap.students} students</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {roadmap.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{roadmap.title}</DialogTitle>
                          <DialogDescription>{roadmap.detailedDescription}</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Skills You'll Learn</h4>
                            <div className="flex flex-wrap gap-2">
                              {roadmap.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Duration: {roadmap.duration}</h4>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Learning Modules</h4>
                            <ul className="space-y-2">
                              {roadmap.sampleTasks.map((task, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{task}</span>
                                </li>
                              ))}
                            </ul>
                            {roadmap.modules && roadmap.modules.length > 5 && (
                              <p className="text-sm text-muted-foreground mt-2 italic">
                                ...and {roadmap.modules.length - 5} more modules
                              </p>
                            )}
                          </div>

                          <Button 
                            onClick={() => handleAcceptRoadmap(roadmap)} 
                            className="w-full"
                            disabled={acceptedRoadmaps.has(roadmap.id)}
                          >
                            {acceptedRoadmaps.has(roadmap.id) ? (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Accepted
                              </>
                            ) : (
                              'Accept Roadmap'
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      onClick={() => handleAcceptRoadmap(roadmap)} 
                      className="flex-1"
                      disabled={acceptedRoadmaps.has(roadmap.id)}
                    >
                      {acceptedRoadmaps.has(roadmap.id) ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Accepted
                        </>
                      ) : (
                        'Accept'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No roadmaps generated yet. Click "Generate Path" to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}

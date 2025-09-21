"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { skillsService, interestsService, jobsService, learningService, activityService } from "@/lib/database/services"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Target,
  BookOpen,
  Award,
  Calendar,
  TrendingUp,
  Users,
  FileText,
  Newspaper,
  ArrowRight,
  Star,
  Clock,
  CheckCircle,
  Github,
  Linkedin,
  Trophy,
  Zap,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  Code,
  Briefcase,
} from "lucide-react"

interface UserData {
  id: string
  name: string
  email: string
  college_id?: string
  current_year?: string
  career_goals?: string
  skills: string[]
  interests: string[]
  jobs: any[]
  learningResources: any[]
  recentActivity: any[]
}

export function DashboardContent() {
  const { user, profile } = useAuth()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedCareerPath, setSelectedCareerPath] = useState<any>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id || !profile) return

      try {
        setIsLoading(true)

        // Fetch user skills
        const skills = await skillsService.getUserSkills(user.id)

        // Fetch user interests
        const interests = await interestsService.getUserInterests(user.id)

        // Fetch user jobs
        const jobs = await jobsService.getUserJobs(user.id)

        // Fetch learning resources
        const learningResources = await learningService.getUserResources(user.id)

        // Fetch recent activity
        const recentActivity = await activityService.getUserActivity(user.id)

        const combinedUserData: UserData = {
          id: user.id,
          name: profile.name || user.email?.split("@")[0] || "",
          email: user.email || "",
          college_id: profile.college_id,
          current_year: profile.current_year,
          career_goals: profile.career_goals,
          skills: skills?.map((s: any) => s.skill_name) || [],
          interests: interests?.map((i: any) => i.interest_name) || [],
          jobs: jobs || [],
          learningResources: learningResources || [],
          recentActivity: recentActivity || []
        }

        setUserData(combinedUserData)
        setIsLoading(false)

      } catch (error) {
        console.error("Error fetching user data:", error)
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [user, profile])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Unable to load dashboard</h2>
          <p className="text-muted-foreground">Please refresh the page or contact support.</p>
        </div>
      </div>
    )
  }

  const firstName = userData?.name?.split(" ")[0] || "Student"

  const handlePathSelect = (path: any) => {
    setSelectedCareerPath(path)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">Welcome back, {firstName}!</h1>
          <p className="text-muted-foreground text-pretty">
            Continue your journey to becoming a{" "}
            {selectedCareerPath?.title || userData?.career_goals || "tech"} professional. You're making
            great progress!
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">XP Points</CardTitle>
            <Star className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">Level 12 Developer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">{userData?.interests?.[0] || "Full-Stack"} track</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3/5</div>
            <p className="text-xs text-muted-foreground">2 remaining</p>
          </CardContent>
        </Card>
      </div>

      {selectedCareerPath && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Selected Career Path
            </CardTitle>
            <CardDescription>Your chosen learning journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{selectedCareerPath.title}</h3>
                <p className="text-muted-foreground text-sm">{selectedCareerPath.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="secondary">{selectedCareerPath.level || "Intermediate"}</Badge>
                  <span className="text-muted-foreground">
                    Duration: {selectedCareerPath.timeToComplete || "6 months"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Career Path Progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Your Career Path: {selectedCareerPath?.title || userData?.interests?.[0] || "Full-Stack Developer"}
                </CardTitle>
                <CardDescription>Track your progress through the complete roadmap</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsPaused(!isPaused)} className="bg-transparent">
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  {isPaused ? "Resume" : "Pause"}
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedCareerPath ? (
              selectedCareerPath.roadmap
                .map((step: string, index: number) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{step}</span>
                      <Badge variant={index === 0 ? "secondary" : index === 1 ? "outline" : "outline"}>
                        {index === 0 ? "Completed" : index === 1 ? "In Progress" : "Next Up"}
                      </Badge>
                    </div>
                    <Progress value={index === 0 ? 100 : index === 1 ? 75 : index === 2 ? 25 : 0} className="h-2" />
                  </div>
                ))
                .slice(0, 4)
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Frontend Fundamentals</span>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {userData?.skills?.includes("React") ? "Advanced React" : "React Development"}
                    </span>
                    <Badge variant="outline">In Progress</Badge>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {userData?.skills?.includes("Node.js") ? "Advanced Backend" : "Backend with Node.js"}
                    </span>
                    <Badge variant="outline">Next Up</Badge>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">System Design & Architecture</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </>
            )}

            <Button className="w-full mt-4" disabled={isPaused}>
              {isPaused ? "Learning Paused" : "Continue Learning"}
              {!isPaused && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Clock className="w-4 h-4 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">React Hooks Practice</p>
                  <p className="text-xs text-muted-foreground">9:00 AM - 10:30 AM</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  +50 XP
                </Badge>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <BookOpen className="w-4 h-4 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">JavaScript Algorithms</p>
                  <p className="text-xs text-muted-foreground">2:00 PM - 3:00 PM</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  +30 XP
                </Badge>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <FileText className="w-4 h-4 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Resume Review</p>
                  <p className="text-xs text-muted-foreground">4:00 PM - 4:30 PM</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  +20 XP
                </Badge>
              </div>
            </div>

            <Button variant="outline" className="w-full bg-transparent">
              View Full Schedule
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Activity Tracking & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GitHub & LinkedIn Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              Activity Tracking
            </CardTitle>
            <CardDescription>Keep your profiles active and engaged</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Github className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">GitHub Activity</p>
                  <p className="text-xs text-muted-foreground">3 commits this week</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline">Goal: 5/week</Badge>
                <p className="text-xs text-muted-foreground mt-1">60% complete</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Linkedin className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">LinkedIn Engagement</p>
                  <p className="text-xs text-muted-foreground">2 posts this week</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline">Goal: 3/week</Badge>
                <p className="text-xs text-muted-foreground mt-1">67% complete</p>
              </div>
            </div>

            <Button variant="outline" className="w-full bg-transparent">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Activity Tips
            </Button>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Recent Achievements
            </CardTitle>
            <CardDescription>Your latest milestones and badges</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Week Warrior</p>
                <p className="text-xs text-muted-foreground">Completed 7-day streak</p>
              </div>
              <Badge variant="secondary">New!</Badge>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">React Master</p>
                <p className="text-xs text-muted-foreground">Completed React fundamentals</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <Code className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Code Contributor</p>
                <p className="text-xs text-muted-foreground">Made 10 GitHub commits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Opportunities & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="w-5 h-5 text-primary" />
              Hackathons
            </CardTitle>
            <CardDescription>Upcoming competitions and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <p className="text-sm font-medium">Smart India Hackathon 2024</p>
              <p className="text-xs text-muted-foreground">Registration ends in 5 days</p>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              View All Events
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="w-5 h-5 text-primary" />
              Free Courses
            </CardTitle>
            <CardDescription>Recommended learning resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <p className="text-sm font-medium">Advanced React Patterns</p>
              <p className="text-xs text-muted-foreground">By Meta • 4.8 rating</p>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Browse Courses
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase className="w-5 h-5 text-primary" />
              Job Opportunities
            </CardTitle>
            <CardDescription>Internships and entry-level positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <p className="text-sm font-medium">Frontend Intern at Startup</p>
              <p className="text-xs text-muted-foreground">Remote • ₹15k/month</p>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              View Opportunities
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-primary" />
              Resume Lab
            </CardTitle>
            <CardDescription>Optimize your resume with AI-powered suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-transparent">
              Analyze Resume
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-primary" />
              Find Mentors
            </CardTitle>
            <CardDescription>Connect with senior developers and alumni</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-transparent">
              Browse Mentors
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Newspaper className="w-5 h-5 text-primary" />
              Tech News
            </CardTitle>
            <CardDescription>Stay updated with the latest in technology</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-transparent">
              Read Latest
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

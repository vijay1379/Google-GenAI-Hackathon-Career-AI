"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { useRequireProfile } from "@/hooks/use-auth-guards"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Share2, Github, Linkedin, CheckCircle, Trophy, Star, TrendingUp } from "lucide-react"

export default function SocialPage() {
  useRequireProfile()
  
  const [completedTasks, setCompletedTasks] = useState<number[]>([])

  const linkedinTasks = [
    {
      id: 1,
      title: "Complete LinkedIn Profile",
      description: "Add professional photo, headline, and summary",
      xp: 100,
      difficulty: "Easy",
      category: "Profile Setup",
    },
    {
      id: 2,
      title: "Connect with 50 Professionals",
      description: "Build your network by connecting with industry professionals",
      xp: 150,
      difficulty: "Medium",
      category: "Networking",
    },
    {
      id: 3,
      title: "Share 5 Industry Articles",
      description: "Share relevant tech articles with thoughtful commentary",
      xp: 75,
      difficulty: "Easy",
      category: "Content Sharing",
    },
    {
      id: 4,
      title: "Write 3 Professional Posts",
      description: "Create original content about your learning journey",
      xp: 200,
      difficulty: "Hard",
      category: "Content Creation",
    },
    {
      id: 5,
      title: "Join 10 Tech Groups",
      description: "Join relevant LinkedIn groups in your field",
      xp: 50,
      difficulty: "Easy",
      category: "Community",
    },
  ]

  const githubTasks = [
    {
      id: 6,
      title: "Create Professional README",
      description: "Write a compelling profile README with your skills and projects",
      xp: 80,
      difficulty: "Medium",
      category: "Profile Setup",
    },
    {
      id: 7,
      title: "Contribute to Open Source",
      description: "Make your first contribution to an open source project",
      xp: 250,
      difficulty: "Hard",
      category: "Contributions",
    },
    {
      id: 8,
      title: "Pin 6 Best Repositories",
      description: "Showcase your best work by pinning repositories",
      xp: 40,
      difficulty: "Easy",
      category: "Portfolio",
    },
    {
      id: 9,
      title: "Maintain 30-Day Streak",
      description: "Commit code for 30 consecutive days",
      xp: 300,
      difficulty: "Hard",
      category: "Consistency",
    },
    {
      id: 10,
      title: "Star 50 Useful Repositories",
      description: "Build a collection of useful repositories for reference",
      xp: 30,
      difficulty: "Easy",
      category: "Learning",
    },
    {
      id: 11,
      title: "Follow 25 Developers",
      description: "Follow influential developers in your tech stack",
      xp: 25,
      difficulty: "Easy",
      category: "Networking",
    },
  ]

  const handleCompleteTask = (taskId: number) => {
    setCompletedTasks((prev) => [...prev, taskId])
    console.log(`  Completed social task: ${taskId}`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500"
      case "Medium":
        return "bg-yellow-500"
      case "Hard":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const calculateProgress = (tasks: any[]) => {
    const completed = tasks.filter((task) => completedTasks.includes(task.id)).length
    return (completed / tasks.length) * 100
  }

  const calculateTotalXP = (tasks: any[]) => {
    return tasks.filter((task) => completedTasks.includes(task.id)).reduce((total, task) => total + task.xp, 0)
  }

  const renderTaskList = (tasks: any[], platform: string) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="font-medium">Progress</span>
            </div>
            <Progress value={calculateProgress(tasks)} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {tasks.filter((task) => completedTasks.includes(task.id)).length} of {tasks.length} tasks completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-primary" />
              <span className="font-medium">Total XP Earned</span>
            </div>
            <div className="text-2xl font-bold text-primary">{calculateTotalXP(tasks)}</div>
            <p className="text-sm text-muted-foreground">Experience points from {platform}</p>
          </CardContent>
        </Card>
      </div>

      {tasks.map((task) => (
        <Card key={task.id} className={`transition-all ${completedTasks.includes(task.id) ? "bg-accent/50" : ""}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3
                    className={`font-medium ${completedTasks.includes(task.id) ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.title}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {task.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getDifficultyColor(task.difficulty)}`} />
                    <span className="text-xs text-muted-foreground">{task.difficulty}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-primary text-primary-foreground">
                    {task.xp} XP
                  </Badge>
                </div>
              </div>
              <Button
                variant={completedTasks.includes(task.id) ? "secondary" : "outline"}
                size="sm"
                onClick={() => handleCompleteTask(task.id)}
                disabled={completedTasks.includes(task.id)}
                className="ml-4"
              >
                {completedTasks.includes(task.id) ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Completed
                  </>
                ) : (
                  "Complete"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Social & Professional Development</h1>
          <p className="text-muted-foreground">
            Build your professional presence on LinkedIn and GitHub with structured tasks and XP rewards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Share2 className="w-5 h-5 text-primary" />
                <span className="font-medium">Total Tasks</span>
              </div>
              <div className="text-2xl font-bold">{linkedinTasks.length + githubTasks.length}</div>
              <p className="text-sm text-muted-foreground">Available challenges</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="font-medium">Completed</span>
              </div>
              <div className="text-2xl font-bold text-primary">{completedTasks.length}</div>
              <p className="text-sm text-muted-foreground">Tasks finished</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span className="font-medium">Total XP</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                {calculateTotalXP(linkedinTasks) + calculateTotalXP(githubTasks)}
              </div>
              <p className="text-sm text-muted-foreground">Experience earned</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="linkedin" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="linkedin" className="flex items-center gap-2">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </TabsTrigger>
          </TabsList>

          <TabsContent value="linkedin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Linkedin className="w-5 h-5 text-blue-600" />
                  LinkedIn Professional Development
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Build your professional network and establish thought leadership on LinkedIn.
                </p>
              </CardHeader>
              <CardContent>{renderTaskList(linkedinTasks, "LinkedIn")}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="github" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="w-5 h-5" />
                  GitHub Developer Profile
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Showcase your coding skills and contribute to the open source community.
                </p>
              </CardHeader>
              <CardContent>{renderTaskList(githubTasks, "GitHub")}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}

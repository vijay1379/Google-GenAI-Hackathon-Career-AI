"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Lock, Target, ArrowRight } from "lucide-react"

export function SkillRoadmap() {
  const roadmapItems = [
    {
      title: "Frontend Fundamentals",
      description: "HTML, CSS, JavaScript basics",
      progress: 100,
      status: "completed",
      estimatedTime: "2 weeks",
      skills: ["HTML5", "CSS3", "JavaScript ES6+"],
    },
    {
      title: "React Development",
      description: "Component-based UI development",
      progress: 75,
      status: "in-progress",
      estimatedTime: "3 weeks",
      skills: ["React", "JSX", "Hooks", "State Management"],
    },
    {
      title: "Backend with Node.js",
      description: "Server-side JavaScript development",
      progress: 25,
      status: "next",
      estimatedTime: "4 weeks",
      skills: ["Node.js", "Express", "APIs", "Databases"],
    },
    {
      title: "Full-Stack Integration",
      description: "Connecting frontend and backend",
      progress: 0,
      status: "locked",
      estimatedTime: "2 weeks",
      skills: ["REST APIs", "Authentication", "Deployment"],
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Full-Stack Developer Roadmap
          </CardTitle>
          <CardDescription>Your personalized learning path based on your goals and current skills</CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {roadmapItems.map((item, index) => (
          <Card key={index} className={item.status === "in-progress" ? "ring-2 ring-primary" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.status === "completed" && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {item.status === "in-progress" && <Clock className="w-5 h-5 text-primary" />}
                  {item.status === "next" && <Target className="w-5 h-5 text-muted-foreground" />}
                  {item.status === "locked" && <Lock className="w-5 h-5 text-muted-foreground" />}
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      item.status === "completed" ? "default" : item.status === "in-progress" ? "secondary" : "outline"
                    }
                  >
                    {item.status === "completed" && "Completed"}
                    {item.status === "in-progress" && "In Progress"}
                    {item.status === "next" && "Next Up"}
                    {item.status === "locked" && "Locked"}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{item.estimatedTime}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Skills you'll learn:</p>
                <div className="flex flex-wrap gap-2">
                  {item.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {item.status === "in-progress" && (
                <Button className="w-full">
                  Continue Learning
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}

              {item.status === "next" && (
                <Button variant="outline" className="w-full bg-transparent">
                  Start Module
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

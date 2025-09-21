"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Target, Star, ArrowRight, RefreshCw, Sparkles } from "lucide-react"

interface CareerPath {
  title: string
  description: string
  match: number
  skills: string[]
  timeToComplete: string
  averageSalary: string
  demandLevel: "High" | "Medium" | "Low"
  roadmap: string[]
}

interface CareerPathSuggestionsProps {
  userSkills: string[]
  userInterests: string[]
  onPathSelect: (path: CareerPath) => void
}

export function CareerPathSuggestions({ userSkills, userInterests, onPathSelect }: CareerPathSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<CareerPath[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const generateCareerPaths = async () => {
    setIsLoading(true)

    try {
      // Get user data from localStorage for more context
      const userData = localStorage.getItem("userOnboardingData")
      const parsedData = userData ? JSON.parse(userData) : {}

      const response = await fetch("/api/career-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userSkills,
          userInterests,
          currentYear: parsedData.currentYear || "Final Year",
          college: parsedData.college || "Unknown",
        }),
      })

      const data = await response.json()
      setSuggestions(data.suggestions)
    } catch (error) {
      console.error("Error fetching career suggestions:", error)
      // Fallback to basic suggestions on error
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userSkills.length > 0 || userInterests.length > 0) {
      generateCareerPaths()
    }
  }, [userSkills, userInterests])

  const getDemandColor = (level: string) => {
    switch (level) {
      case "High":
        return "bg-green-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Career Path Suggestions
          </CardTitle>
          <CardDescription>
            Analyzing your profile with Gemini AI to generate personalized recommendations...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">AI is analyzing your skills and interests...</p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3 h-3" />
              Powered by Gemini AI
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Career Path Suggestions
            </CardTitle>
            <CardDescription>Personalized recommendations powered by Gemini AI</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={generateCareerPaths} disabled={isLoading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {suggestions.map((path, index) => (
          <div key={index} className="border rounded-lg p-6 space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{path.title}</h3>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {path.match}% match
                  </Badge>
                  <Badge variant="outline" className={`${getDemandColor(path.demandLevel)} text-white border-0`}>
                    {path.demandLevel} Demand
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">{path.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Timeline:</span>
                <p className="text-muted-foreground">{path.timeToComplete}</p>
              </div>
              <div>
                <span className="font-medium">Avg. Salary:</span>
                <p className="text-muted-foreground">{path.averageSalary}</p>
              </div>
              <div>
                <span className="font-medium">AI Match Score:</span>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={path.match} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground">{path.match}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-medium text-sm">Key Skills Required:</span>
              <div className="flex flex-wrap gap-2">
                {path.skills.map((skill, skillIndex) => (
                  <Badge
                    key={skillIndex}
                    variant={
                      userSkills.some((s) => s.toLowerCase().includes(skill.toLowerCase())) ? "default" : "outline"
                    }
                    className="text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-medium text-sm">AI-Generated Learning Roadmap:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {path.roadmap.slice(0, 4).map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={() => onPathSelect(path)} className="flex-1">
                Start This Path
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline">View Full Roadmap</Button>
            </div>
          </div>
        ))}

        {suggestions.length === 0 && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Complete your profile to get AI-powered career path suggestions</p>
            <p className="text-xs mt-2">Powered by Gemini AI</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

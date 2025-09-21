"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Clock, Target, ExternalLink, Play, CheckCircle } from "lucide-react"

interface Resource {
  type: string
  title: string
  url?: string
  description: string
}

interface Project {
  title: string
  description: string
}

interface LearningModule {
  title: string
  description: string
  skills: string[]
  timeEstimate: string
  resources: Resource[]
  project: Project
}

interface LearningRoadmap {
  title: string
  description: string
  estimatedTime: string
  difficulty: string
  modules: LearningModule[]
}

export function LearningRoadmap() {
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [focusArea, setFocusArea] = useState("")
  const [error, setError] = useState<string | null>(null)

  const generateRoadmap = async () => {
    if (!focusArea.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/learning-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          focusArea: focusArea.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate learning roadmap")
      }

      const data = await response.json()
      setRoadmap(data.roadmap)
    } catch (error) {
      console.error("Error generating roadmap:", error)
      setError("Failed to generate learning roadmap. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      generateRoadmap()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">AI Learning Roadmap</h2>
        <p className="text-muted-foreground">Get a personalized learning path based on your goals</p>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            What do you want to learn?
          </CardTitle>
          <CardDescription>Enter a skill, technology, or career area you'd like to focus on</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="focus-area">Focus Area</Label>
            <Input
              id="focus-area"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., React Development, Data Science, Machine Learning..."
              disabled={isLoading}
            />
          </div>
          <Button onClick={generateRoadmap} disabled={!focusArea.trim() || isLoading}>
            {isLoading ? "Generating..." : "Generate Roadmap"}
          </Button>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Roadmap Display */}
      {roadmap && (
        <div className="space-y-6">
          {/* Roadmap Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                {roadmap.title}
              </CardTitle>
              <CardDescription>{roadmap.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{roadmap.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <Badge variant="secondary">{roadmap.difficulty}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{roadmap.modules.length} Modules</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Modules */}
          <div className="space-y-4">
            {roadmap.modules.map((module, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{module.timeEstimate}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Skills */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Skills You'll Learn</h4>
                    <div className="flex flex-wrap gap-2">
                      {module.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Learning Resources</h4>
                    <div className="space-y-2">
                      {module.resources.map((resource, resourceIndex) => (
                        <div key={resourceIndex} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="flex-shrink-0 w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                            {resource.type === "course" && <Play className="w-3 h-3 text-primary" />}
                            {resource.type === "tutorial" && <BookOpen className="w-3 h-3 text-primary" />}
                            {resource.type === "project" && <Target className="w-3 h-3 text-primary" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{resource.title}</span>
                              {resource.url && (
                                <Button variant="ghost" size="sm" className="h-auto p-0" asChild>
                                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </Button>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{resource.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Hands-on Project</h4>
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="font-medium text-sm text-primary">{module.project.title}</div>
                      <p className="text-xs text-muted-foreground mt-1">{module.project.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

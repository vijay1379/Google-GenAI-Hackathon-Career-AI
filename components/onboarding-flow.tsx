"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Target, User, GraduationCap, Code, Lightbulb, ArrowRight, ArrowLeft, CheckCircle, Brain } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { profileService } from "@/lib/database/services"

const SKILLS_OPTIONS = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "React",
  "Node.js",
  "HTML/CSS",
  "SQL",
  "Git",
  "Docker",
  "AWS",
  "Machine Learning",
  "Data Science",
  "UI/UX Design",
  "Mobile Development",
  "DevOps",
  "Cybersecurity",
]

const INTERESTS_OPTIONS = [
  "Web Development",
  "Mobile App Development",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Cybersecurity",
  "Cloud Computing",
  "DevOps",
  "UI/UX Design",
  "Game Development",
  "Blockchain",
  "IoT",
  "Robotics",
]

interface OnboardingData {
  name: string
  email: string
  collegeId: string
  currentYear: string
  skills: string[]
  interests: string[]
  careerGoals: string
}

export function OnboardingFlow() {
  const router = useRouter()
  const { user, profile, refreshProfile } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<OnboardingData>({
    name: profile?.name || user?.user_metadata?.name || "",
    email: profile?.email || user?.email || "",
    collegeId: profile?.college_id || "",
    currentYear: profile?.current_year || "",
    skills: [],
    interests: [],
    careerGoals: profile?.career_goals || "",
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      if (!user?.id) {
        setError("User not authenticated")
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        console.log("Starting onboarding for user:", user.id)
        console.log("Onboarding data:", {
          name: data.name,
          email: data.email,
          college_id: data.collegeId,
          current_year: data.currentYear,
          career_goals: data.careerGoals,
          skills: data.skills,
          interests: data.interests,
        })

        const success = await profileService.completeOnboarding(user.id, {
          name: data.name,
          email: data.email,
          college_id: data.collegeId,
          current_year: data.currentYear,
          career_goals: data.careerGoals,
          skills: data.skills,
          interests: data.interests,
        })

        console.log("Onboarding result:", success)

        if (success) {
          console.log("Onboarding successful, refreshing profile...")
          await refreshProfile()
          console.log("Profile refreshed, navigating to dashboard...")
          router.push("/dashboard")
        } else {
          console.error("Onboarding failed")
          setError("Failed to save onboarding data. Please try again.")
        }
      } catch (error) {
        console.error("Onboarding error:", error)
        setError(`An error occurred while saving your data: ${error instanceof Error ? error.message : 'Unknown error'}`)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleSkill = (skill: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }

  const toggleInterest = (interest: string) => {
    setData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return data.name && data.email && data.collegeId
      case 2:
        return data.currentYear
      case 3:
        return data.skills.length > 0
      case 4:
        return data.interests.length > 0
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-balance">Welcome to CareerAI</h1>
            <p className="text-muted-foreground text-pretty">
              Let's personalize your learning journey in just a few steps
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <User className="w-5 h-5 text-primary" />}
              {currentStep === 2 && <GraduationCap className="w-5 h-5 text-primary" />}
              {currentStep === 3 && <Code className="w-5 h-5 text-primary" />}
              {currentStep === 4 && <Lightbulb className="w-5 h-5 text-primary" />}
              {currentStep === 1 && "Personal Information"}
              {currentStep === 2 && "Academic Details"}
              {currentStep === 3 && "Current Skills"}
              {currentStep === 4 && "Career Interests"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about yourself to get started"}
              {currentStep === 2 && "Help us understand your academic background"}
              {currentStep === 3 && "Select the skills you currently have"}
              {currentStep === 4 && "What areas interest you the most?"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={data.name}
                    onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">College Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@college.edu"
                    value={data.email}
                    onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collegeId">College/Student ID</Label>
                  <Input
                    id="collegeId"
                    placeholder="Enter your student ID"
                    value={data.collegeId}
                    onChange={(e) => setData((prev) => ({ ...prev, collegeId: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Academic Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentYear">Current Year of Study</Label>
                  <Select
                    value={data.currentYear}
                    onValueChange={(value) => setData((prev) => ({ ...prev, currentYear: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your current year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st-year">1st Year</SelectItem>
                      <SelectItem value="2nd-year">2nd Year</SelectItem>
                      <SelectItem value="3rd-year">3rd Year</SelectItem>
                      <SelectItem value="4th-year">4th Year</SelectItem>
                      <SelectItem value="masters">Master's Student</SelectItem>
                      <SelectItem value="phd">PhD Student</SelectItem>
                      <SelectItem value="graduate">Recent Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="careerGoals">Career Goals (Optional)</Label>
                  <Textarea
                    id="careerGoals"
                    placeholder="Tell us about your career aspirations..."
                    value={data.careerGoals}
                    onChange={(e) => setData((prev) => ({ ...prev, careerGoals: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Skills */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select all the skills you currently have experience with:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SKILLS_OPTIONS.map((skill) => (
                    <div
                      key={skill}
                      className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        data.skills.includes(skill)
                          ? "bg-primary/10 border-primary"
                          : "bg-muted/50 border-border hover:bg-muted"
                      }`}
                      onClick={() => toggleSkill(skill)}
                    >
                      <Checkbox checked={data.skills.includes(skill)} onChange={() => toggleSkill(skill)} />
                      <span className="text-sm font-medium">{skill}</span>
                    </div>
                  ))}
                </div>
                {data.skills.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Selected Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Interests */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">What areas of technology interest you the most?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {INTERESTS_OPTIONS.map((interest) => (
                    <div
                      key={interest}
                      className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        data.interests.includes(interest)
                          ? "bg-primary/10 border-primary"
                          : "bg-muted/50 border-border hover:bg-muted"
                      }`}
                      onClick={() => toggleInterest(interest)}
                    >
                      <Checkbox checked={data.interests.includes(interest)} onChange={() => toggleInterest(interest)} />
                      <span className="text-sm font-medium">{interest}</span>
                    </div>
                  ))}
                </div>
                {data.interests.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Selected Interests:</p>
                    <div className="flex flex-wrap gap-2">
                      {data.interests.map((interest) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">{error}</div>}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isLoading}
            className="bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={!isStepValid() || isLoading}>
            {currentStep === totalSteps ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Complete Setup"}
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}




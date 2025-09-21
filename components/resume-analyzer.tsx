"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FileText,
  Upload,
  Zap,
  CheckCircle,
  AlertTriangle,
  Target,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Award,
  Users,
  Clock,
  BarChart3,
  Lightbulb,
  Briefcase,
  Star,
  Brain,
} from "lucide-react"

interface AIAnalysis {
  overall_score: number
  category_scores: {
    formatting: number
    clarity: number
    relevance_to_jobs: number
    skills_presentation: number
    impact_of_experience: number
    keywords_for_ATS: number
    use_of_adverbs: number
    xyz_format_in_projects: number
  }
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  ats_keywords_to_add: string[]
  adverbs: {
    used_in_resume: string[]
    suggested_to_add: string[]
  }
  rewritten_examples: Array<{
    original: string
    improved: string
  }>
}

export function ResumeAnalyzer() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isExtractingPDF, setIsExtractingPDF] = useState(false)

  const extractPDFText = async (file: File) => {
    setIsExtractingPDF(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const extractResponse = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      })
      
      if (extractResponse.ok) {
        const extractResult = await extractResponse.json()
        
        // Check if PDF extraction actually worked or if it's a fallback
        if (extractResult.fallback) {
          setError("PDF text extraction failed. Please copy and paste your resume content into the text area below for analysis.")
          setResumeText("")
          return false
        }
        
        // Only use extracted text if it's real content (not fallback message)
        if (extractResult.text && !extractResult.fallback) {
          setResumeText(extractResult.text)
          return true
        }
      } else {
        setError("Failed to process PDF file. Please try uploading again or paste your resume text manually.")
        setResumeText("")
        return false
      }
    } catch (error) {
      console.error("PDF extraction error:", error)
      setError("Failed to extract text from PDF. Please paste your resume content manually.")
      setResumeText("")
      return false
    } finally {
      setIsExtractingPDF(false)
    }
    
    return false
  }

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setUploadedFile(file)
      // Clear any previous errors when file is uploaded
      if (error) setError(null)
      
      // Try to extract text from PDF immediately
      await extractPDFText(file)
    }
  }, [error])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === "application/pdf") {
      setUploadedFile(file)
      // Clear any previous errors when file is dropped
      if (error) setError(null)
      
      // Try to extract text from PDF immediately
      await extractPDFText(file)
    }
  }, [error])

  const analyzeResume = async () => {
    // Clear any previous errors
    setError(null)
    
    // Validate required fields
    if (!resumeText.trim()) {
      setError("Please upload a resume or enter resume text to analyze.")
      return
    }
    
    if (!jobTitle.trim()) {
      setError("Please enter a job title for targeted analysis.")
      return
    }
    
    if (!jobDescription.trim()) {
      setError("Please enter the job description to analyze your resume against.")
      return
    }

    setIsAnalyzing(true)

    try {
      // At this point, if there's an uploaded file, the text should already be extracted
      // If there's no resumeText but there's an uploaded file, extraction failed
      if (uploadedFile && !resumeText.trim()) {
        setError("PDF text extraction failed. Please copy and paste your resume content into the text area below for analysis.")
        setIsAnalyzing(false)
        return
      }

      // Send to Gemini API for analysis
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText: resumeText,
          jobTitle,
          jobDescription,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze resume")
      }

      const analysisResult = await response.json()
      setAnalysis(analysisResult)
    } catch (error) {
      console.error("Analysis failed:", error)
      setError("Failed to analyze resume. Please check your inputs and try again.")
      setAnalysis(null)
    }

    setIsAnalyzing(false)
  }

  return (
    <div className="space-y-8">
      {/* Main Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resume Upload */}
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Upload Your Resume
            </CardTitle>
            <CardDescription>Upload your resume in PDF format for AI-powered analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                isDragOver
                  ? "border-primary bg-primary/5 scale-105"
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FileText
                className={`w-12 h-12 mx-auto mb-4 transition-colors ${
                  isDragOver ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium">
                  {isDragOver ? "Drop your resume here!" : "Drop your resume here or click to browse"}
                </p>
                <p className="text-xs text-muted-foreground">PDF files only, max 10MB</p>
              </div>
              
              {/* Custom File Input Button */}
              <div className="relative inline-block">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="resume-upload"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="relative bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
                  asChild
                >
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadedFile ? `Change File (${uploadedFile.name})` : "Choose File"}
                  </label>
                </Button>
              </div>
            </div>

            {uploadedFile && (
              <Alert className={isExtractingPDF ? "border-blue-200 bg-blue-50" : "border-green-200 bg-green-50"}>
                {isExtractingPDF ? (
                  <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                <AlertDescription className={isExtractingPDF ? "text-blue-800" : "text-green-800"}>
                  {isExtractingPDF ? (
                    <>
                      <strong>Extracting text from PDF:</strong> {uploadedFile.name}
                      <br />
                      <span className="text-xs">Please wait while we extract the text from your resume...</span>
                    </>
                  ) : (
                    <>
                      <strong>Successfully uploaded:</strong> {uploadedFile.name}
                      <br />
                      <span className="text-xs">File size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                    </>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {resumeText && (
              <div className="space-y-2">
                <Label htmlFor="resumePreview" className="text-sm font-medium">
                  Resume Content Preview
                </Label>
                <Textarea
                  id="resumePreview"
                  value={resumeText}
                  onChange={(e) => {
                    setResumeText(e.target.value)
                    if (error) setError(null)
                  }}
                  rows={8}
                  className="font-mono text-xs"
                  placeholder="Your resume content will appear here..."
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Job Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Job Details
            </CardTitle>
            <CardDescription>Enter the job title and description you're targeting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => {
                  setJobTitle(e.target.value)
                  if (error) setError(null)
                }}
                placeholder="e.g., Senior Frontend Developer"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => {
                  setJobDescription(e.target.value)
                  if (error) setError(null)
                }}
                rows={12}
                placeholder="Paste the complete job description here..."
                className="text-sm"
              />
            </div>

            {/* Error Alert */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Error:</strong> {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={analyzeResume}
              disabled={!resumeText || !jobTitle || !jobDescription || isAnalyzing || isExtractingPDF}
              className="w-full h-12 text-base"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing with AI...
                </>
              ) : isExtractingPDF ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Extracting PDF Text...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  Analyze Resume with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-8">
          {/* Overall Score Header */}
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">AI Analysis Complete</h2>
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-primary">{analysis.overall_score}/100</div>
                  <p className="text-lg font-medium">Overall Resume Score</p>
                  <Progress value={analysis.overall_score} className="h-4 max-w-md mx-auto" />
                  <Badge
                    variant={
                      analysis.overall_score >= 80 ? "default" : analysis.overall_score >= 60 ? "secondary" : "destructive"
                    }
                    className="text-base px-4 py-2"
                  >
                    {analysis.overall_score >= 80
                      ? "Excellent Resume"
                      : analysis.overall_score >= 60
                      ? "Good Resume"
                      : "Needs Improvement"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Scores Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(analysis.category_scores).map(([category, score]) => (
              <Card key={category} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm capitalize">
                      {category.replace(/_/g, ' ')}
                    </h3>
                    <div className="text-2xl font-bold text-primary">{score}/10</div>
                    <Progress value={score * 10} className="h-2" />
                    <Badge variant={score >= 8 ? "default" : score >= 6 ? "secondary" : "destructive"} className="text-xs">
                      {score >= 8 ? "Excellent" : score >= 6 ? "Good" : "Needs Work"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Strengths */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-green-700 dark:text-green-300">
                      Strengths ({analysis.strengths.length})
                    </CardTitle>
                    <CardDescription>What's working well in your resume</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">{strength}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weaknesses */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-red-700 dark:text-red-300">
                      Areas to Improve ({analysis.weaknesses.length})
                    </CardTitle>
                    <CardDescription>Critical areas that need attention</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">{weakness}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl text-blue-700 dark:text-blue-300">
                    Actionable Recommendations ({analysis.recommendations.length})
                  </CardTitle>
                  <CardDescription>Specific steps to improve your resume</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ATS Keywords and Adverbs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ATS Keywords */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-purple-700 dark:text-purple-300">
                      Missing ATS Keywords
                    </CardTitle>
                    <CardDescription>Keywords to add for better ATS optimization</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.ats_keywords_to_add.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Adverbs Section */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-orange-700 dark:text-orange-300">
                      Power Adverbs
                    </CardTitle>
                    <CardDescription>Strengthen your impact with powerful adverbs</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-green-700 dark:text-green-300 mb-2">Currently Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.adverbs.used_in_resume.map((adverb, index) => (
                      <Badge key={index} variant="default" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                        {adverb}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-orange-700 dark:text-orange-300 mb-2">Suggested to Add:</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.adverbs.suggested_to_add.map((adverb, index) => (
                      <Badge key={index} variant="outline" className="bg-orange-50 dark:bg-orange-900/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                        {adverb}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rewritten Examples */}
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <CardTitle className="text-xl text-indigo-700 dark:text-indigo-300">
                    Before & After Examples
                  </CardTitle>
                  <CardDescription>See how your bullet points can be improved</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analysis.rewritten_examples.map((example, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 bg-muted/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Original
                        </h4>
                        <p className="text-sm p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded">
                          {example.original}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Improved
                        </h4>
                        <p className="text-sm p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded">
                          {example.improved}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

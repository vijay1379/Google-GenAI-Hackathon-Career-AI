"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Upload, Download, Zap, CheckCircle, RefreshCw, Sparkles, HelpCircle, Share } from "lucide-react"

interface MCQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "Easy" | "Medium" | "Hard"
  topic: string
}

interface PPTContent {
  title: string
  slides: string[]
  extractedText: string
}

export function PPTConverter() {
  const [activeTab, setActiveTab] = useState("upload")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [pptContent, setPptContent] = useState<PPTContent | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [mcqCount, setMcqCount] = useState("10")
  const [difficulty, setDifficulty] = useState("Medium")
  const [questions, setQuestions] = useState<MCQuestion[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && (file.type.includes("presentation") || file.name.endsWith(".pptx") || file.name.endsWith(".ppt"))) {
      setUploadedFile(file)
    }
  }, [])

  const processPPT = async () => {
    if (!uploadedFile) return

    setIsProcessing(true)
    // Simulate PPT processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setPptContent({
      title: "Introduction to React Hooks",
      slides: [
        "Slide 1: Introduction to React Hooks",
        "Slide 2: What are Hooks?",
        "Slide 3: useState Hook",
        "Slide 4: useEffect Hook",
        "Slide 5: Custom Hooks",
        "Slide 6: Best Practices",
        "Slide 7: Common Pitfalls",
        "Slide 8: Conclusion",
      ],
      extractedText: `Introduction to React Hooks

React Hooks are functions that let you use state and other React features without writing a class component. They were introduced in React 16.8 and have revolutionized how we write React applications.

What are Hooks?
Hooks are JavaScript functions that:
- Start with the word "use"
- Can only be called at the top level of React functions
- Allow you to reuse stateful logic between components

useState Hook
The useState hook allows you to add state to functional components:
- Returns an array with current state value and setter function
- Can be initialized with any value type
- Triggers re-render when state changes

useEffect Hook
The useEffect hook lets you perform side effects in functional components:
- Runs after every render by default
- Can be controlled with dependency array
- Supports cleanup functions
- Replaces componentDidMount, componentDidUpdate, and componentWillUnmount

Custom Hooks
Custom hooks allow you to extract component logic into reusable functions:
- Must start with "use"
- Can call other hooks
- Enable sharing stateful logic between components

Best Practices
- Always use hooks at the top level
- Use multiple state variables for unrelated data
- Optimize with useMemo and useCallback when needed
- Create custom hooks for reusable logic

Common Pitfalls
- Calling hooks conditionally
- Missing dependencies in useEffect
- Infinite re-render loops
- Not cleaning up subscriptions`,
    })

    setIsProcessing(false)
    setActiveTab("content")
  }

  const generateMCQs = async () => {
    if (!pptContent) return

    setIsGenerating(true)
    // Simulate AI MCQ generation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const generatedQuestions: MCQuestion[] = [
      {
        id: 1,
        question: "When were React Hooks introduced?",
        options: ["React 16.6", "React 16.8", "React 17.0", "React 18.0"],
        correctAnswer: 1,
        explanation:
          "React Hooks were introduced in React 16.8, marking a significant change in how React components are written.",
        difficulty: "Easy",
        topic: "React Basics",
      },
      {
        id: 2,
        question: "What is the primary purpose of the useState hook?",
        options: [
          "To perform side effects",
          "To add state to functional components",
          "To optimize performance",
          "To handle routing",
        ],
        correctAnswer: 1,
        explanation:
          "The useState hook allows you to add state to functional components, returning the current state value and a setter function.",
        difficulty: "Easy",
        topic: "useState",
      },
      {
        id: 3,
        question: "Which of the following is a rule for using hooks?",
        options: [
          "Hooks can be called conditionally",
          "Hooks must start with 'use'",
          "Hooks can only be used in class components",
          "Hooks don't need dependency arrays",
        ],
        correctAnswer: 1,
        explanation: "Hooks must start with the word 'use' and can only be called at the top level of React functions.",
        difficulty: "Medium",
        topic: "Hook Rules",
      },
      {
        id: 4,
        question: "What does the useEffect hook replace from class components?",
        options: [
          "constructor only",
          "render method",
          "componentDidMount, componentDidUpdate, and componentWillUnmount",
          "setState method",
        ],
        correctAnswer: 2,
        explanation:
          "useEffect combines the functionality of componentDidMount, componentDidUpdate, and componentWillUnmount lifecycle methods.",
        difficulty: "Medium",
        topic: "useEffect",
      },
      {
        id: 5,
        question: "What is a common pitfall when using useEffect?",
        options: [
          "Using it in functional components",
          "Missing dependencies in the dependency array",
          "Calling it at the top level",
          "Using it for side effects",
        ],
        correctAnswer: 1,
        explanation: "Missing dependencies in the useEffect dependency array can lead to bugs and unexpected behavior.",
        difficulty: "Hard",
        topic: "useEffect",
      },
    ]

    setQuestions(generatedQuestions.slice(0, Number.parseInt(mcqCount)))
    setSelectedQuestions(generatedQuestions.slice(0, Number.parseInt(mcqCount)).map((q) => q.id))
    setIsGenerating(false)
    setActiveTab("questions")
  }

  const toggleQuestionSelection = (questionId: number) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId],
    )
  }

  const exportQuestions = () => {
    const selectedQs = questions.filter((q) => selectedQuestions.includes(q.id))
    const exportData = {
      title: pptContent?.title || "Generated MCQs",
      questions: selectedQs,
      generatedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "mcq-questions.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            PPT to MCQ Converter
          </CardTitle>
          <CardDescription>
            Upload your PowerPoint presentations and automatically generate multiple-choice questions for study and
            assessment
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload PPT</TabsTrigger>
          <TabsTrigger value="content" disabled={!pptContent}>
            Extracted Content
          </TabsTrigger>
          <TabsTrigger value="questions" disabled={questions.length === 0}>
            Generated MCQs
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Upload Presentation
                </CardTitle>
                <CardDescription>Upload your PowerPoint file (.ppt or .pptx)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Drop your presentation here or click to browse</p>
                    <p className="text-xs text-muted-foreground">PPT, PPTX files only, max 10MB</p>
                  </div>
                  <Input type="file" accept=".ppt,.pptx" onChange={handleFileUpload} className="mt-4 cursor-pointer" />
                </div>

                {uploadedFile && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>Successfully uploaded: {uploadedFile.name}</AlertDescription>
                  </Alert>
                )}

                <Button onClick={processPPT} disabled={!uploadedFile || isProcessing} className="w-full">
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Processing Presentation...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Extract Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* MCQ Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  MCQ Settings
                </CardTitle>
                <CardDescription>Configure how you want your questions generated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mcqCount">Number of Questions</Label>
                  <Select value={mcqCount} onValueChange={setMcqCount}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Questions</SelectItem>
                      <SelectItem value="10">10 Questions</SelectItem>
                      <SelectItem value="15">15 Questions</SelectItem>
                      <SelectItem value="20">20 Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                      <SelectItem value="Mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={generateMCQs}
                  disabled={!pptContent || isGenerating}
                  className="w-full bg-transparent"
                  variant="outline"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating MCQs...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate MCQs
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          {pptContent && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Slide Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Slide Overview</CardTitle>
                  <CardDescription>{pptContent.slides.length} slides detected</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pptContent.slides.map((slide, index) => (
                      <li key={index} className="text-sm p-2 rounded bg-muted/50">
                        {slide}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Extracted Text */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Extracted Text Content</CardTitle>
                  <CardDescription>Text content extracted from your presentation</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={pptContent.extractedText}
                    readOnly
                    rows={15}
                    className="font-mono text-xs resize-none"
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-6">
          {questions.length > 0 && (
            <>
              {/* Header Actions */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Generated MCQs</CardTitle>
                      <CardDescription>
                        {questions.length} questions generated • {selectedQuestions.length} selected
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={exportQuestions}
                        disabled={selectedQuestions.length === 0}
                        className="bg-transparent"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Selected
                      </Button>
                      <Button variant="outline" className="bg-transparent">
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Questions List */}
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <Card
                    key={question.id}
                    className={selectedQuestions.includes(question.id) ? "ring-2 ring-primary" : ""}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={selectedQuestions.includes(question.id)}
                            onCheckedChange={() => toggleQuestionSelection(question.id)}
                          />
                          <div className="space-y-2">
                            <CardTitle className="text-base">
                              Question {index + 1}: {question.question}
                            </CardTitle>
                            <div className="flex gap-2">
                              <Badge
                                variant={
                                  question.difficulty === "Easy"
                                    ? "secondary"
                                    : question.difficulty === "Medium"
                                      ? "default"
                                      : "destructive"
                                }
                              >
                                {question.difficulty}
                              </Badge>
                              <Badge variant="outline">{question.topic}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border ${
                              optionIndex === question.correctAnswer
                                ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                                : "bg-muted/50"
                            }`}
                          >
                            <span className="font-medium mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                            {option}
                            {optionIndex === question.correctAnswer && (
                              <CheckCircle className="w-4 h-4 text-green-600 inline ml-2" />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

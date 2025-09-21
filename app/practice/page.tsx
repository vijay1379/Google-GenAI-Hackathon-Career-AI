"use client"

import type React from "react"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { useRequireProfile } from "@/hooks/use-auth-guards"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Brain,
  Upload,
  FileText,
  Video,
  HelpCircle,
  BookOpen,
  CheckCircle,
  XCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface MCQOption {
  id: string
  text: string
  isCorrect: boolean
  explanation: string
}

interface MCQQuestion {
  id: string
  question: string
  options: MCQOption[]
}

export default function PracticePage() {
  useRequireProfile()
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [generationType, setGenerationType] = useState("")
  const [description, setDescription] = useState("")
  const [showMCQDialog, setShowMCQDialog] = useState(false)
  const [currentTopic, setCurrentTopic] = useState("")
  const [mcqQuestions, setMcqQuestions] = useState<MCQQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [showCurrentAnswer, setShowCurrentAnswer] = useState(false)
  const [questionResults, setQuestionResults] = useState<Record<number, { answer: string; correct: boolean }>>({})
  const [isGenerating, setIsGenerating] = useState(false)

  const skillTopics = [
    {
      topic: "React Hooks",
      completed: true,
      difficulty: "Intermediate",
      questions: 15,
    },
    {
      topic: "JavaScript ES6+",
      completed: true,
      difficulty: "Beginner",
      questions: 20,
    },
    {
      topic: "Node.js Basics",
      completed: false,
      difficulty: "Intermediate",
      questions: 12,
    },
    {
      topic: "MongoDB Queries",
      completed: false,
      difficulty: "Advanced",
      questions: 8,
    },
  ]

  const sampleMCQData: Record<string, MCQQuestion[]> = {
    "React Hooks": [
      {
        id: "rh1",
        question: "Which hook is used to manage state in functional components?",
        options: [
          {
            id: "a",
            text: "useEffect",
            isCorrect: false,
            explanation: "useEffect is used for side effects, not state management.",
          },
          {
            id: "b",
            text: "useState",
            isCorrect: true,
            explanation: "useState is the correct hook for managing state in functional components.",
          },
          {
            id: "c",
            text: "useContext",
            isCorrect: false,
            explanation: "useContext is used for consuming context values.",
          },
          {
            id: "d",
            text: "useReducer",
            isCorrect: false,
            explanation: "useReducer is an alternative to useState for complex state logic.",
          },
        ],
      },
      {
        id: "rh2",
        question: "When does useEffect run by default?",
        options: [
          {
            id: "a",
            text: "Only on mount",
            isCorrect: false,
            explanation: "This would require an empty dependency array.",
          },
          {
            id: "b",
            text: "After every render",
            isCorrect: true,
            explanation: "Without a dependency array, useEffect runs after every render.",
          },
          {
            id: "c",
            text: "Only on unmount",
            isCorrect: false,
            explanation: "This would require a cleanup function only.",
          },
          { id: "d", text: "Never", isCorrect: false, explanation: "useEffect always runs unless prevented." },
        ],
      },
    ],
    "JavaScript ES6+": [
      {
        id: "js1",
        question: "What is the difference between let and const?",
        options: [
          {
            id: "a",
            text: "No difference",
            isCorrect: false,
            explanation: "There are significant differences between let and const.",
          },
          {
            id: "b",
            text: "const cannot be reassigned",
            isCorrect: true,
            explanation: "const creates a binding that cannot be reassigned, while let can be.",
          },
          {
            id: "c",
            text: "let is block-scoped, const is function-scoped",
            isCorrect: false,
            explanation: "Both let and const are block-scoped.",
          },
          { id: "d", text: "const is faster", isCorrect: false, explanation: "Performance difference is negligible." },
        ],
      },
      {
        id: "js2",
        question: "What does the spread operator (...) do?",
        options: [
          {
            id: "a",
            text: "Creates a new array",
            isCorrect: false,
            explanation: "It can be used to create arrays but that's not its primary purpose.",
          },
          {
            id: "b",
            text: "Expands iterables into individual elements",
            isCorrect: true,
            explanation: "The spread operator expands arrays, objects, or other iterables.",
          },
          {
            id: "c",
            text: "Concatenates strings",
            isCorrect: false,
            explanation: "String concatenation uses + or template literals.",
          },
          {
            id: "d",
            text: "Declares variables",
            isCorrect: false,
            explanation: "Variables are declared with let, const, or var.",
          },
        ],
      },
    ],
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      console.log(`File uploaded: ${file.name}`)
    }
  }

  const handleGenerateMCQ = async (topic: string) => {
    setCurrentTopic(topic)
    setIsGenerating(true)
    setShowMCQDialog(true)
    setCurrentQuestionIndex(0)
    setCurrentAnswer("")
    setShowCurrentAnswer(false)
    setQuestionResults({})

    setTimeout(() => {
      const questions = sampleMCQData[topic] || []
      setMcqQuestions(questions)
      setIsGenerating(false)
    }, 1500)
  }

  const handleAnswerSelect = (optionId: string) => {
    if (showCurrentAnswer) return
    setCurrentAnswer(optionId)
  }

  const handleCheckCurrentAnswer = () => {
    if (!currentAnswer) return

    const currentQuestion = mcqQuestions[currentQuestionIndex]
    const correctOption = currentQuestion.options.find((opt) => opt.isCorrect)
    const isCorrect = currentAnswer === correctOption?.id

    setQuestionResults((prev) => ({
      ...prev,
      [currentQuestionIndex]: { answer: currentAnswer, correct: isCorrect },
    }))
    setShowCurrentAnswer(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mcqQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      
      // Restore the answer state for the next question if it was already answered
      const nextQuestionResult = questionResults[nextIndex]
      if (nextQuestionResult) {
        setCurrentAnswer(nextQuestionResult.answer)
        setShowCurrentAnswer(true)
      } else {
        setCurrentAnswer("")
        setShowCurrentAnswer(false)
      }
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1
      setCurrentQuestionIndex(prevIndex)
      
      // Restore the answer state for the previous question if it was already answered
      const prevQuestionResult = questionResults[prevIndex]
      if (prevQuestionResult) {
        setCurrentAnswer(prevQuestionResult.answer)
        setShowCurrentAnswer(true)
      } else {
        setCurrentAnswer("")
        setShowCurrentAnswer(false)
      }
    }
  }

  const handleCloseMCQDialog = () => {
    setShowMCQDialog(false)
    setMcqQuestions([])
    setCurrentQuestionIndex(0)
    setCurrentAnswer("")
    setShowCurrentAnswer(false)
    setQuestionResults({})
    setCurrentTopic("")
  }

  const calculateOverallScore = () => {
    const completedQuestions = Object.keys(questionResults).length
    if (completedQuestions === 0) return 0
    const correctAnswers = Object.values(questionResults).filter((result) => result.correct).length
    return Math.round((correctAnswers / completedQuestions) * 100)
  }

  const handleGenerateFromFile = () => {
    if (!selectedFile || !generationType) return
    console.log(`  Generating ${generationType} from file: ${selectedFile.name}`)
    // Here you would integrate with Gemini API
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Practice Hub</h1>
          <p className="text-muted-foreground">Practice with MCQ questions and generate content from your materials</p>
        </div>

        <Tabs defaultValue="skill-roadmap" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="skill-roadmap">Skill Roadmap</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
          </TabsList>

          <TabsContent value="skill-roadmap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Practice Based on Your Learning Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Practice MCQ questions based on topics you've completed in your learning paths
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skillTopics.map((topic, index) => (
                    <Card key={index} className={`${!topic.completed ? "opacity-60" : ""}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{topic.topic}</CardTitle>
                          <Badge variant={topic.completed ? "default" : "secondary"}>
                            {topic.completed ? "Available" : "Locked"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{topic.difficulty}</span>
                            <span>{topic.questions} questions</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleGenerateMCQ(topic.topic)}
                          disabled={!topic.completed}
                          className="w-full"
                        >
                          {topic.completed ? "Generate MCQ" : "Complete Learning First"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Upload Your Materials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Upload PDF or PPTX</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.pptx,.ppt"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  {selectedFile && <p className="text-sm text-muted-foreground">Selected: {selectedFile.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="generation-type">What would you like to generate?</Label>
                  <Select value={generationType} onValueChange={setGenerationType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose generation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4" />
                          MCQ Questions
                        </div>
                      </SelectItem>
                      <SelectItem value="important-topics">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Important Topics
                        </div>
                      </SelectItem>
                      <SelectItem value="related-videos">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          Topic Related Videos
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Additional Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide any specific instructions or focus areas..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button onClick={handleGenerateFromFile} disabled={!selectedFile || !generationType} className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Content
                </Button>
              </CardContent>
            </Card>

            <Card className="opacity-60">
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Upload a file and select generation type to see results here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {showMCQDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">MCQ Practice: {currentTopic}</h2>
                  <Badge variant="outline" className="ml-4">
                    Question {currentQuestionIndex + 1} of {mcqQuestions.length}
                  </Badge>
                  {Object.keys(questionResults).length > 0 && (
                    <Badge variant="outline" className="ml-2">
                      Score: {calculateOverallScore()}%
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={handleCloseMCQDialog} className="h-8 w-8 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 min-h-0">
                {isGenerating ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-muted-foreground">Generating MCQ questions...</p>
                    </div>
                  </div>
                ) : mcqQuestions.length > 0 ? (
                  <>
                    {(() => {
                      const question = mcqQuestions[currentQuestionIndex]
                      return (
                        <Card className="border-l-4 border-l-primary">
                          <CardHeader>
                            <CardTitle className="text-lg">
                              {currentQuestionIndex + 1}. {question.question}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {question.options.map((option) => {
                              const isSelected = currentAnswer === option.id
                              const isCorrect = option.isCorrect
                              const showCorrect = showCurrentAnswer && isCorrect
                              const showIncorrect = showCurrentAnswer && isSelected && !isCorrect

                              return (
                                <div key={option.id} className="space-y-2">
                                  <Button
                                    variant={
                                      showCorrect || showIncorrect
                                        ? "outline"
                                        : isSelected
                                          ? "secondary"
                                          : "outline"
                                    }
                                    className={`w-full justify-start text-left h-auto p-4 border-2 ${
                                      showCorrect
                                        ? "!border-green-500 border-solid"
                                        : showIncorrect
                                          ? "!border-red-500 border-solid"
                                          : "border-border"
                                    } disabled:opacity-100`}
                                    onClick={() => handleAnswerSelect(option.id)}
                                    disabled={showCurrentAnswer}
                                  >
                                    <div className="flex items-center gap-3 w-full">
                                      <span className="font-medium">{option.id.toUpperCase()}.</span>
                                      <span className="flex-1">{option.text}</span>
                                      {showCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                                      {showIncorrect && <XCircle className="w-5 h-5 text-red-600" />}
                                    </div>
                                  </Button>

                                  {showCurrentAnswer && isCorrect && (
                                    <div className="text-sm p-3 rounded-md bg-green-50 text-green-700">
                                      <strong>Explanation:</strong> {option.explanation}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </CardContent>
                        </Card>
                      )
                    })()}
                  </>
                ) : null}
              </div>

              {/* Footer */}
              <div className="border-t p-6 flex-shrink-0">
                {!isGenerating && mcqQuestions.length > 0 && (
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleNextQuestion}
                        disabled={currentQuestionIndex === mcqQuestions.length - 1}
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>

                    <div className="flex gap-3">
                      {!showCurrentAnswer ? (
                        <Button onClick={handleCheckCurrentAnswer} disabled={!currentAnswer}>
                          Check Answer
                        </Button>
                      ) : (
                        currentQuestionIndex === mcqQuestions.length - 1 ? (
                          <Button onClick={handleCloseMCQDialog}>Close</Button>
                        ) : (
                          <Button onClick={handleNextQuestion}>
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

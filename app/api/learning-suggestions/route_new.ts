import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { aiService, profileService, skillsService, interestsService } from "@/lib/database/services"

// Helper function to save learning paths to database
async function saveLearningPathsToDatabase(supabase: any, userId: string, learningPaths: any[]) {
  try {
    // Check for existing learning resources to avoid duplicates
    const { data: existingResources } = await supabase
      .from("learning_resources")
      .select("title")
      .eq("user_id", userId)

    const existingTitles = new Set(existingResources?.map((r: any) => r.title) || [])

    // Filter out duplicates
    const newLearningPaths = learningPaths.filter((path: any) => !existingTitles.has(path.title))

    if (newLearningPaths.length === 0) {
      console.log("No new learning paths to save (all already exist)")
      return { saved: 0, skipped: learningPaths.length }
    }

    const learningResourcesData = newLearningPaths.map((path: any) => ({
      user_id: userId,
      title: path.title,
      description: path.description,
      resource_type: 'course',
      url: path.url || null,
      skill_category: path.category,
      difficulty_level: path.difficulty?.toLowerCase() || 'beginner',
      estimated_duration: path.duration,
      status: 'saved',
      progress_percentage: 0,
    }))

    const { data: savedResources, error: saveError } = await supabase
      .from("learning_resources")
      .insert(learningResourcesData)
      .select()

    if (saveError) {
      console.error("Error saving learning resources:", saveError)
      return { saved: 0, error: saveError.message }
    }

    console.log(`Saved ${savedResources?.length || 0} new learning resources to database`)
    return { 
      saved: savedResources?.length || 0, 
      skipped: learningPaths.length - newLearningPaths.length 
    }
  } catch (error) {
    console.error("Error saving learning resources to database:", error)
    return { saved: 0, error: error }
  }
}

// Mock data generator for fallback
async function generateMockLearningPaths(skills: string[], interests: string[], careerGoal: string) {
  const allMockPaths = [
    {
      title: "JavaScript Fundamentals",
      description: "Master the basics of JavaScript programming for web development",
      category: "Programming",
      difficulty: "Beginner",
      duration: "4-6 weeks",
      provider: "FreeCodeCamp",
      url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
      skills: ["JavaScript", "Programming", "Web Development"],
      rating: 4.8,
      enrolled: 15420,
      isRecommended: true,
      match: 85,
      modules: [
        "Variables and Data Types",
        "Functions and Scope",
        "DOM Manipulation",
        "ES6+ Features",
        "Async Programming",
        "Practice Projects"
      ]
    },
    {
      title: "React Development Mastery",
      description: "Build modern, scalable web applications with React ecosystem",
      category: "Frontend Framework",
      difficulty: "Intermediate",
      duration: "6-8 weeks",
      provider: "React.dev",
      url: "https://react.dev/learn",
      skills: ["React", "JavaScript", "Frontend", "Component Design"],
      rating: 4.9,
      enrolled: 8940,
      isRecommended: true,
      match: 92,
      modules: [
        "React Fundamentals",
        "Hooks and State Management",
        "Component Patterns",
        "Routing with React Router",
        "State Management (Redux/Zustand)",
        "Testing and Deployment"
      ]
    },
    {
      title: "Data Structures & Algorithms",
      description: "Essential problem-solving skills for coding interviews and system design",
      category: "Computer Science",
      difficulty: "Intermediate",
      duration: "8-12 weeks",
      provider: "LeetCode + GeeksforGeeks",
      url: "https://leetcode.com/study-plan/",
      skills: ["Problem Solving", "Algorithms", "Data Structures", "Interview Prep"],
      rating: 4.7,
      enrolled: 12350,
      isRecommended: true,
      match: 78,
      modules: [
        "Arrays and Strings",
        "Linked Lists and Stacks",
        "Trees and Graphs",
        "Dynamic Programming",
        "System Design Basics",
        "Mock Interviews"
      ]
    },
    {
      title: "Python for Data Science",
      description: "Learn Python programming focused on data analysis and machine learning",
      category: "Data Science",
      difficulty: "Beginner",
      duration: "6-10 weeks",
      provider: "Coursera",
      url: "https://www.coursera.org/specializations/python",
      skills: ["Python", "Data Analysis", "Pandas", "NumPy", "Machine Learning"],
      rating: 4.6,
      enrolled: 18750,
      isRecommended: true,
      match: 88,
      modules: [
        "Python Basics",
        "Data Manipulation with Pandas",
        "Data Visualization",
        "Statistics for Data Science",
        "Intro to Machine Learning",
        "Capstone Project"
      ]
    },
    {
      title: "Full Stack Web Development",
      description: "Complete web development course covering frontend and backend technologies",
      category: "Web Development",
      difficulty: "Intermediate",
      duration: "12-16 weeks",
      provider: "The Odin Project",
      url: "https://www.theodinproject.com/paths/full-stack-javascript",
      skills: ["HTML", "CSS", "JavaScript", "Node.js", "Database", "Express"],
      rating: 4.8,
      enrolled: 9240,
      isRecommended: true,
      match: 90,
      modules: [
        "Frontend Foundations",
        "JavaScript Deep Dive",
        "Backend with Node.js",
        "Database Management",
        "API Development",
        "Full Stack Project"
      ]
    },
    {
      title: "Mobile App Development with React Native",
      description: "Build cross-platform mobile applications using React Native",
      category: "Mobile Development",
      difficulty: "Intermediate",
      duration: "8-10 weeks",
      provider: "Expo + React Native",
      url: "https://reactnative.dev/docs/getting-started",
      skills: ["React Native", "Mobile Development", "JavaScript", "iOS", "Android"],
      rating: 4.5,
      enrolled: 6830,
      isRecommended: true,
      match: 82,
      modules: [
        "React Native Fundamentals",
        "Navigation & State Management",
        "Native Device Features",
        "Performance Optimization",
        "App Store Deployment",
        "Advanced Patterns"
      ]
    }
  ]

  // Smart filtering based on user's actual skills and interests
  const filteredPaths = allMockPaths.filter(path => {
    const skillMatch = path.skills.some(skill => 
      skills.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase()))
    )
    const interestMatch = path.skills.some(skill => 
      interests.some(interest => interest.toLowerCase().includes(skill.toLowerCase()))
    )
    const categoryMatch = interests.some(interest => 
      path.category.toLowerCase().includes(interest.toLowerCase())
    )
    const careerMatch = path.description.toLowerCase().includes(careerGoal.toLowerCase()) ||
                       path.category.toLowerCase().includes(careerGoal.toLowerCase())

    return skillMatch || interestMatch || categoryMatch || careerMatch
  })

  // If no matches found, return basic programming courses
  if (filteredPaths.length === 0) {
    return allMockPaths.slice(0, 3)
  }

  // Calculate match scores based on user data
  const pathsWithScores = filteredPaths.map(path => {
    let matchScore = 0
    
    // Score based on skill overlap
    const skillOverlap = path.skills.filter(skill => 
      skills.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase()))
    ).length
    matchScore += skillOverlap * 20

    // Score based on interest overlap
    const interestOverlap = path.skills.filter(skill => 
      interests.some(interest => interest.toLowerCase().includes(skill.toLowerCase()))
    ).length
    matchScore += interestOverlap * 15

    // Score based on career goal alignment
    if (path.description.toLowerCase().includes(careerGoal.toLowerCase()) ||
        path.category.toLowerCase().includes(careerGoal.toLowerCase())) {
      matchScore += 25
    }

    return {
      ...path,
      match: Math.min(matchScore + 50, 98) // Ensure score is between 50-98
    }
  })

  // Sort by match score and return top 3-4
  return pathsWithScores
    .sort((a, b) => b.match - a.match)
    .slice(0, 4)
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user data from database
    const profile = await profileService.getProfile(user.id)
    const userSkills = await skillsService.getUserSkills(user.id)
    const userInterests = await interestsService.getUserInterests(user.id)

    // Extract data from database
    const finalSkills = userSkills.map(s => s.skill_name)
    const finalInterests = userInterests.map(i => i.interest_name)
    const finalCareerGoal = profile?.career_goals || "General Development"
    const currentYear = profile?.current_year || "Final Year"
    const college = profile?.college_id || "College Student"

    // If user has no data in database, return empty or basic suggestions
    if (finalSkills.length === 0 && finalInterests.length === 0) {
      const basicMockResponse = await generateMockLearningPaths(
        ["Programming", "Web Development"], 
        ["Technology", "Software Development"], 
        "General Development"
      )
      
      await aiService.saveInteraction(user.id, "learning_suggestions", 
        JSON.stringify({ message: "No user data found, showing basic suggestions" }), 
        JSON.stringify(basicMockResponse), 
        { model: "fallback" }
      )

      // Save basic learning paths to learning_resources table
      const saveResult = await saveLearningPathsToDatabase(supabase, user.id, basicMockResponse)

      return NextResponse.json({ 
        learningPaths: basicMockResponse,
        message: "Complete your profile to get personalized suggestions",
        saved: saveResult
      })
    }

    // Get Gemini API key
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY

    if (!GEMINI_API_KEY) {
      // Return enhanced mock data with more realistic AI-like responses
      const mockResponse = await generateMockLearningPaths(finalSkills, finalInterests, finalCareerGoal)
      
      await aiService.saveInteraction(user.id, "learning_suggestions", 
        JSON.stringify({ finalSkills, finalInterests, finalCareerGoal, currentYear, college }), 
        JSON.stringify(mockResponse), 
        { model: "fallback" }
      )

      // Save mock learning paths to learning_resources table
      const saveResult = await saveLearningPathsToDatabase(supabase, user.id, mockResponse)

      return NextResponse.json({ 
        learningPaths: mockResponse,
        saved: saveResult
      })
    }

    // Real Gemini API implementation with user's database data
    const prompt = `
    As an AI learning advisor for Indian tech students, analyze the following student profile from our database and suggest 3-4 most suitable learning paths:

    Student Profile (from database):
    - Current Skills: ${finalSkills.join(", ")}
    - Interests: ${finalInterests.join(", ")}
    - Career Goal: ${finalCareerGoal}
    - Academic Year: ${currentYear}
    - College: ${college}

    Based on this EXISTING user data, provide personalized learning recommendations that will help them:
    1. Build on their current skills
    2. Explore their stated interests
    3. Achieve their career goals
    4. Advance from their current academic level

    For each learning path, provide:
    1. Course/Path title
    2. Brief description (1-2 sentences)
    3. Category (Programming, Data Science, Web Development, etc.)
    4. Difficulty level (Beginner/Intermediate/Advanced)
    5. Duration estimate
    6. Best provider/platform
    7. Learning URL (if available)
    8. Skills gained (4-5 key skills)
    9. Match percentage (based on current skills/interests)
    10. Course rating (4.0-5.0)
    11. Enrolled students count
    12. 6 key learning modules/topics

    Format the response as a JSON array with this structure:
    {
      "title": "Course Title",
      "description": "Brief description",
      "category": "Category",
      "difficulty": "Difficulty Level",
      "duration": "X weeks/months",
      "skills": ["skill1", "skill2", ...],
      "match": 85,
      "rating": 4.8,
      "enrolled": 12500,
      "modules": ["Module 1", "Module 2", ...] 
    }

    Focus on practical, career-relevant learning paths that build upon the user's existing skills and interests from their profile.
    `

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    )

    const data = await response.json()
    
    if (!response.ok || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Failed to get response from Gemini API")
    }

    const generatedText = data.candidates[0].content.parts[0].text

    // Parse the JSON response from Gemini
    let learningPaths
    try {
      learningPaths = JSON.parse(generatedText.replace(/```json\n?|\n?```/g, ""))
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError)
      // Fallback to mock data if parsing fails
      learningPaths = await generateMockLearningPaths(finalSkills, finalInterests, finalCareerGoal)
    }

    // Save interaction to database
    await aiService.saveInteraction(user.id, "learning_suggestions", 
      JSON.stringify({ finalSkills, finalInterests, finalCareerGoal, currentYear, college }), 
      JSON.stringify(learningPaths), 
      { model: "gemini-pro", response_time: Date.now() }
    )

    // Save each learning path to learning_resources table
    const saveResult = await saveLearningPathsToDatabase(supabase, user.id, learningPaths)

    return NextResponse.json({ 
      learningPaths,
      userProfile: {
        skills: finalSkills,
        interests: finalInterests,
        careerGoal: finalCareerGoal
      },
      saved: saveResult
    })
  } catch (error) {
    console.error("Error generating learning suggestions:", error)

    // Fallback to mock data on error
    try {
      const mockResponse = await generateMockLearningPaths(
        ["Programming"],
        ["Technology"],
        "General Development"
      )

      return NextResponse.json({ 
        learningPaths: mockResponse,
        error: "Using fallback suggestions due to error"
      })
    } catch (fallbackError) {
      console.error("Fallback error:", fallbackError)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const previousSuggestions = await aiService.getUserInteractions(user.id, "learning_suggestions")
    return NextResponse.json({ previousSuggestions })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
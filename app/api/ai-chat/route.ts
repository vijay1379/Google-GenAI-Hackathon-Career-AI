import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { aiService, profileService, skillsService, interestsService } from "@/lib/database/services"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const profile = await profileService.getProfile(user.id)
    const skills = await skillsService.getUserSkills(user.id)
    const interests = await interestsService.getUserInterests(user.id)

    const userContext = profile
      ? {
          currentYear: profile.current_year,
          careerGoals: profile.career_goals,
          skills: skills.map((s) => s.skill_name),
          interests: interests.map((i) => i.interest_name),
        }
      : null

    const conversationHistory = await aiService.getConversationHistory(user.id, 5)

    if (process.env.GOOGLE_GEMINI_API_KEY) {
      try {
        // Build conversation context for Gemini
        const conversationContext = conversationHistory.slice(-4)
          .map((interaction) => `User: ${interaction.prompt}\nAssistant: ${interaction.response}`)
          .join('\n\n')

        const systemPrompt = `You are CareerAI, a helpful career advisor for college students. Provide helpful, personalized career advice. Keep responses under 300 words.

${userContext ? `User Context:
- Current Year: ${userContext.currentYear || 'Unknown'}
- Career Goals: ${userContext.careerGoals || 'Not specified'}
- Skills: ${userContext.skills?.join(', ') || 'None specified'}
- Interests: ${userContext.interests?.join(', ') || 'None specified'}` : ''}

${conversationContext ? `Previous Conversation:\n${conversationContext}\n` : ''}

Current Question: ${message}`

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: systemPrompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 500,
            }
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response."

          await aiService.saveInteraction(user.id, "chat", message, aiResponse, {
            model: "gemini-pro",
            tokens: data.usageMetadata?.totalTokenCount || 0,
            userContext: userContext,
          })

          return NextResponse.json({ 
            response: aiResponse,
            context: userContext,
          })
        }
      } catch (error) {
        console.error("Gemini API error:", error)
      }
    }

    const aiResponse = generateSimpleResponse(message, userContext)

    await aiService.saveInteraction(user.id, "chat", message, aiResponse, {
      model: "fallback",
      userContext: userContext,
    })

    return NextResponse.json({ 
      response: aiResponse,
      context: userContext,
    })

  } catch (error) {
    console.error("Error in AI chat:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const conversationHistory = await aiService.getConversationHistory(user.id, 20)

    return NextResponse.json({ 
      conversations: conversationHistory.map(interaction => ({
        id: interaction.id,
        message: interaction.prompt,
        response: interaction.response,
        timestamp: interaction.created_at,
      }))
    })

  } catch (error) {
    console.error("Error fetching conversation history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateSimpleResponse(message: string, userContext: any): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("interview")) {
    return `Great question about interviews! Here are some key preparation strategies: Practice coding problems, prepare STAR method examples, and research the company thoroughly. ${userContext?.careerGoals ? `Given your interest in ${userContext.careerGoals}, focus on relevant examples.` : ""}`
  }

  if (lowerMessage.includes("skill")) {
    return `Based on your background, here are some strategic learning recommendations: Cloud Computing, System Design, Testing, and Communication skills. ${userContext?.skills?.length ? `Building on your current skills: ${userContext.skills.join(", ")}.` : ""}`
  }

  return `Thanks for your question! As a ${userContext?.currentYear || "student"}, I'd be happy to help with career guidance. Focus on building strong foundations, creating projects, networking, staying updated with trends, and practicing interviews regularly.`
}
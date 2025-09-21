import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Missing Gemini API key" }, { status: 500 })
    }
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
      method: "POST",
      headers: { "Content-Type": "application/json","X-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })
    const data = await response.json()
    // Gemini returns text in data.candidates[0].content.parts[0].text
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
    return NextResponse.json({ text, raw: data })
  } catch (error) {
    return NextResponse.json({ error: error?.toString() || "Unknown error" }, { status: 500 })
  }
}

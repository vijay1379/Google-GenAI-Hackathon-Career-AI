import { NextRequest, NextResponse } from "next/server"
import pdf from "pdf-parse"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const pdfData = await pdf(buffer)
    const extractedText = pdfData.text.trim()

    if (!extractedText || extractedText.length < 10) {
      throw new Error("No meaningful text extracted (likely scanned PDF)")
    }

    return NextResponse.json({
      text: extractedText,
      success: true,
      metadata: {
        pages: pdfData.numpages,
        textLength: extractedText.length,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to process PDF", details: error?.message },
      { status: 500 }
    )
  }
}

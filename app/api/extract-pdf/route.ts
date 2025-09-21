import { NextRequest, NextResponse } from "next/server"

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

    console.log(`Processing PDF: ${file.name}, size: ${file.size} bytes`)

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    console.log(`Buffer created successfully, size: ${buffer.length} bytes`)
    
    // Validate the buffer starts with PDF signature
    const pdfSignature = buffer.subarray(0, 4).toString()
    if (!pdfSignature.includes('%PDF')) {
      return NextResponse.json({ 
        error: "Invalid PDF file - missing PDF signature" 
      }, { status: 400 })
    }
    console.log('✅ Valid PDF signature detected')

    try {
      // Try to use pdf-parse library which works with buffers directly (no file system needed)
      const pdfParse = require('pdf-parse')
      
      console.log('Using pdf-parse for text extraction...')
      const pdfData = await pdfParse(buffer)
      
      const extractedText = pdfData.text.trim()
      
      console.log('PDF extraction successful!')
      console.log('- Number of pages:', pdfData.numpages)
      console.log('- Total text length:', extractedText.length)
      console.log('- First 100 chars:', extractedText.substring(0, 100))
      
      // Check if we actually got meaningful text
      if (!extractedText || extractedText.length < 10) {
        console.log('Extracted text is too short or empty')
        throw new Error('No meaningful text extracted from PDF - likely a scanned/image PDF')
      }

      return NextResponse.json({ 
        text: extractedText,
        success: true,
        metadata: {
          pages: pdfData.numpages,
          textLength: extractedText.length,
          method: 'pdf-parse'
        }
      })
      
    } catch (pdfError: any) {
      console.error("PDF parsing error details:", pdfError?.message || pdfError)
      console.error("Full error:", pdfError)
      console.log("pdf-parse failed, showing manual input fallback...")
      
      // Fallback: Return a helpful message for manual text input
      const fallbackText = `PDF Upload Detected: ${file.name}
      
Unfortunately, automatic PDF text extraction failed for this file. 
This could be because:
- The PDF contains scanned images instead of text
- The PDF is password protected
- The PDF format is not supported

Please copy and paste your resume content into the text area below for analysis.`

      return NextResponse.json({ 
        text: fallbackText,
        success: true,
        fallback: true,
        message: "PDF uploaded but text extraction failed. Please paste your resume text manually for best results."
      })
    }
    
  } catch (error: any) {
    console.error("PDF extraction error:", error)
    return NextResponse.json(
      { error: "Failed to process PDF", details: error?.message },
      { status: 500 }
    )
  }
}

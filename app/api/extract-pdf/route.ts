import { NextRequest, NextResponse } from "next/server"
import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'

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
      // Use pdf2json for PDF text extraction
      const PDFParser = require("pdf2json")
      console.log('pdf2json module loaded successfully')
      
      // Create a temporary file for pdf2json to process
      const tempDir = path.join(process.cwd(), 'temp')
      const tempFilePath = path.join(tempDir, `temp_${Date.now()}_${file.name}`)
      
      // Ensure temp directory exists
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true })
      }
      
      // Write buffer to temporary file
      fs.writeFileSync(tempFilePath, buffer)
      console.log('Temporary file created:', tempFilePath)
      
      // Parse PDF using pdf2json
      const pdfParser = new PDFParser(null, 1)
      
      // Create promise wrapper for pdf2json parsing
      const parsePDF = () => {
        return new Promise((resolve, reject) => {
          pdfParser.on("pdfParser_dataError", (errData: any) => {
            console.error("PDF parsing error:", errData.parserError)
            reject(new Error(errData.parserError))
          })
          
          pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
            try {
              console.log('PDF data ready, extracting text...')
              
              let fullText = ''
              let pageCount = 0
              
              // Extract text from all pages
              if (pdfData.Pages && Array.isArray(pdfData.Pages)) {
                pageCount = pdfData.Pages.length
                console.log(`Processing ${pageCount} pages...`)
                
                pdfData.Pages.forEach((page: any, pageIndex: number) => {
                  let pageText = ''
                  
                  if (page.Texts && Array.isArray(page.Texts)) {
                    page.Texts.forEach((textItem: any) => {
                      if (textItem.R && Array.isArray(textItem.R)) {
                        textItem.R.forEach((textRun: any) => {
                          if (textRun.T) {
                            // Decode URI component and clean up text
                            const decodedText = decodeURIComponent(textRun.T)
                            pageText += decodedText + ' '
                          }
                        })
                      }
                    })
                  }
                  
                  // Clean up page text
                  pageText = pageText.trim().replace(/\s+/g, ' ')
                  if (pageText.length > 0) {
                    fullText += pageText + '\n'
                    console.log(`Page ${pageIndex + 1} extracted: ${pageText.length} characters`)
                  }
                })
              }
              
              // Clean up the extracted text
              fullText = fullText.trim()
              
              console.log('PDF extraction successful!')
              console.log('- Number of pages:', pageCount)
              console.log('- Total text length:', fullText.length)
              console.log('- First 100 chars:', fullText.substring(0, 100))
              
              resolve({
                text: fullText,
                pages: pageCount,
                success: true
              })
              
            } catch (extractError) {
              console.error('Text extraction error:', extractError)
              reject(extractError)
            }
          })
          
          // Start parsing
          pdfParser.loadPDF(tempFilePath)
        })
      }
      
      // Parse the PDF
      const result = await parsePDF() as any
      
      // Clean up temporary file
      try {
        fs.unlinkSync(tempFilePath)
        console.log('Temporary file cleaned up')
      } catch (cleanupError) {
        console.warn('Failed to cleanup temp file:', cleanupError)
      }
      
      // Check if we actually got meaningful text
      if (!result.text || result.text.trim().length < 10) {
        console.log('Extracted text is too short or empty')
        throw new Error('No meaningful text extracted from PDF - likely a scanned/image PDF')
      }
      
      return NextResponse.json({ 
        text: result.text,
        success: true,
        metadata: {
          pages: result.pages,
          textLength: result.text.length,
          method: 'pdf2json'
        }
      })
      
    } catch (pdfError: any) {
      console.error("PDF parsing error details:", pdfError?.message || pdfError)
      console.error("Full error:", pdfError)
      console.log("pdf2json failed, showing manual input fallback...")
      
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
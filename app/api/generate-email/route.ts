import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
export const runtime = 'nodejs';


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    console.log('Received POST request');
    const formData = await request.formData();
    const file = formData.get('resume') as File;
    const companyName = formData.get('companyName') as string;
    const jobTitle = formData.get('jobTitle') as string;

    if (!file || !companyName || !jobTitle) {
      console.error('Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('File and fields received:', file.name);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    console.log('ArrayBuffer created:', arrayBuffer.byteLength, 'bytes');
    const buffer = Buffer.from(arrayBuffer);
    console.log('Buffer created:', buffer.length, 'bytes');

    // Extract text from PDF using pdf-parser
    let resumeText = '';
    try {
      console.log('Requiring pdf-parser...');
      const pdfParser = require('pdf-parser');
      console.log('pdf-parser required. Typeof:', typeof pdfParser);

      // pdf-parser uses a callback API
      resumeText = await new Promise<string>((resolve, reject) => {
        pdfParser.pdf2json(buffer, (error: any, pdf: any) => {
          if (error) {
            console.error('pdf-parser error:', error);
            reject(error);
          } else {
            console.log('pdf-parser result:', pdf);
            // Extract all text from all pages
            let text = '';
            if (pdf && pdf.pages) {
              for (const page of pdf.pages) {
                if (page.texts) {
                  for (const t of page.texts) {
                    if (t && t.text) text += t.text + ' ';
                  }
                }
              }
            }
            resolve(text.trim());
          }
        });
      });
      console.log('Extracted resume text:', resumeText);
    } catch (pdfError) {
      console.error('PDF text extraction error:', pdfError);
      return NextResponse.json(
        { error: 'Failed to extract text from PDF. Please ensure it is a valid PDF file.' },
        { status: 400 }
      );
    }

    if (!resumeText.trim()) {
      console.error('No text extracted from PDF.');
      return NextResponse.json(
        { error: 'No text found in the PDF. Please ensure your resume contains extractable text.' },
        { status: 400 }
      );
    }

    // Generate cold email using Groq
    const prompt = `Based on the following resume content, create a professional cold email for applying to a ${jobTitle} position at ${companyName}. 

Resume Content:
${resumeText}

Please generate:
1. A compelling subject line
2. A professional email body that:
   - Is personalized and specific to the company and role
   - Highlights relevant skills and experiences from the resume
   - Shows genuine interest in the company
   - Includes a clear call to action
   - Is concise but impactful (1-2 paragraphs max)
   - Uses a professional but friendly tone

Format your response as JSON with two fields:
- "subject": the subject line
- "content": the full email body

Make it compelling and authentic, avoiding generic templates.`;

    console.log('Sending prompt to Groq:', prompt);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Consider switching to this known stable model
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response from Groq API');
    }

    console.log('Groq API response:', response);

    // Parse the JSON response
    let emailData;
    try {
      emailData = JSON.parse(response);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', response);

      const subjectMatch = response.match(/"subject":\s*"([^"]+)"/);
      const contentMatch = response.match(/"content":\s*"([^"]*)"/);

      if (subjectMatch && contentMatch) {
        emailData = {
          subject: subjectMatch[1],
          content: contentMatch[1].replace(/\\n/g, '\n'),
        };
      } else {
        throw new Error('Failed to parse Groq response');
      }
    }

    if (!emailData.subject || !emailData.content) {
      throw new Error('Invalid response format from Groq API');
    }

    return NextResponse.json({
      subject: emailData.subject,
      content: emailData.content,
    });
  } catch (error) {
    console.error('API Error:', error);

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'API configuration error. Please check your Groq API key.' },
          { status: 500 }
        );
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}
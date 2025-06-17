# Cold Email Generator

This project is a Next.js application that generates professional cold emails for job applications based on your uploaded resume (PDF), target company, and job title. It uses Groq's Llama 3 model for generating personalized email content.

## Features

- Upload your resume as a PDF file.
- Enter the company name and job title.
- Extracts text from your PDF resume using `pdf-parser`.
- Sends the extracted text and job info to Groq's Llama 3 model to generate a compelling cold email.
- Returns a JSON response with a subject and email body.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/)
- A [Groq API key](https://console.groq.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/cold-email.git
   cd cold-email
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory and add your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Run the development server:**
   ```sh
   npm run dev
   ```

5. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to use the app.

## Usage

1. Upload your resume as a PDF.
2. Enter the company name and job title.
3. Click "Generate Email".
4. The app will extract text from your PDF and generate a cold email using Groq's Llama 3 model.

## Project Structure

- `components/ColdEmailGenerator.tsx` — Main React component for the UI.
- `app/api/generate-email/route.ts` — API route for handling PDF extraction and Groq API calls.
- `next.config.js` — Next.js configuration.

## Notes

- The API route uses `pdf-parser` for PDF text extraction. If you encounter issues with PDF parsing, ensure your PDF is not image-based (scanned).
- The Groq model used is `llama-3.3-70b-versatile`. If this model is deprecated, check [Groq's documentation](https://console.groq.com/docs/deprecations) for the latest supported models and update the code accordingly.

## Troubleshooting

- **PDF parsing errors:** Make sure your PDF is text-based, not a scanned image.
- **Groq API errors:** Ensure your API key is correct and the model is supported.
- **Module not found:** Run `npm install` to ensure all dependencies are installed.

## License

MIT

---

**Made with ❤️ using Next.js, Groq, and Llama 3**
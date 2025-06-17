'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Mail, Copy, CheckCircle, AlertCircle, Loader2, FileText, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedEmail {
  subject: string;
  content: string;
}

export default function ColdEmailGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmail | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        toast.success('PDF file uploaded successfully!');
      } else {
        toast.error('Please upload a PDF file only.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        toast.success('PDF file uploaded successfully!');
      } else {
        toast.error('Please upload a PDF file only.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !companyName.trim() || !jobTitle.trim()) {
      toast.error('Please fill in all fields and upload your resume.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('companyName', companyName.trim());
    formData.append('jobTitle', jobTitle.trim());

    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate email');
      }

      const result = await response.json();
      setGeneratedEmail(result);
      toast.success('Cold email generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  const copyFullEmail = () => {
    if (generatedEmail) {
      const fullEmail = `Subject: ${generatedEmail.subject}\n\n${generatedEmail.content}`;
      navigator.clipboard.writeText(fullEmail);
      toast.success('Full email copied to clipboard!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Cold Email Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your resume and let AI craft the perfect cold email for your job applications. 
            Get personalized, professional emails that stand out.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                Upload & Configure
              </CardTitle>
              <CardDescription>
                Upload your resume and provide job details to generate your cold email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume (PDF)</Label>
                  <label
                    htmlFor="file-upload"
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
                      dragActive
                        ? 'border-blue-500 bg-blue-50'
                        : file
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    tabIndex={0}
                    style={{ display: 'block' }}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      tabIndex={-1}
                    />

                    {file ? (
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-700">
                            {file.name}
                          </p>
                          <p className="text-xs text-green-600">
                            PDF uploaded successfully
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PDF files only, up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="e.g., Google, Microsoft, Apple"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Job Title */}
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    type="text"
                    placeholder="e.g., Software Engineer, Product Manager"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !file || !companyName.trim() || !jobTitle.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Email...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Cold Email
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-green-600" />
                Generated Email
              </CardTitle>
              <CardDescription>
                Your personalized cold email ready to send
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedEmail ? (
                <div className="space-y-6">
                  {/* Subject */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-gray-700">Subject Line</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(generatedEmail.subject, 'Subject')}
                        className="h-8 px-2"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border">
                      <p className="text-sm font-medium text-gray-800">
                        {generatedEmail.subject}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-gray-700">Email Content</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(generatedEmail.content, 'Content')}
                        className="h-8 px-2"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <Textarea
                      value={generatedEmail.content}
                      readOnly
                      className="min-h-[300px] bg-gray-50 border resize-none"
                    />
                  </div>

                  {/* Copy Full Email Button */}
                  <Button
                    onClick={copyFullEmail}
                    className="w-full bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Full Email
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Mail className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Email Generated Yet
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    Upload your resume, fill in the company details, and click generate to see your personalized cold email here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="py-8 border-t">
            <p className="text-gray-600">
              Made with ❤️ by Shaurya Gupta
            </p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <a
                href="https://github.com/CodebyShaurya"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/shaurya--gupta/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
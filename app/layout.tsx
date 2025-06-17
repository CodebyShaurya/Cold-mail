import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cold Email Generator - AI-Powered Resume-Based Cold Emails',
  description: 'Generate personalized cold emails using your resume and AI technology. Upload your PDF resume and get compelling cold emails for your job applications.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="https://icons.veryicon.com/png/o/business/oa-office/mail-227.png" />
      </head>
      <body className={inter.className}>
        {/* Logo at the top center */}
        
        {children}
        <Toaster />
      </body>
    </html>
  );
}
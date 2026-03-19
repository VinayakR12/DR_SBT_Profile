// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageLoader from '@/components/PageLoader'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: 'Dr. Sachin Takmare',
    template: '%s | Dr. Sachin Takmare',
  },
  description:
    'Official academic portfolio of Dr. Sachin Balawant Takmare — Ph.D. (2024), Assistant Professor with 18+ years of UGC-approved teaching, AI/ML researcher, 2 patents, 15 international publications.',
  keywords: [
    'Dr. Sachin Takmare', 'AI Professor', 'Machine Learning', 'Deep Learning',
    'Precision Agriculture', 'CNN', 'Computer Engineering',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <PageLoader />
     
        <Navbar />
        <main style={{ minHeight: '100vh' }}>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
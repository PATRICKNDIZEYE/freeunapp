import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Toaster } from "@/components/ui/sonner"

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'FreeUnApp - Discover Your Perfect Scholarship',
  description: 'Find and apply for scholarships that match your academic goals. Connect with opportunities worldwide.',
  keywords: 'scholarships, education, funding, students, university, college',
  authors: [{ name: 'FreeUnApp Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans bg-gray-50 text-gray-900">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { ScholarshipDetail } from '@/components/scholarships/scholarship-detail'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Badge } from '@/components/ui/badge'

interface ScholarshipPageProps {
  params: {
    id: string
  }
}

export default async function ScholarshipPage({ params }: ScholarshipPageProps) {
  const session = await getServerSession(authOptions)
  
  const scholarship = await prisma.scholarship.findUnique({
    where: { id: params.id },
    include: {
      admin: {
        select: {
          name: true
        }
      },
      _count: {
        select: {
          savedBy: true,
          applications: true
        }
      }
    }
  })

  if (!scholarship) {
    notFound()
  }

  // Check if scholarship is expired and redirect if so
  if (new Date(scholarship.deadline) <= new Date()) {
    notFound() // This will show a 404 page for expired scholarships
  }

  // Increment view count
  await prisma.scholarship.update({
    where: { id: params.id },
    data: {
      views: {
        increment: 1
      }
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
              <a href="/" className="hover:text-blue-600">Home</a>
              <span>/</span>
              <a href="/scholarships" className="hover:text-blue-600">Scholarships</a>
              <span>/</span>
              <span className="text-gray-900">{scholarship.title}</span>
            </nav>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">
                {scholarship.category.replace('_', ' ')}
              </Badge>
              <Badge variant="outline">
                {scholarship.degreeLevel}
              </Badge>
            </div>
          </div>
          
          <ScholarshipDetail 
            scholarship={scholarship} 
            user={session?.user}
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}

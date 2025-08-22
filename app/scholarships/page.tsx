import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { ScholarshipsFilter } from '@/components/scholarships/scholarships-filter'
import { ScholarshipsList } from '@/components/scholarships/scholarships-list'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { GraduationCap, Users, Award, DollarSign } from 'lucide-react'

interface PageProps {
  searchParams: {
    search?: string
    category?: string
    degreeLevel?: string
    amountType?: string
    deadline?: string
  }
}

export default async function ScholarshipsPage({ searchParams }: PageProps) {
  // Fetch real data from database
  const [scholarships, stats] = await Promise.all([
    prisma.scholarship.findMany({
      where: { 
        status: 'ACTIVE'
      },
      include: {
        admin: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            applications: true,
            savedBy: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.$transaction([
      prisma.scholarship.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.application.count(),
      prisma.scholarship.aggregate({
        _sum: {
          awardsAvailable: true
        }
      })
    ])
  ])

  const [totalScholarships, totalStudents, totalApplications, awardsSum] = stats

  // Apply filters
  let filteredScholarships = scholarships

  if (searchParams.search) {
    const searchTerm = searchParams.search.toLowerCase()
    filteredScholarships = filteredScholarships.filter(scholarship =>
      scholarship.title.toLowerCase().includes(searchTerm) ||
      scholarship.description.toLowerCase().includes(searchTerm) ||
      scholarship.category.toLowerCase().includes(searchTerm)
    )
  }

  if (searchParams.category && searchParams.category !== 'all') {
    filteredScholarships = filteredScholarships.filter(scholarship =>
      scholarship.category === searchParams.category
    )
  }

  if (searchParams.degreeLevel && searchParams.degreeLevel !== 'all') {
    filteredScholarships = filteredScholarships.filter(scholarship =>
      scholarship.degreeLevel === searchParams.degreeLevel
    )
  }

  if (searchParams.amountType && searchParams.amountType !== 'all') {
    filteredScholarships = filteredScholarships.filter(scholarship =>
      scholarship.amountType === searchParams.amountType
    )
  }

  if (searchParams.deadline && searchParams.deadline !== 'all') {
    const days = parseInt(searchParams.deadline)
    const deadlineDate = new Date()
    deadlineDate.setDate(deadlineDate.getDate() + days)
    
    filteredScholarships = filteredScholarships.filter(scholarship =>
      scholarship.deadline && new Date(scholarship.deadline) <= deadlineDate
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Scholarship Opportunities
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and apply for scholarships that match your academic goals and field of study
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{totalScholarships}</div>
              <div className="text-sm text-gray-600">Active Scholarships</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">{awardsSum._sum.awardsAvailable || 0}</div>
              <div className="text-sm text-gray-600">Awards Available</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <ScholarshipsFilter />
        </div>

        {/* Results */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredScholarships.length} Scholarship{filteredScholarships.length !== 1 ? 's' : ''} Found
            </h2>
            {Object.keys(searchParams).length > 0 && (
              <div className="text-sm text-gray-500">
                Filtered results
              </div>
            )}
          </div>
        </div>

        {/* Scholarships List */}
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
            <span className="ml-3 text-gray-600">Loading scholarships...</span>
          </div>
        }>
          <ScholarshipsList scholarships={filteredScholarships} />
        </Suspense>
      </div>

      <Footer />
    </div>
  )
}

import { prisma } from '@/lib/prisma'
import { ScholarshipsList } from '@/components/scholarships/scholarships-list'
import { ScholarshipsFilter } from '@/components/scholarships/scholarships-filter'
import { Hero } from '@/components/landing/hero'
import { Footer } from '@/components/layout/footer'
import { Navigation as Navbar  } from '@/components/layout/navigation'

export default async function ScholarshipsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const category = searchParams.category as string
  const degreeLevel = searchParams.degreeLevel as string
  const search = searchParams.search as string

  // Build where clause
  const where: any = {
    status: 'ACTIVE'
  }

  if (category && category !== 'all') {
    where.category = category
  }

  if (degreeLevel && degreeLevel !== 'all') {
    where.degreeLevel = degreeLevel
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ]
  }

  const scholarships = await prisma.scholarship.findMany({
    where,
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
  })

  const stats = await prisma.$transaction([
    prisma.scholarship.count({ where: { status: 'ACTIVE' } }),
    prisma.application.count(),
    prisma.scholarship.aggregate({
      _sum: {
        awardsAvailable: true
      }
    })
  ])

  const [totalScholarships, totalApplications, awardsSum] = stats

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              All Scholarships
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover thousands of scholarship opportunities from around the world
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalScholarships}</div>
                <div className="text-sm text-gray-600">Available Scholarships</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totalApplications}</div>
                <div className="text-sm text-gray-600">Applications Submitted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{awardsSum._sum.awardsAvailable || 0}</div>
                <div className="text-sm text-gray-600">Awards Available</div>
              </div>
            </div>
          </div>

          {/* Filters and List */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <ScholarshipsFilter />
            </div>
            <div className="lg:col-span-3">
              <ScholarshipsList scholarships={scholarships} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

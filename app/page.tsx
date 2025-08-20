import { prisma } from '@/lib/prisma'
import { Hero } from '@/components/landing/hero'
import { Stats } from '@/components/landing/stats'
import { FeaturedScholarships } from '@/components/landing/featured-scholarships'
import { Footer } from '@/components/layout/footer'
import { ScholarshipFilters } from '@/components/landing/scholarship-filters'

export default async function HomePage() {
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
      take: 6,
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

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <ScholarshipFilters />
      <Stats 
        totalScholarships={totalScholarships}
        totalStudents={totalStudents}
        totalApplications={totalApplications}
        totalAwards={awardsSum._sum.awardsAvailable || 0}
      />
      <FeaturedScholarships scholarships={scholarships} />
      <Footer />
    </div>
  )
}
import { prisma } from '@/lib/prisma'
import { Hero } from '@/components/landing/hero'
import { Stats } from '@/components/landing/stats'
import { FeaturedScholarships } from '@/components/landing/featured-scholarships'
import { Footer } from '@/components/layout/footer'
import { ScholarshipFilters } from '@/components/landing/scholarship-filters'
import { MarketingSignup } from '@/components/landing/marketing-signup'
import { OnboardingCard } from '@/components/landing/onboarding-card'
import { Navigation } from '@/components/layout/navigation'

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
      <Navigation />
      <Hero />
      <ScholarshipFilters />
      <Stats 
        totalScholarships={totalScholarships}
        totalStudents={totalStudents}
        totalApplications={totalApplications}
        totalAwards={awardsSum._sum.awardsAvailable || 0}
      />
      <FeaturedScholarships scholarships={scholarships} />
      
      {/* Marketing Signup Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <MarketingSignup />
          </div>
        </div>
      </section>
      
      <Footer />
      
      {/* Onboarding Card */}
      <OnboardingCard />
    </div>
  )
}
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { StudentDashboard } from '@/components/dashboard/student-dashboard'
import { StudentNavigation } from '@/components/layout/student-navigation'

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Find the user
  const user = await prisma.user.findFirst({
    where: { email: session.user.email }
  })

  if (!user) {
    redirect('/auth/signin')
  }

  // Fetch student-specific data
  const [applications, savedScholarships, notifications, recommendedScholarships] = await Promise.all([
    // User's applications
    prisma.application.findMany({
      where: { email: session.user.email! },
      include: {
        scholarship: {
          select: {
            id: true,
            title: true,
            amount: true,
            category: true,
            degreeLevel: true,
            deadline: true,
            status: true
          }
        }
      },
      orderBy: { appliedAt: 'desc' },
      take: 5
    }),

    // Saved scholarships
    prisma.savedScholarship.findMany({
      where: { userId: user.id },
      include: {
        scholarship: {
          select: {
            id: true,
            title: true,
            amount: true,
            category: true,
            degreeLevel: true,
            deadline: true
          }
        }
      },
      take: 5
    }),

    // User notifications
    prisma.notification.findMany({
      where: { userId: user.id, read: false },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),

    // Recommended scholarships based on user profile
    prisma.scholarship.findMany({
      where: {
        status: 'ACTIVE',
        approvalStatus: 'APPROVED',
        deadline: { gt: new Date() },
        ...(user.fieldOfStudy && {
          OR: [
            { category: user.fieldOfStudy as any },
            { title: { contains: user.fieldOfStudy, mode: 'insensitive' } },
            { description: { contains: user.fieldOfStudy, mode: 'insensitive' } }
          ]
        })
      },
      orderBy: { createdAt: 'desc' },
      take: 6
    })
  ])

  // Calculate application stats
  const applicationStats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'APPLIED').length,
    underReview: applications.filter(a => a.status === 'UNDER_REVIEW').length,
    accepted: applications.filter(a => a.status === 'ACCEPTED').length,
    rejected: applications.filter(a => a.status === 'REJECTED').length
  }

  // Calculate profile completion
  const profileFields = [
    user.name,
    user.fieldOfStudy,
    user.degreeLevel,
    user.profileComplete
  ]
  const completedFields = profileFields.filter(field => field).length
  const profileCompletion = Math.round((completedFields / profileFields.length) * 100)

  // Get all applications count for navbar
  const allApplications = await prisma.application.findMany({
    where: { email: session.user.email! }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNavigation 
        notificationCount={notifications.length}
        applicationCount={allApplications.length}
        savedCount={savedScholarships.length}
      />
      <div className="container mx-auto px-4 py-8">
        <StudentDashboard 
          user={user}
          applications={applications}
          savedScholarships={savedScholarships}
          notifications={notifications}
          recommendedScholarships={recommendedScholarships}
          applicationStats={applicationStats}
          profileCompletion={profileCompletion}
        />
      </div>
    </div>
  )
}

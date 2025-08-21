import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { SavedScholarshipsList } from '@/components/dashboard/saved-scholarships-list'
import { StudentNavigation } from '@/components/layout/student-navigation'

export default async function SavedScholarshipsPage() {
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

  // Fetch saved scholarships with full scholarship data
  const savedScholarships = await prisma.savedScholarship.findMany({
    where: { userId: user.id },
    include: {
      scholarship: {
        select: {
          id: true,
          title: true,
          description: true,
          amount: true,
          amountType: true,
          category: true,
          degreeLevel: true,
          deadline: true,
          status: true,
          approvalStatus: true,
          views: true,
          _count: {
            select: {
              applications: true,
              savedBy: true
            }
          }
        }
      }
    },
    orderBy: {
      savedAt: 'desc'
    }
  })

  // Get counts for navigation
  const [applications, notifications] = await Promise.all([
    prisma.application.findMany({
      where: { email: session.user.email! }
    }),
    prisma.notification.findMany({
      where: { userId: user.id, read: false }
    })
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNavigation 
        notificationCount={notifications.length}
        applicationCount={applications.length}
        savedCount={savedScholarships.length}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Scholarships</h1>
          <p className="text-gray-600">
            Your bookmarked scholarships ({savedScholarships.length} saved)
          </p>
        </div>

        <SavedScholarshipsList savedScholarships={savedScholarships} />
      </div>
    </div>
  )
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ApplicationsList } from '@/components/dashboard/applications-list'
import { ApplicationProgress } from '@/components/dashboard/application-progress'
import { StudentNavigation } from '@/components/layout/student-navigation'

export default async function ApplicationsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Fetch user's applications
  const applications = await prisma.application.findMany({
    where: {
      email: session.user.email!
    },
            include: {
          scholarship: {
            select: {
              id: true,
              title: true,
              amount: true,
              amountType: true,
              category: true,
              degreeLevel: true,
              deadline: true,
              status: true
            }
          }
        },
    orderBy: {
      appliedAt: 'desc'
    }
  })

  // Find the user for navigation counts
  const user = await prisma.user.findFirst({
    where: { email: session.user.email }
  })

  if (!user) {
    redirect('/auth/signin')
  }

  // Get counts for navigation
  const [savedScholarships, notifications] = await Promise.all([
    prisma.savedScholarship.findMany({
      where: { userId: user.id }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track your scholarship applications and their status</p>
        </div>

        <ApplicationProgress applications={applications} />
        <ApplicationsList applications={applications} />
      </div>
    </div>
  )
}

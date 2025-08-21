import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DashboardNav } from '@/components/dashboard/nav'
import { StudentNavigation } from '@/components/layout/student-navigation'
import { NotificationsList } from '@/components/dashboard/notifications-list'

export default async function NotificationsPage() {
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

  // Get notifications for the user
  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  })

  // For students, get additional navigation data
  let navigationData = {}
  if (user.role === 'STUDENT') {
    const [applications, savedScholarships] = await Promise.all([
      prisma.application.findMany({ where: { email: user.email } }),
      prisma.savedScholarship.findMany({ where: { userId: user.id } })
    ])
    
    navigationData = {
      applicationCount: applications.length,
      savedCount: savedScholarships.length,
      notificationCount: notifications.filter(n => !n.read).length
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {user.role === 'STUDENT' ? (
        <StudentNavigation {...navigationData} />
      ) : (
        <DashboardNav user={user} notifications={notifications} />
      )}
      
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <NotificationsList 
            notifications={notifications} 
            userRole={user.role}
          />
        </div>
      </div>
    </div>
  )
}

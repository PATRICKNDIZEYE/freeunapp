import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DashboardNav } from '@/components/dashboard/nav'
import { StudentNavigation } from '@/components/layout/student-navigation'
import { ProfileForm } from '@/components/dashboard/profile-form'

export default async function ProfilePage() {
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

  // Get user statistics based on role
  let statistics = {}
  
  if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
    // Admin statistics
    const [scholarshipsCreated, applicationsCount, usersManaged, resourcesCreated] = await Promise.all([
      prisma.scholarship.count({ where: { adminId: user.id } }),
      prisma.application.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.resource.count({ where: { adminId: user.id } })
    ])
    
    statistics = {
      scholarshipsCreated,
      applicationsReviewed: applicationsCount,
      usersManaged,
      resourcesCreated
    }
  } else if (user.role === 'STUDENT') {
    // Student statistics
    const [applicationsCount, savedCount, acceptedCount] = await Promise.all([
      prisma.application.count({ where: { email: user.email } }),
      prisma.savedScholarship.count({ where: { userId: user.id } }),
      prisma.application.count({ where: { email: user.email, status: 'ACCEPTED' } })
    ])
    
    statistics = {
      applicationsSubmitted: applicationsCount,
      savedScholarships: savedCount,
      acceptedApplications: acceptedCount,
      profileCompletion: user.profileComplete ? 100 : 60
    }
  }

  // Get notifications for navigation
  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 10
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
          <ProfileForm 
            user={user}
            statistics={statistics}
            userRole={user.role}
          />
        </div>
      </div>
    </div>
  )
}

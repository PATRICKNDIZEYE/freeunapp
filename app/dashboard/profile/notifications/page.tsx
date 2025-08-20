import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard/nav'
import { NotificationPreferences } from '@/components/dashboard/notification-preferences'
import { prisma } from '@/lib/prisma'

export default async function NotificationPreferencesPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: {
      id: true,
      fieldOfStudy: true,
      degreeLevel: true,
      notificationPreferences: true
    }
  })

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <DashboardNav user={session.user} />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Notification Preferences</h1>
            <p className="text-gray-600 mt-2">Customize how and when you receive notifications</p>
          </div>
          
          <NotificationPreferences 
            user={user}
            currentPreferences={user.notificationPreferences as any}
          />
        </div>
      </div>
    </div>
  )
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard/nav'
import { DashboardStats } from '@/components/dashboard/stats'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/signin')
  }

  // Find the admin user
  const adminUser = await prisma.user.findFirst({
    where: { email: session.user.email }
  })

  if (!adminUser) {
    redirect('/auth/signin')
  }

  // Fetch dashboard stats and notifications
  const [stats, notifications] = await Promise.all([
    prisma.$transaction([
      prisma.scholarship.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.application.count(),
    ]),
    prisma.notification.findMany({
      where: { userId: adminUser.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ])

  const [totalScholarships, totalStudents, totalAdmins, totalApplications] = stats

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <DashboardNav user={adminUser} notifications={notifications} />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {session.user.name || session.user.email}</p>
          </div>

          {/* Stats Overview */}
          <DashboardStats 
            totalScholarships={totalScholarships}
            totalStudents={totalStudents}
            totalAdmins={totalAdmins}
            totalApplications={totalApplications}
          />

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a href="/dashboard/scholarships/new" className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Add New Scholarship
                </a>
                <a href="/dashboard/users" className="block w-full bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  Manage Users
                </a>
                <a href="/dashboard/profile" className="block w-full bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  Edit Profile
                </a>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3 text-sm text-gray-600">
                {notifications.slice(0, 3).map((notification) => (
                  <p key={notification.id}>• {notification.message}</p>
                ))}
                {notifications.length === 0 && (
                  <p>No recent activity</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="text-green-600 text-sm">● Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Service</span>
                  <span className="text-green-600 text-sm">● Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API</span>
                  <span className="text-green-600 text-sm">● Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard/nav'
import { ContentModeration } from '@/components/dashboard/content-moderation'
import { prisma } from '@/lib/prisma'

export default async function ModerationPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/signin')
  }

  // Only super admin can access this page
  if (session.user.role !== 'SUPER_ADMIN') {
    redirect('/dashboard')
  }

  // Fetch all content for moderation
  const [scholarships, resources, users] = await Promise.all([
    prisma.scholarship.findMany({
      include: {
        admin: {
          select: {
            name: true,
            email: true
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
    }),
    prisma.resource.findMany({
      include: {
        admin: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'STUDENT']
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <DashboardNav user={session.user} />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
            <p className="text-gray-600 mt-2">Manage and moderate all content on the platform</p>
          </div>
          
          <ContentModeration 
            scholarships={scholarships}
            resources={resources}
            users={users}
          />
        </div>
      </div>
    </div>
  )
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard/nav'
import { UserDetailView } from '@/components/dashboard/user-detail-view'
import { prisma } from '@/lib/prisma'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface UserDetailPageProps {
  params: {
    id: string
  }
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/signin')
  }

  // Only admins and super admins can view user details
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    redirect('/dashboard')
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      _count: {
        select: {
          savedScholarships: true,
          scholarships: true
        }
      },
      savedScholarships: {
        include: {
          scholarship: {
            select: {
              id: true,
              title: true,
              amount: true,
              deadline: true
            }
          }
        },
        take: 5,
        orderBy: {
          savedAt: 'desc'
        }
      },
      scholarships: {
        select: {
          id: true,
          title: true,
          amount: true,
          status: true,
          createdAt: true
        },
        take: 5,
        orderBy: {
          createdAt: 'desc'
        }
      },

    }
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <DashboardNav user={session.user} />
      
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard/users">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Users
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
              <p className="text-gray-600 mt-2">View detailed user information and activity</p>
            </div>
            {session.user.role === 'SUPER_ADMIN' && (
              <Link href={`/dashboard/users/${user.id}/edit`}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Edit User
                </Button>
              </Link>
            )}
          </div>

          {/* User Detail View */}
          <UserDetailView user={user} />
        </div>
      </div>
    </div>
  )
}

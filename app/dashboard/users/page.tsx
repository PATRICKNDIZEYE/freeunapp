import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard/nav'
import { UsersList } from '@/components/dashboard/users-list'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function UsersPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/signin')
  }

  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          savedScholarships: true,
          scholarships: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const stats = {
    total: users.length,
    students: users.filter(u => u.role === 'STUDENT').length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    approved: users.filter(u => u.approved).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <DashboardNav user={session.user} />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Users</h1>
              <p className="text-gray-600 mt-2">Manage all users and their permissions</p>
            </div>
            <Link href="/dashboard/users/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New User
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{stats.students}</div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
              <div className="text-sm text-gray-600">Admins</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-orange-600">{stats.approved}</div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
          </div>

          {/* Users List */}
          <UsersList users={users} />
        </div>
      </div>
    </div>
  )
}

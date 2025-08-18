import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard/nav'
import { ScholarshipsList } from '@/components/dashboard/scholarships-list'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function ScholarshipsPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/signin')
  }

  const scholarships = await prisma.scholarship.findMany({
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
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <DashboardNav user={session.user} />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Scholarships</h1>
              <p className="text-gray-600 mt-2">Manage all scholarship opportunities</p>
            </div>
            <Link href="/dashboard/scholarships/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Scholarship
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{scholarships.length}</div>
              <div className="text-sm text-gray-600">Total Scholarships</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600">
                {scholarships.filter(s => s.status === 'ACTIVE').length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-orange-600">
                {scholarships.filter(s => s.status === 'DRAFT').length}
              </div>
              <div className="text-sm text-gray-600">Drafts</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">
                {scholarships.reduce((acc, s) => acc + s._count.applications, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </div>
          </div>

          {/* Scholarships List */}
          <ScholarshipsList scholarships={scholarships} />
        </div>
      </div>
    </div>
  )
}

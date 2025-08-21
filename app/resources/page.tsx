import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { ResourcesList } from '@/components/resources/resources-list'
import { ResourcesFilter } from '@/components/resources/resources-filter'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, Plus } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  searchParams: {
    search?: string
    category?: string
    type?: string
  }
}

export default async function ResourcesPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)
  
  const [resources, stats] = await Promise.all([
    prisma.resource.findMany({
      include: {
        admin: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.$transaction([
      prisma.resource.count()
    ])
  ])

  const [totalResources] = stats

  // Apply filters
  let filteredResources = resources

  if (searchParams.search) {
    const searchTerm = searchParams.search.toLowerCase()
    filteredResources = filteredResources.filter(resource =>
      resource.title.toLowerCase().includes(searchTerm) ||
      (resource.description && resource.description.toLowerCase().includes(searchTerm)) ||
      resource.category.toLowerCase().includes(searchTerm)
    )
  }

  if (searchParams.category && searchParams.category !== 'all') {
    filteredResources = filteredResources.filter(resource =>
      resource.category === searchParams.category
    )
  }

  if (searchParams.type && searchParams.type !== 'all') {
    filteredResources = filteredResources.filter(resource =>
      resource.type.toLowerCase() === searchParams.type!.toLowerCase()
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Educational Resources</h1>
          <p className="text-gray-600">Access helpful guides, templates, and materials for your scholarship applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Resources</p>
                  <p className="text-2xl font-bold text-gray-900">{totalResources}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Downloads</p>
                  <p className="text-2xl font-bold text-gray-900">{totalResources}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add New Resource Button - Only for Admins */}
        {session?.user && (session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN') && (
          <div className="mb-8">
            <Link href="/dashboard/resources/new">
              <Button className="bg-brand-blue hover:bg-primary-900">
                <Plus className="h-4 w-4 mr-2" />
                Add New Resource
              </Button>
            </Link>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8">
          <ResourcesFilter />
        </div>

        {/* Results */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredResources.length} Resource{filteredResources.length !== 1 ? 's' : ''} Found
            </h2>
            {Object.keys(searchParams).length > 0 && (
              <div className="text-sm text-gray-500">
                Filtered results
              </div>
            )}
          </div>
        </div>

        {/* Resources List */}
        <ResourcesList resources={filteredResources} />
      </div>
      <Footer />
    </div>
  )
}

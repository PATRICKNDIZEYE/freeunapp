import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { ResourcesList } from '@/components/resources/resources-list'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function ResourcesPage() {
  const session = await getServerSession(authOptions)
  
  // Fetch resources
  const resources = await prisma.resource.findMany({
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
  })

  // Fetch stats
  const stats = await prisma.$transaction([
    prisma.resource.count(),
    prisma.resource.aggregate({
      _sum: {
        downloads: true
      }
    })
  ])

  const [totalResources, downloadsSum] = stats

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Educational Resources
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access helpful guides, templates, and resources to support your scholarship applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600">{totalResources}</div>
              <div className="text-sm text-gray-600">Available Resources</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Download className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600">{downloadsSum._sum.downloads || 0}</div>
              <div className="text-sm text-gray-600">Total Downloads</div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions */}
        {session?.user && (
          <div className="mb-8">
            <Link href="/dashboard/resources/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Resource
              </Button>
            </Link>
          </div>
        )}

        {/* Resources List */}
        <ResourcesList resources={resources} />
      </div>

      <Footer />
    </div>
  )
}

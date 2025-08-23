import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard/nav'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScholarshipApplicationsList } from '@/components/dashboard/scholarship-applications-list'
import { ScholarshipSidebarActions } from '@/components/dashboard/scholarship-sidebar-actions'
import { 
  GraduationCap, 
  Calendar, 
  DollarSign, 
  Users, 
  Eye,
  ArrowLeft,
  Edit,
  Trash2,
  ExternalLink,
  Mail,
  FileText,
  Bookmark,
  User
} from 'lucide-react'
import Link from 'next/link'

interface ScholarshipDetailPageProps {
  params: {
    id: string
  }
}

export default async function ScholarshipDetailPage({ params }: ScholarshipDetailPageProps) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/signin')
  }

  const scholarship = await prisma.scholarship.findUnique({
    where: { id: params.id },
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
      },
      applications: {
        orderBy: {
          appliedAt: 'desc'
        }
      }
    }
  })

  if (!scholarship) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'EXPIRED': return 'bg-red-100 text-red-800'
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'COMPUTER_SCIENCE': return 'bg-blue-100 text-blue-800'
      case 'ENGINEERING': return 'bg-purple-100 text-purple-800'
      case 'MEDICINE': return 'bg-red-100 text-red-800'
      case 'BUSINESS': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <DashboardNav user={session.user} />
      
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link href="/dashboard/scholarships">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Scholarships
                  </Button>
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{scholarship.title}</h1>
              <p className="text-gray-600 mt-2">Scholarship details and management</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/scholarships/${scholarship.id}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Scholarship
                </Button>
              </Link>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Scholarship Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Scholarship Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(scholarship.status)}>
                      {scholarship.status}
                    </Badge>
                    <Badge className={getCategoryColor(scholarship.category)}>
                      {scholarship.category.replace('_', ' ')}
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-800">
                      {scholarship.degreeLevel}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p className="text-gray-600">{scholarship.description}</p>
                  </div>

                  {scholarship.detailedDescription && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Detailed Description</h3>
                      <p className="text-gray-600">{scholarship.detailedDescription}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Amount</span>
                      <p className="font-semibold text-green-600">{scholarship.amount}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Type</span>
                      <p className="font-semibold">{scholarship.amountType}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Awards</span>
                      <p className="font-semibold">{scholarship.awardsAvailable || 'Unlimited'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Views</span>
                      <p className="font-semibold">{scholarship.views}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements & Process */}
              <Card>
                <CardHeader>
                  <CardTitle>Requirements & Application Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scholarship.eligibilityCriteria && (
                    <div>
                      <h4 className="font-semibold mb-2">Eligibility Criteria</h4>
                      <p className="text-gray-600">{scholarship.eligibilityCriteria}</p>
                    </div>
                  )}

                  {scholarship.applicationProcess && (
                    <div>
                      <h4 className="font-semibold mb-2">Application Process</h4>
                      <p className="text-gray-600">{scholarship.applicationProcess}</p>
                    </div>
                  )}

                  {scholarship.qualificationBasis && (
                    <div>
                      <h4 className="font-semibold mb-2">Qualification Basis</h4>
                      <p className="text-gray-600">{scholarship.qualificationBasis}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Applications List */}
              <div id="applications-section">
                <ScholarshipApplicationsList 
                  applications={scholarship.applications}
                  scholarshipTitle={scholarship.title}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Key Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-500">Deadline</span>
                      <p className="font-medium">{new Date(scholarship.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-500">Applications</span>
                      <p className="font-medium">{scholarship._count.applications}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-500">Saved</span>
                      <p className="font-medium">{scholarship._count.savedBy}</p>
                    </div>
                  </div>


                </CardContent>
              </Card>

              {/* Contact & Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact & Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scholarship.contactInfo && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">Contact</span>
                        <p className="font-medium">{scholarship.contactInfo}</p>
                      </div>
                    </div>
                  )}

                  {scholarship.referenceUrl && (
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">Reference</span>
                        <a 
                          href={scholarship.referenceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-500">Created by</span>
                      <p className="font-medium">{scholarship.admin.name || scholarship.admin.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScholarshipSidebarActions />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

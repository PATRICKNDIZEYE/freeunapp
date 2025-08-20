import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { ScholarshipDetail } from '@/components/scholarships/scholarship-detail'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Share2, 
  Heart, 
  Calendar, 
  DollarSign, 
  GraduationCap, 
  MapPin,
  ExternalLink,
  Users,
  Award
} from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: {
    id: string
  }
}

export default async function ScholarshipDetailPage({ params }: PageProps) {
  const scholarship = await prisma.scholarship.findUnique({
    where: { id: params.id },
    include: {
      admin: {
        select: {
          name: true
        }
      },
      _count: {
        select: {
          applications: true,
          savedBy: true
        }
      }
    }
  })

  if (!scholarship || scholarship.status !== 'ACTIVE') {
    notFound()
  }

  // Update view count
  await prisma.scholarship.update({
    where: { id: params.id },
    data: { views: { increment: 1 } }
  })

  const getAmountColor = (amountType: string) => {
    switch (amountType) {
      case 'FULL': return 'bg-green-100 text-green-800'
      case 'PARTIAL': return 'bg-yellow-100 text-yellow-800'
      case 'CUSTOM': return 'bg-blue-100 text-blue-800'
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

  const isDeadlineNear = (deadline: Date | null) => {
    if (!deadline) return false
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  const isDeadlineExpired = (deadline: Date | null) => {
    if (!deadline) return false
    return new Date(deadline) < new Date()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/scholarships">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Scholarships
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {scholarship.title}
                </h1>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={getAmountColor(scholarship.amountType)}>
                    {scholarship.amountType === 'FULL' ? 'Full Tuition' : 
                     scholarship.amountType === 'PARTIAL' ? 'Partial' : 
                     scholarship.amountType === 'CUSTOM' ? scholarship.amount : scholarship.amountType}
                  </Badge>
                  <Badge className={getCategoryColor(scholarship.category)}>
                    {scholarship.category.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline">
                    {scholarship.degreeLevel}
                  </Badge>
                  {scholarship.country && (
                    <Badge variant="outline">
                      {scholarship.country}
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold">{scholarship.amount}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GraduationCap className="h-4 w-4" />
                    <span>{scholarship.degreeLevel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{scholarship._count.applications} applications</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Heart className="h-4 w-4" />
                    <span>{scholarship._count.savedBy} saved</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const text = `Check out this scholarship: ${scholarship.title} - ${window.location.href}`
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
                    window.open(whatsappUrl, '_blank')
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>

            {/* Deadline Warning */}
            {isDeadlineNear(scholarship.deadline) && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  ⚠️ <strong>Deadline approaching!</strong> Apply before {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'TBD'}
                </p>
              </div>
            )}

            {isDeadlineExpired(scholarship.deadline) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  ❌ <strong>Application deadline has passed</strong>
                </p>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scholarship Details */}
            <div className="lg:col-span-2">
              <ScholarshipDetail scholarship={scholarship} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Application Actions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Apply for this Scholarship</h3>
                  
                  {!isDeadlineExpired(scholarship.deadline) ? (
                    <div className="space-y-3">
                      <Button className="w-full bg-brand-blue hover:bg-primary-900">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Apply for Myself
                      </Button>
                      <Button variant="outline" className="w-full">
                        Apply for Me
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">Applications are closed</p>
                    </div>
                  )}

                  {scholarship.referenceUrl && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold mb-2">Official Website</h4>
                      <a 
                        href={scholarship.referenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-blue hover:text-primary-900 underline text-sm"
                      >
                        Visit Official Website
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Scholarship Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Scholarship Information</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Posted by:</span>
                      <span className="font-medium">{scholarship.admin.name || 'Admin'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Posted on:</span>
                      <span>{new Date(scholarship.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Views:</span>
                      <span>{scholarship.views}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deadline:</span>
                      <span className={isDeadlineExpired(scholarship.deadline) ? 'text-red-600' : ''}>
                        {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'TBD'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

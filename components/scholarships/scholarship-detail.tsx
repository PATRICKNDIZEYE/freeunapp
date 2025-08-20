'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  DollarSign, 
  GraduationCap, 
  ExternalLink,
  Heart,
  Share2,
  Users,
  Eye,
  Clock,
  Award
} from 'lucide-react'

interface Scholarship {
  id: string
  title: string
  description: string
  detailedDescription: string | null
  logoUrl: string | null
  referenceUrl: string | null
  eligibilityCriteria: string | null
  applicationProcess: string | null
  qualificationBasis: string | null
  awardsAvailable: number | null
  amount: string
  amountType: string
  category: string
  degreeLevel: string
  deadline: Date
  contactInfo: string | null
  status: string
  approvalStatus: string
  views: number
  createdAt: Date
  admin: {
    name: string | null
  }
  _count: {
    savedBy: number
    applications: number
  }
}

interface ScholarshipDetailProps {
  scholarship: Scholarship
  user?: any
}

export function ScholarshipDetail({ scholarship, user }: ScholarshipDetailProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isApplied, setIsApplied] = useState(false)

  const handleSave = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = '/auth/signin'
      return
    }

    try {
      const response = await fetch('/api/scholarships/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scholarshipId: scholarship.id })
      })

      if (response.ok) {
        const data = await response.json()
        setIsSaved(data.saved)
      }
    } catch (error) {
      console.error('Error saving scholarship:', error)
    }
  }

  const handleApply = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = '/auth/signin'
      return
    }

    try {
      const response = await fetch('/api/scholarships/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scholarshipId: scholarship.id })
      })

      if (response.ok) {
        setIsApplied(true)
      }
    } catch (error) {
      console.error('Error applying for scholarship:', error)
    }
  }

  const handleShare = () => {
    const text = `Check out this scholarship: ${scholarship.title} - ${window.location.href}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, '_blank')
  }

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

  const isDeadlineExpired = (deadline: Date) => {
    return new Date(deadline) < new Date()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold mb-4">
                  {scholarship.title}
                </CardTitle>
                
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
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={isSaved ? "text-red-500 hover:text-red-700" : ""}
                  onClick={handleSave}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {scholarship.description}
              </p>
              {scholarship.detailedDescription && (
                <div className="mt-4" dangerouslySetInnerHTML={{ __html: scholarship.detailedDescription }} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Eligibility Criteria */}
        {scholarship.eligibilityCriteria && (
          <Card>
            <CardHeader>
              <CardTitle>Eligibility Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: scholarship.eligibilityCriteria }} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Application Process */}
        {scholarship.applicationProcess && (
          <Card>
            <CardHeader>
              <CardTitle>Application Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: scholarship.applicationProcess }} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Qualification Basis */}
        {scholarship.qualificationBasis && (
          <Card>
            <CardHeader>
              <CardTitle>Qualification Basis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: scholarship.qualificationBasis }} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Application Actions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Apply for this Scholarship</h3>
            
            {!isDeadlineExpired(scholarship.deadline) ? (
              <div className="space-y-3">
                <Button 
                  className="w-full bg-brand-blue hover:bg-primary-900"
                  onClick={handleApply}
                  disabled={isApplied}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {isApplied ? 'Applied' : 'Apply for Myself'}
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
              {scholarship.awardsAvailable && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Awards Available:</span>
                  <span>{scholarship.awardsAvailable}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        {scholarship.contactInfo && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="prose max-w-none text-sm">
                <div dangerouslySetInnerHTML={{ __html: scholarship.contactInfo }} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

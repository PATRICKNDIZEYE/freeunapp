'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RichTextDisplay } from '@/components/ui/rich-text-display'
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
  Award,
  BookOpen,
  FileText,
  MapPin
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

interface ScholarshipDetailsProps {
  scholarship: Scholarship
}

export function ScholarshipDetails({
  scholarship
}: ScholarshipDetailsProps) {
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
    <div className="space-y-6">
      {/* About This Scholarship */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            About This Scholarship
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <RichTextDisplay content={scholarship.detailedDescription || scholarship.description} />
          </div>
        </CardContent>
      </Card>

      {/* Key Information */}
      <Card>
        <CardHeader>
          <CardTitle>Key Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-semibold">{scholarship.amount}</p>
              </div>
            </div>
            
            {scholarship.awardsAvailable && (
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Awards Available</p>
                  <p className="font-semibold">{scholarship.awardsAvailable}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Application Deadline</p>
                <p className="font-semibold">
                  {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'TBD'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Eligibility Criteria */}
      {scholarship.eligibilityCriteria && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Eligibility Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg">
              <RichTextDisplay content={scholarship.eligibilityCriteria} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Application Process */}
      {scholarship.applicationProcess && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Application Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none bg-blue-50 p-4 rounded-lg">
              <RichTextDisplay content={scholarship.applicationProcess} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Information */}
      {scholarship.contactInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <RichTextDisplay content={scholarship.contactInfo} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Official Website */}
      {scholarship.referenceUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Official Website
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a 
              href={scholarship.referenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-blue hover:text-primary-900 underline"
            >
              Visit Official Website
              <ExternalLink className="h-4 w-4" />
            </a>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {scholarship._count.applications}
              </div>
              <div className="text-sm text-gray-600">Applications</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {scholarship._count.savedBy}
              </div>
              <div className="text-sm text-gray-600">Saved</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

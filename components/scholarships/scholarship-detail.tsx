'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  FileText, 
  MapPin, 
  ExternalLink,
  Calendar,
  DollarSign,
  Award
} from 'lucide-react'

interface Scholarship {
  id: string
  title: string
  description: string
  detailedDescription: string | null
  eligibilityCriteria: string | null
  applicationProcess: string | null
  contactInfo: string | null
  referenceUrl: string | null
  amount: string
  amountType: string
  category: string
  degreeLevel: string
  deadline: Date | null
  country: string | null
  awardsAvailable: number | null
  createdAt: Date
  admin: {
    name: string | null
  }
  _count: {
    applications: number
    savedBy: number
  }
}

interface ScholarshipDetailProps {
  scholarship: Scholarship
}

export function ScholarshipDetail({ scholarship }: ScholarshipDetailProps) {
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
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: scholarship.detailedDescription || scholarship.description 
            }}
          />
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
            
            {scholarship.country && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Country</p>
                  <p className="font-semibold">{scholarship.country}</p>
                </div>
              </div>
            )}
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
            <div 
              className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg"
              dangerouslySetInnerHTML={{ __html: scholarship.eligibilityCriteria }}
            />
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
            <div 
              className="prose prose-sm max-w-none bg-blue-50 p-4 rounded-lg"
              dangerouslySetInnerHTML={{ __html: scholarship.applicationProcess }}
            />
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
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: scholarship.contactInfo }}
            />
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

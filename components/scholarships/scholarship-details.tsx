'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  Share2, 
  Send, 
  Calendar, 
  DollarSign, 
  GraduationCap, 
  MapPin,
  BookOpen,
  FileText,
  ExternalLink,
  CheckCircle,
  Award
} from 'lucide-react'

interface Scholarship {
  id: string
  title: string
  description: string
  amount: string
  amountType: string
  category: string
  degreeLevel: string
  deadline: Date | null
  country: string | null
  detailedDescription: string | null
  eligibilityCriteria: string | null
  applicationProcess: string | null
  contactInfo: string | null
  referenceUrl: string | null
  createdAt: Date
  admin: {
    name: string | null
  }
  _count: {
    applications: number
    savedBy: number
  }
}

interface ScholarshipDetailsProps {
  scholarship: Scholarship
  onSave: () => void
  onApply: () => void
  onShare: () => void
  isSaved: boolean
  isApplied: boolean
}

export function ScholarshipDetails({ 
  scholarship, 
  onSave, 
  onApply, 
  onShare, 
  isSaved, 
  isApplied 
}: ScholarshipDetailsProps) {
  const [viewMode, setViewMode] = useState<'details' | 'apply'>('details')

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

  const isDeadlineExpired = (deadline: Date | null) => {
    if (!deadline) return false
    return new Date(deadline) < new Date()
  }

  if (viewMode === 'details') {
    return (
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="font-semibold">{scholarship.amount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            <span>{scholarship._count.applications} applications received</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-red-600" />
            <span>Deadline: {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'TBD'}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-purple-600" />
            <span>{scholarship.degreeLevel}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
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

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            About This Scholarship
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {scholarship.detailedDescription || scholarship.description}
          </p>
        </div>

        {/* Eligibility */}
        {scholarship.eligibilityCriteria && (
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Eligibility Criteria
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {scholarship.eligibilityCriteria}
              </p>
            </div>
          </div>
        )}

        {/* Application Process */}
        {scholarship.applicationProcess && (
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Application Process
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {scholarship.applicationProcess}
              </p>
            </div>
          </div>
        )}

        {/* Contact & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scholarship.contactInfo && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Contact Information
              </h3>
              <p className="text-gray-700">{scholarship.contactInfo}</p>
            </div>
          )}
          {scholarship.referenceUrl && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Official Website
              </h3>
              <a 
                href={scholarship.referenceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Visit Official Website
              </a>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
          <span>Posted by: {scholarship.admin.name || 'Admin'}</span>
          <span>{scholarship._count.savedBy} students saved this</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button 
            onClick={onSave}
            variant="outline"
            className={`flex items-center gap-2 ${isSaved ? 'text-red-500 border-red-500' : ''}`}
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Saved' : 'Save for Later'}
          </Button>
          
          <Button 
            onClick={onShare}
            variant="outline"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share via WhatsApp
          </Button>

          {!isDeadlineExpired(scholarship.deadline) && (
            <Button 
              onClick={() => setViewMode('apply')}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isApplied}
            >
              {isApplied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Already Applied
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Apply Now
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Application form view
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Apply for {scholarship.title}</h3>
        <p className="text-gray-600">Please fill out the application form below</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold text-blue-900 mb-2">Application Requirements:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Complete personal information</li>
          <li>• Academic background and achievements</li>
          <li>• Motivation statement</li>
          <li>• Supporting documents (if required)</li>
        </ul>
      </div>

      <div className="text-center">
        <p className="text-gray-600 mb-4">
          This will redirect you to the official application portal or contact form.
        </p>
        <div className="flex gap-3 justify-center">
          <Button 
            onClick={() => setViewMode('details')}
            variant="outline"
          >
            Back to Details
          </Button>
          <Button 
            onClick={onApply}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4 mr-2" />
            Start Application
          </Button>
        </div>
      </div>
    </div>
  )
}

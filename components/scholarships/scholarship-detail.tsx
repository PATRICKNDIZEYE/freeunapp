'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  CheckCircle
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'

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
  categories: string[]
  degreeLevels: string[]
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

  const router = useRouter()

  // Check if scholarship is saved and applied on component mount
  useEffect(() => {
    if (user) {
      checkSavedStatus()
      checkApplicationStatus()
    }
  }, [user, scholarship.id])

  const checkSavedStatus = async () => {
    try {
      const response = await fetch(`/api/scholarships/save?scholarshipId=${scholarship.id}`)
      if (response.ok) {
        const data = await response.json()
        setIsSaved(data.saved)
      }
    } catch (error) {
      console.error('Error checking saved status:', error)
    }
  }

  const checkApplicationStatus = async () => {
    try {
      const response = await fetch(`/api/scholarships/${scholarship.id}/applications/check`)
      if (response.ok) {
        const data = await response.json()
        setIsApplied(data.applied)
      }
    } catch (error) {
      console.error('Error checking application status:', error)
    }
  }





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
      // Redirect to registration page with return URL
      router.push(`/auth/signup?returnTo=${encodeURIComponent(`/apply/${scholarship.id}`)}`)
      return
    }

    // If user is logged in, redirect to dedicated application page
    router.push(`/apply/${scholarship.id}`)
  }





  const handleShare = () => {
    const text = `Check out this scholarship: ${scholarship.title} - ${window.location.href}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      // You could add a toast notification here
      alert('Link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy link:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Link copied to clipboard!')
    }
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

  const isDeadlineNear = (deadline: Date) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0
  }

  const getDaysRemaining = (deadline: Date) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Expired'
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return '1 day left'
    return `${diffDays} days left`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Deadline Warning Banner */}
      {isDeadlineNear(scholarship.deadline) && (
        <div className="lg:col-span-2">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Deadline Approaching!
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  This scholarship closes in {getDaysRemaining(scholarship.deadline)}. Apply now before it's too late!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  {scholarship.categories.slice(0, 2).map((category, index) => (
                    <Badge key={index} className={getCategoryColor(category)}>
                      {category.replace('_', ' ')}
                    </Badge>
                  ))}
                  {scholarship.categories.length > 2 && (
                    <Badge className="bg-gray-100 text-gray-700">
                      +{scholarship.categories.length - 2} more
                    </Badge>
                  )}
                  {scholarship.degreeLevels.slice(0, 2).map((level, index) => (
                    <Badge key={index} variant="outline">
                      {level}
                    </Badge>
                  ))}
                  {scholarship.degreeLevels.length > 2 && (
                    <Badge variant="outline">
                      +{scholarship.degreeLevels.length - 2} more
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
                    <span>{scholarship.degreeLevels.join(', ')}</span>
                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'TBD'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="h-4 w-4" />
                  <span>{scholarship.awardsAvailable || 'N/A'} awards</span>
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
                  onClick={handleCopyLink}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy Link
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
                {isApplied && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-600 border-green-600"
                    disabled
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Applied
                  </Button>
                )}
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
                <div className="mt-4">
                  <RichTextDisplay content={scholarship.detailedDescription} />
                </div>
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
                <RichTextDisplay content={scholarship.eligibilityCriteria} />
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
                <RichTextDisplay content={scholarship.applicationProcess} />
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
                <RichTextDisplay content={scholarship.qualificationBasis} />
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
                  className="w-full bg-brand-blue hover:bg-primary-900 text-white"
                  onClick={handleApply}
                  disabled={isApplied}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {isApplied ? 'Applied' : 'Apply Now'}
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">Applications are closed</p>
              </div>
            )}

            {scholarship.referenceUrl && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold mb-2">School Official Website</h4>
                <a 
                  href={scholarship.referenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue hover:text-primary-900 underline text-sm"
                >
                  Visit School Official Website
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

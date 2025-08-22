'use client'

import { useState, useEffect } from 'react'
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
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  // Registration form state
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Application form state
  const [applicationData, setApplicationData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    currentInstitution: '',
    fieldOfStudy: '',
    currentYear: '',
    gpa: '',
    expectedGraduation: '',
    intendedUniversity: '',
    intendedProgram: '',
    intendedCountry: '',
    financialNeed: '',
    achievements: '',
    extracurricular: '',
    workExperience: '',
    researchExperience: '',
    publications: '',
    awards: '',
    references: '',
    motivation: '',
    futureGoals: '',
    additionalInfo: ''
  })

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
      // Show registration modal instead of redirecting
      setShowRegistrationModal(true)
      return
    }

    // If user is logged in, redirect to dedicated application page
    router.push(`/apply/${scholarship.id}`)
  }

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
      })

      if (response.ok) {
        // Registration successful, close modal and show application form
        setShowRegistrationModal(false)
        setShowApplicationModal(true)
        // Pre-fill application data with registration info
        setApplicationData(prev => ({
          ...prev,
          name: registrationData.name,
          email: registrationData.email
        }))
      } else {
        const error = await response.json()
        alert(error.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/scholarships/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scholarshipId: scholarship.id,
          ...applicationData
        })
      })

      if (response.ok) {
        setIsApplied(true)
        setShowApplicationModal(false)
        // Redirect to user dashboard to see application status
        router.push('/dashboard/applications')
      } else {
        const error = await response.json()
        alert(error.error || 'Application failed')
      }
    } catch (error) {
      console.error('Application error:', error)
      alert('Application failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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

      {/* Registration Modal */}
      <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register to Apply</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRegistration} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={registrationData.name}
                onChange={(e) => setRegistrationData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={registrationData.email}
                onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={registrationData.password}
                onChange={(e) => setRegistrationData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={registrationData.confirmPassword}
                onChange={(e) => setRegistrationData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Application Form Modal */}
      <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {scholarship.title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleApplicationSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={applicationData.name}
                onChange={(e) => setApplicationData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={applicationData.email}
                onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                value={applicationData.phone}
                onChange={(e) => setApplicationData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dateOfBirth">Date of Birth (Optional)</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={applicationData.dateOfBirth}
                onChange={(e) => setApplicationData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nationality">Nationality (Optional)</Label>
              <Input
                id="nationality"
                value={applicationData.nationality}
                onChange={(e) => setApplicationData(prev => ({ ...prev, nationality: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currentInstitution">Current Institution (Optional)</Label>
              <Input
                id="currentInstitution"
                value={applicationData.currentInstitution}
                onChange={(e) => setApplicationData(prev => ({ ...prev, currentInstitution: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fieldOfStudy">Field of Study (Optional)</Label>
              <Input
                id="fieldOfStudy"
                value={applicationData.fieldOfStudy}
                onChange={(e) => setApplicationData(prev => ({ ...prev, fieldOfStudy: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currentYear">Current Year (Optional)</Label>
              <Input
                id="currentYear"
                type="number"
                value={applicationData.currentYear}
                onChange={(e) => setApplicationData(prev => ({ ...prev, currentYear: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gpa">GPA (Optional)</Label>
              <Input
                id="gpa"
                type="number"
                step="0.01"
                value={applicationData.gpa}
                onChange={(e) => setApplicationData(prev => ({ ...prev, gpa: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expectedGraduation">Expected Graduation (Optional)</Label>
              <Input
                id="expectedGraduation"
                type="date"
                value={applicationData.expectedGraduation}
                onChange={(e) => setApplicationData(prev => ({ ...prev, expectedGraduation: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="intendedUniversity">Intended University (Optional)</Label>
              <Input
                id="intendedUniversity"
                value={applicationData.intendedUniversity}
                onChange={(e) => setApplicationData(prev => ({ ...prev, intendedUniversity: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="intendedProgram">Intended Program (Optional)</Label>
              <Input
                id="intendedProgram"
                value={applicationData.intendedProgram}
                onChange={(e) => setApplicationData(prev => ({ ...prev, intendedProgram: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="intendedCountry">Intended Country (Optional)</Label>
              <Input
                id="intendedCountry"
                value={applicationData.intendedCountry}
                onChange={(e) => setApplicationData(prev => ({ ...prev, intendedCountry: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="financialNeed">Financial Need (Optional)</Label>
              <Input
                id="financialNeed"
                type="text"
                value={applicationData.financialNeed}
                onChange={(e) => setApplicationData(prev => ({ ...prev, financialNeed: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="achievements">Achievements (Optional)</Label>
              <Textarea
                id="achievements"
                value={applicationData.achievements}
                onChange={(e) => setApplicationData(prev => ({ ...prev, achievements: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="extracurricular">Extracurricular Activities (Optional)</Label>
              <Textarea
                id="extracurricular"
                value={applicationData.extracurricular}
                onChange={(e) => setApplicationData(prev => ({ ...prev, extracurricular: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="workExperience">Work Experience (Optional)</Label>
              <Textarea
                id="workExperience"
                value={applicationData.workExperience}
                onChange={(e) => setApplicationData(prev => ({ ...prev, workExperience: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="researchExperience">Research Experience (Optional)</Label>
              <Textarea
                id="researchExperience"
                value={applicationData.researchExperience}
                onChange={(e) => setApplicationData(prev => ({ ...prev, researchExperience: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="publications">Publications (Optional)</Label>
              <Textarea
                id="publications"
                value={applicationData.publications}
                onChange={(e) => setApplicationData(prev => ({ ...prev, publications: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="awards">Awards (Optional)</Label>
              <Textarea
                id="awards"
                value={applicationData.awards}
                onChange={(e) => setApplicationData(prev => ({ ...prev, awards: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="references">References (Optional)</Label>
              <Textarea
                id="references"
                value={applicationData.references}
                onChange={(e) => setApplicationData(prev => ({ ...prev, references: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="motivation">Motivation (Optional)</Label>
              <Textarea
                id="motivation"
                value={applicationData.motivation}
                onChange={(e) => setApplicationData(prev => ({ ...prev, motivation: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="futureGoals">Future Goals (Optional)</Label>
              <Textarea
                id="futureGoals"
                value={applicationData.futureGoals}
                onChange={(e) => setApplicationData(prev => ({ ...prev, futureGoals: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
              <Textarea
                id="additionalInfo"
                value={applicationData.additionalInfo}
                onChange={(e) => setApplicationData(prev => ({ ...prev, additionalInfo: e.target.value }))}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

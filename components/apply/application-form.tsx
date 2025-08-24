'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Calendar, 
  DollarSign, 
  GraduationCap, 
  User,
  BookOpen,
  Award,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Save,
  Send
} from 'lucide-react'
import { toast } from 'sonner'
import { InlineLoader } from '@/components/ui/loader'

interface Scholarship {
  id: string
  title: string
  description: string
  amount: string
  amountType: string
  categories: string[]
  degreeLevels: string[]
  deadline: Date
  admin: {
    name: string | null
  }
}

interface User {
  id: string
  name: string | null
  email: string
}

interface ApplicationFormProps {
  scholarship: Scholarship
  user: User
}

export function ApplicationForm({ scholarship, user }: ApplicationFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    // Personal Information
    name: user.name || '',
    email: user.email,
    phone: '',
    dateOfBirth: '',
    nationality: '',
    
    // Academic Information
    schoolAttended: '',
    fieldOfStudy: '',
    currentYear: '',
    marksPercentage: '',
    gpa: '',
    expectedGraduation: '',
    
    // Intended Program
    intendedUniversity: '',
    intendedProgram: '',
    intendedCountry: '',
    financialNeed: '',
    
    // Achievements and Experience
    achievements: '',
    extracurricular: '',
    workExperience: '',
    researchExperience: '',
    publications: '',
    awards: '',
    references: '',
    
    // Motivation and Goals
    motivation: '',
    futureGoals: '',
    additionalInfo: ''
  })

  // GPA conversion function
  const convertMarksToGPA = (marks: string): string => {
    const percentage = parseFloat(marks)
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      return ''
    }
    
    // Rwanda GPA conversion formula
    if (percentage >= 80) return '4.0'
    if (percentage >= 75) return '3.7'
    if (percentage >= 70) return '3.3'
    if (percentage >= 65) return '3.0'
    if (percentage >= 60) return '2.7'
    if (percentage >= 55) return '2.3'
    if (percentage >= 50) return '2.0'
    if (percentage >= 45) return '1.7'
    if (percentage >= 40) return '1.3'
    return '1.0'
  }

  const steps = [
    { id: 1, title: 'Personal Information', icon: User },
    { id: 2, title: 'Academic Background', icon: BookOpen },
    { id: 3, title: 'Intended Program', icon: GraduationCap },
    { id: 4, title: 'Achievements & Experience', icon: Award },
    { id: 5, title: 'Motivation & Goals', icon: CheckCircle }
  ]

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required'
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
        if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required'
        break
      
      case 2:
        if (!formData.schoolAttended.trim()) newErrors.schoolAttended = 'School attended is required'
        if (!formData.fieldOfStudy.trim()) newErrors.fieldOfStudy = 'Field of study is required'
        if (!formData.currentYear.trim()) newErrors.currentYear = 'Current year is required'
        if (!formData.marksPercentage.trim()) newErrors.marksPercentage = 'Marks percentage is required'
        // GPA and expected graduation are optional
        break
      
      case 3:
        if (!formData.intendedUniversity.trim()) newErrors.intendedUniversity = 'Intended university is required'
        if (!formData.intendedProgram.trim()) newErrors.intendedProgram = 'Intended program is required'
        if (!formData.intendedCountry.trim()) newErrors.intendedCountry = 'Intended country is required'
        // Financial need is optional
        break
      
      case 4:
        // Step 4 fields are optional - no validation required
        break
      
      case 5:
        if (!formData.motivation.trim()) newErrors.motivation = 'Motivation statement is required'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast.error('Please fix the errors before submitting')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/scholarships/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scholarshipId: scholarship.id,
          ...formData
        })
      })

      if (response.ok) {
        toast.success('Application submitted successfully!')
        router.push('/dashboard/applications')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error('Failed to submit application')
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="space-y-6">
      {/* Scholarship Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            Scholarship Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{scholarship.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{scholarship.description}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">{scholarship.amount} ({scholarship.amountType})</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                <span className="text-sm">{scholarship.degreeLevels.join(', ')} • {scholarship.categories.map(c => c.replace('_', ' ')).join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-red-600" />
                <span className="text-sm">Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Application Progress</h3>
              <span className="text-sm text-gray-600">{currentStep} of {steps.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between text-sm text-gray-600">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step.id <= currentStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.id < currentStep ? <CheckCircle className="h-3 w-3" /> : step.id}
                  </div>
                  <span className="hidden md:inline">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5 text-blue-600" })}
            {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className={errors.dateOfBirth ? 'border-red-500' : ''}
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="nationality">Nationality *</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  placeholder="Enter your nationality"
                  className={errors.nationality ? 'border-red-500' : ''}
                />
                {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schoolAttended">School Attended *</Label>
                  <Input
                    id="schoolAttended"
                    value={formData.schoolAttended}
                    onChange={(e) => handleInputChange('schoolAttended', e.target.value)}
                    placeholder="Your school/university name"
                    className={errors.schoolAttended ? 'border-red-500' : ''}
                  />
                  {errors.schoolAttended && <p className="text-red-500 text-sm mt-1">{errors.schoolAttended}</p>}
                </div>
                
                <div>
                  <Label htmlFor="fieldOfStudy">Field of Study *</Label>
                  <Select onValueChange={(value) => handleInputChange('fieldOfStudy', value)}>
                    <SelectTrigger className={errors.fieldOfStudy ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select field of study" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                      <SelectItem value="Information Technology">Information Technology</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                      <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                      <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                      <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                      <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                      <SelectItem value="Chemical Engineering">Chemical Engineering</SelectItem>
                      <SelectItem value="Biomedical Engineering">Biomedical Engineering</SelectItem>
                      <SelectItem value="Medicine">Medicine</SelectItem>
                      <SelectItem value="Nursing">Nursing</SelectItem>
                      <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="Business Administration">Business Administration</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Accounting">Accounting</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Economics">Economics</SelectItem>
                      <SelectItem value="Law">Law</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Psychology">Psychology</SelectItem>
                      <SelectItem value="Sociology">Sociology</SelectItem>
                      <SelectItem value="Political Science">Political Science</SelectItem>
                      <SelectItem value="International Relations">International Relations</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="Environmental Science">Environmental Science</SelectItem>
                      <SelectItem value="Agriculture">Agriculture</SelectItem>
                      <SelectItem value="Veterinary Medicine">Veterinary Medicine</SelectItem>
                      <SelectItem value="Architecture">Architecture</SelectItem>
                      <SelectItem value="Urban Planning">Urban Planning</SelectItem>
                      <SelectItem value="Journalism">Journalism</SelectItem>
                      <SelectItem value="Communication">Communication</SelectItem>
                      <SelectItem value="Languages">Languages</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="Theater">Theater</SelectItem>
                      <SelectItem value="Film Studies">Film Studies</SelectItem>
                      <SelectItem value="Tourism">Tourism</SelectItem>
                      <SelectItem value="Hospitality Management">Hospitality Management</SelectItem>
                      <SelectItem value="Sports Science">Sports Science</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.fieldOfStudy && <p className="text-red-500 text-sm mt-1">{errors.fieldOfStudy}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentYear">Current Year *</Label>
                  <Select onValueChange={(value) => handleInputChange('currentYear', value)}>
                    <SelectTrigger className={errors.currentYear ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st Year">1st Year</SelectItem>
                      <SelectItem value="2nd Year">2nd Year</SelectItem>
                      <SelectItem value="3rd Year">3rd Year</SelectItem>
                      <SelectItem value="4th Year">4th Year</SelectItem>
                      <SelectItem value="Graduated">Graduated</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.currentYear && <p className="text-red-500 text-sm mt-1">{errors.currentYear}</p>}
                </div>
                
                <div>
                  <Label htmlFor="expectedGraduation">Expected Graduation (Optional)</Label>
                  <Input
                    id="expectedGraduation"
                    type="date"
                    value={formData.expectedGraduation}
                    onChange={(e) => handleInputChange('expectedGraduation', e.target.value)}
                    className={errors.expectedGraduation ? 'border-red-500' : ''}
                  />
                  {errors.expectedGraduation && <p className="text-red-500 text-sm mt-1">{errors.expectedGraduation}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="marksPercentage">Marks Percentage *</Label>
                  <Input
                    id="marksPercentage"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.marksPercentage}
                    onChange={(e) => {
                      const marks = e.target.value
                      handleInputChange('marksPercentage', marks)
                      // Auto-convert to GPA
                      const gpa = convertMarksToGPA(marks)
                      handleInputChange('gpa', gpa)
                    }}
                    placeholder="e.g., 85.5"
                    className={errors.marksPercentage ? 'border-red-500' : ''}
                  />
                  {errors.marksPercentage && <p className="text-red-500 text-sm mt-1">{errors.marksPercentage}</p>}
                  <p className="text-xs text-gray-500 mt-1">Enter your marks as a percentage (0-100)</p>
                </div>
                
                <div>
                  <Label htmlFor="gpa">Calculated GPA</Label>
                  <Input
                    id="gpa"
                    type="text"
                    value={formData.gpa}
                    readOnly
                    placeholder="Auto-calculated from marks"
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">GPA automatically calculated from your marks</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="intendedUniversity">Intended University *</Label>
                  <Input
                    id="intendedUniversity"
                    value={formData.intendedUniversity}
                    onChange={(e) => handleInputChange('intendedUniversity', e.target.value)}
                    placeholder="University you want to attend"
                    className={errors.intendedUniversity ? 'border-red-500' : ''}
                  />
                  {errors.intendedUniversity && <p className="text-red-500 text-sm mt-1">{errors.intendedUniversity}</p>}
                </div>
                
                <div>
                  <Label htmlFor="intendedProgram">Intended Program *</Label>
                  <Input
                    id="intendedProgram"
                    value={formData.intendedProgram}
                    onChange={(e) => handleInputChange('intendedProgram', e.target.value)}
                    placeholder="Program you want to study"
                    className={errors.intendedProgram ? 'border-red-500' : ''}
                  />
                  {errors.intendedProgram && <p className="text-red-500 text-sm mt-1">{errors.intendedProgram}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="intendedCountry">Intended Country *</Label>
                  <Input
                    id="intendedCountry"
                    value={formData.intendedCountry}
                    onChange={(e) => handleInputChange('intendedCountry', e.target.value)}
                    placeholder="Country you want to study in"
                    className={errors.intendedCountry ? 'border-red-500' : ''}
                  />
                  {errors.intendedCountry && <p className="text-red-500 text-sm mt-1">{errors.intendedCountry}</p>}
                </div>
                
                <div>
                  <Label htmlFor="financialNeed">Financial Need Description (Optional)</Label>
                  <Textarea
                    id="financialNeed"
                    value={formData.financialNeed}
                    onChange={(e) => handleInputChange('financialNeed', e.target.value)}
                    placeholder="Describe your financial need and why you need this scholarship"
                    rows={3}
                    className={errors.financialNeed ? 'border-red-500' : ''}
                  />
                  {errors.financialNeed && <p className="text-red-500 text-sm mt-1">{errors.financialNeed}</p>}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="achievements">Academic & Personal Achievements (Optional)</Label>
                <Textarea
                  id="achievements"
                  value={formData.achievements}
                  onChange={(e) => handleInputChange('achievements', e.target.value)}
                  placeholder="List your academic achievements, awards, honors, etc."
                  rows={4}
                  className={errors.achievements ? 'border-red-500' : ''}
                />
                {errors.achievements && <p className="text-red-500 text-sm mt-1">{errors.achievements}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="extracurricular">Extracurricular Activities</Label>
                  <Textarea
                    id="extracurricular"
                    value={formData.extracurricular}
                    onChange={(e) => handleInputChange('extracurricular', e.target.value)}
                    placeholder="Clubs, sports, volunteer work, etc."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="workExperience">Work Experience</Label>
                  <Textarea
                    id="workExperience"
                    value={formData.workExperience}
                    onChange={(e) => handleInputChange('workExperience', e.target.value)}
                    placeholder="Any relevant work experience"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="researchExperience">Research Experience</Label>
                  <Textarea
                    id="researchExperience"
                    value={formData.researchExperience}
                    onChange={(e) => handleInputChange('researchExperience', e.target.value)}
                    placeholder="Research projects, publications, etc."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="awards">Awards & Recognition</Label>
                  <Textarea
                    id="awards"
                    value={formData.awards}
                    onChange={(e) => handleInputChange('awards', e.target.value)}
                    placeholder="Scholarships, competitions, etc."
                    rows={3}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="references">References</Label>
                <Textarea
                  id="references"
                  value={formData.references}
                  onChange={(e) => handleInputChange('references', e.target.value)}
                  placeholder="Names and contact information of references"
                  rows={3}
                />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="motivation">Motivation Statement *</Label>
                <Textarea
                  id="motivation"
                  value={formData.motivation}
                  onChange={(e) => handleInputChange('motivation', e.target.value)}
                  placeholder="Why do you want this scholarship? What motivates you?"
                  rows={4}
                  className={errors.motivation ? 'border-red-500' : ''}
                />
                {errors.motivation && <p className="text-red-500 text-sm mt-1">{errors.motivation}</p>}
              </div>

              <div>
                <Label htmlFor="futureGoals">Future Goals & Aspirations</Label>
                <Textarea
                  id="futureGoals"
                  value={formData.futureGoals}
                  onChange={(e) => handleInputChange('futureGoals', e.target.value)}
                  placeholder="What are your career goals? How will this scholarship help?"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  placeholder="Any other information you'd like to share"
                  rows={3}
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please review all your information carefully before submitting. You won't be able to edit your application after submission.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-3">
          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              Next
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <InlineLoader size="sm" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

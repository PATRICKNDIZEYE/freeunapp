'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  GraduationCap, 
  Calendar, 
  DollarSign, 
  Users,
  Send,
  MapPin,
  Clock,
  BookOpen,
  Eye,
  ExternalLink,
  Award,
  FileText
} from 'lucide-react'

interface Scholarship {
  id: string
  title: string
  description: string
  detailedDescription?: string | null
  amount: string
  amountType: string
  category: string
  degreeLevel: string
  deadline: Date
  status: string
  eligibilityCriteria?: string | null
  applicationProcess?: string | null
  contactInfo?: string | null
  referenceUrl?: string | null
  awardsAvailable?: number | null
  admin: {
    name: string | null
  }
  _count: {
    applications: number
    savedBy: number
  }
}

interface ScholarshipsListProps {
  scholarships: Scholarship[]
}

export function ScholarshipsList({ scholarships }: ScholarshipsListProps) {
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
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
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [viewMode, setViewMode] = useState<'details' | 'apply'>('details')

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'COMPUTER_SCIENCE': return 'bg-blue-100 text-blue-800'
      case 'ENGINEERING': return 'bg-purple-100 text-purple-800'
      case 'MEDICINE': return 'bg-red-100 text-red-800'
      case 'BUSINESS': return 'bg-green-100 text-green-800'
      case 'LAW': return 'bg-orange-100 text-orange-800'
      case 'EDUCATION': return 'bg-teal-100 text-teal-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const openDetails = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship)
    setViewMode('details')
  }

  const openApply = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship)
    setViewMode('apply')
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedScholarship) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...applicationForm,
          scholarshipId: selectedScholarship.id
        })
      })

      if (response.ok) {
        alert('Application submitted successfully! We will contact you soon.')
        setApplicationForm({
          name: '', email: '', phone: '', dateOfBirth: '', nationality: '',
          currentInstitution: '', fieldOfStudy: '', currentYear: '', gpa: '',
          expectedGraduation: '', intendedUniversity: '', intendedProgram: '',
          intendedCountry: '', financialNeed: '', achievements: '',
          extracurricular: '', workExperience: '', researchExperience: '',
          publications: '', awards: '', references: '', motivation: '',
          futureGoals: '', additionalInfo: ''
        })
        setSelectedScholarship(null)
        setViewMode('details')
      } else {
        alert('Failed to submit application. Please try again.')
      }
    } catch (error) {
      alert('Error submitting application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {scholarships.length === 0 ? (
        <div className="text-center py-12">
          <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No scholarships found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scholarships.map((scholarship) => (
            <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold line-clamp-2 mb-2">
                      {scholarship.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getCategoryColor(scholarship.category)}>
                        {scholarship.category.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        {scholarship.degreeLevel}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm line-clamp-3">
                  {scholarship.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">{scholarship.amount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{scholarship._count.applications} applicants</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    By: {scholarship.admin.name || 'Admin'}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline"
                        className="flex-1"
                        onClick={() => openDetails(scholarship)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                          {selectedScholarship?.title}
                        </DialogTitle>
                      </DialogHeader>
                      
                      {viewMode === 'details' ? (
                        <div className="space-y-6">
                          {/* Basic Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-5 w-5 text-green-600" />
                              <span className="font-semibold">{selectedScholarship?.amount}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award className="h-5 w-5 text-blue-600" />
                              <span>{selectedScholarship?.awardsAvailable || 'Multiple'} awards available</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-5 w-5 text-red-600" />
                              <span>Deadline: {selectedScholarship?.deadline ? new Date(selectedScholarship.deadline).toLocaleDateString() : 'TBD'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-5 w-5 text-purple-600" />
                              <span>{selectedScholarship?.degreeLevel}</span>
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                              <BookOpen className="h-5 w-5" />
                              About This Scholarship
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                              {selectedScholarship?.detailedDescription || selectedScholarship?.description}
                            </p>
                          </div>

                          {/* Eligibility */}
                          {selectedScholarship?.eligibilityCriteria && (
                            <div>
                              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Eligibility Criteria
                              </h3>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                  {selectedScholarship.eligibilityCriteria}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Application Process */}
                          {selectedScholarship?.applicationProcess && (
                            <div>
                              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Application Process
                              </h3>
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                  {selectedScholarship.applicationProcess}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Contact & Links */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedScholarship?.contactInfo && (
                              <div>
                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                  <MapPin className="h-5 w-5" />
                                  Contact Information
                                </h3>
                                <p className="text-gray-700">{selectedScholarship.contactInfo}</p>
                              </div>
                            )}
                            {selectedScholarship?.referenceUrl && (
                              <div>
                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                  <ExternalLink className="h-5 w-5" />
                                  Official Website
                                </h3>
                                <a 
                                  href={selectedScholarship.referenceUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline"
                                >
                                  Visit Official Website
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-4 border-t">
                            <Button 
                              onClick={() => openApply(selectedScholarship!)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Apply Now
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setSelectedScholarship(null)}
                            >
                              Close
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleApply} className="space-y-6">
                          {/* Personal Information */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name">Full Name *</Label>
                              <Input id="name" value={applicationForm.name} onChange={(e) => setApplicationForm({ ...applicationForm, name: e.target.value })} required />
                            </div>
                            <div>
                              <Label htmlFor="email">Email Address *</Label>
                              <Input id="email" type="email" value={applicationForm.email} onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })} required />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input id="phone" value={applicationForm.phone} onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })} />
                            </div>
                            <div>
                              <Label htmlFor="dateOfBirth">Date of Birth</Label>
                              <Input id="dateOfBirth" type="date" value={applicationForm.dateOfBirth} onChange={(e) => setApplicationForm({ ...applicationForm, dateOfBirth: e.target.value })} />
                            </div>
                            <div>
                              <Label htmlFor="nationality">Nationality</Label>
                              <Input id="nationality" value={applicationForm.nationality} onChange={(e) => setApplicationForm({ ...applicationForm, nationality: e.target.value })} />
                            </div>
                          </div>

                          {/* Academic Information */}
                          <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Academic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="currentInstitution">Current Institution</Label>
                                <Input id="currentInstitution" value={applicationForm.currentInstitution} onChange={(e) => setApplicationForm({ ...applicationForm, currentInstitution: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="fieldOfStudy">Field of Study</Label>
                                <Input id="fieldOfStudy" value={applicationForm.fieldOfStudy} onChange={(e) => setApplicationForm({ ...applicationForm, fieldOfStudy: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="currentYear">Current Year/Level</Label>
                                <Select value={applicationForm.currentYear} onValueChange={(value) => setApplicationForm({ ...applicationForm, currentYear: value })}>
                                  <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1st Year">1st Year</SelectItem>
                                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                                    <SelectItem value="4th Year">4th Year</SelectItem>
                                    <SelectItem value="Graduate">Graduate</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="gpa">GPA (if applicable)</Label>
                                <Input id="gpa" type="number" step="0.01" min="0" max="4" value={applicationForm.gpa} onChange={(e) => setApplicationForm({ ...applicationForm, gpa: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="expectedGraduation">Expected Graduation Date</Label>
                                <Input id="expectedGraduation" type="date" value={applicationForm.expectedGraduation} onChange={(e) => setApplicationForm({ ...applicationForm, expectedGraduation: e.target.value })} />
                              </div>
                            </div>
                          </div>

                          {/* Intended Program */}
                          <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Intended Program</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="intendedUniversity">Intended University</Label>
                                <Input id="intendedUniversity" value={applicationForm.intendedUniversity} onChange={(e) => setApplicationForm({ ...applicationForm, intendedUniversity: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="intendedProgram">Intended Program</Label>
                                <Input id="intendedProgram" value={applicationForm.intendedProgram} onChange={(e) => setApplicationForm({ ...applicationForm, intendedProgram: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="intendedCountry">Intended Country</Label>
                                <Input id="intendedCountry" value={applicationForm.intendedCountry} onChange={(e) => setApplicationForm({ ...applicationForm, intendedCountry: e.target.value })} />
                              </div>
                              <div>
                                <Label htmlFor="financialNeed">Financial Need Description</Label>
                                <Textarea id="financialNeed" value={applicationForm.financialNeed} onChange={(e) => setApplicationForm({ ...applicationForm, financialNeed: e.target.value })} rows={2} />
                              </div>
                            </div>
                          </div>

                          {/* Achievements and Experience */}
                          <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Achievements and Experience</h3>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="achievements">Academic Achievements</Label>
                                <Textarea id="achievements" value={applicationForm.achievements} onChange={(e) => setApplicationForm({ ...applicationForm, achievements: e.target.value })} rows={3} placeholder="List your academic achievements, honors, awards..." />
                              </div>
                              <div>
                                <Label htmlFor="extracurricular">Extracurricular Activities</Label>
                                <Textarea id="extracurricular" value={applicationForm.extracurricular} onChange={(e) => setApplicationForm({ ...applicationForm, extracurricular: e.target.value })} rows={3} placeholder="Describe your involvement in clubs, sports, community service..." />
                              </div>
                              <div>
                                <Label htmlFor="workExperience">Work Experience</Label>
                                <Textarea id="workExperience" value={applicationForm.workExperience} onChange={(e) => setApplicationForm({ ...applicationForm, workExperience: e.target.value })} rows={3} placeholder="Describe any relevant work experience..." />
                              </div>
                              <div>
                                <Label htmlFor="researchExperience">Research Experience</Label>
                                <Textarea id="researchExperience" value={applicationForm.researchExperience} onChange={(e) => setApplicationForm({ ...applicationForm, researchExperience: e.target.value })} rows={3} placeholder="Describe any research projects, publications..." />
                              </div>
                            </div>
                          </div>

                          {/* Motivation and Goals */}
                          <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Motivation and Goals</h3>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="motivation">Why do you want this scholarship? *</Label>
                                <Textarea id="motivation" value={applicationForm.motivation} onChange={(e) => setApplicationForm({ ...applicationForm, motivation: e.target.value })} rows={4} required placeholder="Explain your motivation for applying for this scholarship..." />
                              </div>
                              <div>
                                <Label htmlFor="futureGoals">Future Goals and Plans</Label>
                                <Textarea id="futureGoals" value={applicationForm.futureGoals} onChange={(e) => setApplicationForm({ ...applicationForm, futureGoals: e.target.value })} rows={3} placeholder="Describe your career goals and how this scholarship will help..." />
                              </div>
                            </div>
                          </div>

                          {/* Additional Information */}
                          <div>
                            <Label htmlFor="additionalInfo">Additional Information</Label>
                            <Textarea id="additionalInfo" value={applicationForm.additionalInfo} onChange={(e) => setApplicationForm({ ...applicationForm, additionalInfo: e.target.value })} rows={3} placeholder="Any additional information you'd like to share..." />
                          </div>

                          <div className="flex gap-3 pt-4">
                            <Button type="submit" disabled={isSubmitting} className="flex-1">
                              {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                            </Button>
                            <Button 
                              type="button"
                              variant="outline" 
                              onClick={() => setViewMode('details')}
                            >
                              Back to Details
                            </Button>
                          </div>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

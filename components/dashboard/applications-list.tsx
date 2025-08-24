'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  DollarSign, 
  GraduationCap, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  FileText
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Application {
  id: string
  name: string
  email: string
  phone: string | null
  message: string | null
  status: string
  appliedAt: Date
  dateOfBirth: Date | null
  nationality: string | null
  currentInstitution: string | null
  fieldOfStudy: string | null
  currentYear: string | null
  gpa: number | null
  expectedGraduation: Date | null
  intendedUniversity: string | null
  intendedProgram: string | null
  intendedCountry: string | null
  financialNeed: string | null
  achievements: string | null
  extracurricular: string | null
  workExperience: string | null
  researchExperience: string | null
  publications: string | null
  awards: string | null
  references: string | null
  motivation: string | null
  futureGoals: string | null
  additionalInfo: string | null
  scholarship: {
    id: string
    title: string
    amount: string
    amountType: string
    categories: string[]
    degreeLevels: string[]
    deadline: Date
    status: string
  }
}

interface ApplicationsListProps {
  applications: Application[]
}

export function ApplicationsList({ applications }: ApplicationsListProps) {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return 'bg-blue-100 text-blue-800'
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-800'
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'WAITLISTED':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return <FileText className="h-4 w-4" />
      case 'UNDER_REVIEW':
        return <Clock className="h-4 w-4" />
      case 'ACCEPTED':
        return <CheckCircle className="h-4 w-4" />
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />
      case 'WAITLISTED':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isDeadlineExpired = (deadline: Date) => {
    return new Date(deadline) < new Date()
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
        <p className="text-gray-600 mb-6">Start applying for scholarships to see your applications here.</p>
        <Button asChild>
          <a href="/scholarships">Browse Scholarships</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(a => a.status === 'UNDER_REVIEW').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(a => a.status === 'ACCEPTED').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(a => a.status === 'REJECTED').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((application) => (
          <Card key={application.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {application.scholarship.title}
                    </h3>
                    <Badge className={getStatusColor(application.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(application.status)}
                        {application.status.replace('_', ' ')}
                      </div>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-brand-blue" />
                      <span>{application.scholarship.amount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-brand-blue" />
                      <span>{application.scholarship.degreeLevels.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-brand-blue" />
                      <span className={isDeadlineExpired(application.scholarship.deadline) ? 'text-red-600' : ''}>
                        {formatDate(application.scholarship.deadline)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-brand-blue" />
                      <span>Applied {formatDate(application.appliedAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      {application.scholarship.categories.map(c => c.replace('_', ' ')).join(', ')}
                    </Badge>
                    {application.fieldOfStudy && (
                      <Badge variant="outline">
                        {application.fieldOfStudy}
                      </Badge>
                    )}
                    {application.gpa && (
                      <Badge variant="outline">
                        GPA: {application.gpa}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedApplication(application)
                    setShowDetails(true)
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Application Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedApplication && (
            <div>
              <DialogHeader>
                <DialogTitle>Application Details</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Scholarship Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Scholarship Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Scholarship</p>
                        <p className="text-gray-900">{selectedApplication.scholarship.title}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Amount</p>
                        <p className="text-gray-900">{selectedApplication.scholarship.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Category</p>
                        <p className="text-gray-900">{selectedApplication.scholarship.categories.map(c => c.replace('_', ' ')).join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Degree Level</p>
                        <p className="text-gray-900">{selectedApplication.scholarship.degreeLevels.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Deadline</p>
                        <p className="text-gray-900">{formatDate(selectedApplication.scholarship.deadline)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Status</p>
                        <Badge className={getStatusColor(selectedApplication.status)}>
                          {selectedApplication.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Name</p>
                        <p className="text-gray-900">{selectedApplication.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Email</p>
                        <p className="text-gray-900">{selectedApplication.email}</p>
                      </div>
                      {selectedApplication.phone && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Phone</p>
                          <p className="text-gray-900">{selectedApplication.phone}</p>
                        </div>
                      )}
                      {selectedApplication.dateOfBirth && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                          <p className="text-gray-900">{formatDate(selectedApplication.dateOfBirth)}</p>
                        </div>
                      )}
                      {selectedApplication.nationality && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Nationality</p>
                          <p className="text-gray-900">{selectedApplication.nationality}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Academic Information */}
                {(selectedApplication.currentInstitution || selectedApplication.fieldOfStudy || selectedApplication.gpa) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Academic Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedApplication.currentInstitution && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">Current Institution</p>
                            <p className="text-gray-900">{selectedApplication.currentInstitution}</p>
                          </div>
                        )}
                        {selectedApplication.fieldOfStudy && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">Field of Study</p>
                            <p className="text-gray-900">{selectedApplication.fieldOfStudy}</p>
                          </div>
                        )}
                        {selectedApplication.currentYear && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">Current Year</p>
                            <p className="text-gray-900">{selectedApplication.currentYear}</p>
                          </div>
                        )}
                        {selectedApplication.gpa && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">GPA</p>
                            <p className="text-gray-900">{selectedApplication.gpa}</p>
                          </div>
                        )}
                        {selectedApplication.expectedGraduation && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">Expected Graduation</p>
                            <p className="text-gray-900">{formatDate(selectedApplication.expectedGraduation)}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Intended Program */}
                {(selectedApplication.intendedUniversity || selectedApplication.intendedProgram || selectedApplication.intendedCountry) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Intended Program</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedApplication.intendedUniversity && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">Intended University</p>
                            <p className="text-gray-900">{selectedApplication.intendedUniversity}</p>
                          </div>
                        )}
                        {selectedApplication.intendedProgram && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">Intended Program</p>
                            <p className="text-gray-900">{selectedApplication.intendedProgram}</p>
                          </div>
                        )}
                        {selectedApplication.intendedCountry && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">Intended Country</p>
                            <p className="text-gray-900">{selectedApplication.intendedCountry}</p>
                          </div>
                        )}
                        {selectedApplication.financialNeed && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">Financial Need</p>
                            <p className="text-gray-900">{selectedApplication.financialNeed}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Additional Information */}
                {(selectedApplication.achievements || selectedApplication.motivation || selectedApplication.futureGoals) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Additional Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedApplication.achievements && (
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-2">Achievements</p>
                            <p className="text-gray-900 whitespace-pre-wrap">{selectedApplication.achievements}</p>
                          </div>
                        )}
                        {selectedApplication.motivation && (
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-2">Motivation</p>
                            <p className="text-gray-900 whitespace-pre-wrap">{selectedApplication.motivation}</p>
                          </div>
                        )}
                        {selectedApplication.futureGoals && (
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-2">Future Goals</p>
                            <p className="text-gray-900 whitespace-pre-wrap">{selectedApplication.futureGoals}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

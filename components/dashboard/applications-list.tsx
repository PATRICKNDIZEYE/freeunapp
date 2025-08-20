'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  CheckCircle,
  XCircle,
  Clock,
  User,
  GraduationCap,
  Calendar,
  Mail
} from 'lucide-react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'

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
    title: string
    category: string
    degreeLevel: string
  }
}

interface ApplicationsListProps {
  applications: Application[]
}

export function ApplicationsList({ applications }: ApplicationsListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [scholarshipFilter, setScholarshipFilter] = useState('all')
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  const filteredApplications = applications.filter(application => {
    const matchesSearch = 
      application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.scholarship.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter
    const matchesScholarship = scholarshipFilter === 'all' || application.scholarship.title === scholarshipFilter
    
    return matchesSearch && matchesStatus && matchesScholarship
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLIED': return 'bg-yellow-100 text-yellow-800'
      case 'ACCEPTED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800'
      case 'WAITLISTED': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPLIED': return <Clock className="h-4 w-4" />
      case 'ACCEPTED': return <CheckCircle className="h-4 w-4" />
      case 'REJECTED': return <XCircle className="h-4 w-4" />
      case 'UNDER_REVIEW': return <Eye className="h-4 w-4" />
      case 'WAITLISTED': return <Clock className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        // Refresh the page to show updated data
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating application status:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, or scholarship..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter('all')}>
              All Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('APPLIED')}>
              Applied
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('UNDER_REVIEW')}>
              Under Review
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('ACCEPTED')}>
              Accepted
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('REJECTED')}>
              Rejected
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('WAITLISTED')}>
              Waitlisted
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Scholarship
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setScholarshipFilter('all')}>
              All Scholarships
            </DropdownMenuItem>
            {Array.from(new Set(applications.map(app => app.scholarship.title))).map(title => (
              <DropdownMenuItem key={title} onClick={() => setScholarshipFilter(title)}>
                {title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {filteredApplications.length} Application{filteredApplications.length !== 1 ? 's' : ''} Found
        </h2>
        {(searchTerm || statusFilter !== 'all' || scholarshipFilter !== 'all') && (
          <div className="text-sm text-gray-500">
            Filtered results
          </div>
        )}
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApplications.map((application) => (
          <Card key={application.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold line-clamp-2 mb-2">
                    {application.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={getStatusColor(application.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(application.status)}
                        {application.status}
                      </div>
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelectedApplication(application)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(application.id, 'ACCEPTED')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(application.id, 'REJECTED')}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="h-4 w-4" />
                <span>{application.email}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <GraduationCap className="h-4 w-4" />
                <span>{application.scholarship.title}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
              </div>

              {application.motivation && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  "{application.motivation}"
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Application Details Modal */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-2xl">
          {selectedApplication && (
            <div className="p-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Application Details
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {selectedApplication.name}</p>
                      <p><strong>Email:</strong> {selectedApplication.email}</p>
                      {selectedApplication.phone && <p><strong>Phone:</strong> {selectedApplication.phone}</p>}
                      <p><strong>Applied:</strong> {new Date(selectedApplication.appliedAt).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> 
                        <Badge className={`ml-2 ${getStatusColor(selectedApplication.status)}`}>
                          {selectedApplication.status}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Scholarship Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Scholarship:</strong> {selectedApplication.scholarship.title}</p>
                      <p><strong>Category:</strong> {selectedApplication.scholarship.category}</p>
                      <p><strong>Degree Level:</strong> {selectedApplication.scholarship.degreeLevel}</p>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                {(selectedApplication.dateOfBirth || selectedApplication.nationality) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                    <div className="space-y-2 text-sm">
                      {selectedApplication.dateOfBirth && <p><strong>Date of Birth:</strong> {new Date(selectedApplication.dateOfBirth).toLocaleDateString()}</p>}
                      {selectedApplication.nationality && <p><strong>Nationality:</strong> {selectedApplication.nationality}</p>}
                    </div>
                  </div>
                )}

                {/* Academic Information */}
                {(selectedApplication.currentInstitution || selectedApplication.fieldOfStudy || selectedApplication.currentYear || selectedApplication.gpa || selectedApplication.expectedGraduation) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Academic Information</h3>
                    <div className="space-y-2 text-sm">
                      {selectedApplication.currentInstitution && <p><strong>Current Institution:</strong> {selectedApplication.currentInstitution}</p>}
                      {selectedApplication.fieldOfStudy && <p><strong>Field of Study:</strong> {selectedApplication.fieldOfStudy}</p>}
                      {selectedApplication.currentYear && <p><strong>Current Year:</strong> {selectedApplication.currentYear}</p>}
                      {selectedApplication.gpa && <p><strong>GPA:</strong> {selectedApplication.gpa}</p>}
                      {selectedApplication.expectedGraduation && <p><strong>Expected Graduation:</strong> {new Date(selectedApplication.expectedGraduation).toLocaleDateString()}</p>}
                    </div>
                  </div>
                )}

                {/* Intended Program */}
                {(selectedApplication.intendedUniversity || selectedApplication.intendedProgram || selectedApplication.intendedCountry || selectedApplication.financialNeed) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Intended Program</h3>
                    <div className="space-y-2 text-sm">
                      {selectedApplication.intendedUniversity && <p><strong>Intended University:</strong> {selectedApplication.intendedUniversity}</p>}
                      {selectedApplication.intendedProgram && <p><strong>Intended Program:</strong> {selectedApplication.intendedProgram}</p>}
                      {selectedApplication.intendedCountry && <p><strong>Intended Country:</strong> {selectedApplication.intendedCountry}</p>}
                      {selectedApplication.financialNeed && <p><strong>Financial Need:</strong> {selectedApplication.financialNeed}</p>}
                    </div>
                  </div>
                )}

                {/* Achievements and Experience */}
                {(selectedApplication.achievements || selectedApplication.extracurricular || selectedApplication.workExperience || selectedApplication.researchExperience || selectedApplication.publications || selectedApplication.awards || selectedApplication.references) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Achievements and Experience</h3>
                    <div className="space-y-2 text-sm">
                      {selectedApplication.achievements && <p><strong>Achievements:</strong> {selectedApplication.achievements}</p>}
                      {selectedApplication.extracurricular && <p><strong>Extracurricular Activities:</strong> {selectedApplication.extracurricular}</p>}
                      {selectedApplication.workExperience && <p><strong>Work Experience:</strong> {selectedApplication.workExperience}</p>}
                      {selectedApplication.researchExperience && <p><strong>Research Experience:</strong> {selectedApplication.researchExperience}</p>}
                      {selectedApplication.publications && <p><strong>Publications:</strong> {selectedApplication.publications}</p>}
                      {selectedApplication.awards && <p><strong>Awards:</strong> {selectedApplication.awards}</p>}
                      {selectedApplication.references && <p><strong>References:</strong> {selectedApplication.references}</p>}
                    </div>
                  </div>
                )}

                {/* Motivation and Goals */}
                {(selectedApplication.motivation || selectedApplication.futureGoals || selectedApplication.additionalInfo) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Motivation and Goals</h3>
                    <div className="space-y-2 text-sm">
                      {selectedApplication.motivation && <p><strong>Motivation:</strong> {selectedApplication.motivation}</p>}
                      {selectedApplication.futureGoals && <p><strong>Future Goals:</strong> {selectedApplication.futureGoals}</p>}
                      {selectedApplication.additionalInfo && <p><strong>Additional Information:</strong> {selectedApplication.additionalInfo}</p>}
                    </div>
                  </div>
                )}

                {/* Message */}
                {selectedApplication.message && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Message</h3>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedApplication.message}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t">
                  <Button 
                    onClick={() => handleStatusUpdate(selectedApplication.id, 'ACCEPTED')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept Application
                  </Button>
                  <Button 
                    onClick={() => handleStatusUpdate(selectedApplication.id, 'REJECTED')}
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Application
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedApplication(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

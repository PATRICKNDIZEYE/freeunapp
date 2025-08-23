'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  GraduationCap, 
  MapPin, 
  Award, 
  BookOpen,
  Target,
  FileText,
  X,
  Download,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

interface Application {
  id: string
  name: string
  email: string
  phone: string | null
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
  status: string
  appliedAt: Date
}

interface ApplicationDetailModalProps {
  application: Application | null
  isOpen: boolean
  onClose: () => void
}

export function ApplicationDetailModal({ application, isOpen, onClose }: ApplicationDetailModalProps) {
  if (!application) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />
      case 'APPROVED': return <CheckCircle className="h-4 w-4" />
      case 'REJECTED': return <AlertCircle className="h-4 w-4" />
      case 'UNDER_REVIEW': return <FileText className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Application Details
            </DialogTitle>
            
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h2 className="text-xl font-semibold">{application.name}</h2>
              <p className="text-gray-600">{application.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(application.status)}>
                {getStatusIcon(application.status)}
                <span className="ml-1">{application.status.replace('_', ' ')}</span>
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">{application.email}</span>
                </div>
                {application.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{application.phone}</span>
                  </div>
                )}
                                 {application.dateOfBirth && (
                   <div className="flex items-center gap-2">
                     <Calendar className="h-4 w-4 text-gray-400" />
                     <span className="text-sm font-medium">
                       Date of Birth: {new Date(application.dateOfBirth).toLocaleDateString()}
                     </span>
                   </div>
                 )}
                                 {application.nationality && (
                   <div className="flex items-center gap-2">
                     <MapPin className="h-4 w-4 text-gray-400" />
                     <span className="text-sm font-medium">Nationality: {application.nationality}</span>
                   </div>
                 )}
              </CardContent>
            </Card>

            {/* Academic Background */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Academic Background
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                                 {application.currentInstitution && (
                   <div>
                     <span className="text-sm text-gray-500">Current Institution</span>
                     <p className="font-medium">{application.currentInstitution}</p>
                   </div>
                 )}
                 {application.fieldOfStudy && (
                   <div>
                     <span className="text-sm text-gray-500">Field of Study</span>
                     <p className="font-medium">{application.fieldOfStudy}</p>
                   </div>
                 )}
                 {application.currentYear && (
                   <div>
                     <span className="text-sm text-gray-500">Current Year</span>
                     <p className="font-medium">{application.currentYear}</p>
                   </div>
                 )}
                {application.gpa && (
                  <div>
                    <span className="text-sm text-gray-500">GPA</span>
                    <p className="font-medium">{application.gpa}</p>
                  </div>
                )}
                {application.expectedGraduation && (
                  <div>
                    <span className="text-sm text-gray-500">Expected Graduation</span>
                    <p className="font-medium">{new Date(application.expectedGraduation).toLocaleDateString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Intended Program */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Intended Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                                 {application.intendedUniversity && (
                   <div>
                     <span className="text-sm text-gray-500">Intended University</span>
                     <p className="font-medium">{application.intendedUniversity}</p>
                   </div>
                 )}
                 {application.intendedProgram && (
                   <div>
                     <span className="text-sm text-gray-500">Intended Program</span>
                     <p className="font-medium">{application.intendedProgram}</p>
                   </div>
                 )}
                 {application.intendedCountry && (
                   <div>
                     <span className="text-sm text-gray-500">Intended Country</span>
                     <p className="font-medium">{application.intendedCountry}</p>
                   </div>
                 )}
                {application.financialNeed && (
                  <div>
                    <span className="text-sm text-gray-500">Financial Need</span>
                    <p className="text-sm">{application.financialNeed}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Achievements & Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements & Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {application.achievements && (
                  <div>
                    <span className="text-sm text-gray-500">Achievements</span>
                    <p className="text-sm">{application.achievements}</p>
                  </div>
                )}
                {application.extracurricular && (
                  <div>
                    <span className="text-sm text-gray-500">Extracurricular Activities</span>
                    <p className="text-sm">{application.extracurricular}</p>
                  </div>
                )}
                {application.workExperience && (
                  <div>
                    <span className="text-sm text-gray-500">Work Experience</span>
                    <p className="text-sm">{application.workExperience}</p>
                  </div>
                )}
                {application.researchExperience && (
                  <div>
                    <span className="text-sm text-gray-500">Research Experience</span>
                    <p className="text-sm">{application.researchExperience}</p>
                  </div>
                )}
                {application.publications && (
                  <div>
                    <span className="text-sm text-gray-500">Publications</span>
                    <p className="text-sm">{application.publications}</p>
                  </div>
                )}
                {application.awards && (
                  <div>
                    <span className="text-sm text-gray-500">Awards & Recognition</span>
                    <p className="text-sm">{application.awards}</p>
                  </div>
                )}
                {application.references && (
                  <div>
                    <span className="text-sm text-gray-500">References</span>
                    <p className="text-sm">{application.references}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Motivation & Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Motivation & Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                             {application.motivation && (
                 <div>
                   <span className="text-sm text-gray-500 font-medium">Motivation Statement</span>
                   <p className="mt-2 text-sm leading-relaxed">{application.motivation}</p>
                 </div>
               )}
              {application.futureGoals && (
                <div>
                  <span className="text-sm text-gray-500 font-medium">Future Goals</span>
                  <p className="mt-2 text-sm leading-relaxed">{application.futureGoals}</p>
                </div>
              )}
              {application.additionalInfo && (
                <div>
                  <span className="text-sm text-gray-500 font-medium">Additional Information</span>
                  <p className="mt-2 text-sm leading-relaxed">{application.additionalInfo}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Application Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Application Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Applied On</span>
                  <p className="font-medium">{new Date(application.appliedAt).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Application ID</span>
                  <p className="font-medium font-mono text-sm">{application.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

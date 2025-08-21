'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  TrendingUp,
  Award,
  User,
  Mail,
  Phone,
  GraduationCap
} from 'lucide-react'

interface Application {
  id: string
  status: string
  appliedAt: Date
  scholarship: {
    id: string
    title: string
    amount: string
    category: string
    degreeLevel: string
    deadline: Date
  }
}

interface ApplicationProgressProps {
  applications: Application[]
}

export function ApplicationProgress({ applications }: ApplicationProgressProps) {
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

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return 25
      case 'UNDER_REVIEW':
        return 50
      case 'WAITLISTED':
        return 75
      case 'ACCEPTED':
        return 100
      case 'REJECTED':
        return 100
      default:
        return 0
    }
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return 'bg-blue-500'
      case 'UNDER_REVIEW':
        return 'bg-yellow-500'
      case 'WAITLISTED':
        return 'bg-purple-500'
      case 'ACCEPTED':
        return 'bg-green-500'
      case 'REJECTED':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return 'Application submitted successfully'
      case 'UNDER_REVIEW':
        return 'Your application is being reviewed'
      case 'ACCEPTED':
        return 'Congratulations! Your application was accepted'
      case 'REJECTED':
        return 'Application was not selected'
      case 'WAITLISTED':
        return 'You are on the waitlist'
      default:
        return 'Application status unknown'
    }
  }

  // Calculate statistics
  const totalApplications = applications.length
  const appliedCount = applications.filter(a => a.status === 'APPLIED').length
  const underReviewCount = applications.filter(a => a.status === 'UNDER_REVIEW').length
  const acceptedCount = applications.filter(a => a.status === 'ACCEPTED').length
  const rejectedCount = applications.filter(a => a.status === 'REJECTED').length
  const waitlistedCount = applications.filter(a => a.status === 'WAITLISTED').length

  const acceptanceRate = totalApplications > 0 ? (acceptedCount / totalApplications) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Overall Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
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
                <p className="text-2xl font-bold text-gray-900">{acceptedCount}</p>
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
                <p className="text-2xl font-bold text-gray-900">{underReviewCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{acceptanceRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Progress Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-blue" />
            Application Progress Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600">Start applying for scholarships to see your progress here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map((application) => (
                <div key={application.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {application.scholarship.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          {application.scholarship.amount}
                        </span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          {application.scholarship.degreeLevel}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Applied {formatDate(application.appliedAt)}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(application.status)}
                        {application.status.replace('_', ' ')}
                      </div>
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Application Progress</span>
                      <span>{getProgressValue(application.status)}%</span>
                    </div>
                    <Progress 
                      value={getProgressValue(application.status)} 
                      className="h-2"
                    />
                  </div>

                  {/* Status Description */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {application.status.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {getStatusDescription(application.status)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Steps */}
                  <div className="mt-4">
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        getProgressValue(application.status) >= 25 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-gray-600">Applied</span>
                      
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        getProgressValue(application.status) >= 50 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        <Clock className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-gray-600">Under Review</span>
                      
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        getProgressValue(application.status) >= 75 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        <AlertCircle className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-gray-600">Decision</span>
                      
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        getProgressValue(application.status) >= 100 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        <Award className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-gray-600">Final</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-blue" />
            Application Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{appliedCount}</div>
              <div className="text-sm text-gray-600">Applied</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{underReviewCount}</div>
              <div className="text-sm text-gray-600">Under Review</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{waitlistedCount}</div>
              <div className="text-sm text-gray-600">Waitlisted</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{acceptedCount}</div>
              <div className="text-sm text-gray-600">Accepted</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

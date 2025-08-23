'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Bookmark, 
  Bell,
  Search,
  User,
  TrendingUp,
  Calendar,
  DollarSign,
  GraduationCap,
  AlertCircle,
  Star,
  Eye,
  Heart,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface User {
  id: string
  name: string | null
  email: string
  fieldOfStudy: string | null
  degreeLevel: string | null
  profileComplete: boolean
}

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
    status: string
  }
}

interface SavedScholarship {
  id: string
  savedAt: Date
  scholarship: {
    id: string
    title: string
    amount: string
    category: string
    degreeLevel: string
    deadline: Date
  }
}

interface Notification {
  id: string
  message: string
  type: string
  createdAt: Date
  read: boolean
}

interface Scholarship {
  id: string
  title: string
  description: string
  amount: string
  category: string
  degreeLevel: string
  deadline: Date
  views: number
}

interface StudentDashboardProps {
  user: User
  applications: Application[]
  savedScholarships: SavedScholarship[]
  notifications: Notification[]
  recommendedScholarships: Scholarship[]
  applicationStats: {
    total: number
    applied: number
    underReview: number
    accepted: number
    rejected: number
  }
  profileCompletion: number
}

export function StudentDashboard({
  user,
  applications,
  savedScholarships,
  notifications,
  recommendedScholarships,
  applicationStats,
  profileCompletion
}: StudentDashboardProps) {

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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const isDeadlineClose = (deadline: Date) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  const isDeadlineExpired = (deadline: Date) => {
    return new Date(deadline) < new Date()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name || 'Student'}! 👋
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Here's your scholarship application overview and personalized recommendations.
        </p>
      </div>

      {/* Profile Completion Alert */}
      {profileCompletion < 100 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <User className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 mb-2">
                  Complete Your Profile ({profileCompletion}%)
                </h3>
                <p className="text-orange-700 text-sm mb-3">
                  A complete profile helps us recommend better scholarships for you.
                </p>
                <Progress value={profileCompletion} className="mb-3" />
                <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700">
                  <Link href="/dashboard/profile">Complete Profile</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{applicationStats.total}</p>
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
                <p className="text-2xl font-bold text-gray-900">{applicationStats.underReview}</p>
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
                <p className="text-2xl font-bold text-gray-900">{applicationStats.accepted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bookmark className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Saved</p>
                <p className="text-2xl font-bold text-gray-900">{savedScholarships.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Bell className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Notifications</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-brand-blue" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                <Button asChild className="h-auto p-4 flex-col gap-2 bg-brand-blue hover:bg-blue-700 text-white">
                  <Link href="/scholarships">
                    <Search className="h-5 w-5" />
                    <span className="text-sm">Browse Scholarships</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Link href="/dashboard/applications">
                    <FileText className="h-5 w-5" />
                    <span className="text-sm">My Applications</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Link href="/dashboard/saved">
                    <Bookmark className="h-5 w-5" />
                    <span className="text-sm">Saved</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Link href="/dashboard/profile">
                    <User className="h-5 w-5" />
                    <span className="text-sm">Profile</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-brand-blue" />
                  Recent Applications
                </CardTitle>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/applications">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-600 mb-4">Start applying for scholarships to see them here.</p>
                  <Button asChild>
                    <Link href="/scholarships">Browse Scholarships</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {application.scholarship.title}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {application.scholarship.amount}
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommended Scholarships */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-brand-blue" />
                  Recommended for You
                </CardTitle>
                <Button asChild variant="outline" size="sm">
                  <Link href="/scholarships">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recommendedScholarships.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
                  <p className="text-gray-600 mb-4">Complete your profile to get personalized recommendations.</p>
                  <Button asChild>
                    <Link href="/dashboard/profile">Complete Profile</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedScholarships.slice(0, 4).map((scholarship) => (
                    <div key={scholarship.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 line-clamp-2 flex-1">
                          {scholarship.title}
                        </h4>
                        <div className="flex gap-1 ml-2">
                          <Button variant="ghost" size="sm" className="p-1">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <DollarSign className="h-4 w-4" />
                        <span>{scholarship.amount}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {scholarship.category.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {scholarship.degreeLevel}
                        </Badge>
                        {isDeadlineClose(scholarship.deadline) && (
                          <Badge className="bg-orange-100 text-orange-800 text-xs">
                            Deadline Soon
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Deadline: {formatDate(scholarship.deadline)}
                        </span>
                        <Button asChild size="sm">
                          <Link href={`/scholarships/${scholarship.id}`}>
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Apply
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-brand-blue" />
                  Notifications
                </CardTitle>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/notifications">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <div className="text-center py-6">
                  <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No new notifications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Saved Scholarships */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-brand-blue" />
                  Recently Saved
                </CardTitle>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/saved">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {savedScholarships.length === 0 ? (
                <div className="text-center py-6">
                  <Bookmark className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No saved scholarships</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedScholarships.map((saved) => (
                    <div key={saved.id} className="p-3 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                        {saved.scholarship.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{saved.scholarship.amount}</span>
                        <span>{formatDate(saved.savedAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-brand-blue" />
                Profile Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="text-sm text-gray-900">{user.name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Field of Study</p>
                <p className="text-sm text-gray-900">{user.fieldOfStudy || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Degree Level</p>
                <p className="text-sm text-gray-900">{user.degreeLevel || 'Not provided'}</p>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/dashboard/profile">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  CheckCircle, 
  XCircle,
  Edit,
  Trash2,
  GraduationCap,
  FileText,
  Bookmark,
  Clock,
  DollarSign,
  Award
} from 'lucide-react'
import Link from 'next/link'

interface UserDetailViewProps {
  user: {
    id: string
    email: string
    name: string | null
    role: string
    approved: boolean
    profileComplete: boolean
    createdAt: Date
    updatedAt: Date
      _count: {
    savedScholarships: number
    scholarships: number
  }
    savedScholarships: Array<{
      id: string
      savedAt: Date
      scholarship: {
        id: string
        title: string
        amount: string
        deadline: Date
      }
    }>
    scholarships: Array<{
      id: string
      title: string
      amount: string
      status: string
      createdAt: Date
    }>
    
  }
}

export function UserDetailView({ user }: UserDetailViewProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800'
      case 'STUDENT': return 'bg-blue-100 text-blue-800'
      case 'SUPER_ADMIN': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Shield className="h-4 w-4" />
      case 'STUDENT': return <User className="h-4 w-4" />
      case 'SUPER_ADMIN': return <Shield className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'EXPIRED': return 'bg-red-100 text-red-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* User Information */}
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{user.name || 'No Name'}</h3>
                <p className="text-gray-500">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getRoleColor(user.role)}>
                    <div className="flex items-center gap-1">
                      {getRoleIcon(user.role)}
                      {user.role}
                    </div>
                  </Badge>
                  {user.approved ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approved
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <XCircle className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Member since:</span>
                <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-500">Last updated:</span>
                <p className="font-medium">{new Date(user.updatedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-500">Profile complete:</span>
                <p className="font-medium">{user.profileComplete ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <span className="text-gray-500">Email verified:</span>
                <p className="font-medium">Yes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{user._count.savedScholarships}</div>
                <div className="text-sm text-gray-600">Saved Scholarships</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{user._count.scholarships}</div>
                <div className="text-sm text-gray-600">Created Scholarships</div>
              </div>

            </div>
          </CardContent>
        </Card>



        {/* Created Scholarships */}
        {user.scholarships.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Created Scholarships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user.scholarships.map((scholarship) => (
                  <div key={scholarship.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{scholarship.title}</p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(scholarship.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(scholarship.status)}>
                        {scholarship.status}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        {scholarship.amount}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Saved Scholarships */}
        {user.savedScholarships.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="h-5 w-5" />
                Saved Scholarships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user.savedScholarships.map((saved) => (
                  <div key={saved.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{saved.scholarship.title}</p>
                      <p className="text-sm text-gray-500">
                        Saved: {new Date(saved.savedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        {saved.scholarship.amount}
                      </Badge>
                      <Badge className="bg-orange-100 text-orange-800">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(saved.scholarship.deadline).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Link href={`/dashboard/users/${user.id}/edit`}>
              <Button variant="outline" className="w-full justify-start">
                <Edit className="h-4 w-4 mr-2" />
                Edit User
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Change Role
            </Button>
            <Button variant="outline" className="w-full justify-start">
              {user.approved ? (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Revoke Approval
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve User
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Profile updated {new Date(user.updatedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>

            {user._count.scholarships > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>{user._count.scholarships} scholarships created</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Status */}
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Role</span>
              <Badge className={getRoleColor(user.role)}>
                {user.role}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Approval</span>
              <Badge className={user.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                {user.approved ? 'Approved' : 'Pending'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Profile</span>
              <Badge className={user.profileComplete ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {user.profileComplete ? 'Complete' : 'Incomplete'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

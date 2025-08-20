'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Trash2, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  User,
  FileText,
  GraduationCap,
  Calendar,
  Mail
} from 'lucide-react'

interface Scholarship {
  id: string
  title: string
  description: string
  status: string
  approvalStatus: string
  createdAt: Date
  admin: {
    name: string | null
    email: string
  }
  _count: {
    applications: number
    savedBy: number
  }
}

interface Resource {
  id: string
  title: string
  description: string | null
  fileUrl: string
  createdAt: Date
  admin: {
    name: string | null
    email: string
  }
}

interface User {
  id: string
  name: string | null
  email: string
  role: string
  approved: boolean
  createdAt: Date
}

interface ContentModerationProps {
  scholarships: Scholarship[]
  resources: Resource[]
  users: User[]
}

export function ContentModeration({ scholarships, resources, users }: ContentModerationProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDeleteScholarship = async (scholarshipId: string) => {
    if (!confirm('Are you sure you want to delete this scholarship? This action cannot be undone.')) {
      return
    }

    setIsDeleting(scholarshipId)
    try {
      const response = await fetch(`/api/scholarships/${scholarshipId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('Failed to delete scholarship')
      }
    } catch (error) {
      console.error('Error deleting scholarship:', error)
      alert('Error deleting scholarship')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      return
    }

    setIsDeleting(resourceId)
    try {
      const response = await fetch(`/api/resources/${resourceId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('Failed to delete resource')
      }
    } catch (error) {
      console.error('Error deleting resource:', error)
      alert('Error deleting resource')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleToggleUserApproval = async (userId: string, approved: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved })
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('Failed to update user approval status')
      }
    } catch (error) {
      console.error('Error updating user approval:', error)
      alert('Error updating user approval')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'INACTIVE': return 'bg-gray-100 text-gray-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getApprovalColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Tabs defaultValue="scholarships" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="scholarships" className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          Scholarships ({scholarships.length})
        </TabsTrigger>
        <TabsTrigger value="resources" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Resources ({resources.length})
        </TabsTrigger>
        <TabsTrigger value="users" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Users ({users.length})
        </TabsTrigger>
        <TabsTrigger value="reports" className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Reports
        </TabsTrigger>
      </TabsList>

      <TabsContent value="scholarships" className="space-y-4">
        <div className="grid gap-4">
          {scholarships.map((scholarship) => (
            <Card key={scholarship.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{scholarship.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getStatusColor(scholarship.status)}>
                        {scholarship.status}
                      </Badge>
                      <Badge className={getApprovalColor(scholarship.approvalStatus)}>
                        {scholarship.approvalStatus}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteScholarship(scholarship.id)}
                      disabled={isDeleting === scholarship.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Posted by:</span>
                    <p className="font-medium">{scholarship.admin.name || scholarship.admin.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <p>{new Date(scholarship.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Applications:</span>
                    <p>{scholarship._count.applications}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Saved:</span>
                    <p>{scholarship._count.savedBy}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {scholarship.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="resources" className="space-y-4">
        <div className="grid gap-4">
          {resources.map((resource) => (
            <Card key={resource.id} className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteResource(resource.id)}
                      disabled={isDeleting === resource.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Posted by:</span>
                    <p className="font-medium">{resource.admin.name || resource.admin.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <p>{new Date(resource.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">File:</span>
                    <p className="truncate">{resource.fileUrl}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {resource.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="users" className="space-y-4">
        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id} className="border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{user.name || 'No Name'}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{user.role}</Badge>
                      <Badge className={user.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {user.approved ? 'Approved' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={user.approved ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleToggleUserApproval(user.id, !user.approved)}
                    >
                      {user.approved ? (
                        <>
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Joined:</span>
                    <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <p>{user.approved ? 'Active' : 'Pending Approval'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="reports" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Content Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No content reports at this time</p>
              <p className="text-sm text-gray-500 mt-2">
                Reports from users will appear here for review
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

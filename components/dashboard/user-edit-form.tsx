'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Save, 
  User, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Lock,
  Unlock,
  Calendar,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import { toast } from 'sonner'
import { InlineLoader } from '@/components/ui/loader'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  approved: boolean
  profileComplete: boolean
  createdAt: Date
  _count: {
    savedScholarships: number
    scholarships: number
  }
}

interface UserEditFormProps {
  user: User
}

export function UserEditForm({ user }: UserEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email,
    role: user.role,
    approved: user.approved,
    blocked: false // We'll add this to the database schema
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('User updated successfully!')
        router.push('/dashboard/users')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBlockUser = async () => {
    if (!confirm('Are you sure you want to block this user? They will not be able to access the platform.')) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/users/${user.id}/block`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        toast.success('User blocked successfully!')
        router.push('/dashboard/users')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to block user')
      }
    } catch (error) {
      console.error('Error blocking user:', error)
      toast.error('Failed to block user')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnblockUser = async () => {
    if (!confirm('Are you sure you want to unblock this user? They will be able to access the platform again.')) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/users/${user.id}/unblock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        toast.success('User unblocked successfully!')
        router.push('/dashboard/users')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to unblock user')
      }
    } catch (error) {
      console.error('Error unblocking user:', error)
      toast.error('Failed to unblock user')
    } finally {
      setIsLoading(false)
    }
  }

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

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Role and Permissions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role & Permissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">User Role</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">Student</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="approved"
                checked={formData.approved}
                onCheckedChange={(checked) => handleInputChange('approved', checked)}
              />
              <Label htmlFor="approved">Approved</Label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={getRoleColor(formData.role)}>
              <div className="flex items-center gap-1">
                {getRoleIcon(formData.role)}
                {formData.role}
              </div>
            </Badge>
            {formData.approved ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Approved
              </Badge>
            ) : (
              <Badge className="bg-yellow-100 text-yellow-800">
                <XCircle className="h-3 w-3 mr-1" />
                Pending Approval
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Statistics Card */}
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

      {/* Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <InlineLoader size="sm" />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            
            {formData.blocked ? (
              <Button 
                onClick={handleUnblockUser} 
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                <Unlock className="h-4 w-4 mr-2" />
                Unblock User
              </Button>
            ) : (
              <Button 
                onClick={handleBlockUser} 
                disabled={isLoading}
                variant="destructive"
                className="flex-1"
              >
                <Lock className="h-4 w-4 mr-2" />
                Block User
              </Button>
            )}
          </div>

          {formData.role === 'ADMIN' && !formData.approved && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This admin user is pending approval. They cannot access admin features until approved.
              </AlertDescription>
            </Alert>
          )}

          {formData.role === 'SUPER_ADMIN' && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Super Admin users have full system access. Be careful when modifying their permissions.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

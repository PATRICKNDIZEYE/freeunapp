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
  Edit, 
  Trash2, 
  Eye,
  User,
  Shield,
  CheckCircle,
  XCircle,
  Calendar,
  Lock
} from 'lucide-react'
import Link from 'next/link'

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

interface UsersListProps {
  users: User[]
}

export function UsersList({ users }: UsersListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [profileFilter, setProfileFilter] = useState('all')
  const [approvingUsers, setApprovingUsers] = useState<Set<string>>(new Set())
  const [revokingUsers, setRevokingUsers] = useState<Set<string>>(new Set())
  const [deletingUsers, setDeletingUsers] = useState<Set<string>>(new Set())
  const [blockingUsers, setBlockingUsers] = useState<Set<string>>(new Set())

  const handleApproveUser = async (userId: string) => {
    if (!confirm('Are you sure you want to approve this admin user?')) {
      return
    }

    setApprovingUsers(prev => new Set(prev).add(userId))

    try {
      const response = await fetch(`/api/users/${userId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        alert('User approved successfully!')
        // Refresh the page to show updated status
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to approve user')
      }
    } catch (error) {
      console.error('Error approving user:', error)
      alert('Failed to approve user')
    } finally {
      setApprovingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const handleRevokeUser = async (userId: string) => {
    if (!confirm('Are you sure you want to revoke this admin user? This will prevent them from accessing admin features.')) {
      return
    }

    setRevokingUsers(prev => new Set(prev).add(userId))

    try {
      const response = await fetch(`/api/users/${userId}/revoke`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        alert('User revoked successfully!')
        // Refresh the page to show updated status
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to revoke user')
      }
    } catch (error) {
      console.error('Error revoking user:', error)
      alert('Failed to revoke user')
    } finally {
      setRevokingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone and will remove all their data.')) {
      return
    }

    setDeletingUsers(prev => new Set(prev).add(userId))

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        alert('User deleted successfully!')
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    } finally {
      setDeletingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const handleBlockUser = async (userId: string) => {
    if (!confirm('Are you sure you want to block this user? They will not be able to access the platform.')) {
      return
    }

    setBlockingUsers(prev => new Set(prev).add(userId))

    try {
      const response = await fetch(`/api/users/${userId}/block`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        alert('User blocked successfully!')
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to block user')
      }
    } catch (error) {
      console.error('Error blocking user:', error)
      alert('Failed to block user')
    } finally {
      setBlockingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'approved' && user.approved) ||
                         (statusFilter === 'pending' && !user.approved)
    const matchesProfile = profileFilter === 'all' || 
                          (profileFilter === 'complete' && user.profileComplete) ||
                          (profileFilter === 'incomplete' && !user.profileComplete)
    return matchesSearch && matchesRole && matchesStatus && matchesProfile
  })

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
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Role
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setRoleFilter('all')}>
              All Roles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter('STUDENT')}>
              Students
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter('ADMIN')}>
              Admins
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
            <DropdownMenuItem onClick={() => setStatusFilter('approved')}>
              Approved
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
              Pending
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Profile
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setProfileFilter('all')}>
              All Profiles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setProfileFilter('complete')}>
              Complete
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setProfileFilter('incomplete')}>
              Incomplete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {filteredUsers.length} User{filteredUsers.length !== 1 ? 's' : ''} Found
        </h2>
        {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all' || profileFilter !== 'all') && (
          <div className="text-sm text-gray-500">
            Filtered results
          </div>
        )}
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-blue-700 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {user.name || 'No Name'}
                      </CardTitle>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/users/${user.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/users/${user.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit User
                      </Link>
                    </DropdownMenuItem>
                    {!user.approved && user.role === 'ADMIN' && (
                      <DropdownMenuItem 
                        onClick={() => handleApproveUser(user.id)}
                        className="text-green-600"
                        disabled={approvingUsers.has(user.id)}
                      >
                        {approvingUsers.has(user.id) ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent mr-2" />
                            Approving...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Admin
                          </>
                        )}
                      </DropdownMenuItem>
                    )}
                    {user.approved && user.role === 'ADMIN' && (
                      <DropdownMenuItem 
                        onClick={() => handleRevokeUser(user.id)}
                        className="text-red-600"
                        disabled={revokingUsers.has(user.id)}
                      >
                        {revokingUsers.has(user.id) ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent mr-2" />
                            Revoking...
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Revoke Admin
                          </>
                        )}
                      </DropdownMenuItem>
                    )}
                    {user.role !== 'SUPER_ADMIN' && (
                      <DropdownMenuItem 
                        onClick={() => handleBlockUser(user.id)}
                        className="text-orange-600"
                        disabled={blockingUsers.has(user.id)}
                      >
                        {blockingUsers.has(user.id) ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-600 border-t-transparent mr-2" />
                            Blocking...
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Block User
                          </>
                        )}
                      </DropdownMenuItem>
                    )}
                    {user.role !== 'SUPER_ADMIN' && (
                      <DropdownMenuItem 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600"
                        disabled={deletingUsers.has(user.id)}
                      >
                        {deletingUsers.has(user.id) ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent mr-2" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </>
                        )}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-green-600">
                    {user._count.savedScholarships}
                  </div>
                  <div className="text-xs text-gray-500">Saved</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-purple-600">
                    {user._count.scholarships}
                  </div>
                  <div className="text-xs text-gray-500">Created</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-xs">
                  {user.profileComplete ? 'Profile Complete' : 'Profile Incomplete'}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No users found</div>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

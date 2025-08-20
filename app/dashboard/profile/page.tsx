'use client'

import { useState } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard/nav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Save, 
  Camera,
  Bell,
  Lock,
  Globe
} from 'lucide-react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@freeunapp.com',
    bio: 'Administrator at FreeUnApp, helping students find their perfect scholarship opportunities.',
    location: 'Global',
    website: 'https://freeunapp.com'
  })

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <DashboardNav user={{
        id: '1',
        email: 'admin@freeunapp.com',
        name: 'Admin User',
        role: 'ADMIN',
        approved: true
      }} />
      
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-brand-blue to-blue-700 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <Button size="sm" variant="outline" className="absolute -bottom-1 -right-1 w-8 h-8 p-0">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-purple-100 text-purple-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                        <Badge className="bg-green-100 text-green-800">
                          Verified
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">Member since January 2024</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Account Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">8</div>
                      <div className="text-sm text-gray-600">Scholarships Created</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">156</div>
                      <div className="text-sm text-gray-600">Applications Reviewed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">2</div>
                      <div className="text-sm text-gray-600">Users Managed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">45</div>
                      <div className="text-sm text-gray-600">Days Active</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                    <Bell className="h-4 w-4 mr-2" />
                    Notification Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="h-4 w-4 mr-2" />
                    Privacy Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Verified</span>
                    <Badge className="bg-green-100 text-green-800">✓ Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Two-Factor Auth</span>
                    <Badge className="bg-gray-100 text-gray-800">Not Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Login</span>
                    <span className="text-sm text-gray-900">Today, 2:30 PM</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

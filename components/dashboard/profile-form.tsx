'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Save, 
  Camera,
  Bell,
  Lock,
  Globe,
  GraduationCap,
  BookOpen,
  Award,
  Heart,
  CheckCircle,
  AlertCircle,
  MapPin,
  Phone,
  School
} from 'lucide-react'
import { toast } from 'sonner'

interface ProfileFormProps {
  user: any
  statistics: any
  userRole: string
}

export function ProfileForm({ user, statistics, userRole }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email,
    phone: '',
    dateOfBirth: '',
    nationality: '',
    location: '',
    bio: '',
    website: '',
    // Student-specific fields
    currentInstitution: '',
    fieldOfStudy: user.fieldOfStudy || '',
    degreeLevel: user.degreeLevel || '',
    gpa: '',
    expectedGraduation: '',
    // Admin-specific fields
    department: '',
    position: ''
  })

  const handleSave = async () => {
    setIsSubmitting(true)

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()
      
      // Add profile data
      Object.keys(formData).forEach(key => {
        if (formData[key as keyof typeof formData]) {
          formDataToSend.append(key, formData[key as keyof typeof formData])
        }
      })
      
      // Add profile image if selected
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage)
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        body: formDataToSend // Use FormData instead of JSON
      })

      if (response.ok) {
        toast.success('Profile updated successfully!')
        setIsEditing(false)
        // Clear the image preview after successful upload
        setProfileImage(null)
        setImagePreview(null)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }
      
      setProfileImage(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-800'
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800'
      case 'STUDENT':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        return Shield
      case 'STUDENT':
        return GraduationCap
      default:
        return User
    }
  }

  const RoleIcon = getRoleIcon(userRole)

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">
          {userRole === 'STUDENT' 
            ? 'Manage your student profile and academic information'
            : 'Manage your account information and preferences'
          }
        </p>
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
                  {imagePreview ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                      userRole === 'STUDENT' 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                        : 'bg-gradient-to-br from-purple-500 to-purple-600'
                    }`}>
                      <RoleIcon className="h-8 w-8 text-white" />
                    </div>
                  )}
                  <label htmlFor="profile-image" className="absolute -bottom-1 -right-1 w-8 h-8 p-0 cursor-pointer">
                    <Button size="sm" variant="outline" className="w-full h-full p-0">
                      <Camera className="h-4 w-4" />
                    </Button>
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={!isEditing}
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getRoleColor(userRole)}>
                      <RoleIcon className="h-3 w-3 mr-1" />
                      {userRole.replace('_', ' ')}
                    </Badge>
                    <Badge className={user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {user.emailVerified ? 'Verified' : 'Pending'}
                    </Badge>
                    {userRole === 'STUDENT' && (
                      <Badge className={user.profileComplete ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                        Profile {user.profileComplete ? 'Complete' : 'Incomplete'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled={true}
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              </div>

              {userRole === 'STUDENT' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        value={formData.nationality}
                        onChange={(e) => handleInputChange('nationality', e.target.value)}
                        disabled={!isEditing}
                        placeholder="e.g., American, Canadian"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        disabled={!isEditing}
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  placeholder={userRole === 'STUDENT' 
                    ? "Tell us about yourself, your goals, and aspirations..."
                    : "Brief description about your role and experience..."
                  }
                />
              </div>

              {userRole !== 'STUDENT' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={!isEditing}
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      disabled={!isEditing}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
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

          {/* Academic Information (Students Only) */}
          {userRole === 'STUDENT' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentInstitution">Current Institution</Label>
                    <Input
                      id="currentInstitution"
                      value={formData.currentInstitution}
                      onChange={(e) => handleInputChange('currentInstitution', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Your current school/university"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fieldOfStudy">Field of Study</Label>
                    <Input
                      id="fieldOfStudy"
                      value={formData.fieldOfStudy}
                      onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="degreeLevel">Degree Level</Label>
                    <Select onValueChange={(value) => handleInputChange('degreeLevel', value)} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select degree level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HIGH_SCHOOL">High School</SelectItem>
                        <SelectItem value="BACHELOR">Bachelor's</SelectItem>
                        <SelectItem value="MASTER">Master's</SelectItem>
                        <SelectItem value="PHD">PhD</SelectItem>
                        <SelectItem value="CERTIFICATE">Certificate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="gpa">GPA</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      value={formData.gpa}
                      onChange={(e) => handleInputChange('gpa', e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g., 3.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expectedGraduation">Expected Graduation</Label>
                    <Input
                      id="expectedGraduation"
                      type="date"
                      value={formData.expectedGraduation}
                      onChange={(e) => handleInputChange('expectedGraduation', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              {userRole === 'STUDENT' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{statistics.applicationsSubmitted || 0}</div>
                    <div className="text-sm text-gray-600">Applications Submitted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{statistics.acceptedApplications || 0}</div>
                    <div className="text-sm text-gray-600">Accepted Applications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{statistics.savedScholarships || 0}</div>
                    <div className="text-sm text-gray-600">Saved Scholarships</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{statistics.profileCompletion || 0}%</div>
                    <div className="text-sm text-gray-600">Profile Complete</div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{statistics.scholarshipsCreated || 0}</div>
                    <div className="text-sm text-gray-600">Scholarships Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{statistics.applicationsReviewed || 0}</div>
                    <div className="text-sm text-gray-600">Applications Reviewed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{statistics.usersManaged || 0}</div>
                    <div className="text-sm text-gray-600">Users Managed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{statistics.resourcesCreated || 0}</div>
                    <div className="text-sm text-gray-600">Resources Created</div>
                  </div>
                </div>
              )}
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
              {userRole === 'STUDENT' && (
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-2" />
                  Scholarship Preferences
                </Button>
              )}
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
                <Badge className={user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {user.emailVerified ? '✓ Verified' : '⚠ Pending'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Account Status</span>
                <Badge className={user.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {user.approved ? 'Approved' : 'Pending'}
                </Badge>
              </div>
              {userRole === 'STUDENT' && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile Complete</span>
                  <Badge className={user.profileComplete ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                    {user.profileComplete ? 'Complete' : 'Incomplete'}
                  </Badge>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-900">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Profile Completion (Students Only) */}
          {userRole === 'STUDENT' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Profile Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Basic Info</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Academic Info</span>
                    {user.fieldOfStudy ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Preferences</span>
                    {user.preferences ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

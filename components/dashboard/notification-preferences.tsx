'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Bell, 
  Mail, 
  Smartphone, 
  BookOpen, 
  GraduationCap,
  Save,
  CheckCircle
} from 'lucide-react'

interface User {
  id: string
  fieldOfStudy: string | null
  degreeLevel: string | null
}

interface NotificationPreferencesProps {
  user: User
  currentPreferences: any
}

export function NotificationPreferences({ user, currentPreferences }: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState({
    fieldOfStudy: user.fieldOfStudy || '',
    degreeLevel: user.degreeLevel || '',
    fieldNotifications: currentPreferences?.fieldNotifications ?? true,
    emailNotifications: currentPreferences?.emailNotifications ?? true,
    pushNotifications: currentPreferences?.pushNotifications ?? true,
    newScholarships: currentPreferences?.newScholarships ?? true,
    deadlineReminders: currentPreferences?.deadlineReminders ?? true,
    applicationUpdates: currentPreferences?.applicationUpdates ?? true
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldOfStudy: preferences.fieldOfStudy,
          degreeLevel: preferences.degreeLevel,
          notificationPreferences: {
            fieldNotifications: preferences.fieldNotifications,
            emailNotifications: preferences.emailNotifications,
            pushNotifications: preferences.pushNotifications,
            newScholarships: preferences.newScholarships,
            deadlineReminders: preferences.deadlineReminders,
            applicationUpdates: preferences.applicationUpdates
          }
        })
      })

      if (response.ok) {
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 3000)
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Field of Study Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Field of Study Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fieldOfStudy">Your Field of Study</Label>
            <Input
              id="fieldOfStudy"
              placeholder="e.g., Computer Science, Medicine, Engineering"
              value={preferences.fieldOfStudy}
              onChange={(e) => setPreferences({ ...preferences, fieldOfStudy: e.target.value })}
              className="mt-1"
            />
            <p className="text-sm text-gray-600 mt-1">
              We'll notify you when new scholarships in your field become available
            </p>
          </div>

          <div>
            <Label htmlFor="degreeLevel">Degree Level</Label>
            <Select 
              value={preferences.degreeLevel} 
              onValueChange={(value) => setPreferences({ ...preferences, degreeLevel: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your degree level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BACHELOR">Bachelor's Degree</SelectItem>
                <SelectItem value="MASTER">Master's Degree</SelectItem>
                <SelectItem value="PHD">PhD</SelectItem>
                <SelectItem value="DIPLOMA">Diploma</SelectItem>
                <SelectItem value="CERTIFICATE">Certificate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Channels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
            </div>
            <Switch
              id="emailNotifications"
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-green-600" />
              <div>
                <Label htmlFor="pushNotifications">Push Notifications</Label>
                <p className="text-sm text-gray-600">Receive notifications on your device</p>
              </div>
            </div>
            <Switch
              id="pushNotifications"
              checked={preferences.pushNotifications}
              onCheckedChange={(checked) => setPreferences({ ...preferences, pushNotifications: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Notification Types
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="fieldNotifications">Field-Based Notifications</Label>
              <p className="text-sm text-gray-600">Get notified about scholarships in your field</p>
            </div>
            <Switch
              id="fieldNotifications"
              checked={preferences.fieldNotifications}
              onCheckedChange={(checked) => setPreferences({ ...preferences, fieldNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="newScholarships">New Scholarships</Label>
              <p className="text-sm text-gray-600">When new scholarships are posted</p>
            </div>
            <Switch
              id="newScholarships"
              checked={preferences.newScholarships}
              onCheckedChange={(checked) => setPreferences({ ...preferences, newScholarships: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="deadlineReminders">Deadline Reminders</Label>
              <p className="text-sm text-gray-600">Reminders for approaching deadlines</p>
            </div>
            <Switch
              id="deadlineReminders"
              checked={preferences.deadlineReminders}
              onCheckedChange={(checked) => setPreferences({ ...preferences, deadlineReminders: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="applicationUpdates">Application Updates</Label>
              <p className="text-sm text-gray-600">Updates on your scholarship applications</p>
            </div>
            <Switch
              id="applicationUpdates"
              checked={preferences.applicationUpdates}
              onCheckedChange={(checked) => setPreferences({ ...preferences, applicationUpdates: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-brand-blue hover:bg-primary-900"
        >
          {isSaving ? (
            'Saving...'
          ) : isSaved ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

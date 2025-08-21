'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, FileText, Save, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function NewResourceForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    category: '',
    fileUrl: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.type || !formData.category || !formData.fileUrl) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Resource created successfully!')
        router.push('/dashboard/resources')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create resource')
      }
    } catch (error) {
      console.error('Error creating resource:', error)
      toast.error('Failed to create resource')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Scholarship Application Guide"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="type">Type *</Label>
              <Select onValueChange={(value) => handleInputChange('type', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select resource type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GUIDE">Guide</SelectItem>
                  <SelectItem value="ESSAY_EXAMPLE">Essay Example</SelectItem>
                  <SelectItem value="APPLICATION_TIP">Application Tip</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select onValueChange={(value) => handleInputChange('category', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COMPUTER_SCIENCE">Computer Science</SelectItem>
                <SelectItem value="ENGINEERING">Engineering</SelectItem>
                <SelectItem value="MEDICINE">Medicine</SelectItem>
                <SelectItem value="BUSINESS">Business</SelectItem>
                <SelectItem value="ARTS">Arts</SelectItem>
                <SelectItem value="SOCIAL_SCIENCES">Social Sciences</SelectItem>
                <SelectItem value="NATURAL_SCIENCES">Natural Sciences</SelectItem>
                <SelectItem value="MATHEMATICS">Mathematics</SelectItem>
                <SelectItem value="LAW">Law</SelectItem>
                <SelectItem value="EDUCATION">Education</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of the resource..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            File Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="fileUrl">File URL *</Label>
            <Input
              id="fileUrl"
              value={formData.fileUrl}
              onChange={(e) => handleInputChange('fileUrl', e.target.value)}
              placeholder="https://example.com/file.pdf"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              Enter the direct URL to your file (Google Drive, Dropbox, etc.)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">File Upload Notice</h4>
            <p className="text-sm text-blue-700 mt-1">
              Currently, you need to upload your file to a cloud service (Google Drive, Dropbox, etc.) 
              and provide the direct download link. Make sure the file is publicly accessible.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/resources')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Creating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Create Resource
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

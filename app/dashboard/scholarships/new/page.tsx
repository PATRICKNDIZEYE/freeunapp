'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard/nav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { 
  GraduationCap, 
  Save, 
  ArrowLeft,
  Upload,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

export default function NewScholarshipPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    amount: '',
    amountType: 'PARTIAL',
    categories: ['COMPUTER_SCIENCE'],
    degreeLevels: ['BACHELOR'],
    deadline: '',
    eligibilityCriteria: '',
    applicationProcess: '',
    qualificationBasis: '',
    awardsAvailable: '',
    contactInfo: '',
    referenceUrl: '',
    logoUrl: '',
    status: 'DRAFT'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Validate that at least one category and degree level is selected
      if (formData.categories.length === 0) {
        alert('Please select at least one category')
        setLoading(false)
        return
      }
      
      if (formData.degreeLevels.length === 0) {
        alert('Please select at least one degree level')
        setLoading(false)
        return
      }
      
      const response = await fetch('/api/scholarships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        router.push('/dashboard/scholarships')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create scholarship')
      }
    } catch (error) {
      console.error('Error creating scholarship:', error)
      alert('Failed to create scholarship')
    } finally {
      setLoading(false)
    }
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
      
      <div className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link href="/dashboard/scholarships">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Back to Scholarships</span>
                    <span className="sm:hidden">Back</span>
                  </Button>
                </Link>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create New Scholarship</h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Add a new scholarship opportunity for students</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Scholarship Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Google Generation Scholarship"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the scholarship"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="detailedDescription">Detailed Description</Label>
                  <RichTextEditor
                    value={formData.detailedDescription}
                    onChange={(value) => setFormData({ ...formData, detailedDescription: value })}
                    placeholder="Comprehensive description with all details, formatting, and links..."
                    className="min-h-[300px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Scholarship Details */}
            <Card>
              <CardHeader>
                <CardTitle>Scholarship Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="e.g., $25,000 or Full Tuition"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="amountType">Amount Type</Label>
                    <Select value={formData.amountType} onValueChange={(value) => setFormData({ ...formData, amountType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FULL">Full Funding</SelectItem>
                        <SelectItem value="PARTIAL">Partial Funding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categories">Categories *</Label>
                    <div className="space-y-2">
                      {[
                        { value: 'COMPUTER_SCIENCE', label: 'Computer Science' },
                        { value: 'ENGINEERING', label: 'Engineering' },
                        { value: 'MEDICINE', label: 'Medicine' },
                        { value: 'BUSINESS', label: 'Business' },
                        { value: 'ARTS', label: 'Arts' },
                        { value: 'SOCIAL_SCIENCES', label: 'Social Sciences' },
                        { value: 'NATURAL_SCIENCES', label: 'Natural Sciences' },
                        { value: 'MATHEMATICS', label: 'Mathematics' },
                        { value: 'LAW', label: 'Law' },
                        { value: 'EDUCATION', label: 'Education' },
                        { value: 'OTHER', label: 'Other' }
                      ].map((category) => (
                        <label key={category.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.categories.includes(category.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  categories: [...formData.categories, category.value]
                                })
                              } else {
                                setFormData({
                                  ...formData,
                                  categories: formData.categories.filter(c => c !== category.value)
                                })
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{category.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="degreeLevels">Degree Levels *</Label>
                    <div className="space-y-2">
                      {[
                        { value: 'BACHELOR', label: "Bachelor's" },
                        { value: 'MASTER', label: "Master's" },
                        { value: 'PHD', label: 'PhD' },
                        { value: 'CERTIFICATE', label: 'Certificate' },
                        { value: 'DIPLOMA', label: 'Diploma' }
                      ].map((degree) => (
                        <label key={degree.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.degreeLevels.includes(degree.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  degreeLevels: [...formData.degreeLevels, degree.value]
                                })
                              } else {
                                setFormData({
                                  ...formData,
                                  degreeLevels: formData.degreeLevels.filter(d => d !== degree.value)
                                })
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{degree.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="awardsAvailable">Awards Available</Label>
                  <Input
                    id="awardsAvailable"
                    type="number"
                    value={formData.awardsAvailable}
                    onChange={(e) => setFormData({ ...formData, awardsAvailable: e.target.value })}
                    placeholder="Number of awards"
                  />
                </div>

                <div>
                  <Label htmlFor="deadline">Application Deadline *</Label>
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Requirements & Process */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements & Application Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="eligibilityCriteria">Eligibility Criteria</Label>
                  <RichTextEditor
                    value={formData.eligibilityCriteria}
                    onChange={(value) => setFormData({ ...formData, eligibilityCriteria: value })}
                    placeholder="Who is eligible to apply? Use formatting to highlight important requirements..."
                    className="min-h-[200px]"
                  />
                </div>

                <div>
                  <Label htmlFor="applicationProcess">Application Process</Label>
                  <RichTextEditor
                    value={formData.applicationProcess}
                    onChange={(value) => setFormData({ ...formData, applicationProcess: value })}
                    placeholder="Step-by-step application process. Use numbered lists for clear instructions..."
                    className="min-h-[200px]"
                  />
                </div>

                <div>
                  <Label htmlFor="qualificationBasis">Qualification Basis</Label>
                  <RichTextEditor
                    value={formData.qualificationBasis}
                    onChange={(value) => setFormData({ ...formData, qualificationBasis: value })}
                    placeholder="How are candidates evaluated? Use formatting to highlight key criteria..."
                    className="min-h-[200px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact & Links */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information & Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contactInfo">Contact Information</Label>
                  <Input
                    id="contactInfo"
                    value={formData.contactInfo}
                    onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                    placeholder="Email or phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="referenceUrl">Reference URL</Label>
                  <Input
                    id="referenceUrl"
                    type="url"
                    value={formData.referenceUrl}
                    onChange={(e) => setFormData({ ...formData, referenceUrl: e.target.value })}
                    placeholder="Official scholarship website"
                  />
                </div>

                <div>
                  <Label htmlFor="logoUrl">School Logo URL</Label>
                  <Input
                    id="logoUrl"
                    type="url"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="URL to school/organization logo"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This logo will appear on scholarship cards instead of the first letter
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Status & Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Status & Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="PAUSED">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-3">
                  <Link href="/dashboard/scholarships">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Creating...' : 'Create Scholarship'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}

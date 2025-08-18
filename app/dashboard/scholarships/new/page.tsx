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
    category: 'COMPUTER_SCIENCE',
    degreeLevel: 'BACHELOR',
    deadline: '',
    eligibilityCriteria: '',
    applicationProcess: '',
    qualificationBasis: '',
    awardsAvailable: '',
    contactInfo: '',
    referenceUrl: '',
    status: 'DRAFT'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/scholarships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        router.push('/dashboard/scholarships')
      }
    } catch (error) {
      console.error('Error creating scholarship:', error)
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
      
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link href="/dashboard/scholarships">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Scholarships
                  </Button>
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Scholarship</h1>
              <p className="text-gray-600 mt-2">Add a new scholarship opportunity for students</p>
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
                  <Textarea
                    id="detailedDescription"
                    value={formData.detailedDescription}
                    onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                    placeholder="Comprehensive description with all details"
                    rows={5}
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
                        <SelectItem value="CUSTOM">Custom Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
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
                    <Label htmlFor="degreeLevel">Degree Level *</Label>
                    <Select value={formData.degreeLevel} onValueChange={(value) => setFormData({ ...formData, degreeLevel: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BACHELOR">Bachelor's</SelectItem>
                        <SelectItem value="MASTER">Master's</SelectItem>
                        <SelectItem value="PHD">PhD</SelectItem>
                        <SelectItem value="CERTIFICATE">Certificate</SelectItem>
                        <SelectItem value="DIPLOMA">Diploma</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <Textarea
                    id="eligibilityCriteria"
                    value={formData.eligibilityCriteria}
                    onChange={(e) => setFormData({ ...formData, eligibilityCriteria: e.target.value })}
                    placeholder="Who is eligible to apply?"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="applicationProcess">Application Process</Label>
                  <Textarea
                    id="applicationProcess"
                    value={formData.applicationProcess}
                    onChange={(e) => setFormData({ ...formData, applicationProcess: e.target.value })}
                    placeholder="Step-by-step application process"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="qualificationBasis">Qualification Basis</Label>
                  <Textarea
                    id="qualificationBasis"
                    value={formData.qualificationBasis}
                    onChange={(e) => setFormData({ ...formData, qualificationBasis: e.target.value })}
                    placeholder="How are candidates evaluated?"
                    rows={3}
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

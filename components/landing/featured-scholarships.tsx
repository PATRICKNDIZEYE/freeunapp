'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  GraduationCap, 
  Calendar, 
  DollarSign, 
  Users,
  ExternalLink,
  Send,
  Eye,
  Clock,
  MapPin,
  BookOpen,
  Award,
  FileText
} from 'lucide-react'

interface Scholarship {
  id: string
  title: string
  description: string
  detailedDescription?: string | null
  amount: string
  category: string
  degreeLevel: string
  deadline: Date
  status: string
  eligibilityCriteria?: string | null
  applicationProcess?: string | null
  contactInfo?: string | null
  referenceUrl?: string | null
  awardsAvailable?: number | null
  admin: {
    name: string | null
  }
  _count: {
    applications: number
    savedBy: number
  }
}

interface FeaturedScholarshipsProps {
  scholarships: Scholarship[]
}

export function FeaturedScholarships({ scholarships }: FeaturedScholarshipsProps) {
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [viewMode, setViewMode] = useState<'details' | 'apply'>('details')

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'COMPUTER_SCIENCE': return 'bg-blue-100 text-blue-800'
      case 'ENGINEERING': return 'bg-purple-100 text-purple-800'
      case 'MEDICINE': return 'bg-red-100 text-red-800'
      case 'BUSINESS': return 'bg-green-100 text-green-800'
      case 'LAW': return 'bg-orange-100 text-orange-800'
      case 'EDUCATION': return 'bg-teal-100 text-teal-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedScholarship) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...applicationForm,
          scholarshipId: selectedScholarship.id
        })
      })

      if (response.ok) {
        alert('Application submitted successfully! We will contact you soon.')
        setApplicationForm({ name: '', email: '', phone: '', message: '' })
        setSelectedScholarship(null)
        setViewMode('details')
      } else {
        alert('Failed to submit application. Please try again.')
      }
    } catch (error) {
      alert('Error submitting application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openDetails = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship)
    setViewMode('details')
  }

  const openApply = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship)
    setViewMode('apply')
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Scholarships
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Don't miss out on these high-value opportunities closing soon
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {scholarships.map((scholarship) => (
            <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold line-clamp-2 mb-2">
                      {scholarship.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getCategoryColor(scholarship.category)}>
                        {scholarship.category.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        {scholarship.degreeLevel}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm line-clamp-3">
                  {scholarship.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">{scholarship.amount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{scholarship._count.applications} applicants</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    By: {scholarship.admin.name || 'Admin'}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline"
                        className="flex-1"
                        onClick={() => openDetails(scholarship)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                          {selectedScholarship?.title}
                        </DialogTitle>
                      </DialogHeader>
                      
                      {viewMode === 'details' ? (
                        <div className="space-y-6">
                          {/* Basic Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-5 w-5 text-green-600" />
                              <span className="font-semibold">{selectedScholarship?.amount}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award className="h-5 w-5 text-blue-600" />
                              <span>{selectedScholarship?.awardsAvailable || 'Multiple'} awards available</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-5 w-5 text-red-600" />
                              <span>Deadline: {selectedScholarship?.deadline ? new Date(selectedScholarship.deadline).toLocaleDateString() : 'TBD'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-5 w-5 text-purple-600" />
                              <span>{selectedScholarship?.degreeLevel}</span>
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                              <BookOpen className="h-5 w-5" />
                              About This Scholarship
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                              {selectedScholarship?.detailedDescription || selectedScholarship?.description}
                            </p>
                          </div>

                          {/* Eligibility */}
                          {selectedScholarship?.eligibilityCriteria && (
                            <div>
                              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Eligibility Criteria
                              </h3>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                  {selectedScholarship.eligibilityCriteria}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Application Process */}
                          {selectedScholarship?.applicationProcess && (
                            <div>
                              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Application Process
                              </h3>
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                  {selectedScholarship.applicationProcess}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Contact & Links */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedScholarship?.contactInfo && (
                              <div>
                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                  <MapPin className="h-5 w-5" />
                                  Contact Information
                                </h3>
                                <p className="text-gray-700">{selectedScholarship.contactInfo}</p>
                              </div>
                            )}
                            {selectedScholarship?.referenceUrl && (
                              <div>
                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                  <ExternalLink className="h-5 w-5" />
                                  Official Website
                                </h3>
                                <a 
                                  href={selectedScholarship.referenceUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline"
                                >
                                  Visit Official Website
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-4 border-t">
                            <Button 
                              onClick={() => openApply(selectedScholarship!)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Apply Now
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setSelectedScholarship(null)}
                            >
                              Close
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleApply} className="space-y-4">
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Apply for {selectedScholarship?.title}</h3>
                            <p className="text-gray-600 text-sm">Please fill out the application form below.</p>
                          </div>
                          
                          <div>
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              value={applicationForm.name}
                              onChange={(e) => setApplicationForm({ ...applicationForm, name: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={applicationForm.email}
                              onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              value={applicationForm.phone}
                              onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="message">Why should you be considered? *</Label>
                            <Textarea
                              id="message"
                              value={applicationForm.message}
                              onChange={(e) => setApplicationForm({ ...applicationForm, message: e.target.value })}
                              rows={3}
                              required
                            />
                          </div>
                          <div className="flex gap-3 pt-4">
                            <Button type="submit" disabled={isSubmitting} className="flex-1">
                              {isSubmitting ? 'Submitting...' : 'Submit Application'}
                            </Button>
                            <Button 
                              type="button"
                              variant="outline" 
                              onClick={() => setViewMode('details')}
                            >
                              Back to Details
                            </Button>
                          </div>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {scholarships.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scholarships available</h3>
            <p className="text-gray-500">Check back soon for new opportunities!</p>
          </div>
        )}

        <div className="text-center mt-12">
          <a href="/scholarships">
            <Button variant="outline" size="lg">
              View All Scholarships
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
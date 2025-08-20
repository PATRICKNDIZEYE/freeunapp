'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
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
import { 
  Heart, 
  Share2, 
  Send, 
  Calendar, 
  DollarSign, 
  GraduationCap, 
  MapPin,
  Eye,
  Bookmark,
  CheckCircle,
  ExternalLink
} from 'lucide-react'
import { ScholarshipDetails } from './scholarship-details'

interface Scholarship {
  id: string
  title: string
  description: string
  amount: string
  amountType: string
  category: string
  degreeLevel: string
  deadline: Date | null
  country: string | null
  detailedDescription: string | null
  eligibilityCriteria: string | null
  applicationProcess: string | null
  contactInfo: string | null
  referenceUrl: string | null
  createdAt: Date
  admin: {
    name: string | null
  }
  _count: {
    applications: number
    savedBy: number
  }
}

interface ScholarshipsListProps {
  scholarships: Scholarship[]
}

export function ScholarshipsList({ scholarships }: ScholarshipsListProps) {
  const { data: session } = useSession()
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null)
  const [savedScholarships, setSavedScholarships] = useState<Set<string>>(new Set())
  const [appliedScholarships, setAppliedScholarships] = useState<Set<string>>(new Set())

  const handleSave = async (scholarshipId: string) => {
    if (!session) {
      // Redirect to login or show login modal
      return
    }

    try {
      const response = await fetch('/api/scholarships/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scholarshipId })
      })

      if (response.ok) {
        setSavedScholarships(prev => {
          const newSet = new Set(prev)
          if (newSet.has(scholarshipId)) {
            newSet.delete(scholarshipId)
          } else {
            newSet.add(scholarshipId)
          }
          return newSet
        })
      }
    } catch (error) {
      console.error('Error saving scholarship:', error)
    }
  }

  const handleApply = async (scholarshipId: string) => {
    if (!session) {
      // Redirect to login or show login modal
      return
    }

    try {
      const response = await fetch('/api/scholarships/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scholarshipId })
      })

      if (response.ok) {
        setAppliedScholarships(prev => new Set(prev).add(scholarshipId))
      }
    } catch (error) {
      console.error('Error applying to scholarship:', error)
    }
  }

  const handleShare = (scholarship: Scholarship) => {
    const text = `Check out this scholarship: ${scholarship.title} - ${window.location.origin}/scholarships/${scholarship.id}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, '_blank')
  }

  const getAmountColor = (amountType: string) => {
    switch (amountType) {
      case 'FULL': return 'bg-green-100 text-green-800'
      case 'PARTIAL': return 'bg-yellow-100 text-yellow-800'
      case 'CUSTOM': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'COMPUTER_SCIENCE': return 'bg-blue-100 text-blue-800'
      case 'ENGINEERING': return 'bg-purple-100 text-purple-800'
      case 'MEDICINE': return 'bg-red-100 text-red-800'
      case 'BUSINESS': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const isDeadlineNear = (deadline: Date | null) => {
    if (!deadline) return false
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  const isDeadlineExpired = (deadline: Date | null) => {
    if (!deadline) return false
    return new Date(deadline) < new Date()
  }

  if (scholarships.length === 0) {
    return (
      <div className="text-center py-12">
        <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No scholarships found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Scholarships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scholarships.map((scholarship) => (
          <Card key={scholarship.id} className="hover:shadow-lg transition-all duration-200 group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {scholarship.title}
                  </CardTitle>
                  
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={getAmountColor(scholarship.amountType)}>
                      {scholarship.amountType === 'FULL' ? 'Full Tuition' : 
                       scholarship.amountType === 'PARTIAL' ? 'Partial' : 
                       scholarship.amountType === 'CUSTOM' ? scholarship.amount : scholarship.amountType}
                    </Badge>
                    <Badge className={getCategoryColor(scholarship.category)}>
                      {scholarship.category.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline">
                      {scholarship.degreeLevel}
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSave(scholarship.id)}
                    className={`h-8 w-8 p-0 ${savedScholarships.has(scholarship.id) ? 'text-red-500' : 'text-gray-400'}`}
                  >
                    <Heart className={`h-4 w-4 ${savedScholarships.has(scholarship.id) ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(scholarship)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-green-500"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-3">
                {scholarship.description}
              </p>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <DollarSign className="h-4 w-4" />
                  <span>{scholarship.amount}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <GraduationCap className="h-4 w-4" />
                  <span>{scholarship.degreeLevel}</span>
                </div>
                {scholarship.country && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{scholarship.country}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'TBD'}
                  </span>
                </div>
              </div>

              {/* Deadline Warning */}
              {isDeadlineNear(scholarship.deadline) && (
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    ⚠️ Deadline approaching soon!
                  </p>
                </div>
              )}

              {isDeadlineExpired(scholarship.deadline) && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-800">
                    ❌ Application deadline has passed
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                <span>{scholarship._count.applications} applications</span>
                <span>{scholarship._count.savedBy} saved</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedScholarship(scholarship)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{scholarship.title}</DialogTitle>
                    </DialogHeader>
                    {selectedScholarship && (
                      <ScholarshipDetails 
                        scholarship={selectedScholarship}
                        onSave={() => handleSave(scholarship.id)}
                        onApply={() => handleApply(scholarship.id)}
                        onShare={() => handleShare(scholarship)}
                        isSaved={savedScholarships.has(scholarship.id)}
                        isApplied={appliedScholarships.has(scholarship.id)}
                      />
                    )}
                  </DialogContent>
                </Dialog>

                {!isDeadlineExpired(scholarship.deadline) && (
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleApply(scholarship.id)}
                    disabled={appliedScholarships.has(scholarship.id)}
                  >
                    {appliedScholarships.has(scholarship.id) ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Applied
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Apply Now
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* You May Also Like Section */}
      {scholarships.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">You May Also Like</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {scholarships.slice(0, 4).map((scholarship) => (
              <Card key={scholarship.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <h4 className="font-medium text-sm line-clamp-2 mb-2">{scholarship.title}</h4>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{scholarship.amount}</span>
                    <span>{scholarship.category.replace('_', ' ')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

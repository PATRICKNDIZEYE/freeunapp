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
  ExternalLink,
  BookOpen,
  FileText,
  Award,
  Users
} from 'lucide-react'
import { ScholarshipDetails } from '../scholarships/scholarship-details'

interface Scholarship {
  id: string
  title: string
  description: string
  detailedDescription: string | null
  logoUrl: string | null
  referenceUrl: string | null
  eligibilityCriteria: string | null
  applicationProcess: string | null
  qualificationBasis: string | null
  awardsAvailable: number | null
  amount: string
  amountType: string
  category: string
  degreeLevel: string
  deadline: Date
  contactInfo: string | null
  status: string
  approvalStatus: string
  views: number
  createdAt: Date
  admin: {
    name: string | null
  }
  _count: {
    savedBy: number
    applications: number
  }
}

interface FeaturedScholarshipsProps {
  scholarships: Scholarship[]
}

export function FeaturedScholarships({ scholarships }: FeaturedScholarshipsProps) {
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const handleViewDetails = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship)
    setIsDetailOpen(true)
  }

  const handleShare = (scholarship: Scholarship) => {
    const text = `Check out this scholarship: ${scholarship.title} - ${window.location.origin}/scholarships/${scholarship.id}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, '_blank')
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

  const getAmountColor = (amountType: string) => {
    switch (amountType) {
      case 'FULL': return 'bg-green-100 text-green-800'
      case 'PARTIAL': return 'bg-yellow-100 text-yellow-800'
      case 'CUSTOM': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const isDeadlineExpired = (deadline: Date) => {
    return new Date(deadline) < new Date()
  }

  if (scholarships.length === 0) {
    return (
      <div className="text-center py-12">
        <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Featured Scholarships</h3>
        <p className="text-gray-600">Check back later for featured opportunities.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scholarships.slice(0, 6).map((scholarship) => (
          <Card key={scholarship.id} className="hover:shadow-lg transition-shadow group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {scholarship.title}
                  </CardTitle>
                  
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

                <div className="flex flex-col gap-2 ml-2">
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
              <p className="text-sm text-gray-600 line-clamp-3">
                {scholarship.description}
              </p>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <DollarSign className="h-4 w-4" />
                  <span>{scholarship.amount}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <GraduationCap className="h-4 w-4" />
                  <span>{scholarship.degreeLevel}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span className={isDeadlineExpired(scholarship.deadline) ? 'text-red-600' : ''}>
                    {new Date(scholarship.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>{scholarship._count.applications} applications</span>
                </div>
              </div>

              {/* Deadline Warning */}
              {isDeadlineExpired(scholarship.deadline) && (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                  ❌ Deadline passed
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleViewDetails(scholarship)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scholarship Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-2xl">
          {selectedScholarship && (
            <div className="p-6">
              <ScholarshipDetails scholarship={selectedScholarship} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
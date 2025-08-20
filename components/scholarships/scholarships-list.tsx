'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  DollarSign, 
  GraduationCap, 
  Heart,
  Share2,
  Eye,
  Clock,
  Users
} from 'lucide-react'
import { ScholarshipDetail } from './scholarship-detail'
import { Dialog, DialogContent } from '@/components/ui/dialog'

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

interface ScholarshipsListProps {
  scholarships: Scholarship[]
}

export function ScholarshipsList({ scholarships }: ScholarshipsListProps) {
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

  const isDeadlineExpired = (deadline: Date) => {
    return new Date(deadline) < new Date()
  }

  const isDeadlineNear = (deadline: Date) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  if (scholarships.length === 0) {
    return (
      <div className="text-center py-12">
        <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Scholarships Found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or check back later for new opportunities.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scholarships.map((scholarship) => (
          <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold line-clamp-2 mb-2">
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
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-3">
                {scholarship.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-semibold">{scholarship.amount}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <GraduationCap className="h-4 w-4" />
                  <span>{scholarship.degreeLevel}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{scholarship._count.applications} applications</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Heart className="h-4 w-4" />
                  <span>{scholarship._count.savedBy} saved</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className={isDeadlineExpired(scholarship.deadline) ? 'text-red-600' : ''}>
                    {new Date(scholarship.deadline).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(scholarship)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(scholarship)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Deadline Warning */}
              {isDeadlineNear(scholarship.deadline) && !isDeadlineExpired(scholarship.deadline) && (
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  ⚠️ Deadline approaching
                </div>
              )}

              {isDeadlineExpired(scholarship.deadline) && (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                  ❌ Deadline passed
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scholarship Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-2xl">
          {selectedScholarship && (
            <div className="p-6">
              <ScholarshipDetail 
                scholarship={selectedScholarship}
                user={null}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

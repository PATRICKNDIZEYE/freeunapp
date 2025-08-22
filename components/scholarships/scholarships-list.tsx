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
  Users,
  Bookmark
} from 'lucide-react'
import { ScholarshipDetail } from './scholarship-detail'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import Link from 'next/link'

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

  const getDaysRemaining = (deadline: Date) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Expired'
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return '1 day left'
    return `${diffDays} days left`
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
          <Link key={scholarship.id} href={`/scholarships/${scholarship.id}`} className="block">
            <Card className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 group overflow-hidden relative cursor-pointer">
            {/* Header with Icon and Title */}
            <div className="p-6 pb-4">
              <div className="flex items-start gap-4">
                {/* Scholarship Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {scholarship.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                
                {/* Title */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-brand-blue transition-colors">
                    {scholarship.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Key Details Section */}
            <div className="px-6 pb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="h-4 w-4 text-brand-blue" />
                  <span className="font-medium">{scholarship.amount}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4 text-brand-blue" />
                  <span className={`font-medium ${isDeadlineExpired(scholarship.deadline) ? 'text-red-600' : ''}`}>
                    {new Date(scholarship.deadline).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({getDaysRemaining(scholarship.deadline)})
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {scholarship.description}
              </p>
            </div>

            {/* Tags/Badges */}
            <div className="px-6 pb-4">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {scholarship.category.replace('_', ' ')}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {scholarship.degreeLevel}
                </span>
              </div>
            </div>

            {/* Footer with Actions */}
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between">
                {/* Action Icons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-brand-blue transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-brand-blue transition-colors"
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>

                {/* Apply Button */}
                <Button 
                  asChild
                  className="bg-brand-blue hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <Link href={`/scholarships/${scholarship.id}`}>
                    Apply Now
                  </Link>
                </Button>
              </div>
            </div>

            {/* Deadline Warning Overlay */}
            {isDeadlineNear(scholarship.deadline) && !isDeadlineExpired(scholarship.deadline) && (
              <div className="absolute top-4 right-4">
                <div className="bg-yellow-100 border border-yellow-200 rounded-full px-2 py-1 text-xs text-yellow-800 font-medium">
                  Soon
                </div>
              </div>
            )}

            {isDeadlineExpired(scholarship.deadline) && (
              <div className="absolute top-4 right-4">
                <div className="bg-red-100 border border-red-200 rounded-full px-2 py-1 text-xs text-red-800 font-medium">
                  Expired
                </div>
              </div>
            )}
            </Card>
          </Link>
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

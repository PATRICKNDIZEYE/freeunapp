'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  DollarSign, 
  GraduationCap, 
  Bookmark,
  Eye,
  ExternalLink,
  Users,
  Heart,
  Trash2,
  Clock,
  AlertCircle
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface SavedScholarship {
  id: string
  savedAt: Date
  scholarship: {
    id: string
    title: string
    description: string
    amount: string
    amountType: string
    category: string
    degreeLevel: string
    deadline: Date
    status: string
    approvalStatus: string
    views: number
    _count: {
      applications: number
      savedBy: number
    }
  }
}

interface SavedScholarshipsListProps {
  savedScholarships: SavedScholarship[]
}

export function SavedScholarshipsList({ savedScholarships }: SavedScholarshipsListProps) {
  const [isUnsaveLoading, setIsUnsaveLoading] = useState<string | null>(null)
  const [selectedScholarship, setSelectedScholarship] = useState<SavedScholarship | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const router = useRouter()

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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isDeadlineExpired = (deadline: Date) => {
    return new Date(deadline) < new Date()
  }

  const isDeadlineClose = (deadline: Date) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  const handleUnsave = async (savedScholarshipId: string) => {
    setIsUnsaveLoading(savedScholarshipId)
    
    try {
      const response = await fetch('/api/scholarships/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          scholarshipId: savedScholarships.find(s => s.id === savedScholarshipId)?.scholarship.id 
        })
      })

      if (response.ok) {
        toast.success('Scholarship removed from saved list')
        // Refresh the page to update the list
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to remove scholarship')
      }
    } catch (error) {
      console.error('Error unsaving scholarship:', error)
      toast.error('Failed to remove scholarship')
    } finally {
      setIsUnsaveLoading(null)
    }
  }

  const handleApply = (scholarshipId: string) => {
    router.push(`/scholarships/${scholarshipId}`)
  }

  if (savedScholarships.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Bookmark className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No saved scholarships yet</h3>
        <p className="text-gray-600 mb-6">Start browsing scholarships and save the ones you're interested in.</p>
        <Button asChild>
          <Link href="/scholarships">Browse Scholarships</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bookmark className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Saved</p>
                <p className="text-2xl font-bold text-gray-900">{savedScholarships.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {savedScholarships.filter(s => !isDeadlineExpired(s.scholarship.deadline)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Deadline Soon</p>
                <p className="text-2xl font-bold text-gray-900">
                  {savedScholarships.filter(s => isDeadlineClose(s.scholarship.deadline)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-gray-900">
                  {savedScholarships.filter(s => isDeadlineExpired(s.scholarship.deadline)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saved Scholarships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedScholarships.map((savedScholarship) => (
          <Card key={savedScholarship.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 group overflow-hidden relative">
            {/* Header with Icon and Title */}
            <div className="p-6 pb-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {savedScholarship.scholarship.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-brand-blue transition-colors">
                    {savedScholarship.scholarship.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getAmountColor(savedScholarship.scholarship.amountType)}>
                      {savedScholarship.scholarship.amountType === 'FULL' ? 'Full Tuition' : 
                       savedScholarship.scholarship.amountType === 'PARTIAL' ? 'Partial' : 
                       savedScholarship.scholarship.amountType === 'CUSTOM' ? savedScholarship.scholarship.amount : savedScholarship.scholarship.amountType}
                    </Badge>
                    <Badge className={getCategoryColor(savedScholarship.scholarship.category)}>
                      {savedScholarship.scholarship.category.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Details Section */}
            <div className="px-6 pb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="h-4 w-4 text-brand-blue" />
                  <span className="font-medium">{savedScholarship.scholarship.amount}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4 text-brand-blue" />
                  <span className={`font-medium ${isDeadlineExpired(savedScholarship.scholarship.deadline) ? 'text-red-600' : ''}`}>
                    {formatDate(savedScholarship.scholarship.deadline)}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {savedScholarship.scholarship.description}
              </p>
            </div>

            {/* Tags/Badges */}
            <div className="px-6 pb-4">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {savedScholarship.scholarship.category.replace('_', ' ')}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {savedScholarship.scholarship.degreeLevel}
                </span>
                {isDeadlineClose(savedScholarship.scholarship.deadline) && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Deadline Soon
                  </span>
                )}
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
                    onClick={() => setSelectedScholarship(savedScholarship)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-600 transition-colors"
                    onClick={() => handleUnsave(savedScholarship.id)}
                    disabled={isUnsaveLoading === savedScholarship.id}
                  >
                    {isUnsaveLoading === savedScholarship.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Apply Button */}
                <Button 
                  onClick={() => handleApply(savedScholarship.scholarship.id)}
                  className="bg-brand-blue hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                  disabled={isDeadlineExpired(savedScholarship.scholarship.deadline)}
                >
                  {isDeadlineExpired(savedScholarship.scholarship.deadline) ? 'Expired' : 'Apply Now'}
                </Button>
              </div>
            </div>

            {/* Deadline Warning Overlay */}
            {isDeadlineExpired(savedScholarship.scholarship.deadline) && (
              <div className="absolute top-4 right-4">
                <div className="bg-red-100 border border-red-200 rounded-full px-2 py-1 text-xs text-red-800 font-medium">
                  Expired
                </div>
              </div>
            )}

            {/* Saved Date */}
            <div className="absolute bottom-2 right-4">
              <p className="text-xs text-gray-500">
                Saved {formatDate(savedScholarship.savedAt)}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Scholarship Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedScholarship && (
            <div>
              <DialogHeader>
                <DialogTitle>Scholarship Details</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Scholarship Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedScholarship.scholarship.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Amount</p>
                        <p className="text-gray-900">{selectedScholarship.scholarship.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Category</p>
                        <p className="text-gray-900">{selectedScholarship.scholarship.category.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Degree Level</p>
                        <p className="text-gray-900">{selectedScholarship.scholarship.degreeLevel}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Deadline</p>
                        <p className="text-gray-900">{formatDate(selectedScholarship.scholarship.deadline)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Views</p>
                        <p className="text-gray-900">{selectedScholarship.scholarship.views}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Applications</p>
                        <p className="text-gray-900">{selectedScholarship.scholarship._count.applications}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedScholarship.scholarship.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button 
                    onClick={() => handleApply(selectedScholarship.scholarship.id)}
                    className="flex-1 bg-brand-blue hover:bg-blue-700"
                    disabled={isDeadlineExpired(selectedScholarship.scholarship.deadline)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {isDeadlineExpired(selectedScholarship.scholarship.deadline) ? 'Expired' : 'Apply Now'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleUnsave(selectedScholarship.id)}
                    disabled={isUnsaveLoading === selectedScholarship.id}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove from Saved
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

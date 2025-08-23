'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Users,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Scholarship {
  id: string
  title: string
  description: string
  amount: string
  category: string
  degreeLevel: string
  deadline: Date
  status: string
  approvalStatus: string
  views: number
  admin: {
    name: string | null
    email: string
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
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [degreeLevelFilter, setDegreeLevelFilter] = useState('all')
  const [deletingScholarshipId, setDeletingScholarshipId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || scholarship.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || scholarship.category === categoryFilter
    const matchesDegreeLevel = degreeLevelFilter === 'all' || scholarship.degreeLevel === degreeLevelFilter
    return matchesSearch && matchesStatus && matchesCategory && matchesDegreeLevel
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'EXPIRED': return 'bg-red-100 text-red-800'
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800'
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

  const handleDeleteScholarship = async (scholarshipId: string) => {
    setDeletingScholarshipId(scholarshipId)
    
    try {
      const response = await fetch(`/api/scholarships/${scholarshipId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Scholarship deleted",
          description: `"${data.deletedScholarship.title}" has been deleted successfully.`,
        })
        // Refresh the page to update the list
        router.refresh()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete scholarship",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting scholarship:', error)
      toast({
        title: "Error",
        description: "Failed to delete scholarship",
        variant: "destructive",
      })
    } finally {
      setDeletingScholarshipId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search scholarships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter('all')}>
              All Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('ACTIVE')}>
              Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('DRAFT')}>
              Draft
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('EXPIRED')}>
              Expired
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('PAUSED')}>
              Paused
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Category
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setCategoryFilter('all')}>
              All Categories
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategoryFilter('COMPUTER_SCIENCE')}>
              Computer Science
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategoryFilter('ENGINEERING')}>
              Engineering
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategoryFilter('MEDICINE')}>
              Medicine
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategoryFilter('BUSINESS')}>
              Business
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategoryFilter('ARTS')}>
              Arts
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategoryFilter('SCIENCE')}>
              Science
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Degree Level
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setDegreeLevelFilter('all')}>
              All Levels
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDegreeLevelFilter('BACHELORS')}>
              Bachelor's
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDegreeLevelFilter('MASTERS')}>
              Master's
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDegreeLevelFilter('PHD')}>
              PhD
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDegreeLevelFilter('DIPLOMA')}>
              Diploma
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDegreeLevelFilter('CERTIFICATE')}>
              Certificate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {filteredScholarships.length} Scholarship{filteredScholarships.length !== 1 ? 's' : ''} Found
        </h2>
        {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || degreeLevelFilter !== 'all') && (
          <div className="text-sm text-gray-500">
            Filtered results
          </div>
        )}
      </div>

      {/* Scholarships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScholarships.map((scholarship) => (
          <Card key={scholarship.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 group overflow-hidden relative">
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
                
                {/* Title and Status */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-brand-blue transition-colors">
                    {scholarship.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(scholarship.status)}>
                      {scholarship.status}
                    </Badge>
                    <Badge className={getCategoryColor(scholarship.category)}>
                      {scholarship.category.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                {/* Admin Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/scholarships/${scholarship.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/scholarships/${scholarship.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Scholarship</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{scholarship.title}"? This action cannot be undone.
                            <br /><br />
                            <strong>This will also delete:</strong>
                            <br />• {scholarship._count.applications} application(s)
                            <br />• {scholarship._count.savedBy} saved bookmark(s)
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteScholarship(scholarship.id)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deletingScholarshipId === scholarship.id}
                          >
                            {deletingScholarshipId === scholarship.id ? 'Deleting...' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  <span className="font-medium">
                    {new Date(scholarship.deadline).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
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

            {/* Stats and Admin Info */}
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{scholarship._count.applications} apps</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{scholarship.views} views</span>
                  </div>
                </div>
                <span className="text-xs">{scholarship.degreeLevel}</span>
              </div>
            </div>

            {/* Footer with Admin Info */}
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  By: {scholarship.admin.name || scholarship.admin.email}
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/dashboard/scholarships/${scholarship.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/dashboard/scholarships/${scholarship.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Scholarship</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{scholarship.title}"? This action cannot be undone.
                          <br /><br />
                          <strong>This will also delete:</strong>
                          <br />• {scholarship._count.applications} application(s)
                          <br />• {scholarship._count.savedBy} saved bookmark(s)
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteScholarship(scholarship.id)}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={deletingScholarshipId === scholarship.id}
                        >
                          {deletingScholarshipId === scholarship.id ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredScholarships.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No scholarships found</div>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

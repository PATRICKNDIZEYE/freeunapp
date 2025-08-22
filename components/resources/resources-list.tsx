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
  Search, 
  Filter, 
  FileText, 
  Download, 
  Calendar, 
  User, 
  Eye 
} from 'lucide-react'

interface Resource {
  id: string
  title: string
  description: string | null
  fileUrl: string
  type: string
  category: string
  createdAt: Date
  admin: {
    name: string | null
  }
}

interface ResourcesListProps {
  resources: Resource[]
}

export function ResourcesList({ resources }: ResourcesListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter
    const matchesType = typeFilter === 'all' || resource.type.toLowerCase() === typeFilter.toLowerCase()
    
    return matchesSearch && matchesCategory && matchesType
  })

  const handleDownload = async (resourceId: string, fileUrl: string) => {
    try {
      // Update download count
      await fetch(`/api/resources/${resourceId}/download`, {
        method: 'POST'
      })
      
      // Create a temporary link element to trigger download
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = fileUrl.split('/').pop() || 'resource'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading resource:', error)
      // Fallback to opening in new tab
      window.open(fileUrl, '_blank')
    }
  }

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-4 w-4" />
      case 'doc':
      case 'docx':
        return <FileText className="h-4 w-4" />
      case 'ppt':
      case 'pptx':
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getFileTypeColor = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return 'bg-red-100 text-red-800'
      case 'doc':
      case 'docx':
        return 'bg-blue-100 text-blue-800'
      case 'ppt':
      case 'pptx':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'GUIDE': return 'bg-green-100 text-green-800'
      case 'ESSAY_EXAMPLE': return 'bg-blue-100 text-blue-800'
      case 'APPLICATION_TIP': return 'bg-purple-100 text-purple-800'
      case 'OTHER': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Resources Available</h3>
        <p className="text-gray-600">Check back later for educational resources and materials.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
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
            <DropdownMenuItem onClick={() => setCategoryFilter('GUIDE')}>
              Guide
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategoryFilter('ESSAY_EXAMPLE')}>
              Essay Example
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategoryFilter('APPLICATION_TIP')}>
              Application Tip
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategoryFilter('OTHER')}>
              Other
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Type
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setTypeFilter('all')}>
              All Types
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('pdf')}>
              PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('doc')}>
              DOC
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('docx')}>
              DOCX
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('ppt')}>
              PPT
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('pptx')}>
              PPTX
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {filteredResources.length} Resource{filteredResources.length !== 1 ? 's' : ''} Found
        </h2>
        {(searchTerm || categoryFilter !== 'all' || typeFilter !== 'all') && (
          <div className="text-sm text-gray-500">
            Filtered results
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card 
            key={resource.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => window.open(resource.fileUrl, '_blank')}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                <div className="flex gap-1">
                  <Badge className={getCategoryColor(resource.category)}>
                    {resource.category.replace('_', ' ')}
                  </Badge>
                  <Badge className={getFileTypeColor(resource.type)}>
                    {resource.type.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-3">
                {resource.description || 'No description available'}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{resource.admin.name || 'Admin'}</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload(resource.id, resource.fileUrl)
                  }}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(resource.fileUrl, '_blank')
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Resources Found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  )
}

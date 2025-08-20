'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, Calendar, User, Eye } from 'lucide-react'

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
  const handleDownload = async (resourceId: string, fileUrl: string) => {
    try {
      // Update download count
      await fetch(`/api/resources/${resourceId}/download`, {
        method: 'POST'
      })
      
      // Open file in new tab
      window.open(fileUrl, '_blank')
    } catch (error) {
      console.error('Error downloading resource:', error)
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                <Badge className={getFileTypeColor(resource.type)}>
                  {resource.type.toUpperCase()}
                </Badge>
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
                  onClick={() => handleDownload(resource.id, resource.fileUrl)}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.open(resource.fileUrl, '_blank')}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

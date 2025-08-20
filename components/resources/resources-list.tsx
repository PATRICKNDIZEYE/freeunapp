'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Download, 
  Calendar, 
  User,
  Eye,
  FilePdf
} from 'lucide-react'

interface Resource {
  id: string
  title: string
  description: string
  fileUrl: string
  fileType: string
  downloads: number
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

      // Download the file
      window.open(fileUrl, '_blank')
    } catch (error) {
      console.error('Error downloading resource:', error)
    }
  }

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FilePdf className="h-6 w-6 text-red-500" />
      default:
        return <FileText className="h-6 w-6 text-blue-500" />
    }
  }

  const getFileTypeColor = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return 'bg-red-100 text-red-800'
      case 'doc':
      case 'docx':
        return 'bg-blue-100 text-blue-800'
      case 'xls':
      case 'xlsx':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No resources available</h3>
        <p className="text-gray-500">Check back later for helpful guides and templates</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold line-clamp-2 mb-2">
                    {resource.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={getFileTypeColor(resource.fileType)}>
                      {resource.fileType.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      {resource.downloads} downloads
                    </Badge>
                  </div>
                </div>
                <div className="ml-2">
                  {getFileTypeIcon(resource.fileType)}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-3">
                {resource.description}
              </p>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <User className="h-4 w-4" />
                  <span>{resource.admin.name || 'Admin'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={() => handleDownload(resource.id, resource.fileUrl)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
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

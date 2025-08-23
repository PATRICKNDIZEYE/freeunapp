'use client'

import React from 'react'

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
    email: string
  }
}

interface ResourcesListProps {
  resources: Resource[]
}

export function ResourcesList({ resources }: ResourcesListProps) {
  const handleDelete = async (resourceId: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      try {
        const response = await fetch(`/api/resources/${resourceId}`, { 
          method: 'DELETE' 
        })
        
        if (response.ok) {
          window.location.reload()
        } else {
          alert('Failed to delete resource')
        }
      } catch (error) {
        console.error('Error deleting resource:', error)
        alert('Failed to delete resource')
      }
    }
  }

  if (resources.length === 0) {
    return (
      <div className="p-12 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No resources</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new resource.</p>
        <div className="mt-6">
          <a
            href="/dashboard/resources/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Resource
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200">
      {resources.map((resource) => (
        <div key={resource.id} className="p-6 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {resource.title}
              </h3>
              {resource.description && (
                <p className="text-sm text-gray-600 mb-2">
                  {resource.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {resource.type}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {resource.category.replace('_', ' ')}
                </span>
                <span>By {resource.admin.name || resource.admin.email}</span>
                <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={resource.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Download
              </a>
              <button
                type="button"
                onClick={() => handleDelete(resource.id)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

'use client'

import React from 'react'

interface ResourceDeleteButtonProps {
  resourceId: string
}

export function ResourceDeleteButton({ resourceId }: ResourceDeleteButtonProps) {
  const handleDelete = async () => {
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

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-red-600 hover:text-red-700 text-sm font-medium"
    >
      Delete
    </button>
  )
}

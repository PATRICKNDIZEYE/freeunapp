'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { 
  Mail, 
  FileText, 
  ExternalLink 
} from 'lucide-react'

export function ScholarshipSidebarActions() {
  const scrollToApplications = () => {
    const applicationsSection = document.getElementById('applications-section')
    if (applicationsSection) {
      applicationsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-3">
      <Button variant="outline" className="w-full justify-start">
        <Mail className="h-4 w-4 mr-2" />
        Contact Applicants
      </Button>
      <Button 
        variant="outline" 
        className="w-full justify-start"
        onClick={scrollToApplications}
      >
        <FileText className="h-4 w-4 mr-2" />
        View All Applications
      </Button>
      <Button variant="outline" className="w-full justify-start">
        <ExternalLink className="h-4 w-4 mr-2" />
        Preview Public Page
      </Button>
    </div>
  )
}

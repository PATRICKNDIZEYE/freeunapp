'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, MessageCircle, ExternalLink } from 'lucide-react'

export function OnboardingCard() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has seen the onboarding card
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
    
    if (!hasSeenOnboarding) {
      // Show after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('hasSeenOnboarding', 'true')
  }

  const handleJoinWhatsApp = () => {
    window.open('https://chat.whatsapp.com/EkZ2IIrYojVLNetzxbZyAO', '_blank')
    handleClose()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-between items-start">
            <div className="flex-1"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* WhatsApp Icon */}
          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to FreeUnApp! 🎓
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Join our community of students and get instant updates on new scholarships, application tips, and success stories.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Why Join Our WhatsApp Group?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Get instant notifications for new scholarships</li>
              <li>• Share application tips and experiences</li>
              <li>• Connect with other students</li>
              <li>• Ask questions and get help</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleJoinWhatsApp}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Join WhatsApp Group
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1"
            >
              Maybe Later
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            You can always join later from your dashboard
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

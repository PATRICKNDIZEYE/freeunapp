'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Phone, Send } from 'lucide-react'
import Image from 'next/image'

export function MarketingSignup() {
  const [formData, setFormData] = useState({
    email: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/marketing-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({ email: '', phone: '' })
      }
    } catch (error) {
      console.error('Error submitting signup:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-brand-blue text-white p-6 rounded-lg text-center">
        <div className="flex justify-center mb-4">
          <Image 
            src="/lgo.png" 
            alt="FreeUnApp Logo" 
            width={32} 
            height={32}
            className="h-8 w-auto"
          />
        </div>
        <h3 className="text-xl font-semibold mb-2">Thank you for your interest!</h3>
        <p className="text-sm opacity-90">
          We'll contact you soon with exciting opportunities and updates.
        </p>
      </div>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-brand-blue to-blue-800 text-white border-0 shadow-xl">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Image 
              src="/lgo.png" 
              alt="FreeUnApp Logo" 
              width={40} 
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
          <p className="text-sm opacity-90">
            Get notified about new scholarships, opportunities, and exclusive deals
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:bg-white/20"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:bg-white/20"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-brand-blue hover:bg-gray-100 font-semibold"
          >
            {isSubmitting ? (
              'Subscribing...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Subscribe for Updates
              </>
            )}
          </Button>
        </form>

        <p className="text-xs text-center mt-4 opacity-75">
          By subscribing, you agree to receive marketing communications from FreeUnApp.
        </p>
      </CardContent>
    </Card>
  )
}

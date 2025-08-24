'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { FcGoogle } from 'react-icons/fc'
import { ArrowRight, GraduationCap, User, Mail, Lock, Phone, Shield, Eye, EyeOff } from 'lucide-react'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import Image from 'next/image'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT' // Default to student
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // If admin account created, show message and redirect to signin
        if (formData.role === 'ADMIN') {
          alert(data.message || 'Admin account created successfully. Please wait for approval.')
          router.push('/auth/signin')
          return
        }
        
        // For students, sign them in automatically
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false
        })

        if (result?.ok) {
          // Always redirect to dashboard for new users, not to application page
          router.push('/dashboard/student')
        } else {
          router.push('/auth/signin')
        }
      } else {
        const data = await response.json()
        setError(data.error || 'Something went wrong')
      }
    } catch (error) {
      setError('Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard/student' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue via-blue-700 to-blue-800 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-white/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-md backdrop-blur-sm bg-white/95 border-0 shadow-2xl">
        <CardHeader className="text-center pb-8">
          {/* Logo */}
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-brand-blue to-blue-800 rounded-xl flex items-center justify-center mb-6">
            <Image 
              src="/lgo.png" 
              alt="FreeUnApp Logo" 
              width={32} 
              height={32}
              className="h-8 w-auto"
            />
          </div>
          
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Join FreeUnApp
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Join thousands of students discovering scholarship opportunities
          </p>
          
          {/* Admin Approval Note */}
         
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social Login */}
          <div className="space-y-3">
      
           
          </div>

        

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10 bg-white border-gray-300 focus:border-brand-blue focus:ring-brand-blue"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 bg-white border-gray-300 focus:border-brand-blue focus:ring-brand-blue"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10 bg-white border-gray-300 focus:border-brand-blue focus:ring-brand-blue"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                I am a
              </Label>
              <div className="relative mt-1">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="pl-10 bg-white border-gray-300 focus:border-brand-blue focus:ring-brand-blue">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student (Looking for scholarships)</SelectItem>
                    <SelectItem value="ADMIN">Administrator (Managing scholarships)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 bg-white border-gray-300 focus:border-brand-blue focus:ring-brand-blue"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10 pr-10 bg-white border-gray-300 focus:border-brand-blue focus:ring-brand-blue"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-blue hover:bg-primary-900 text-white font-semibold"
            >
              {isSubmitting ? (
                'Creating Account...'
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/auth/signin" className="font-semibold text-brand-blue hover:text-primary-900">
                Sign in
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}




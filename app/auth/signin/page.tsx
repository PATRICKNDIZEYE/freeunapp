'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        alert('Invalid credentials')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      alert('An error occurred during sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-md backdrop-blur-sm bg-white/80 border-0 shadow-2xl">
        <CardHeader className="text-center pb-8">
          {/* Logo */}
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-brand-blue to-blue-700 rounded-xl flex items-center justify-center mb-6">
            <Image 
              src="/lgo.png" 
              alt="FreeUnApp Logo" 
              width={32} 
              height={32}
              className="h-8 w-auto"
            />
          </div>
          
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Sign in to FreeUnApp
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Access your scholarship dashboard and discover opportunities
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  type="email" 
                  placeholder="Email address"
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="pl-10 h-12 border-gray-200 focus:border-brand-blue focus:ring-brand-blue"
                  required 
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="pl-10 pr-10 h-12 border-gray-200 focus:border-brand-blue focus:ring-brand-blue"
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="flex justify-end">
                <Link href="/auth/forgot-password" className="text-sm text-brand-blue hover:text-blue-800">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Sign In Button */}
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-brand-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-4">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-brand-blue hover:text-blue-800 font-semibold">
                Sign up for free
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



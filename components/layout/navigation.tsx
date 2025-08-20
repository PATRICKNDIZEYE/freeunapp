'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, User, Search, Bookmark, Bell } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 rounded-lg">
              <Image 
                src="/lgo.png" 
                alt="FreeUnApp Logo" 
                width={100} 
                height={100}
                className="h-32 w-auto"
              />
            </div>

          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/scholarships" className="text-gray-700 hover:text-brand-blue font-medium transition-colors">
              Browse Scholarships
            </Link>
            <Link href="/resources" className="text-gray-700 hover:text-brand-blue font-medium transition-colors">
              Resources
            </Link>
        
            {session?.user.role === 'ADMIN' || session?.user.role === 'SUPER_ADMIN' ? (
              <Link href="/dashboard" className="text-gray-700 hover:text-brand-blue font-medium transition-colors">
                Admin Dashboard
              </Link>
            ) : null}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="p-2" onClick={() => router.push('/dashboard/saved')}>
                  <Bookmark className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2" onClick={() => router.push('/dashboard/notifications')}>
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2" onClick={() => router.push('/dashboard')}>
                  <User className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="ml-2"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/auth/signin')}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push('/auth/signup')}
                  className="bg-brand-blue hover:bg-blue-700"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            <Link 
              href="/scholarships" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5" />
                Browse Scholarships
              </div>
            </Link>
            <Link 
              href="/resources" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            
            {session ? (
              <div className="space-y-2">
                <Link 
                  href="/dashboard" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5" />
                    Dashboard
                  </div>
                </Link>
                <Link 
                  href="/dashboard/saved" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <Bookmark className="h-5 w-5" />
                    Saved Scholarships
                  </div>
                </Link>
                {(session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN') && (
                  <Link 
                    href="/dashboard" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    router.push('/auth/signin')
                    setIsMenuOpen(false)
                  }}
                >
                  Sign In
                </Button>
                <Button
                  className="w-full bg-brand-blue hover:bg-blue-700"
                  onClick={() => {
                    router.push('/auth/signup')
                    setIsMenuOpen(false)
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
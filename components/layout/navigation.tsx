'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, User, Search, Bookmark, Bell, FileText } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Check if user is admin
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'
  const isStudent = session?.user?.role === 'STUDENT'

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
                className="h-8 w-auto sm:h-12 md:h-16 lg:h-20"
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
            
            {/* Only show admin dashboard link to admins */}
            {isAdmin && (
              <Link href="/dashboard" className="text-gray-700 hover:text-brand-blue font-medium transition-colors">
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                {/* Student-specific links */}
                {isStudent && (
                  <>
                    <Link 
                      href="/dashboard/student" 
                      className="text-gray-700 hover:text-brand-blue font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/dashboard/applications" 
                      className="text-gray-700 hover:text-brand-blue font-medium transition-colors"
                    >
                      My Applications
                    </Link>
                    <Link 
                      href="/dashboard/saved" 
                      className="text-gray-700 hover:text-brand-blue font-medium transition-colors"
                    >
                      Saved
                    </Link>
                  </>
                )}

                {/* Admin-specific links */}
                {isAdmin && (
                  <Link 
                    href="/dashboard" 
                    className="text-gray-700 hover:text-brand-blue font-medium transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}

                {/* User Menu */}
                <div className="relative group">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {session.user.name || session.user.email}
                  </Button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      {isStudent && (
                        <>
                          <Link 
                            href="/dashboard/student" 
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <div className="flex items-center gap-3">
                              <User className="h-5 w-5" />
                              Student Dashboard
                            </div>
                          </Link>
                          <Link 
                            href="/dashboard/applications" 
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5" />
                              My Applications
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
                        </>
                      )}
                      
                      {isAdmin && (
                        <Link 
                          href="/dashboard" 
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5" />
                            Admin Dashboard
                          </div>
                        </Link>
                      )}
                      
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <X className="h-5 w-5" />
                          Sign Out
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/signin">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              <Link 
                href="/scholarships" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Scholarships
              </Link>
              <Link 
                href="/resources" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
              
              {session ? (
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  {isStudent && (
                    <>
                      <Link 
                        href="/dashboard/student" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5" />
                          Student Dashboard
                        </div>
                      </Link>
                      <Link 
                        href="/dashboard/applications" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5" />
                          My Applications
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
                    </>
                  )}
                  
                  {isAdmin && (
                    <Link 
                      href="/dashboard" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5" />
                        Admin Dashboard
                      </div>
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/' })
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <X className="h-5 w-5" />
                      Sign Out
                    </div>
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <Link 
                    href="/auth/signin" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
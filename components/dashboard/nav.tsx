'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
  X, 
  User, 
  Bell, 
  Settings, 
  LogOut,
  GraduationCap,
  FileText,
  Users,
  Shield,
  BookOpen
} from 'lucide-react'
import { signOut } from 'next-auth/react'

interface DashboardNavProps {
  user: any
  notifications?: any[]
}

export function DashboardNav({ user, notifications }: DashboardNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Check if user is admin
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'
  const isSuperAdmin = user?.role === 'SUPER_ADMIN'

  // If not admin, don't render admin navigation
  if (!isAdmin) {
    return null
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Image 
                src="/lgo.png" 
                alt="FreeUnApp Logo" 
                width={100} 
                height={100}
                className="h-20 w-auto"
              />
              <span className="text-xl font-bold text-gray-900">Admin Panel</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-gray-700 hover:text-brand-blue transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/scholarships" className="text-gray-700 hover:text-brand-blue transition-colors">
              Scholarships
            </Link>
            <Link href="/dashboard/applications" className="text-gray-700 hover:text-brand-blue transition-colors">
              Applications
            </Link>
            <Link href="/dashboard/users" className="text-gray-700 hover:text-brand-blue transition-colors">
              Users
            </Link>
            <Link href="/dashboard/resources" className="text-gray-700 hover:text-brand-blue transition-colors">
              Resources
            </Link>
            {isSuperAdmin && (
              <Link href="/dashboard/moderation" className="text-gray-700 hover:text-brand-blue transition-colors">
                Moderation
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {notifications && notifications.length > 0 && (
              <div className="relative">
                <Button variant="ghost" size="sm" className="p-2">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                </Button>
              </div>
            )}

            {/* User Dropdown */}
            <div className="relative group">
              <Button variant="ghost" className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{user?.name || user?.email}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user?.role === 'SUPER_ADMIN' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user?.role}
                </span>
              </Button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <Link href="/dashboard/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </div>
                  </Link>
                  <Link href="/dashboard/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-2">
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            <Link 
              href="/dashboard" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Dashboard</span>
              </div>
            </Link>
            <Link 
              href="/dashboard/scholarships" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Scholarships</span>
              </div>
            </Link>
            <Link 
              href="/dashboard/applications" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Applications</span>
              </div>
            </Link>
            <Link 
              href="/dashboard/users" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Users</span>
              </div>
            </Link>
            <Link 
              href="/dashboard/resources" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Resources</span>
              </div>
            </Link>
            {isSuperAdmin && (
              <Link 
                href="/dashboard/moderation" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Moderation</span>
                </div>
              </Link>
            )}
            <Link 
              href="/dashboard/profile" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </div>
            </Link>
            <Link 
              href="/dashboard/settings" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </div>
            </Link>
            <button
              onClick={() => {
                signOut({ callbackUrl: '/' })
                setIsMobileMenuOpen(false)
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-2">
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

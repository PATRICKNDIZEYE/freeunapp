'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Menu, 
  X, 
  User, 
  Search, 
  Bookmark, 
  Bell, 
  FileText, 
  GraduationCap,
  Settings,
  LogOut,
  Home,
  Star,
  TrendingUp,
  Award,
  Calendar
} from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface StudentNavigationProps {
  notificationCount?: number
  applicationCount?: number
  savedCount?: number
}

export function StudentNavigation({ 
  notificationCount = 0, 
  applicationCount = 0, 
  savedCount = 0 
}: StudentNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Only show this navigation for students
  if (!session || session.user.role !== 'STUDENT') {
    return null
  }

  return (
    <nav className="bg-gradient-to-r from-brand-blue to-blue-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard/student" className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div className="text-white">
              <h1 className="font-bold text-lg">FreeUnApp</h1>
              <p className="text-xs text-blue-100">Student Portal</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/dashboard/student" 
              className="text-white/90 hover:text-white font-medium transition-colors flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            
            <Link 
              href="/scholarships" 
              className="text-white/90 hover:text-white font-medium transition-colors flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Browse Scholarships
            </Link>
            
            <Link 
              href="/dashboard/applications" 
              className="text-white/90 hover:text-white font-medium transition-colors flex items-center gap-2 relative"
            >
              <FileText className="h-4 w-4" />
              My Applications
              {applicationCount > 0 && (
                <Badge className="bg-orange-500 text-white text-xs h-5 w-5 flex items-center justify-center p-0 absolute -top-2 -right-2">
                  {applicationCount > 99 ? '99+' : applicationCount}
                </Badge>
              )}
            </Link>
            
            <Link 
              href="/dashboard/saved" 
              className="text-white/90 hover:text-white font-medium transition-colors flex items-center gap-2 relative"
            >
              <Bookmark className="h-4 w-4" />
              Saved
              {savedCount > 0 && (
                <Badge className="bg-purple-500 text-white text-xs h-5 w-5 flex items-center justify-center p-0 absolute -top-2 -right-2">
                  {savedCount > 99 ? '99+' : savedCount}
                </Badge>
              )}
            </Link>
            
            <Link 
              href="/resources" 
              className="text-white/90 hover:text-white font-medium transition-colors flex items-center gap-2"
            >
              <Award className="h-4 w-4" />
              Resources
            </Link>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative p-2 text-white/90 hover:text-white hover:bg-white/10" 
              onClick={() => router.push('/dashboard/notifications')}
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center p-0 absolute -top-1 -right-1">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name || 'Student'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        Student
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/student" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/applications" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Applications
                    {applicationCount > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {applicationCount}
                      </Badge>
                    )}
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/saved" className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    Saved Scholarships
                    {savedCount > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {savedCount}
                      </Badge>
                    )}
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notifications
                    {notificationCount > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {notificationCount}
                      </Badge>
                    )}
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2 text-white/90 hover:text-white hover:bg-white/10"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-4 space-y-2">
            {/* Student Info */}
            <div className="px-4 py-3 bg-white/10 rounded-lg mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {session.user.name || 'Student'}
                  </p>
                  <p className="text-blue-100 text-xs">{session.user.email}</p>
                  <Badge variant="outline" className="text-xs mt-1 text-white border-white/30">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    Student Portal
                  </Badge>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <Link 
              href="/dashboard/student" 
              className="flex items-center gap-3 px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              href="/scholarships" 
              className="flex items-center gap-3 px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Search className="h-5 w-5" />
              <span>Browse Scholarships</span>
            </Link>
            
            <Link 
              href="/dashboard/applications" 
              className="flex items-center gap-3 px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <FileText className="h-5 w-5" />
              <span>My Applications</span>
              {applicationCount > 0 && (
                <Badge className="bg-orange-500 text-white ml-auto">
                  {applicationCount}
                </Badge>
              )}
            </Link>
            
            <Link 
              href="/dashboard/saved" 
              className="flex items-center gap-3 px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Bookmark className="h-5 w-5" />
              <span>Saved Scholarships</span>
              {savedCount > 0 && (
                <Badge className="bg-purple-500 text-white ml-auto">
                  {savedCount}
                </Badge>
              )}
            </Link>
            
            <Link 
              href="/dashboard/notifications" 
              className="flex items-center gap-3 px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
              {notificationCount > 0 && (
                <Badge className="bg-red-500 text-white ml-auto">
                  {notificationCount}
                </Badge>
              )}
            </Link>
            
            <Link 
              href="/resources" 
              className="flex items-center gap-3 px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Award className="h-5 w-5" />
              <span>Resources</span>
            </Link>

            {/* Divider */}
            <div className="border-t border-white/20 my-4"></div>
            
            <Link 
              href="/dashboard/profile" 
              className="flex items-center gap-3 px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-5 w-5" />
              <span>My Profile</span>
            </Link>
            
            <Link 
              href="/dashboard/settings" 
              className="flex items-center gap-3 px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-3 px-4 py-3 text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-lg transition-colors w-full text-left"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

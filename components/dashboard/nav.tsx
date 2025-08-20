'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { User, Menu, GraduationCap, Bell } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'

interface DashboardNavProps {
  user: any
  notifications?: any[]
}

export function DashboardNav({ user, notifications }: DashboardNavProps) {
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
            {user?.role === 'SUPER_ADMIN' && (
              <Link href="/dashboard/moderation" className="text-gray-700 hover:text-brand-blue transition-colors">
                Moderation
              </Link>
            )}
            <Link href="/dashboard/users" className="text-gray-700 hover:text-brand-blue transition-colors">
              Users
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {notifications && notifications.length > 0 && (
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              </Button>
            )}

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-blue to-blue-700 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden sm:inline">{user?.name || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/scholarships">Scholarships</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/applications">Applications</Link>
                </DropdownMenuItem>
                {user?.role === 'SUPER_ADMIN' && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/moderation">Moderation</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/users">Users</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}

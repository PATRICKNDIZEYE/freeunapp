import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { User, Menu, GraduationCap } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'

export function Nav() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/lgo.png" 
              alt="FreeUnApp Logo" 
              width={40} 
              height={40}
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-gray-900">FreeUnApp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/scholarships" className="text-gray-700 hover:text-brand-blue transition-colors">
              Scholarships
            </Link>
            <Link href="/resources" className="text-gray-700 hover:text-brand-blue transition-colors">
              Resources
            </Link>
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-brand-blue to-blue-700 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="hidden sm:inline">{session.user?.name || 'User'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => signOut()}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
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
                  <Link href="/scholarships">Scholarships</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/resources">Resources</Link>
                </DropdownMenuItem>
                {session ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/signin">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/signup">Sign Up</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}

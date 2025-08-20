'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ArrowRight, GraduationCap, DollarSign, Calendar, MapPin } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Scholarship {
  id: string
  title: string
  description: string
  category: string
  degreeLevel: string
  amount: string
  deadline: Date
}

export function Hero() {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<Scholarship[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const popularSearches = [
    'Computer Science',
    'Engineering',
    'Medicine',
    'Business',
    'Full Tuition',
    'International',
    'Graduate',
    'Undergraduate'
  ]

  // Fetch scholarships for suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/scholarships?search=${encodeURIComponent(searchTerm)}&limit=5`)
        if (response.ok) {
          const data = await response.json()
          setSuggestions(data.scholarships || [])
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/scholarships?search=${encodeURIComponent(searchTerm.trim())}`)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (scholarship: Scholarship) => {
    router.push(`/scholarships/${scholarship.id}`)
    setShowSuggestions(false)
    setSearchTerm('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'COMPUTER_SCIENCE': return 'bg-blue-100 text-blue-800'
      case 'ENGINEERING': return 'bg-purple-100 text-purple-800'
      case 'MEDICINE': return 'bg-red-100 text-red-800'
      case 'BUSINESS': return 'bg-green-100 text-green-800'
      case 'ARTS': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatAmount = (amount: string) => {
    if (amount.includes('Full')) return 'Full Tuition'
    if (amount.includes('Partial')) return 'Partial Funding'
    return amount
  }

  const isDeadlineNear = (deadline: Date) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-brand-blue via-blue-700 to-blue-800 text-white">
      <div className="absolute inset-0 bg-opacity-20 bg-white"></div>
      
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <Image 
                src="/lgo.png" 
                alt="FreeUnApp Logo" 
                width={48} 
                height={48}
                className="h-12 w-auto"
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Discover Your Perfect
            <span className="block text-white/90">Scholarship</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect with thousands of scholarship opportunities worldwide. 
            Your journey to free education starts here.
          </p>

          <div className="max-w-2xl mx-auto mb-8" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search scholarships by field, country, or keyword..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                className="pl-12 pr-20 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40"
              />
              <Button
                onClick={handleSearch}
                disabled={!searchTerm.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-white/30 px-4 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Search
              </Button>
              
              {/* Search Suggestions */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50">
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-blue mx-auto"></div>
                      <p className="text-sm mt-2">Searching...</p>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="py-1">
                      {suggestions.map((scholarship) => (
                        <div
                          key={scholarship.id}
                          onClick={() => handleSuggestionClick(scholarship)}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="text-gray-900 font-medium">
                            {scholarship.title}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {scholarship.category.replace('_', ' ')} • {scholarship.degreeLevel} • {formatAmount(scholarship.amount)}
                          </div>
                        </div>
                      ))}
                      <div className="border-t border-gray-100">
                        <button
                          onClick={handleSearch}
                          className="w-full text-left px-4 py-3 text-brand-blue hover:bg-gray-50 font-medium text-sm"
                        >
                          View all results for "{searchTerm}"
                        </button>
                      </div>
                    </div>
                  ) : searchTerm.length >= 2 ? (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">No scholarships found for "{searchTerm}"</p>
                      <p className="text-xs mt-1 text-gray-400">Try different keywords</p>
                    </div>
                  ) : searchTerm.length === 0 ? (
                    <div className="p-4">
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Popular searches</p>
                        <div className="flex flex-wrap gap-1">
                          {popularSearches.slice(0, 6).map((term) => (
                            <button
                              key={term}
                              onClick={() => {
                                setSearchTerm(term)
                                setShowSuggestions(true)
                              }}
                              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs transition-colors"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/scholarships">
              <Button className="bg-white text-brand-blue hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                <Search className="h-5 w-5 mr-2" />
                See All Scholarships
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold">
                <ArrowRight className="h-5 w-5 mr-2" />
                Get Started Free
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">5K+</div>
              <div className="text-sm text-white/70">Active Scholarships</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">50K+</div>
              <div className="text-sm text-white/70">Students Helped</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">95%</div>
              <div className="text-sm text-white/70">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">$2.5M+</div>
              <div className="text-sm text-white/70">Total Funding</div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/60 text-sm">
              Trusted by Students Worldwide
            </p>
            <p className="text-white/40 text-xs mt-1">
              Our platform connects ambitious students with life-changing scholarship opportunities
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

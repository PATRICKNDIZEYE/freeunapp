'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Search, 
  Filter, 
  GraduationCap, 
  DollarSign, 
  Calendar,
  BookOpen
} from 'lucide-react'

interface Scholarship {
  id: string
  title: string
  description: string
  category: string
  degreeLevel: string
  amount: string
  deadline: Date
}

export function ScholarshipFilters() {
  const router = useRouter()
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    degreeLevel: '',
    amountType: '',
    deadline: ''
  })
  const [suggestions, setSuggestions] = useState<Scholarship[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') params.set(key, value)
    })
    
    const queryString = params.toString()
    router.push(`/scholarships${queryString ? `?${queryString}` : ''}`)
  }

  const handleViewAll = () => {
    router.push('/scholarships')
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      degreeLevel: 'all',
      amountType: 'all',
      deadline: 'all'
    })
  }

  // Fetch suggestions for search
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (filters.search.length < 2) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/scholarships?search=${encodeURIComponent(filters.search)}&limit=3`)
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
  }, [filters.search])

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

  const handleSuggestionClick = (scholarship: Scholarship) => {
    router.push(`/scholarships/${scholarship.id}`)
    setShowSuggestions(false)
    setFilters(prev => ({ ...prev, search: '' }))
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

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Scholarship
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover thousands of scholarship opportunities tailored to your field of study, degree level, and preferences
            </p>
          </div>

          {/* Filters Card */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Search */}
                <div className="relative" ref={searchRef}>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search scholarships..."
                    value={filters.search}
                    onChange={(e) => {
                      handleFilterChange('search', e.target.value)
                      setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="pl-10"
                  />
                  
                  {/* Search Suggestions */}
                  {showSuggestions && (filters.search.length >= 2 || suggestions.length > 0) && (
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
                              View all results for "{filters.search}"
                            </button>
                          </div>
                        </div>
                      ) : filters.search.length >= 2 ? (
                        <div className="p-4 text-center text-gray-500">
                          <p className="text-sm">No scholarships found for "{filters.search}"</p>
                          <p className="text-xs mt-1 text-gray-400">Try different keywords</p>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Field of Study */}
                <div>
                  <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <SelectValue placeholder="Field of Study" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Fields</SelectItem>
                      <SelectItem value="COMPUTER_SCIENCE">Computer Science</SelectItem>
                      <SelectItem value="ENGINEERING">Engineering</SelectItem>
                      <SelectItem value="MEDICINE">Medicine</SelectItem>
                      <SelectItem value="BUSINESS">Business</SelectItem>
                      <SelectItem value="ARTS">Arts & Humanities</SelectItem>
                      <SelectItem value="SCIENCE">Natural Sciences</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Degree Level */}
                <div>
                  <Select value={filters.degreeLevel} onValueChange={(value) => handleFilterChange('degreeLevel', value)}>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        <SelectValue placeholder="Degree Level" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="BACHELORS">Bachelor's</SelectItem>
                      <SelectItem value="MASTERS">Master's</SelectItem>
                      <SelectItem value="PHD">PhD</SelectItem>
                      <SelectItem value="DIPLOMA">Diploma</SelectItem>
                      <SelectItem value="CERTIFICATE">Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Amount Type */}
                <div>
                  <Select value={filters.amountType} onValueChange={(value) => handleFilterChange('amountType', value)}>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <SelectValue placeholder="Amount Type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Amounts</SelectItem>
                      <SelectItem value="FULL">Full Tuition</SelectItem>
                      <SelectItem value="PARTIAL">Partial</SelectItem>
                      <SelectItem value="CUSTOM">Custom Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Deadline */}
                <div>
                  <Select value={filters.deadline} onValueChange={(value) => handleFilterChange('deadline', value)}>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <SelectValue placeholder="Deadline" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Deadlines</SelectItem>
                      <SelectItem value="7">Within 7 days</SelectItem>
                      <SelectItem value="30">Within 30 days</SelectItem>
                      <SelectItem value="90">Within 90 days</SelectItem>
                      <SelectItem value="180">Within 6 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleSearch}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
                <Button 
                  onClick={handleViewAll}
                  variant="outline"
                  className="flex-1"
                >
                  View All Scholarships
                </Button>
                <Button 
                  onClick={clearFilters}
                  variant="outline"
                  className="flex-1"
                  disabled={Object.values(filters).every(value => value === '' || value === 'all')}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">5K+</div>
              <div className="text-sm text-gray-600">Active Scholarships</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">50K+</div>
              <div className="text-sm text-gray-600">Students Helped</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">$2.5M+</div>
              <div className="text-sm text-gray-600">Total Funding</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

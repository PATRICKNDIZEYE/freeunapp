'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Search, 
  Filter, 
  GraduationCap,
  DollarSign,
  Calendar
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Scholarship {
  id: string
  title: string
  description: string
  category: string
  degreeLevel: string
  amount: string
  deadline: Date
}

export function ScholarshipsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    degreeLevel: searchParams.get('degreeLevel') || 'all',
    amountType: searchParams.get('amountType') || 'all',
    deadline: searchParams.get('deadline') || 'all'
  })
  const [suggestions, setSuggestions] = useState<Scholarship[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'all') params.set(key, value)
    })
    
    router.push(`/scholarships?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      degreeLevel: 'all',
      amountType: 'all',
      deadline: 'all'
    })
    router.push('/scholarships')
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div>
          <Label htmlFor="search">Search Scholarships</Label>
          <div className="relative" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search by title or description..."
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
                        onClick={() => {
                          const params = new URLSearchParams()
                          Object.entries(filters).forEach(([key, value]) => {
                            if (value && value !== 'all') params.set(key, value)
                          })
                          router.push(`/scholarships?${params.toString()}`)
                          setShowSuggestions(false)
                        }}
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
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="COMPUTER_SCIENCE">Computer Science</SelectItem>
              <SelectItem value="ENGINEERING">Engineering</SelectItem>
              <SelectItem value="MEDICINE">Medicine</SelectItem>
              <SelectItem value="BUSINESS">Business</SelectItem>
              <SelectItem value="ARTS">Arts</SelectItem>
              <SelectItem value="SOCIAL_SCIENCES">Social Sciences</SelectItem>
              <SelectItem value="NATURAL_SCIENCES">Natural Sciences</SelectItem>
              <SelectItem value="MATHEMATICS">Mathematics</SelectItem>
              <SelectItem value="LAW">Law</SelectItem>
              <SelectItem value="EDUCATION">Education</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Degree Level */}
        <div>
          <Label htmlFor="degreeLevel">Degree Level</Label>
          <Select value={filters.degreeLevel} onValueChange={(value) => handleFilterChange('degreeLevel', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="BACHELOR">Bachelor's</SelectItem>
              <SelectItem value="MASTER">Master's</SelectItem>
              <SelectItem value="PHD">PhD</SelectItem>
              <SelectItem value="CERTIFICATE">Certificate</SelectItem>
              <SelectItem value="DIPLOMA">Diploma</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amount Type */}
        <div>
          <Label htmlFor="amountType">Funding Type</Label>
          <Select value={filters.amountType} onValueChange={(value) => handleFilterChange('amountType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="FULL">Full Funding</SelectItem>
              <SelectItem value="PARTIAL">Partial Funding</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Deadline */}
        <div>
          <Label htmlFor="deadline">Deadline</Label>
          <Select value={filters.deadline} onValueChange={(value) => handleFilterChange('deadline', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any Deadline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Deadline</SelectItem>
              <SelectItem value="7">Within 7 Days</SelectItem>
              <SelectItem value="30">Within 30 Days</SelectItem>
              <SelectItem value="90">Within 90 Days</SelectItem>
              <SelectItem value="180">Within 180 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        <Button 
          variant="outline" 
          onClick={clearFilters}
          className="w-full"
          disabled={Object.values(filters).every(value => value === '' || value === 'all')}
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  )
}

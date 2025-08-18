'use client'

import { useState } from 'react'
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search by title or description..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
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
              <SelectItem value="CUSTOM">Custom Amount</SelectItem>
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
              <SelectItem value="1month">Within 1 Month</SelectItem>
              <SelectItem value="3months">Within 3 Months</SelectItem>
              <SelectItem value="6months">Within 6 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        <Button 
          variant="outline" 
          onClick={clearFilters}
          className="w-full"
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  )
}

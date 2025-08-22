'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  FileText,
  BookOpen
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

export function ResourcesFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    type: searchParams.get('type') || 'all',
    dateRange: searchParams.get('dateRange') || 'all',
    uploader: searchParams.get('uploader') || 'all'
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'all') params.set(key, value)
    })
    
    router.push(`/resources?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      type: 'all',
      dateRange: 'all',
      uploader: 'all'
    })
    router.push('/resources')
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
          <Label htmlFor="search">Search Resources</Label>
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
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="GUIDE">Guide</SelectItem>
              <SelectItem value="ESSAY_EXAMPLE">Essay Example</SelectItem>
              <SelectItem value="APPLICATION_TIP">Application Tip</SelectItem>
              <SelectItem value="CALENDAR">Calendar</SelectItem>
              <SelectItem value="TEMPLATE">Template</SelectItem>
              <SelectItem value="CHECKLIST">Checklist</SelectItem>
              <SelectItem value="SAMPLE">Sample</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Resource Type */}
        <div>
          <Label htmlFor="type">Resource Type</Label>
          <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <SelectValue placeholder="All Types" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="GUIDE">Guide</SelectItem>
              <SelectItem value="ESSAY_EXAMPLE">Essay Example</SelectItem>
              <SelectItem value="APPLICATION_TIP">Application Tip</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div>
          <Label htmlFor="dateRange">Date Range</Label>
          <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Uploader */}
        <div>
          <Label htmlFor="uploader">Uploader</Label>
          <Select value={filters.uploader} onValueChange={(value) => handleFilterChange('uploader', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Uploaders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Uploaders</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="super_admin">Super Admins</SelectItem>
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

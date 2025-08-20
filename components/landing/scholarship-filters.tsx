'use client'

import { useState } from 'react'
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

export function ScholarshipFilters() {
  const router = useRouter()
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    degreeLevel: '',
    amountType: '',
    deadline: ''
  })

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
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search scholarships..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
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

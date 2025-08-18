'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, GraduationCap, Award, Users } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/scholarships?search=${encodeURIComponent(searchQuery)}`)
    } else {
      router.push('/scholarships')
    }
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
      <div className="relative container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
            <GraduationCap className="h-8 w-8 text-blue-200" />
            <span className="text-xl font-bold text-white">FreeUnApp</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Discover Your
            <span className="block text-blue-200 animate-pulse">Perfect Scholarship</span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with thousands of scholarship opportunities worldwide. 
            Your journey to free education starts here.
          </p>

          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search scholarships by field, country, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-12 h-14 text-lg border-0 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <Button 
                onClick={handleSearch}
                size="lg"
                className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-xl transition-all duration-200 hover:scale-105"
              >
                Search
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={() => router.push('/scholarships')}
              variant="outline" 
              size="lg"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-3 text-lg font-medium rounded-xl transition-all duration-200 hover:scale-105"
            >
              See All Scholarships
            </Button>
            <Button 
              onClick={() => router.push('/auth/signup')}
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 px-8 py-3 text-lg font-medium rounded-xl transition-all duration-200 hover:scale-105"
            >
              Get Started Free
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-full mb-2">
                <Award className="h-6 w-6 text-blue-200" />
              </div>
              <div className="text-2xl font-bold text-white">5K+</div>
              <div className="text-sm text-blue-200">Active Scholarships</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-full mb-2">
                <Users className="h-6 w-6 text-blue-200" />
              </div>
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-sm text-blue-200">Students Helped</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-full mb-2">
                <GraduationCap className="h-6 w-6 text-blue-200" />
              </div>
              <div className="text-2xl font-bold text-white">95%</div>
              <div className="text-sm text-blue-200">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

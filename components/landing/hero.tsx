'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export function Hero() {
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

          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search scholarships by field, country, or keyword..."
                className="pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40"
              />
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

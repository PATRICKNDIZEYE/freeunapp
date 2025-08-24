'use client'

import { cn } from '@/lib/utils'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function Loader({ size = 'md', className, text = 'Loading...' }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-3', className)}>
      {/* Professional Spinner */}
      <div className="relative">
        <div className={cn(
          'animate-spin rounded-full border-2 border-gray-200 border-t-blue-600',
          sizeClasses[size]
        )}></div>
      </div>

      {/* Loading text */}
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600">{text}</p>
      </div>
    </div>
  )
}

// Full page loader component
export function PageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <Loader size="lg" text={text} />
        
        {/* Subtle loading indicator */}
        <div className="mt-6">
          <div className="flex justify-center space-x-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Inline loader for buttons and small areas
export function InlineLoader({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <div className="flex items-center justify-center">
      <div className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
        size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'
      )}></div>
    </div>
  )
}

// Skeleton loader for content
export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <div className={cn('skeleton rounded', className)}></div>
  )
}

// Card skeleton loader
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
      <div className="skeleton h-6 w-3/4 rounded"></div>
      <div className="skeleton h-4 w-full rounded"></div>
      <div className="skeleton h-4 w-2/3 rounded"></div>
      <div className="flex space-x-2">
        <div className="skeleton h-6 w-16 rounded-full"></div>
        <div className="skeleton h-6 w-20 rounded-full"></div>
      </div>
    </div>
  )
}

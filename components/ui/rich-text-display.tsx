'use client'

import React from 'react'

interface RichTextDisplayProps {
  content: string
  className?: string
}

export function RichTextDisplay({ content, className }: RichTextDisplayProps) {
  if (!content) {
    return null
  }

  return (
    <div 
      className={`rich-text-content ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

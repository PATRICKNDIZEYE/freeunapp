'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  List,
  ListOrdered,
  Link,
  Image,
  Paperclip,
  Plus,
  MoreVertical
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const toggleBold = () => {
    execCommand('bold')
    setIsBold(!isBold)
  }

  const toggleItalic = () => {
    execCommand('italic')
    setIsItalic(!isItalic)
  }

  const toggleUnderline = () => {
    execCommand('underline')
    setIsUnderline(!isUnderline)
  }

  const setAlignment = (align: string) => {
    execCommand('justify' + align.charAt(0).toUpperCase() + align.slice(1))
  }

  const insertList = (ordered: boolean) => {
    execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList')
  }

  const insertLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      execCommand('createLink', url)
    }
  }

  const insertImage = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      execCommand('insertImage', url)
    }
  }

  const getCharacterCount = () => {
    return editorRef.current?.textContent?.length || 0
  }

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap items-center gap-1">
        {/* Text Formatting */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleBold}
          className={`h-8 w-8 p-0 ${isBold ? 'bg-gray-200' : ''}`}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleItalic}
          className={`h-8 w-8 p-0 ${isItalic ? 'bg-gray-200' : ''}`}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleUnderline}
          className={`h-8 w-8 p-0 ${isUnderline ? 'bg-gray-200' : ''}`}
        >
          <Underline className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Alignment */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAlignment('left')}
          className="h-8 w-8 p-0"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAlignment('center')}
          className="h-8 w-8 p-0"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAlignment('right')}
          className="h-8 w-8 p-0"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAlignment('justify')}
          className="h-8 w-8 p-0"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Lists */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertList(false)}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertList(true)}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Links and Media */}
        <Button
          variant="ghost"
          size="sm"
          onClick={insertLink}
          className="h-8 w-8 p-0"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={insertImage}
          className="h-8 w-8 p-0"
        >
          <Image className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* More Options */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div className="p-4">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="min-h-[200px] outline-none focus:ring-0"
          placeholder={placeholder}
          style={{ 
            minHeight: '200px',
            outline: 'none'
          }}
        />
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 flex justify-between items-center text-xs text-gray-500">
        <span>Gray Theme</span>
        <span>Characters: {getCharacterCount()}</span>
      </div>
    </div>
  )
}

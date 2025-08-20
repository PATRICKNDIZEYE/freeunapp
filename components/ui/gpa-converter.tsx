'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calculator, ArrowRight, Info } from 'lucide-react'
import { convertRwandanMarksToGPA, convertGPAToRwandanMarks, getGPAGrade, getPercentageGrade } from '@/lib/gpa-converter'

export function GPAConverter() {
  const [percentage, setPercentage] = useState('')
  const [gpa, setGpa] = useState('')
  const [convertedGPA, setConvertedGPA] = useState<number | null>(null)
  const [convertedPercentage, setConvertedPercentage] = useState<number | null>(null)
  const [error, setError] = useState('')

  const handlePercentageToGPA = () => {
    setError('')
    const percentageValue = parseFloat(percentage)
    
    if (isNaN(percentageValue) || percentageValue < 0 || percentageValue > 100) {
      setError('Please enter a valid percentage between 0 and 100')
      return
    }

    try {
      const converted = convertRwandanMarksToGPA(percentageValue)
      setConvertedGPA(converted)
      setConvertedPercentage(null)
    } catch (err) {
      setError('Error converting percentage to GPA')
    }
  }

  const handleGPAToPercentage = () => {
    setError('')
    const gpaValue = parseFloat(gpa)
    
    if (isNaN(gpaValue) || gpaValue < 0 || gpaValue > 4) {
      setError('Please enter a valid GPA between 0 and 4')
      return
    }

    try {
      const converted = convertGPAToRwandanMarks(gpaValue)
      setConvertedPercentage(converted)
      setConvertedGPA(null)
    } catch (err) {
      setError('Error converting GPA to percentage')
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Rwandan Marks to GPA Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Conversion Formula:</p>
              <p>GPA = (Percentage ÷ 20) - 1</p>
              <p className="text-xs mt-1">This converts the 0-100 scale to a 0-4 GPA scale</p>
            </div>
          </div>
        </div>

        {/* Percentage to GPA */}
        <div className="space-y-3">
          <Label htmlFor="percentage">Rwandan Marks (Percentage)</Label>
          <div className="flex gap-2">
            <Input
              id="percentage"
              type="number"
              placeholder="Enter percentage (0-100)"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              min="0"
              max="100"
              step="0.01"
            />
            <Button onClick={handlePercentageToGPA} size="sm">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* GPA to Percentage */}
        <div className="space-y-3">
          <Label htmlFor="gpa">GPA (0-4 Scale)</Label>
          <div className="flex gap-2">
            <Input
              id="gpa"
              type="number"
              placeholder="Enter GPA (0-4)"
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
              min="0"
              max="4"
              step="0.01"
            />
            <Button onClick={handleGPAToPercentage} size="sm">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Results */}
        {convertedGPA !== null && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Conversion Result:</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Percentage:</strong> {percentage}%</p>
              <p><strong>GPA:</strong> {convertedGPA.toFixed(2)}</p>
              <p><strong>Grade:</strong> {getGPAGrade(convertedGPA)}</p>
            </div>
          </div>
        )}

        {convertedPercentage !== null && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Conversion Result:</h4>
            <div className="space-y-2 text-sm">
              <p><strong>GPA:</strong> {gpa}</p>
              <p><strong>Percentage:</strong> {convertedPercentage.toFixed(2)}%</p>
              <p><strong>Grade:</strong> {getPercentageGrade(convertedPercentage)}</p>
            </div>
          </div>
        )}

        {/* Grade Scale */}
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Grade Scale:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p><strong>GPA Scale:</strong></p>
              <p>3.7-4.0 = A</p>
              <p>3.3-3.6 = A-</p>
              <p>3.0-3.2 = B+</p>
              <p>2.7-2.9 = B</p>
            </div>
            <div>
              <p><strong>Percentage Scale:</strong></p>
              <p>90-100% = A</p>
              <p>80-89% = B</p>
              <p>70-79% = C</p>
              <p>60-69% = D</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

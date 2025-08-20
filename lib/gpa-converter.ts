/**
 * Convert Rwandan marks (percentage) to GPA
 * Formula: GPA = (Percentage / 20) - 1
 * This converts the 0-100 scale to a 0-4 GPA scale
 */

export function convertRwandanMarksToGPA(percentage: number): number {
  if (percentage < 0 || percentage > 100) {
    throw new Error('Percentage must be between 0 and 100')
  }
  
  // Convert percentage to GPA (0-4 scale)
  const gpa = (percentage / 20) - 1
  
  // Round to 2 decimal places
  return Math.round(gpa * 100) / 100
}

export function convertGPAToRwandanMarks(gpa: number): number {
  if (gpa < 0 || gpa > 4) {
    throw new Error('GPA must be between 0 and 4')
  }
  
  // Convert GPA back to percentage
  const percentage = (gpa + 1) * 20
  
  // Round to 2 decimal places
  return Math.round(percentage * 100) / 100
}

export function getGPAGrade(gpa: number): string {
  if (gpa >= 3.7) return 'A'
  if (gpa >= 3.3) return 'A-'
  if (gpa >= 3.0) return 'B+'
  if (gpa >= 2.7) return 'B'
  if (gpa >= 2.3) return 'B-'
  if (gpa >= 2.0) return 'C+'
  if (gpa >= 1.7) return 'C'
  if (gpa >= 1.3) return 'C-'
  if (gpa >= 1.0) return 'D+'
  if (gpa >= 0.7) return 'D'
  return 'F'
}

export function getPercentageGrade(percentage: number): string {
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}

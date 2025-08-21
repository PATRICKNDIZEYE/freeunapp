import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the user
    const user = await prisma.user.findFirst({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Handle FormData for file upload
    const formData = await req.formData()
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const dateOfBirth = formData.get('dateOfBirth') as string
    const nationality = formData.get('nationality') as string
    const location = formData.get('location') as string
    const bio = formData.get('bio') as string
    const website = formData.get('website') as string
    const currentInstitution = formData.get('currentInstitution') as string
    const fieldOfStudy = formData.get('fieldOfStudy') as string
    const degreeLevel = formData.get('degreeLevel') as string
    const gpa = formData.get('gpa') as string
    const expectedGraduation = formData.get('expectedGraduation') as string
    const department = formData.get('department') as string
    const position = formData.get('position') as string
    
    // Handle profile image upload
    const profileImage = formData.get('profileImage') as File | null

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Prepare update data
    const updateData: any = {
      name: name.trim(),
      updatedAt: new Date()
    }

    // Add role-specific fields
    if (user.role === 'STUDENT') {
      if (fieldOfStudy) updateData.fieldOfStudy = fieldOfStudy.trim()
      if (degreeLevel) updateData.degreeLevel = degreeLevel
      
      // Check if profile is now complete
      const isProfileComplete = !!(
        name?.trim() && 
        fieldOfStudy?.trim() && 
        degreeLevel &&
        currentInstitution?.trim()
      )
      updateData.profileComplete = isProfileComplete
    }

    // Handle profile image upload
    let imageUrl = null
    if (profileImage) {
      try {
        // Convert file to buffer
        const bytes = await profileImage.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Generate unique filename
        const timestamp = Date.now()
        const filename = `profile-${user.id}-${timestamp}.${profileImage.name.split('.').pop()}`
        
        // For now, we'll store the image in the public/uploads directory
        // In production, you'd want to use a cloud storage service like AWS S3
        const uploadDir = './public/uploads'
        const fs = require('fs')
        const path = require('path')
        
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }
        
        const filePath = path.join(uploadDir, filename)
        fs.writeFileSync(filePath, buffer)
        
        imageUrl = `/uploads/${filename}`
      } catch (error) {
        console.error('Error uploading image:', error)
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
      }
    }

    // Store additional profile data in JSON field (for fields not in main schema)
    const profileData: any = {}
    if (phone) profileData.phone = phone.trim()
    if (dateOfBirth) profileData.dateOfBirth = dateOfBirth
    if (nationality) profileData.nationality = nationality.trim()
    if (location) profileData.location = location.trim()
    if (bio) profileData.bio = bio.trim()
    if (website) profileData.website = website.trim()
    if (currentInstitution) profileData.currentInstitution = currentInstitution.trim()
    if (gpa) profileData.gpa = parseFloat(gpa)
    if (expectedGraduation) profileData.expectedGraduation = expectedGraduation
    if (department) profileData.department = department.trim()
    if (position) profileData.position = position.trim()
    if (imageUrl) profileData.profileImage = imageUrl

    // Store profile data in the preferences JSON field
    updateData.preferences = {
      ...user.preferences as any,
      profile: profileData
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileComplete: updatedUser.profileComplete,
        fieldOfStudy: updatedUser.fieldOfStudy,
        degreeLevel: updatedUser.degreeLevel,
        preferences: updatedUser.preferences
      }
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the user with profile data
    const user = await prisma.user.findFirst({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileComplete: true,
        fieldOfStudy: true,
        degreeLevel: true,
        preferences: true,
        emailVerified: true,
        approved: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

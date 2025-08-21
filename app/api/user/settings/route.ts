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

    const body = await req.json()
    const {
      emailNotifications,
      pushNotifications,
      scholarshipAlerts,
      applicationUpdates,
      systemAnnouncements,
      twoFactorAuth,
      sessionTimeout,
      profileVisibility,
      showEmail,
      showActivity,
      theme,
      language,
      currentPassword,
      newPassword,
      confirmPassword
    } = body

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date()
    }

    // Store settings in preferences
    const currentPreferences = user.preferences as any || {}
    updateData.preferences = {
      ...currentPreferences,
      settings: {
        emailNotifications,
        pushNotifications,
        scholarshipAlerts,
        applicationUpdates,
        systemAnnouncements,
        twoFactorAuth,
        sessionTimeout,
        profileVisibility,
        showEmail,
        showActivity,
        theme,
        language
      }
    }

    // Handle password change if provided
    if (currentPassword && newPassword && confirmPassword) {
      // TODO: Implement password change logic
      // For now, just return success
      console.log('Password change requested but not implemented yet')
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        preferences: updatedUser.preferences
      }
    })
  } catch (error) {
    console.error('Error saving settings:', error)
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

    // Find the user
    const user = await prisma.user.findFirst({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        preferences: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const preferences = user.preferences as any || {}
    const settings = preferences.settings || {
      emailNotifications: true,
      pushNotifications: true,
      scholarshipAlerts: true,
      applicationUpdates: true,
      systemAnnouncements: false,
      twoFactorAuth: false,
      sessionTimeout: '24',
      profileVisibility: 'public',
      showEmail: true,
      showActivity: false,
      theme: 'light',
      language: 'en'
    }

    return NextResponse.json({
      success: true,
      settings
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

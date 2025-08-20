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

    const body = await req.json()
    const { fieldOfStudy, degreeLevel, notificationPreferences } = body

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email! },
      data: {
        fieldOfStudy: fieldOfStudy || null,
        degreeLevel: degreeLevel || null,
        notificationPreferences: notificationPreferences || {}
      }
    })

    return NextResponse.json({ 
      success: true, 
      user: {
        fieldOfStudy: updatedUser.fieldOfStudy,
        degreeLevel: updatedUser.degreeLevel,
        notificationPreferences: updatedUser.notificationPreferences
      }
    })
  } catch (error) {
    console.error('Error updating user preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

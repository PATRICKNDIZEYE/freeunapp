import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { scholarshipId } = body

    if (!scholarshipId) {
      return NextResponse.json({ error: 'Scholarship ID is required' }, { status: 400 })
    }

    // Find the user
    const user = await prisma.user.findFirst({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if scholarship exists and is active
    const scholarship = await prisma.scholarship.findUnique({
      where: { id: scholarshipId }
    })

    if (!scholarship) {
      return NextResponse.json({ error: 'Scholarship not found' }, { status: 404 })
    }

    if (scholarship.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Scholarship is not active' }, { status: 400 })
    }

    // Check if already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        email: session.user.email!,
        scholarshipId: scholarshipId
      }
    })

    if (existingApplication) {
      return NextResponse.json({ 
        applied: true, 
        message: 'Already applied to this scholarship',
        applicationId: existingApplication.id
      })
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        name: session.user.name || 'Anonymous',
        email: session.user.email!,
        message: `Applied via FreeUnApp platform`,
        status: 'APPLIED',
        scholarshipId: scholarshipId,
        appliedAt: new Date()
      }
    })

    // Create notification for admin
    await prisma.notification.create({
      data: {
        message: `${session.user.name || session.user.email} applied for ${scholarship.title}`,
        type: 'APPLICATION_UPDATE',
        userId: scholarship.adminId,
        read: false
      }
    })

    return NextResponse.json({
      applied: true,
      message: 'Application submitted successfully',
      applicationId: application.id
    })
  } catch (error) {
    console.error('Error applying to scholarship:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { scholarshipId } = body

    if (!scholarshipId) {
      return NextResponse.json({ error: 'Scholarship ID is required' }, { status: 400 })
    }

    // Get the scholarship details
    const scholarship = await prisma.scholarship.findUnique({
      where: { id: scholarshipId },
      select: {
        id: true,
        title: true,
        category: true,
        degreeLevel: true,
        amount: true,
        deadline: true
      }
    })

    if (!scholarship) {
      return NextResponse.json({ error: 'Scholarship not found' }, { status: 404 })
    }

    // Find users who have matching field of study and degree level preferences
    const eligibleUsers = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        approved: true,
        OR: [
          {
            fieldOfStudy: {
              contains: scholarship.category,
              mode: 'insensitive'
            }
          },
          {
            degreeLevel: scholarship.degreeLevel
          }
        ],
        notificationPreferences: {
          path: ['fieldNotifications'],
          equals: true
        }
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    })

    // Create notifications for eligible users
    const notifications = await Promise.all(
      eligibleUsers.map(user =>
        prisma.notification.create({
          data: {
            message: `New scholarship available in your field! ${scholarship.title} - ${scholarship.amount} (Deadline: ${scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'TBD'})`,
            type: 'NEW_SCHOLARSHIP',
            userId: user.id,
            read: false
          }
        })
      )
    )

    return NextResponse.json({ 
      success: true, 
      notificationsCreated: notifications.length,
      eligibleUsers: eligibleUsers.length
    })
  } catch (error) {
    console.error('Error creating field-based notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

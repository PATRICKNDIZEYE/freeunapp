import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const scholarshipId = params.id

    // Find the user
    const user = await prisma.user.findFirst({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has applied for this scholarship by matching email
    const application = await prisma.application.findFirst({
      where: {
        email: user.email,
        scholarshipId: scholarshipId
      }
    })

    return NextResponse.json({
      applied: !!application,
      applicationId: application?.id || null
    })
  } catch (error) {
    console.error('Error checking application status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

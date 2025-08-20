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

    // Check if already saved
    const existingSave = await prisma.savedScholarship.findFirst({
      where: {
        userId: user.id,
        scholarshipId: scholarshipId
      }
    })

    if (existingSave) {
      // Remove from saved
      await prisma.savedScholarship.delete({
        where: { id: existingSave.id }
      })
      return NextResponse.json({ saved: false, message: 'Removed from saved' })
    } else {
      // Add to saved
      await prisma.savedScholarship.create({
        data: {
          userId: user.id,
          scholarshipId: scholarshipId
        }
      })
      return NextResponse.json({ saved: true, message: 'Added to saved' })
    }
  } catch (error) {
    console.error('Error saving scholarship:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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

    // Check if already saved
    const existingSave = await prisma.savedScholarship.findFirst({
      where: {
        userId: user.id,
        scholarshipId: scholarshipId
      }
    })

    if (existingSave) {
      // Unsave the scholarship
      await prisma.savedScholarship.delete({
        where: { id: existingSave.id }
      })

      return NextResponse.json({
        saved: false,
        message: 'Scholarship removed from saved list'
      })
    } else {
      // Save the scholarship
      await prisma.savedScholarship.create({
        data: {
          userId: user.id,
          scholarshipId: scholarshipId,
          savedAt: new Date()
        }
      })

      return NextResponse.json({
        saved: true,
        message: 'Scholarship saved successfully'
      })
    }
  } catch (error) {
    console.error('Error saving/unsaving scholarship:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET endpoint to check if a scholarship is saved
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const scholarshipId = searchParams.get('scholarshipId')

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

    // Check if scholarship is saved
    const savedScholarship = await prisma.savedScholarship.findFirst({
      where: {
        userId: user.id,
        scholarshipId: scholarshipId
      }
    })

    return NextResponse.json({
      saved: !!savedScholarship,
      savedAt: savedScholarship?.savedAt || null
    })
  } catch (error) {
    console.error('Error checking saved status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

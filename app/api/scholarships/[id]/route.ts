import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const scholarship = await prisma.scholarship.findUnique({
      where: { id: params.id },
      include: {
        admin: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!scholarship) {
      return NextResponse.json({ error: 'Scholarship not found' }, { status: 404 })
    }

    return NextResponse.json(scholarship)
  } catch (error) {
    console.error('Error fetching scholarship:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      title,
      description,
      detailedDescription,
      amount,
      amountType,
      category,
      degreeLevel,
      deadline,
      eligibilityCriteria,
      applicationProcess,
      qualificationBasis,
      awardsAvailable,
      contactInfo,
      referenceUrl,
      status
    } = body

    // Find the admin user by email since session.user.id might be undefined
    const adminUser = await prisma.user.findFirst({
      where: { email: session.user.email }
    })

    if (!adminUser) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 })
    }

    const scholarship = await prisma.scholarship.update({
      where: { id: params.id },
      data: {
        title,
        description,
        detailedDescription,
        amount,
        amountType,
        category,
        degreeLevel,
        deadline: new Date(deadline),
        eligibilityCriteria,
        applicationProcess,
        qualificationBasis,
        awardsAvailable: awardsAvailable ? parseInt(awardsAvailable) : null,
        contactInfo,
        referenceUrl,
        status
      }
    })

    return NextResponse.json(scholarship)
  } catch (error) {
    console.error('Error updating scholarship:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.scholarship.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Scholarship deleted successfully' })
  } catch (error) {
    console.error('Error deleting scholarship:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

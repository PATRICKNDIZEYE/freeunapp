import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const scholarship = await prisma.scholarship.findUnique({
      where: { id: params.id },
      include: {
        admin: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            savedBy: true,
            applications: true
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
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin or super admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    
    const updatedScholarship = await prisma.scholarship.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        detailedDescription: body.detailedDescription,
        logoUrl: body.logoUrl,
        referenceUrl: body.referenceUrl,
        eligibilityCriteria: body.eligibilityCriteria,
        applicationProcess: body.applicationProcess,
        qualificationBasis: body.qualificationBasis,
        awardsAvailable: body.awardsAvailable ? parseInt(body.awardsAvailable) : null,
        amount: body.amount,
        amountType: body.amountType,
        categories: body.categories,
        degreeLevels: body.degreeLevels,
        deadline: new Date(body.deadline),
        contactInfo: body.contactInfo,
        status: body.status,
        approvalStatus: body.approvalStatus
      }
    })

    return NextResponse.json(updatedScholarship)
  } catch (error) {
    console.error('Error updating scholarship:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin or super admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if scholarship exists
    const scholarship = await prisma.scholarship.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            applications: true,
            savedBy: true
          }
        }
      }
    })

    if (!scholarship) {
      return NextResponse.json({ error: 'Scholarship not found' }, { status: 404 })
    }

    // Delete related records first (due to foreign key constraints)
    await prisma.$transaction([
      // Delete applications
      prisma.application.deleteMany({
        where: { scholarshipId: params.id }
      }),
      // Delete saved scholarships
      prisma.savedScholarship.deleteMany({
        where: { scholarshipId: params.id }
      }),
      // Delete the scholarship
      prisma.scholarship.delete({
        where: { id: params.id }
      })
    ])

    return NextResponse.json({ 
      message: 'Scholarship deleted successfully',
      deletedScholarship: {
        id: scholarship.id,
        title: scholarship.title,
        applicationsCount: scholarship._count.applications,
        savedCount: scholarship._count.savedBy
      }
    })
  } catch (error) {
    console.error('Error deleting scholarship:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

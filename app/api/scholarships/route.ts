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

    const scholarship = await prisma.scholarship.create({
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
        status,
        admin: {
          connect: {
            id: adminUser.id
          }
        },
        approvalStatus: 'APPROVED'
      }
    })

    return NextResponse.json(scholarship)
  } catch (error) {
    console.error('Error creating scholarship:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
